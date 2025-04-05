const express = require('express');
const chromium = require('chrome-aws-lambda');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('Frontend'));

app.get('/screenshot', async (req, res) => {
    let browser = null;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto('https://infographic-website-brown.vercel.app/', { waitUntil: 'networkidle0' });
        await page.waitForTimeout(2000);

        const screenshotBuffer = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"');
        res.send(screenshotBuffer);

    } catch (error) {
        console.error('Screenshot Error:', error);
        if (browser) await browser.close();
        res.status(500).send('Failed to capture screenshot');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
