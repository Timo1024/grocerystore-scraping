const puppeteer = require("puppeteer");
const { takeScreenshot, isElementClickable } = require("./lib.js");

const url = "https://filiale.kaufland.de/angebote/aktuelle-woche/uebersicht.category=01_Fleisch__Gefl%C3%BCgel__Wurst.html";

const main = async () => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(url);

    // const [el] = await page.$x('/html/body/div[3]/header/div/div[1]/div[2]/div/div/div[3]/div/div[2]/div[2]/div/div/div[2]/div[1]/span[1]/span[2]');
    // const txt = await el.getProperty('textContent');
    // const rawTxt = await txt.jsonValue();
    // console.log({rawTxt});

    // take screenshot
    // await page.click('.a-flyout-link__anchor');
    
    await takeScreenshot(page, 1);
    await page.waitForXPath('//*[@id="onetrust-reject-all-handler"]');
    await takeScreenshot(page, 2);

    // click on xpath
    const [button] = await page.$x('//*[@id="onetrust-reject-all-handler"]');
    if (button && await isElementClickable(page, button)) {
        await button.click()
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await takeScreenshot(page, 3);

    // reload page
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

    const [buttonLocationMenu] = await page.$x('/html/body/div[3]/header/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[1]/a');
    if (buttonLocationMenu && await isElementClickable(page, buttonLocationMenu)) {
        await buttonLocationMenu.click();
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });
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

    // get all food
    // const allFood = await page.evaluate(() => {
    //     const foods = Array.from(document.getElementsByClassName("o-overview-list__list-item"));

    //     return Array.from(foods).slice(0,3).map(async food => {
    //         const nameSub = food.querySelector("h5")?.innerText;
    //         const nameMain = food.querySelector("h4")?.innerText;
            
    //         // let spanPrice = await food.$$('.a-pricetag__price');
    //         // spanPrice = spanElement.pop();
    //         // spanPrice = await spanElement.getProperty('innerText');
    //         // spanPrice = await spanElement.jsonValue();
    //         // const price = food.querySelector(".a-pricetag__price").innerText;//[0]?.innerText;

    //         return {nameSub, nameMain};

    //     });
    // }
    // );

    // const h4Elements = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[2]/div/div/div//h4');
    let foodItems = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[2]/div/div/div/div');
    // make foodItems to array
    foodItems = Array.from(foodItems);
    console.log(foodItems.length);
    // make foodItems readable and log t
    // foodItems = await Promise.all(foodItems.map(async foodItem => {
    //     let txt = await foodItem.getProperty('textContent');
    //     txt = await txt.jsonValue();
    //     return txt;
    // }));
    // console.log(foodItems);

    // from foodItems get h4, h5 and price
    // const food = await Promise.all(foodItems.map(async foodItem => {
    const food = await Promise.all(foodItems.map(async (foodItem) => {
        const itemH5 = await foodItem.$('h5');
        if(!itemH5) return null;
        let txtItemH5 = await itemH5.getProperty('textContent');
        txtItemH5 = await txtItemH5.jsonValue();
        txtItemH5 = txtItemH5.trim();

        const itemH4 = await foodItem.$('h4');
        if(!itemH4) return null;
        let txtItemH4 = await itemH4.getProperty('textContent');
        txtItemH4 = await txtItemH4.jsonValue();
        txtItemH4 = txtItemH4.trim();

        const itemPrice = await foodItem.$('.a-pricetag__price');
        if(!itemPrice) return null;
        let txtItemPrice = await itemPrice.getProperty('textContent');
        txtItemPrice = await txtItemPrice.jsonValue();
        txtItemPrice = txtItemPrice.trim();

        // const itemImage = await foodItem.$('img');
        // if(!itemImage) return null;
        // let txtItemImage = await itemImage.getProperty('src');
        // txtItemImage = await txtItemImage.jsonValue();
        // txtItemImage = txtItemImage.trim();

        return {txtItemH5, txtItemH4, txtItemPrice};



        // let [nameSub] = await foodItem.$$('xpath/' + './/h5');
        // const nameSubTxt = await nameSub.getProperty('textContent');
        // const nameSubRawTxt = await nameSubTxt.jsonValue();
        // // console.log({nameSubRawTxt});

        // let [nameMain] = await foodItem.$$('xpath/' + './/h4');
        // // nameMain = nameMain.pop();
        // // nameMain = await nameMain.getProperty('innerText');
        // // nameMain = await nameMain.jsonValue();
        // const nameMainTxt = await nameMain.getProperty('textContent');
        // const nameMainRawTxt = await nameMainTxt.jsonValue();

        // return {nameSubRawTxt, nameMainRawTxt};

        // const nameSub = await foodItem.$eval('h5', element => element.innerText);
        // const nameMain = await foodItem.$eval('h4', element => element.innerText);
        // const price = await foodItem.$eval('.a-pricetag__price', element => element.innerText);
        // return {nameSub, nameMain, price};
        // return(await foodItem.jsonValue())
    }));

    console.log(food);

    // await Promise.all(h4Elements.map(async element => {
    //     const txt = await element.getProperty('textContent');
    //     let rawTxt = await txt.jsonValue();
    //     // remove all whitespaces
    //     rawTxt = rawTxt.replace(/\s/g, '');
    //     console.log({rawTxt});
    // }));
    // console.log({h4Elements});

    // await takeScreenshot(page, 5);

    // const isClickable = await page.$eval('#onetrust-reject-all-handler', element => {
    //     const rect = element.getBoundingClientRect();
    //     // return !!(rect.width || rect.height);
    // });

    // console.log('Is #onetrust-reject-all-handler clickable?', isClickable);
    


    // if (await page.$('#onetrust-reject-all-handler') !== null) {
    //     await page.click('#onetrust-reject-all-handler');
    // }
    // await takeScreenshot(page, 3);

    // // wait for 1 second
    // new Promise(r => setTimeout(r, 1000));

    // // set filiale
    // await page.click('.a-flyout-link__anchor');
    // await takeScreenshot(page, 4);
    // await page.waitForSelector('.a-link--storeflyout-change');
    // page.$eval(`.a-link--storeflyout-change`, element =>
    //     element.click()
    // );
    // // await page.click('.a-link--storeflyout-change');
    // // await page.waitForSelector('.m-store-flyout__address-town');

    // await page.waitForSelector('#store-search');
    // await page.type('#store-search', 'Kirchentellinsfurt');
    // await page.keyboard.press('Enter');

    // // await page.waitForNavigation();
    // // await page.waitForNavigation({ waitUntil: "networkidle0" });
    // await page.waitForSelector('.a-button--storelist-choose');
    // await page.$eval('.a-button--storelist-choose a', element =>
    //     element.click()
    // );

    // await page.goto(url);
    // await page.click('.a-button--storelist-choose a');


    // const location = await page.evaluate(() => {
    //     const loc = document.getElementsByClassName("m-store-flyout__address-town");//.innerHTML;
        
    //     return Array.from(loc).map(loc => {
    //         return loc.value;
    //     });
    // });

    // spanElement = await page.$$('.m-store-flyout__address-town');
    // spanElement = await page.$$('.m-accordion__title');
    // spanElement = spanElement.pop();
    // spanElement = await spanElement.getProperty('innerText');
    // spanElement = await spanElement.jsonValue();

    // console.log(spanElement);
    
    // await page.screenshot({ path: "screenshot.png" });

    // await page.waitForSelector('.o-overview-list__list-item');
    // console.log(await page.evaluate(() => document.getElementsByClassName("o-overview-list__list-item")[0]));
    // const allFood = await page.evaluate(() => {
    //     const foods = Array.from(document.getElementsByClassName("o-overview-list__list-item"));

    //     return Array.from(foods).slice(0,3).map(async food => {
    //         const nameSub = food.querySelector("h5")?.innerText;
    //         const nameMain = food.querySelector("h4")?.innerText;
            
    //         // let spanPrice = await food.$$('.a-pricetag__price');
    //         // spanPrice = spanElement.pop();
    //         // spanPrice = await spanElement.getProperty('innerText');
    //         // spanPrice = await spanElement.jsonValue();
    //         // const price = food.querySelector(".a-pricetag__price").innerText;//[0]?.innerText;

    //         return {nameSub, nameMain};

    //     });
    // });

    // console.log(allFood);
    // console.log(foods);
    await browser.close();
}

main();