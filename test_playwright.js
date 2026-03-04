import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('dialog', async dialog => {
        console.log('BROWSER ALERT:', dialog.message());
        await dialog.accept();
    });

    try {
        await page.goto('http://localhost:5173/#/onboarding');
        await page.waitForTimeout(500);

        // Onboarding
        await page.fill('input[placeholder*="nome"]', 'Test Playwright');
        await page.fill('input[placeholder*="idade"]', '30');
        await page.selectOption('select', { value: 'SP' }); // Select value might just need 'SP'
        await page.fill('input[placeholder*="WhatsApp"]', '11999999999');
        await page.click('button:has-text("Avançar")');

        await page.waitForTimeout(500);

        // Loop through questions
        for (let i = 0; i < 10; i++) {
            const title = await page.locator('h1').textContent()
            console.log(`Answering Question ${i + 1}: ${title}`)

            // If it's a select question but rendered as radio boxes
            let optionToClick = await page.locator('div.border-2.border-orange-200.bg-white').first()
            if (await optionToClick.count() > 0) {
                await optionToClick.click()
            } else {
                // Might be multi-select (checkbox) or text
                const checkbox = await page.locator('div.border-2.border-transparent').first()
                if (await checkbox.count() > 0) {
                    await checkbox.click()
                }
            }

            await page.click('button#next-btn');
            await page.waitForTimeout(300);
        }

        console.log("Waiting for analysis page to process...")
        await page.waitForURL('**/rewards', { timeout: 10000 });
        console.log("Reached rewards page. Save was successful.");

    } catch (error) {
        console.error("Test Error:", error);
    } finally {
        await browser.close();
    }
})();
