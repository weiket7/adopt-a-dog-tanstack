const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const JSON_FILE = 'chained-dog-awareness.json';
const WELFARE_GROUP_ID = 'kn76a3f1aaec6mw9w5wgrypssd87a52y';

(async () => {
    const jsonPath = path.join(__dirname, JSON_FILE);
    
    // Check if the source data file exists
    if (!fs.existsSync(jsonPath)) {
        console.error(`Error: Could not find the data file at ${jsonPath}`);
        process.exit(1);
    }

    // Load and parse the list of dogs
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const dogsData = JSON.parse(rawData);
    console.log(`Loaded ${dogsData.length} dog profiles from ${JSON_FILE}`);

    // Launch browser (headless: false let's you see the automation in real-time)
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('Navigating to Admin Portal Dashboard...');
    await page.goto('https://adopt-a-dog.wei-ket.workers.dev/admin/dogs', { waitUntil: 'networkidle' });

    for (const dog of dogsData) {
        console.log(`\nUploading data for: ${dog.name}`);

        // Click Add a Dog trigger button
        await page.click('#btn-add-a-dog');
        
        // Ensure the input field modal is open and visible
        await page.waitForSelector('#f-name', { state: 'visible' });

        // Populate text inputs
        await page.fill('#f-name', dog.name);
        await page.fill('#f-birthday', dog.birthday);

        // Select Gender Radio Option (Defaulting to Male if property is missing)
        const dogGender = (dog.gender || 'Male').toLowerCase();
        if (dogGender === 'male') {
            await page.click('#gender-male');
        } else if (dogGender === 'female') {
            await page.click('#gender-female');
        }

        // Select HDB Status Radio Option
        const isHdbApproved = dog.hdbApproved === 'Yes' || dog.hdbApproved === 'true' || dog.hdbApproved === true;
        if (isHdbApproved) {
            await page.click('#hdb-yes');
        } else {
            await page.click('#hdb-no');
        }

        // Resolve absolute path for the image and assign to the file picker input
        const absoluteImagePath = path.resolve(__dirname, dog.localImagePath);
        if (fs.existsSync(absoluteImagePath)) {
            await page.setInputFiles('#image', absoluteImagePath);
            console.log(`-> Attached file: ${dog.localImagePath}`);
        } else {
            console.warn(`⚠️ Warning: Image asset not found locally at ${absoluteImagePath}`);
        }

        // Select welfare group
        await page.selectOption('#f-welfare-group', WELFARE_GROUP_ID);

        // Populate Text Description block
        await page.fill('#f-description', dog.description);

        // Submit and wait for modal to close
        await page.click('button[type="submit"]');
        await page.waitForSelector('#f-name', { state: 'hidden' });

        console.log(`✅ Finished input entries for ${dog.name}.`);
    }

    console.log('\n🎉 Pipeline finished processing all records from file.');
    await browser.close();
})();