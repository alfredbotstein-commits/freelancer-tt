const puppeteer = require('puppeteer');
const path = require('path');

const names = [
  '01-active-timer',
  '02-project-list',
  '03-manual-entry',
  '04-invoice-preview',
  '05-weekly-report',
  '06-client-management',
  '07-export-options',
  '08-premium-features'
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  const htmlPath = 'file://' + path.resolve(__dirname, 'generate.html');
  await page.goto(htmlPath, { waitUntil: 'load' });

  for (let i = 0; i < 8; i++) {
    // Hide all, show current
    await page.evaluate((idx) => {
      document.querySelectorAll('.frame').forEach((f, j) => {
        f.style.display = j === idx ? 'flex' : 'none';
      });
    }, i);
    await page.screenshot({ path: path.join(__dirname, `${names[i]}.png`), type: 'png' });
    console.log(`Captured ${names[i]}.png`);
  }

  await browser.close();
  console.log('Done — 8 screenshots saved.');
})();
