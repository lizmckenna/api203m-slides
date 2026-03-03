const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const filePath = path.resolve(__dirname, 'class01.html');
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

    // Reveal all content and trigger print mode
    await page.evaluate(() => {
        document.querySelectorAll('.reveal-item').forEach(item => {
            item.classList.add('visible');
        });
        document.body.classList.add('print-mode');
    });

    // Wait for fonts and images to load
    await page.waitForTimeout(2000);

    const outputName = 'API-203M_Class01_Introduction.pdf';
    const desktopPath = path.join('/Users/ecm351/Desktop', outputName);
    const repoPath = path.join(__dirname, outputName);

    // Generate PDF - landscape, no margins, to match slide aspect ratio
    await page.pdf({
        path: repoPath,
        width: '1280px',
        height: '720px',
        printBackground: true,
        preferCSSPageSize: false,
    });

    // Copy to Desktop
    require('fs').copyFileSync(repoPath, desktopPath);

    console.log(`PDF saved to:`);
    console.log(`  ${repoPath}`);
    console.log(`  ${desktopPath}`);

    await browser.close();
})();
