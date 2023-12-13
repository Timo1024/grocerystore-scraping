const { takeScreenshot, isElementClickable } = require("./lib.js");

const acceptCookies = async (page) => {

    await takeScreenshot(page, 1);
    await page.waitForXPath('//*[@id="onetrust-reject-all-handler"]');
    await takeScreenshot(page, 2);

    // click on xpath
    const [button] = await page.$x('//*[@id="onetrust-reject-all-handler"]');
    if (button && await isElementClickable(page, button)) {
        await button.click()
    }

    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await takeScreenshot(page, 3);

    // reload page
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

}

const setLocation = async (page) => {

    const [buttonLocationMenu] = await page.$x('/html/body/div[3]/header/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[1]/a');
    if (buttonLocationMenu && await isElementClickable(page, buttonLocationMenu)) {
        await buttonLocationMenu.click();
        await takeScreenshot(page, 4);
    }

    const [locationName] = await page.$x('/html/body/div[3]/header/div/div[1]/div[2]/div/div/div[3]/div/div[2]/div[2]/div/div/div[2]/div[1]/span[1]/span[2]')
    if (locationName) {
        const txt = await locationName.getProperty('textContent');
        const rawTxt = await txt.jsonValue();
        console.log({rawTxt});
    }

    await takeScreenshot(page, 5);

    const [buttonToChangeLoacation] = await page.$x('/html/body/div[3]/header/div/div[1]/div[2]/div/div/div[3]/div/div[2]/div[2]/div/div/div[2]/div[2]/ul/li[3]/a');
    console.log(await isElementClickable(page, buttonToChangeLoacation))
    if(buttonToChangeLoacation && await isElementClickable(page, buttonToChangeLoacation)) {
        await buttonToChangeLoacation.click();
        await new Promise(r => setTimeout(r, 1000));
        await takeScreenshot(page, 6);
    }

    // wait for no network connections
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(page, 7);

    // get field for city and type Kirchentellinsfurt
    const [fieldCity] = await page.$x('//*[@id="store-search"]');
    if(fieldCity) {
        await fieldCity.type('Kirchentellinsfurt');
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 1000));
        await takeScreenshot(page, 8);
    }

    // get first store and click on it
    const [firstStore] = await page.$x('/html/body/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div[2]/div[2]/div/ul/li[1]/div[3]/div[1]/div/a');
    if(firstStore) {
        await firstStore.click();
        await new Promise(r => setTimeout(r, 2000));
        await takeScreenshot(page, 9);
    }

}

module.exports = { setLocation, acceptCookies };