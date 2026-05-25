const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://spca.org.sg';
// Starting URL for page 1
let currentUrl = 'https://spca.org.sg/services/adoption/?sam_type=dog&sam_age=&sam_status=&sam_hdb=';

const DOWNLOAD_DIR = path.join(__dirname, 'spca_dogs');
const JSON_OUTPUT_PATH = path.join(__dirname, 'spca_dogs.json');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Global array to collect all dogs across all pages
const globalDogsList = [];
let dogCount = 0;

// Helper function to download images
async function downloadImage(url, filename) {
    try {
        const response = await axios({ url, method: 'GET', responseType: 'stream', headers: HEADERS });
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filename);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`  [!] Could not download image: ${error.message}`);
    }
}

// Sub-routine to fetch deep-linked profile information from .sam-story-section
async function fetchSpcaProfileDetails(profileUrl) {
    try {
        await new Promise(resolve => setTimeout(resolve, 600)); // Rate limiting

        const { data } = await axios.get(profileUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        const storySection = $('.sam-story-section');

        if (!storySection.length) {
            return { gender: "Unknown", breed: "Unknown", birthday: null, hdbApproved: "Unknown", description: "Metadata missing." };
        }

        const storyText = storySection.text().trim();

        const genderMatch = storyText.match(/Gender:\s*(Male|Female)/i);
        const breedMatch = storyText.match(/Breed:\s*([^\n\r]+)/i);
        const ageMatch = storyText.match(/(?:Estimated\s+)?Age:\s*([^\n\r]+)/i);
        const hdbMatch = storyText.match(/HDB\s*Approved:\s*(Yes|No)/i);

        const parseBirthdayFromAge = (ageStr) => {
            if (!ageStr) return null;
            const yearsMatch = ageStr.match(/(\d+)\s*(?:year|yr)/i);
            const monthsMatch = ageStr.match(/(\d+)\s*month/i);
            let totalMonths = 0;
            if (yearsMatch) totalMonths += parseInt(yearsMatch[1], 10) * 12;
            if (monthsMatch) totalMonths += parseInt(monthsMatch[1], 10);
            if (totalMonths === 0 && !yearsMatch && !monthsMatch) return null;
            const birth = new Date();
            birth.setMonth(birth.getMonth() - totalMonths);
            return `${birth.getFullYear()}-${String(birth.getMonth() + 1).padStart(2, '0')}-01`;
        };

        let descriptionArray = [];
        storySection.find('p, div').each((_, el) => {
            const txt = $(el).text().trim();
            if (txt.length > 0 && !txt.includes('Gender:') && !txt.includes('Breed:') && !txt.includes('Age:') && !txt.includes('HDB')) {
                descriptionArray.push(txt);
            }
        });

        let description = descriptionArray.join(' ').replace(/\s+/g, ' ').trim();
        let hdbApproved = hdbMatch ? hdbMatch[1].trim() : "Unknown";
        if (storyText.toLowerCase().includes('not hdb approved')) hdbApproved = "No";

        return {
            gender: genderMatch ? genderMatch[1].trim() : "Unknown",
            breed: breedMatch ? breedMatch[1].trim() : "Unknown Mixed Breed",
            birthday: parseBirthdayFromAge(ageMatch ? ageMatch[1].trim() : null),
            hdbApproved: hdbApproved,
            description: description || "No detailed biography written."
        };
    } catch (error) {
        return { gender: "Error", breed: "Error", birthday: null, hdbApproved: "Error", description: error.message };
    }
}

// Recursive master function to handle pagination loops
async function startScraperEngine(url, pageNum = 1) {
    try {
        console.log(`\n==================================================`);
        console.log(`👉 PROCESSING PAGE ${pageNum}: ${url}`);
        console.log(`==================================================`);

        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        // Target the individual animal grids
        const cards = $('.sam-animals-grid.sam-grid-cols-3').find('.sam-animal-card.sam-programme-adoption');
        console.log(`Found ${cards.length} dogs on page ${pageNum}.`);

        for (let i = 0; i < cards.length; i++) {
            const card = $(cards[i]);
            const imgEl = card.find('img');
            const imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
            const profileUrl = card.find('a').attr('href') || card.attr('href');
            let name = card.find('.sam-animal-name, h3, h4, .sam-name').text().trim();

            if (!name) name = imgEl.attr('alt') ? imgEl.attr('alt').trim() : `SPCA_Dog_${Date.now()}`;
            if (!imgUrl) continue;

            dogCount++;
            console.log(`[Dog #${dogCount}] Extracting: ${name}`);

            const safeName = name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
            const localImageName = `${dogCount}_${safeName}.jpg`;
            const localImagePath = path.join(DOWNLOAD_DIR, localImageName);

            await downloadImage(imgUrl, localImagePath);

            let profileDetails = { gender: "N/A", breed: "N/A", birthday: null, hdbApproved: "N/A", description: "No URL" };
            if (profileUrl) {
                profileDetails = await fetchSpcaProfileDetails(profileUrl);
            }

            globalDogsList.push({
                id: dogCount,
                name: name,
                gender: profileDetails.gender,
                breed: profileDetails.breed,
                birthday: profileDetails.birthday,
                hdbApproved: profileDetails.hdbApproved,
                description: profileDetails.description,
                sourceImageUrl: imgUrl,
                localImagePath: `spca_dogs/${localImageName}`,
                profileUrl: profileUrl || null
            });
        }

        // 🏙️ PAGINATION LOGIC: Look inside the .page-numbers wrapper element
        // WordPress/WooCommerce standard puts the 'next' button with a class 'next page-numbers'
        const nextButton = $('.page-numbers.next, a.next.page-numbers');
        const nextHref = nextButton.attr('href');

        if (nextHref) {
            // Absolute URL building format check
            const nextTargetPageUrl = nextHref.startsWith('http') ? nextHref : `${BASE_URL}${nextHref}`;
            console.log(`\n✨ "Next" link identified! Advancing navigation target layer...`);
            
            // Artificial breathing room between page traversals to stay secure
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Execute recursion loop call passing the discovered next page URL block
            await startScraperEngine(nextTargetPageUrl, pageNum + 1);
        } else {
            console.log(`\n🏁 No further pagination triggers found. Final page threshold completed.`);
            
            // Save global dataset compile block out to disk space layout
            fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(globalDogsList, null, 4), 'utf-8');
            console.log(`💾 Successfully exported metrics for a total of ${dogCount} dogs into: ${JSON_OUTPUT_PATH}`);
        }

    } catch (error) {
        console.error(`Fatal operational failure within Pagination engine stack: ${error.message}`);
        // Ensure data is saved safely up to point of unexpected termination
        if (globalDogsList.length > 0) {
            fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(globalDogsList, null, 4), 'utf-8');
        }
    }
}

// Master execution initializer execution block
(async () => {
    if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR);
    }
    await startScraperEngine(currentUrl);
})();