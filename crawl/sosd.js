const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const TARGET_URL = 'https://www.sosd.org.sg/adopt-a-dog/';
const DOWNLOAD_DIR = path.join(__dirname, 'sosd');
const JSON_OUTPUT_PATH = path.join(__dirname, 'sosd.json');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Helper function to stream and store image assets safely
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

// Sub-routine to fetch and parse the individual dog's detailed profile page (Simulating the Click action)
async function fetchPersonality(profileUrl) {
    try {
        // Simple rate limiting delay to avoid triggering firewall blocks
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data } = await axios.get(profileUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        // Target the element block containing "Personality:" or look for text segments
        const pageText = $('body').text();

        const cleanPersonalityText = (text) => {
            return text
                .replace(/If you are keen to sponsor[\s\S]*/i, '')
                .replace(/If you wish to share[\s\S]*/i, '')
                .trim()
                .replace(/\s+/g, ' ');
        };
        
        // Capture text immediately following "Personality:" up until the next section divider or text block
        const personalityMatch = pageText.match(/Personality:\s*([\s\S]*?)(?=Health:|Diet:|Background:|History:|$)/i);
        
        if (personalityMatch && personalityMatch[1]) {
            return cleanPersonalityText(personalityMatch[1]);
        }
        
        // Fallback fallback selector structural mapping in case it's stored inside an explicit block/paragraph
        let paragraphText = "";
        $('p, div').each((_, el) => {
            const txt = $(el).text();
            if (txt.toLowerCase().includes('personality:')) {
                paragraphText = txt.replace(/personality:/i, '').trim();
            }
        });

        return paragraphText ? cleanPersonalityText(paragraphText) : "Not specified on individual profile.";
    } catch (error) {
        return `Failed to load detailed profile: ${error.message}`;
    }
}

async function scrapeSosdGallery() {
    try {
        console.log(`Requesting main index layout from ${TARGET_URL}...`);
        const { data } = await axios.get(TARGET_URL, { headers: HEADERS });
        const $ = cheerio.load(data);

        // Verify/Create isolated download directory target
        if (!fs.existsSync(DOWNLOAD_DIR)) {
            fs.mkdirSync(DOWNLOAD_DIR);
        }

        const sosdDogsList = [];
        let dogCount = 0;

        // Target profiles only after the specific section heading
        let loops = $();
        const adoptableHeading = $('h2').filter((_, el) => {
            const headingText = $(el).text().trim();
            return headingText.toLowerCase() === 'view our adoptable dogs here!';
        }).first();

        if (adoptableHeading.length) {
            loops = adoptableHeading.nextAll().find('.dog-loop-inner');
        }

        // Fallback to global selector if section heading cannot be found
        if (!loops.length) {
            loops = $('.dog-loop-inner');
        }
        console.log(`Found ${loops.length} target profiles in the gallery listing.`);

        for (let i = 0; i < loops.length; i++) {
            const loopItem = $(loops[i]);

            // Extract initial preview card attributes
            const imgEl = loopItem.find('img');
            const imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
            
            // Find the anchor link wrapping the card element or heading to extract the profile URL
            const profileUrl = loopItem.find('a').attr('href') || loopItem.closest('a').attr('href');

            // Parse text content layout inside the card frame
            const cardText = loopItem.text().trim();

            // Match basic metrics out of structural list frameworks or clean strings
            const nameMatch = loopItem.find('.dog-name, h3, h4').text().trim();
            const hdbMatch = cardText.match(/HDB:\s*(Yes|No)/i);
            const ageMatch = cardText.match(/(\d+(?:\.\d+)?)\s*years?\s*old/i);

            // Set up standardized clean defaults
            let name = nameMatch || cardText.split('\n')[0].trim();
            let hdbApproved = hdbMatch ? (hdbMatch[1].toLowerCase() === 'yes' ? 'Yes' : 'No') : 'No';
            let birthday = null;
            if (ageMatch) {
                const birthYear = new Date().getFullYear() - Math.round(parseFloat(ageMatch[1]));
                birthday = `${birthYear}-01-01`;
            }

            // Safety skip loop elements that match layout infrastructure variations instead of actual profiles
            if (!imgUrl || name.toLowerCase().includes('search') || name.length > 50) continue;

            dogCount++;
            console.log(`\n----------------------------------------`);
            console.log(`[#${dogCount}] Processing preview record for: ${name}`);

            // Download layout configuration
            const safeName = name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
            const localImageName = `${dogCount}_${safeName}.jpg`;
            const localImagePath = path.join(DOWNLOAD_DIR, localImageName);
            
            await downloadImage(imgUrl, localImagePath);
            console.log(`  -> Downloaded profile picture to: sosd/${localImageName}`);

            // Execute programmatic sub-query navigation loop if hyperlink is validated
            let personalityDescription = "No detail page linked.";
            if (profileUrl) {
                console.log(`  -> Following page flow link: ${profileUrl}`);
                personalityDescription = await fetchPersonality(profileUrl);
            }

            // Assemble compiled structural model document
            const dogRecord = {
                id: dogCount,
                name: name,
                hdbApproved: hdbApproved,
                birthday: birthday,
                localImagePath: `sosd/${localImageName}`,
                sourceImageUrl: imgUrl,
                profileUrl: profileUrl || null,
                description: personalityDescription
            };

            sosdDogsList.push(dogRecord);
        }

        // Output complete payload dataset
        fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(sosdDogsList, null, 4), 'utf-8');
        console.log(`\nExecution Finished. Generated database map output inside: ${JSON_OUTPUT_PATH}`);

    } catch (error) {
        console.error(`Fatal scraping operational error: ${error.message}`);
    }
}

scrapeSosdGallery();