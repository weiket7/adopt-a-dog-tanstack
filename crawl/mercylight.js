const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const URLS = [
    'https://www.mercylight.org.sg/adopt-a-blessing/adopt-a-lady-blessing/',
    'https://www.mercylight.org.sg/adopt-a-blessing/adopt-a-gentleman-blessing/'
];

const DOWNLOAD_DIR = path.join(__dirname, 'mercylight_dogs');
const JSON_OUTPUT_PATH = path.join(__dirname, 'mercylight_dogs.json');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Global counter and storage array to merge records from both pages
const globalDogsList = [];
let globalDogCount = 0;

// Helper function to stream and download images locally
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

// Sub-routine to fetch inner profile layout details (Simulating the Click action)
async function fetchInnerProfileDetails(profileUrl) {
    try {
        // Safe timeout buffering to avoid slamming the host server
        await new Promise(resolve => setTimeout(resolve, 600));

        const { data } = await axios.get(profileUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        const fullPageText = $('body').text();

        // Extract metadata from span elements
        const extractSpanValue = (label) => {
            let value = null;
            $('span').each((_, el) => {
                const text = $(el).text();
                const regex = new RegExp(`^${label}\\s*`, 'i');
                if (regex.test(text)) {
                    value = text.replace(regex, '').trim();
                    return false;
                }
            });
            return value;
        };

        const extractedName = (extractSpanValue('Name:') || '').replace(/\s+Blessing$/i, '').trim() || null;
        const extractedGender = extractSpanValue('Gender:');
        const extractedDob = (() => {
            const raw = extractSpanValue('Date of Birth:');
            if (!raw) return null;
            const d = new Date(raw);
            if (isNaN(d.getTime())) return raw;
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })();
        const extractedHdb = (() => {
            let value = extractSpanValue('HDB approved:');
            if (value) value = value.replace(/If you are keen to adopt[\s\S]*/i, '').trim();
            return value;
        })();

        // Isolate and merge Background and Personality texts
        const backgroundMatch = fullPageText.match(/Background:\s*([\s\S]*?)(?=Personality:|Brief\s+Requirements:|$)/i);
        const personalityMatch = fullPageText.match(/Personality:\s*([\s\S]*?)(?=Brief\s+Requirements:|Background:|$)/i);

        let backgroundText = backgroundMatch ? backgroundMatch[1].trim() : "";
        let personalityText = personalityMatch ? personalityMatch[1].trim() : "";

        backgroundText = backgroundText.replace(/\s+/g, ' ');
        personalityText = personalityText.replace(/\s+/g, ' ');

        let combinedDescription = "";
        if (backgroundText) combinedDescription += `Background:\n${backgroundText}`;
        if (backgroundText && personalityText) combinedDescription += '\n\n';
        if (personalityText) combinedDescription += `Personality:\n${personalityText}`;
        combinedDescription = combinedDescription.trim() || null;

        var result = {
            name: extractedName,
            gender: extractedGender || null,
            birthday: extractedDob || null,
            hdbApproved: extractedHdb || null,
            description: combinedDescription,
            welfareGroupId: "kn7df7dx9b345x9j1v2b6rh9yd81j0c3"
        };

        console.log(JSON.stringify(result));

        return result;
    } catch (error) {
        console.error(`  [!] Error parsing internal profile details: ${error.message}`);
        return null;
    }
}

// Modular function to handle a single gallery endpoint
async function scrapeMercylightPage(url) {
    try {
        console.log(`\n==================================================`);
        console.log(`👉 CONNECTING TO GALLERY: ${url}`);
        console.log(`==================================================`);
        
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const targetClass = '.elementor-column.elementor-col-25.elementor-top-column.elementor-element';
        const structuralColumns = $(targetClass);
        
        console.log(`Found ${structuralColumns.length} potential layout grid containers.`);

        for (let i = 0; i < structuralColumns.length; i++) {
            const column = $(structuralColumns[i]);
            const imgEl = column.find('img');

            // Confirm column element contains valid image element
            if (!imgEl.length) continue;

            const imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
            const profileUrl = column.find('a').attr('href');

            if (!imgUrl) continue;

            // Attempt to derive name from preview tag context or fallback variables
            let rawName = column.text().trim().split('\n')[0].trim();
            if (!rawName || rawName.length > 30) {
                rawName = imgEl.attr('alt') ? imgEl.attr('alt').trim() : `Dog_${Date.now()}_${i}`;
            }

            // Remove static layout UI keywords if picked up
            if (['logo', 'banner', 'button'].some(kw => rawName.toLowerCase().includes(kw))) continue;

            globalDogCount++;
            console.log(`\n[Dog #${globalDogCount}] Found listing record: ${rawName}`);

            // Set file definitions
            const safeName = rawName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
            const localImageName = `${globalDogCount}_${safeName}.jpg`;
            const localImagePath = path.join(DOWNLOAD_DIR, localImageName);

            // Download preview image to local storage
            await downloadImage(imgUrl, localImagePath);
            console.log(`  -> Saved image asset to local directory`);

            const EXCLUDED_DOMAINS = ['mercylight.medialabsstreaming.com', 'mercylight.org.sg'];
            const isExcluded = profileUrl && EXCLUDED_DOMAINS.some(d => profileUrl.includes(d));

            let deepDetails = null;
            if (profileUrl && !isExcluded) {
                console.log(`  -> "Clicking" through link layout: ${profileUrl}`);
                deepDetails = await fetchInnerProfileDetails(profileUrl);
            }

            // Construct data payload model
            const dogProfile = {
                id: globalDogCount,
                name: deepDetails?.name || rawName,
                gender: deepDetails?.gender || "Unknown",
                birthday: deepDetails?.birthday || "Unknown",
                hdbApproved: deepDetails?.hdbApproved || "Unknown",
                description: deepDetails?.description || "No description loaded.",
                sourceImageUrl: imgUrl,
                localImagePath: `mercylight_dogs/${localImageName}`,
                profileUrl: profileUrl || null
            };

            globalDogsList.push(dogProfile);
        }

    } catch (error) {
        console.error(`Operational error on endpoint [${url}]: ${error.message}`);
    }
}

// Master execution Orchestrator loop
(async () => {
    try {
        // Initialize download folder directory safely
        if (!fs.existsSync(DOWNLOAD_DIR)) {
            fs.mkdirSync(DOWNLOAD_DIR);
        }

        // Loop through both requested URLs
        for (const url of URLS) {
            await scrapeMercylightPage(url);
            // Quick cool-down time delay between pages
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Output completely aggregated structured data array mapping to the local filesystem
        fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(globalDogsList, null, 4), 'utf-8');
        console.log(`\n==================================================`);
        console.log(`🎉 SUCCESS! Total combined dogs processed: ${globalDogCount}`);
        console.log(`💾 Aggregated data exported successfully to: ${JSON_OUTPUT_PATH}`);
        console.log(`==================================================`);

    } catch (error) {
        console.error(`Master Engine execution failed: ${error.message}`);
    }
})();