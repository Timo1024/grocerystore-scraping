const puppeteer = require("puppeteer");
const fs = require('fs');
const { takeScreenshot, isElementClickable, extractDates, addFoodToDatabase, clearDatabaseByStore } = require("./lib.js");
const { setLocation, acceptCookies } = require("./subtasks.js");
const sqlite3 = require('sqlite3').verbose();

const saveNatworkData = false;

const url = "https://filiale.kaufland.de/angebote/aktuelle-woche/uebersicht.category=01_Fleisch__Gefl%C3%BCgel__Wurst.html";

const main = async () => {

    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(url);

    takeScreenshot(page, 0);

    await acceptCookies(page);
    // await setLocation(page);

    takeScreenshot(page, 0);

    // get all categories
    let categories = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[1]/div/ul/li/a');
    categories = Array.from(categories);
    const categoriesLength = categories.length;
    let specialCategories = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[2]/div/ul/li/a');
    specialCategories = Array.from(specialCategories);
    const specialCategoriesLength = specialCategories.length;

    // get dates when the prices are valid
    const dateRange = await page.$('.o-richtext--subheadline');
    let txtDateRange = await dateRange.getProperty('textContent');
    txtDateRange = await txtDateRange.jsonValue();
    txtDateRange = txtDateRange.trim();
    console.log({txtDateRange});

    const dates = await extractDates(txtDateRange);

    // const txtDates = dates.map((date) => {
    //     return date.toString();
    // });
    // console.log({txtDates});

    // loop over the categories and click on them
    for(let i = 0; i < categoriesLength; i++) {
        let [currCategory] = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[1]/div/div/nav/ul/li[1]/div/ul/li[' + (i+1) + ']/a');
        const txt = await currCategory.getProperty('textContent');
        const txtCategory = (await txt.jsonValue()).trim();
        console.log({rawTxt: txtCategory});
        await currCategory.click();

        // await redirect
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        // await takeScreenshot(page, i);

        let foodItems = await page.$x('/html/body/div[3]/main/div[1]/div/div/div[4]/div[2]/div/div/div/div');
        // make foodItems to array
        foodItems = Array.from(foodItems);
        console.log(foodItems.length);
    
        // from foodItems get h4, h5 and price
        const food = await Promise.all(foodItems.map(async (foodItem) => {

            // h5 contains the name of the food
            const itemH5 = await foodItem.$('h5');
            let txtItemH5;
            if(!itemH5){
                txtItemH5 = null;
            } else {
                txtItemH5 = await itemH5.getProperty('textContent');
                txtItemH5 = await txtItemH5.jsonValue();
                txtItemH5 = txtItemH5.trim();
            }
    
            // h4 contains the brand, info, etc. of the food
            const itemH4 = await foodItem.$('h4');
            let txtItemH4;
            if(!itemH4){
                txtItemH4 = null;
            } else {
                txtItemH4 = await itemH4.getProperty('textContent');
                txtItemH4 = await txtItemH4.jsonValue();
                txtItemH4 = txtItemH4.trim();
            }
    
            // the reduced price of the food
            const itemPrice = await foodItem.$('.a-pricetag__price');
            let txtItemPrice;
            if(!itemPrice){
                txtItemPrice = null;
            } else {
                txtItemPrice = await itemPrice.getProperty('textContent');
                txtItemPrice = await txtItemPrice.jsonValue();
                txtItemPrice = txtItemPrice.trim();
            }

            // the price per unit of the food
            const itemPricePerUnit = await foodItem.$('.m-offer-tile__quantity');
            let txtItemPricePerUnit;
            if(!itemPricePerUnit){
                txtItemPricePerUnit = null;
            } else {
                txtItemPricePerUnit = await itemPricePerUnit.getProperty('textContent');
                txtItemPricePerUnit = await txtItemPricePerUnit.jsonValue();
                txtItemPricePerUnit = txtItemPricePerUnit.trim();
            }

            // the link to the image of the food
            const itemImage = await foodItem.$('img');
            let txtItemImage;
            if(!itemImage || saveNatworkData){
                txtItemImage = null;
            } else {
                const outerHTML = await page.evaluate(el => el.outerHTML, itemImage);
                txtItemImage = outerHTML.match(/src="([^"]*)/)[1];
            }

            // add discount factor
            const discountFactor = await foodItem.$('.a-pricetag__discount');
            let txtDiscountFactor;
            if(!discountFactor){
                txtDiscountFactor = null;
            } else {
                txtDiscountFactor = await discountFactor.getProperty('textContent');
                txtDiscountFactor = await txtDiscountFactor.jsonValue();
                txtDiscountFactor = txtDiscountFactor.trim();
            }

            // add normal price
            const oldPrice = await foodItem.$('.a-pricetag__old-price');
            let txtOldPrice;
            if(!oldPrice){
                txtOldPrice = null;
            } else {
                txtOldPrice = await oldPrice.getProperty('textContent');
                txtOldPrice = await txtOldPrice.jsonValue();
                txtOldPrice = txtOldPrice.trim();
                if(txtOldPrice == "nur") txtOldPrice = null;
            }

            // add store name
            const storeName = "Kaufland"
    
            if((!txtItemH5 && !txtItemH4) || !txtItemPrice) return null;

            const foodInfo = (txtItemH5 ? txtItemH5 : "") + ((txtItemH4 && txtItemH5) ? "; " : "") + (txtItemH4 ? txtItemH4 : "");

            console.log({dates});

            return {
                // brandName: txtItemH5,
                foodInfo: foodInfo, 
                newPrice: txtItemPrice, 
                oldPrice: txtOldPrice,
                discountFactor: txtDiscountFactor, 
                PricePerUnit: txtItemPricePerUnit,
                image: txtItemImage,
                category: txtCategory,
                store: storeName,
                dates: dates
            };
    
        }));

        // add food to database
        await Promise.all(food.map(async (foodItem) => {
            if(foodItem) await addFoodToDatabase(
                // foodItem.brandName, 
                foodItem.foodInfo, 
                foodItem.newPrice, 
                foodItem.oldPrice, 
                foodItem.discountFactor, 
                foodItem.PricePerUnit, 
                foodItem.image, 
                foodItem.category, 
                foodItem.store, 
                foodItem.dates
            );
        }));

        // Save food to food.json
        // fs.writeFile('food.json', JSON.stringify(food, null, 2), (err) => {
        //     if (err) {
        //         console.error('Error saving food to food.json:', err);
        //     } else {
        //         console.log('Food saved to food.json');
        //     }
        // });

        // console.log(food);

    }

    await browser.close();
}

const initializeSqliteDB = () => {
    const db = new sqlite3.Database('food.db');
    db.serialize(function() {
        // db.run("CREATE TABLE IF NOT EXISTS food (brandName TEXT, foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, PricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS food (foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, PricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT)");
    });
    db.close();
}

initializeSqliteDB();
clearDatabaseByStore("Kaufland");
main();