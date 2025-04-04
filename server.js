const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Setup
app.use(cors());
app.use(express.static('Frontend'));

app.get('/screenshot', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.CHROME_PATH || puppeteer.executablePath(), 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://infographic-website-brown.vercel.app/', { waitUntil: 'networkidle2' });

        const screenshotPath = path.join(__dirname, 'screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();
        
        res.setHeader('Content-Type', 'image/png');
        res.download(screenshotPath, 'screenshot.png', () => {
            fs.unlinkSync(screenshotPath);
        });
    } catch (error) {
        console.error('Screenshot Error:', error);
        res.status(500).send('Failed to capture screenshot');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
