const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const TARGET_URL = 'https://www.oscas.sg/adoption-gallery';
const DOWNLOAD_DIR = path.join(__dirname, 'oscas_dogs');
const JSON_OUTPUT_PATH = path.join(__dirname, 'oscas_dogs.json');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Helper function to stream and download image assets locally
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

// Helper to calculate approximate year from text block and format as a birthday string
function calculateBirthdayString(textBlock) {
    const currentYear = 2026; // Reference calendar year
    let targetYear = null;
    
    // Pattern 1: Look for explicit "Born in 2019"
    const bornInMatch = textBlock.match(/Born\s+in\s+(\d{4})/i);
    if (bornInMatch) {
        targetYear = parseInt(bornInMatch[1], 10);
    } else {
        // Pattern 2: Look for numeric age expressions like "7 years old"
        const ageMatch = textBlock.match(/(\d+)\s*(?:years?|yrs?)\s*(?:old)?/i);
        if (ageMatch) {
            const estimatedAge = parseInt(ageMatch[1], 10);
            targetYear = currentYear - estimatedAge;
        }
    }

    return targetYear ? `${targetYear}-01-01` : "Unknown";
}

async function scrapeOscasGallery() {
    try {
        console.log(`Connecting to page structure: ${TARGET_URL}...`);
        const { data } = await axios.get(TARGET_URL, { headers: HEADERS });
        const $ = cheerio.load(data);

        if (!fs.existsSync(DOWNLOAD_DIR)) {
            fs.mkdirSync(DOWNLOAD_DIR);
        }

        const dogsList = [];
        let dogCount = 0;

        // Target every explicit gallery block wrapper element
        const galleryBlocks = $('.sqs-block.gallery-block.sqs-block-gallery');
        console.log(`Found ${galleryBlocks.length} explicit gallery blocks to map.`);

        for (let i = 0; i < galleryBlocks.length; i++) {
            const galleryBlock = $(galleryBlocks[i]);

            // Target the profile image inside this gallery block
            const imgEl = galleryBlock.find('img');
            let imgUrl = imgEl.attr('data-src') || imgEl.attr('src');

            if (!imgUrl) continue;

            // 🛡️ DOMAIN FILTER: Skip images which don't contain squarespace-cdn
            if (!imgUrl.includes('squarespace-cdn.com')) continue;

            // Locate subsequent sibling matching the requested html block class name
            const htmlBlock = galleryBlock.nextAll('.sqs-block.html-block.sqs-block-html').first();
            if (!htmlBlock.length) continue;

            // 🏷️ SELECTOR LOGIC: Extract name explicitly from the <h2> element
            const h2Element = htmlBlock.find('h2');
            let rawName = h2Element.text().trim();
            
            // Fallback to alt tag or sequential indexing only if the h2 is missing entirely
            if (!rawName) {
                rawName = imgEl.attr('alt') ? imgEl.attr('alt').trim() : "";
            }
            if (!rawName) continue;

            // Clean name artifacts to match schema requests (e.g., "Teddy.jpg")
            const cleanName = rawName.split('.')[0].trim(); 
            const formattedNameProperty = `${cleanName}.jpg`;

            // Filter out tracking pixels or structural page layouts
            const skipKeywords = ['logo', 'banner', 'icon', 'arrow', 'footer', 'button'];
            if (skipKeywords.some(keyword => cleanName.toLowerCase().includes(keyword))) continue;

            // Step directly inside the targeted 'ul' elements for metadata mapping
            const ulElement = htmlBlock.find('ul');
            if (!ulElement.length) continue; 

            const ulText = ulElement.text().trim();

            // Extract all subsequent paragraphs following the <ul> element as description strings
            let descriptionArray = [];
            ulElement.nextAll('p').each((_, el) => {
                const text = $(el).text().trim();
                if (text.length > 0) {
                    descriptionArray.push(text);
                }
            });
            const fullDescriptionText = descriptionArray.join('\n\n');

            // Parse text traits
            const genderMatch = ulText.match(/(Male|Female)/i);
            const hdbMatch = ulText.match(/HDB\s*Approved/i);
            const notHdbMatch = ulText.match(/Not\s*HDB\s*Approved/i);

            dogCount++;

            // Dynamic date evaluation tracking fallback string assigned to "birthday"
            const birthdayString = calculateBirthdayString(ulText);

            // Determine explicit true/false boolean logic for HDB approval parameters
            let hdbApprovedBoolean = "No";
            if (notHdbMatch) {
                hdbApprovedBoolean = "No";
            } else if (hdbMatch) {
                hdbApprovedBoolean = "Yes";
            }

            // Ensure high-resolution imagery assets request from cdn endpoint configurations
            if (!imgUrl.includes('?format=')) {
                imgUrl = `${imgUrl}?format=1000w`;
            }

            // FORMAT ASSIGNMENT: Format image download name as "oscas-dog-name.jpg"
            const safeNameForFile = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
            const localImageName = `oscas-${safeNameForFile}.jpg`;
            const localImagePath = path.join(DOWNLOAD_DIR, localImageName);

            // Construct exact requested schema object layout structure
            const dogObject = {
                id: dogCount,
                name: formattedNameProperty,
                gender: genderMatch ? genderMatch[1] : "Unknown",
                birthday: birthdayString,
                hdbApproved: hdbApprovedBoolean,
                description: fullDescriptionText,
                image: `oscas_dogs/${localImageName}`,
                welfareGroupId: "kn74zp6qsmh31fswa05dv7rqwn81jfg8"
            };

            dogsList.push(dogObject);
            console.log(`Processing Profile #${dogCount}: ${formattedNameProperty} -> ${localImageName}`);

            // Download file block sequence execution
            await downloadImage(imgUrl, localImagePath);
        }

        // Output formatting file layout out to storage
        fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(dogsList, null, 4), 'utf-8');
        console.log(`\nSuccess! Completed engine cycle. Data structure written to: ${JSON_OUTPUT_PATH}`);

    } catch (error) {
        console.error(`An operational error occurred: ${error.message}`);
    }
}

scrapeOscasGallery();