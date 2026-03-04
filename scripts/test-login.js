const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        }
    });
    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.toString());
    });

    await page.goto('http://localhost:3000/#/login', { waitUntil: 'networkidle0' });

    // Fill login
    await page.type('input[type="email"]', 'admin@hexas.com');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait a bit to see if error occurs
    await new Promise(r => setTimeout(r, 4000));

    await browser.close();
})();
