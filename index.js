const puppeteer = require("puppeteer");
const { takeScreenshot, isElementClickable } = require("./lib.js");
const { setLocation } = require("./subtasks.js");

const saveNatworkData = false;

const url = "https://filiale.kaufland.de/angebote/aktuelle-woche/uebersicht.category=01_Fleisch__Gefl%C3%BCgel__Wurst.html";

const main = async () => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(url);

    await setLocation(page);

    // get all categories
    let categories = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[1]/div/ul/li/a');
    categories = Array.from(categories);
    const categoriesLength = categories.length;
    let specialCategories = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[2]/div/ul/li/a');
    specialCategories = Array.from(specialCategories);
    const specialCategoriesLength = specialCategories.length;
    // concatenate those two arrays
    // categories = categories.concat(specialCategories);
    // console.log(categories.length);

    // loop over the categories and click on them
    for(let i = 0; i < categoriesLength; i++) {
        let [currCategory] = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[1]/div/ul/li[' + (i+1) + ']/a');
        const txt = await currCategory.getProperty('textContent');
        const rawTxt = await txt.jsonValue();
        console.log({rawTxt});
        await currCategory.click();
        // await redirect
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await takeScreenshot(page, i);

        let foodItems = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[2]/div/div/div/div');
        // make foodItems to array
        foodItems = Array.from(foodItems);
        console.log(foodItems.length);
    
        // from foodItems get h4, h5 and price
        const food = await Promise.all(foodItems.map(async (foodItem) => {
            const itemH5 = await foodItem.$('h5');
            let txtItemH5;
            if(!itemH5){
                txtItemH5 = null;
            } else {
                txtItemH5 = await itemH5.getProperty('textContent');
                txtItemH5 = await txtItemH5.jsonValue();
                txtItemH5 = txtItemH5.trim();
            }
    
            const itemH4 = await foodItem.$('h4');
            let txtItemH4;
            if(!itemH4){
                txtItemH4 = null;
            } else {
                txtItemH4 = await itemH4.getProperty('textContent');
                txtItemH4 = await txtItemH4.jsonValue();
                txtItemH4 = txtItemH4.trim();
            }
    
            const itemPrice = await foodItem.$('.a-pricetag__price');
            let txtItemPrice;
            if(!itemPrice){
                txtItemPrice = null;
            } else {
                txtItemPrice = await itemPrice.getProperty('textContent');
                txtItemPrice = await txtItemPrice.jsonValue();
                txtItemPrice = txtItemPrice.trim();
            }

            const itemPricePerUnit = await foodItem.$('.m-offer-tile__quantity');
            let txtItemPricePerUnit;
            if(!itemPricePerUnit){
                txtItemPricePerUnit = null;
            } else {
                txtItemPricePerUnit = await itemPricePerUnit.getProperty('textContent');
                txtItemPricePerUnit = await txtItemPricePerUnit.jsonValue();
                txtItemPricePerUnit = txtItemPricePerUnit.trim();
            }

            const itemImage = await foodItem.$('img');
            let txtItemImage;
            if(!itemImage || saveNatworkData){
                txtItemImage = null;
            } else {
                const outerHTML = await page.evaluate(el => el.outerHTML, itemImage);
                txtItemImage = outerHTML.match(/src="([^"]*)/)[1];
            }

            // TODO add days valid as array
            // TODO add discount factor
            // TODO add normal price
    
            if((!txtItemH5 && !txtItemH4) || !txtItemPrice) return null;

            return {txtItemH5, txtItemH4, txtItemPrice, txtItemPricePerUnit, txtItemImage};
    
        }));
    
        console.log(food);

    }


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