const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://chaineddogawareness.sg/adoption/';
const welfareGroupId = "kn76a3f1aaec6mw9w5wgrypssd87a52y";

const DOWNLOAD_DIR = path.join(__dirname, 'chained-dog-awareness');
const JSON_OUTPUT_PATH = path.join(__dirname, 'chained-dog-awareness.json');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

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

// Helper function to format arbitrary age/dates into YYYY-MM-DD
function formatBirthday(ageString) {
    if (!ageString) return "Unknown";
    
    // If it's already in a date format, try to normalize it
    const parsedDate = Date.parse(ageString);
    if (!isNaN(parsedDate)) {
        return new Date(parsedDate).toISOString().split('T')[0];
    }

    // If it's an age string like "2 years", "6 months", calculate an approximate birthday
    const now = new Date();
    const yearsMatch = ageString.match(/(\d+)\s*year/i);
    const monthsMatch = ageString.match(/(\d+)\s*month/i);

    if (yearsMatch) now.setFullYear(now.getFullYear() - parseInt(yearsMatch[1]));
    if (monthsMatch) now.setMonth(now.getMonth() - parseInt(monthsMatch[1]));

    return now.toISOString().split('T')[0];
}

async function scrapeDogs() {
    try {
        if (!fs.existsSync(DOWNLOAD_DIR)) {
            fs.mkdirSync(DOWNLOAD_DIR);
        }

        // 1. Fetch the main page HTML
        const { data: mainHtml } = await axios.get(url);
        const $ = cheerio.load(mainHtml);
        
        const dogsList = [];
        let dogIdCounter = 1;

        // Find the starting section
        const startSection = $('section:contains("We are ready for a new home!")');
        if (!startSection.length) {
            console.log("Starting section not found.");
            return;
        }

        // We will collect columns that come after the start section but before the stop section
        const dogLinks = [];

        // Traverse elements to find the grid elements before the stop section
        let currentElement = startSection.next();
        let stopScraping = false;

        while (currentElement.length && !stopScraping) {
            // Check if this element or its children contain the stop text
            if (currentElement.text().includes("Dogs That Have Happily Found Their Forever Homes")) {
                stopScraping = true;
                break;
            }

            // Find columns inside the current container element
            currentElement.find('.elementor-column.elementor-col-25').each((_, el) => {
                const link = $(el).find('a').attr('href');
                if (link) dogLinks.push(link);
            });

            currentElement = currentElement.next();
        }

        console.log(`Found ${dogLinks.length} dog profiles to scrape. Starting deep crawl...`);

        // 2. Navigate to each dog's link to extract details
        for (const link of dogLinks) {
            try {
                //console.log(link);

                const { data: dogHtml } = await axios.get(link);
                const $dog = cheerio.load(dogHtml);

                const container = $dog('.elementor-widget-container h2').first().parent();

                //console.log(container.html());

                if (!container.length) return null;

                //const name = container.find('h2').text().trim();

                // Extract Name
                const name = $dog('h2').first().text().trim() || "Unknown";

                // Target the wrapper class and find its first internal image
                const carouselWrapper = $dog('.elementor-image-carousel-wrapper');
                let image = carouselWrapper.find('img').first().attr('src');

                const localImageName = `${name}.jpg`;
                const localImagePath = path.join(DOWNLOAD_DIR, localImageName);
                await downloadImage(image, localImagePath);
                console.log(`Downloaded image for ${name} from ${image}`);

                // Extract Details from the span containing "Breed"
                const infoSpan = $dog('span:contains("Breed")');
                const infoText = infoSpan.text();

                // Regex parsing for specific fields
                const genderMatch = infoText.match(/Gender:\s*([a-zA-Z]+)/i);
                const ageMatch = infoText.match(/Age:\s*([^HDB\n,|]+)/i); // Extracts age string until next delimiter
                
                const gender = genderMatch ? genderMatch[1].trim() : "Unknown";
                const rawAge = ageMatch ? ageMatch[1].trim() : "";
                const birthday = formatBirthday(rawAge);

                // Determine HDB status
                let hdbApproved = "No";
                if (/hdb approved/i.test(infoText) && !/non-hdb approved/i.test(infoText)) {
                    hdbApproved = "Yes";
                }

                // Collect all subsequent descriptions keeping their structural layout linebreaks
                let description = "";
                container.find('p, div').slice(1).each((i, el) => {
                    //console.log($(el).html());
                    // Replace br tags with line breaks, then clean up html tags
                    let pContent = $(el).html().replace(/<br\s*\/?>/gi, '\n');
                    pContent = cheerio.load(pContent).text().trim();
                    if (pContent) {
                        description += pContent + "\n\n";
                    }
                });
                description = description.trim();

                dogsList.push({
                    id: dogIdCounter++,
                    name,
                    gender,
                    birthday,
                    hdbApproved,
                    description,
                    image,
                    localImagePath: `chained-dog-awareness/${localImageName}`,
                    welfareGroupId
                });

            } catch (err) {
                console.error(`Error scraping dog profile at ${link}:`, err.message);
            }
        }

        fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(dogsList, null, 4), 'utf-8');
        console.log(`\n==================================================`);
        console.log(`🎉 SUCCESS! Total combined dogs processed: ${dogsList.length}`);
        console.log(`💾 Aggregated data exported successfully to: ${JSON_OUTPUT_PATH}`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("Error fetching main page:", error.message);
    }
}

scrapeDogs();