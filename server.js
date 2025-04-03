
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const app = express();
// Configure CORS with the origin of your Vercel app
const corsOptions = {
    origin: 'https://infographic-website-brown.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true, // If you need to handle cookies or authorization headers
};
app.use(cors(corsOptions));
app.use(express.static('Frontend')); // Serve static files from the Frontend directory

app.get('/screenshot', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const frontendUrl = process.env.FRONTEND_URL || 'https://infographic-website-brown.vercel.app/';
        await page.goto(frontendUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('.step:last-child', { timeout: 30000 });
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

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
