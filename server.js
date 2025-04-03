
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('Frontend')); // Serve static files from the Frontend directory

app.get('/screenshot', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.goto(`http://localhost:3000`, { waitUntil: 'networkidle2' });
        const screenshotPath = path.join(__dirname, 'Frontend', 'screenshot.png');

        await page.screenshot({ path: screenshotPath, fullPage: true });
        await browser.close();

        res.download(screenshotPath, 'screenshot.png', (err) => {
            if (err) console.error('Error downloading screenshot:', err);
            fs.unlinkSync(screenshotPath); // Remove the file after download
        });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send('Failed to take screenshot');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
