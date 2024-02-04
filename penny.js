const puppeteer = require("puppeteer");
const fs = require('fs');
const { takeScreenshot, isElementClickable, extractDates, addFoodToDatabase, clearDatabaseByStore } = require("./lib.js");
const { setLocation, acceptCookies } = require("./subtasks.js");
const { log } = require("console");
const sqlite3 = require('sqlite3').verbose();

const saveNatworkData = false;

const url = "https://www.penny.de/angebote";

const acceptCookiesPenny = async (page) => {
    let acceptCookiesButton = await (await page.evaluateHandle(`document.querySelector("#usercentrics-root").shadowRoot.querySelector("#uc-center-container > div.sc-eBMEME.dRvQzh > div > div.sc-jsJBEP.bHqEwZ > div > button.sc-dcJsrY.iWikWl")`)).asElement();;
    console.log(acceptCookiesButton);

    if(acceptCookiesButton) {
        await acceptCookiesButton.click();
    }
}

const chooseLocation = async (page) => {
    // await takeScreenshot(page, "1_startChosingLocation");
    const [chooseLocationButton] = await page.$x('/html/body/main/div/div[2]/article/div[2]/button');
    console.log({chooseLocationButton});
    if(chooseLocationButton) {
        await chooseLocationButton.click();

        // await takeScreenshot(page, "2_clickedChooseLocationButton");

        const [inputPLZ] = await page.$x('/html/body/main/div/div[2]/div/div/main/div[1]/div/div/div/div/div/input');

        if(inputPLZ) {
            await inputPLZ.type('72138');

            await new Promise(r => setTimeout(r, 500));
            const [firstResult] = await page.$x('/html/body/main/div/div[2]/div/div/main/div[2]/ul/li[1]/article/div/div[2]/a');
            // await takeScreenshot(page, "3_typedPLZ");

            if(firstResult) {
                await firstResult.click();

                // await takeScreenshot(page, "4_pressedOnFirstResult");

                console.log("Location set to 72138");
            }
        }
    }
}

const main = async () => {

    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(url);

    await new Promise(r => setTimeout(r, 500));
    
    // await takeScreenshot(page, "start");
    
    await acceptCookiesPenny(page);
    
    // await takeScreenshot(page, "afterAcceptCookies");

    await chooseLocation(page);

    await new Promise(r => setTimeout(r, 500));

    // get all time sections
    const [abMontag] = await page.$$('#ab-montag');
    const [abDonnerstag] = await page.$$('#ab-donnerstag');
    const [abFreitag] = await page.$$('#ab-freitag');
    const [abNaechstenMontag] = await page.$$('#ab-naechsten-montag');
    const [abNaechstenDonnerstag] = await page.$$('#ab-naechsten-donnerstag');
    const [abNaechstenFreitag] = await page.$$('#ab-naechsten-freitag');

    const timeSections = [abMontag, abDonnerstag, abFreitag, abNaechstenMontag, abNaechstenDonnerstag, abNaechstenFreitag];

    // console.log({timeSections});

    // get amount of time sections which are not undefined
    const timeSectionsLength = timeSections.filter((timeSection) => timeSection).length;

    const [currentWeekWrapper] = await page.$x('/html/body/main/div/div[4]/section[1]/div[1]/div[1]/div/div/div/div/div[1]');

    console.log({currentWeekWrapper});

    let currentWeek = "";

    if(currentWeekWrapper) {
        currentWeek = await page.evaluate(el => el.getAttribute('data-startend'), currentWeekWrapper);
        currentWeek = currentWeek.trim();
    } else {
        currentWeek = null;
    }

    // get the date range from monday to next saturday (the given first monday is the first date in the current week string "29.01. - 03.02.")
    let [start, end] = currentWeek.split(" - ");
    start = start.split(".");
    let now = new Date();
    start = new Date(now.getFullYear(), start[1]-1, start[0]);

    // get all dated between start and end
    let dates = [];
    for(let i = 0; i < 13; i++) {
        let date = new Date(start.getTime());
        date.setDate(start.getDate() + i);
        dates.push(date.toLocaleDateString());
    }

    const timeSectionsDates = [
        [dates[0], dates[1], dates[2], dates[3], dates[4], dates[5]],
        [dates[3], dates[4], dates[5]],
        [dates[4], dates[5]],
        [dates[7], dates[8], dates[9], dates[10], dates[11], dates[12]],
        [dates[10], dates[11], dates[12]],
        [dates[11], dates[12]]
    ]

    console.log({timeSectionsLength});

    // loop over time sections
    // for(let i = 0; i < 1; i++) {
    for(let i = 0; i < timeSectionsLength; i++) {
        
        let timeSection = timeSections[i];
        // let timeSection = timeSections[1];

        // scroll to the timesection
        // await page.evaluate((el) => {
        //     el.scrollIntoView();
        // }, timeSection);

        // await new Promise(r => setTimeout(r, 500));

        // get the time points

        
        // get all top level section elements
        let sectionElements = await timeSection.$$('xpath/section');

        // loop over section elements
        for(let j = 0; j < sectionElements.length; j++) {
        // for(let j = 0; j < 1; j++) {
            let sectionElement = sectionElements[j];
            // let sectionElement = sectionElements[0];

            await page.evaluate((el) => {
                el.scrollIntoView();
            }, sectionElement);

            // get id of the section element
            let id = await page.evaluate(el => el.id, sectionElement);

            let category = ""

            if(id.includes("framstag")) {
                category = "Framstag";
            } else {
                let [h3] = await sectionElement.$$('xpath/header/div[2]/div/div/div/h3');
                // console.log(h3);
                h3 = await h3.getProperty('textContent');
                category = (await h3.jsonValue()).trim();
            }

            // get the ul which contains all the food items
            let [ul] = await sectionElement.$$('ul');

            // loop over li elements in the lu element
            let liElements = await ul.$$('li');

            for(let k = 0; k < liElements.length; k++) {
                let liElement = liElements[k];

                // log outerHTML of li element
                // let outerHTML = await page.evaluate(el => el.outerHTML, liElement);
                // console.log({outerHTML});
                
                // get the oldPrice
                let [oldPriceWrapper] = await liElement.$$('.bubble__small-value');

                console.log({oldPriceWrapper});

                let oldPrice = "";
                if(oldPriceWrapper) {
                    // get the .label and the .value elements if they exist and concatenate their text
                    let [label] = await oldPriceWrapper.$$('.label');
                    let [value] = await oldPriceWrapper.$$('.value');

                    let labelTxt = "";
                    let valueTxt = "";

                    if(label) {
                        label = await label.getProperty('textContent');
                        labelTxt = (await label.jsonValue()).trim();
                    }

                    if(value) {
                        value = await value.getProperty('textContent');
                        valueTxt = (await value.jsonValue()).trim();
                    }

                    oldPrice = labelTxt + (label && value ? " " : "") + valueTxt;

                } else {
                    oldPrice = null;
                }

                // get new price
                let [newPriceWrapper] = await liElement.$$('.bubble__price');

                let newPrice = "";
                if(newPriceWrapper) {
                    newPrice = await newPriceWrapper.getProperty('textContent');
                    newPrice = (await newPrice.jsonValue()).trim();
                } else {
                    newPrice = null;
                }

                // get additional info
                let [additionalInfoWrapper] = await liElement.$$('.badge--split.t-bg--blue-petrol.t-color--white');

                let additionalInfo = "";
                if(additionalInfoWrapper) {
                    additionalInfo = "nur mit der Penny App";
                } else {
                    additionalInfo = null;
                }

                // get the discount factor
                let [discountFactorWrapper] = await liElement.$$('xpath/article/div[3]/div[1]/span');

                let discountFactor = "";
                if(discountFactorWrapper) {
                    discountFactor = await discountFactorWrapper.getProperty('textContent');
                    discountFactor = (await discountFactor.jsonValue()).trim();
                } else {
                    discountFactor = null;
                }

                // get price per unit
                let [pricePerUnitWrapper] = await liElement.$$('.offer-tile__unit-price');

                let pricePerUnit = "";
                if(pricePerUnitWrapper) {
                    pricePerUnit = await pricePerUnitWrapper.getProperty('textContent');
                    pricePerUnit = (await pricePerUnit.jsonValue()).trim();
                } else {
                    pricePerUnit = null;
                }

                // get food info
                let [foodInfoWrapper] = await liElement.$$('.tile__link--cover');

                let foodInfo = "";
                if(foodInfoWrapper) {
                    foodInfo = await foodInfoWrapper.getProperty('textContent');
                    foodInfo = (await foodInfo.jsonValue()).trim();
                } else {
                    foodInfo = null;
                }

                // get image
                let [imageWrapper] = await liElement.$$('.offer-tile__image');

                let image = "";
                if(imageWrapper) {
                    image = await imageWrapper.getProperty('src');
                    image = (await image.jsonValue()).trim();
                } else {
                    image = null;
                }

                // get the dates
                let dates = timeSectionsDates[i].join(";");

                // store
                let store = "Penny";

                console.log({oldPrice, newPrice, additionalInfo, category, discountFactor, pricePerUnit, foodInfo, image, dates, store});

                // if newPrice and foodInfo are not null, add the food to the database
                if(newPrice && foodInfo) {
                    await addFoodToDatabase(foodInfo, newPrice, oldPrice, discountFactor, pricePerUnit, image, category, store, dates, additionalInfo);
                }

            }

        }

    }

    // get h3 for all time sections (the text attribute)
    // const h3s = await Promise.all(timeSections.map(async (timeSection) => {
    //     return await page.evaluate((timeSection) => {
    //         return timeSection.querySelector('h3').textContent;
    //     }, timeSection);
    // }));

    // console.log(h3s);


    // get all time spans buttons
    // let timeSpans = await page.$x('/html/body/main/div/div[4]/section[1]/div[1]/div[1]/div/div/div/div/div[position()>=3]')
    // timeSpans = Array.from(timeSpans);
    // const timeSpansLength = timeSpans.length;

    // console.log(timeSpansLength);

    // for(let i = 0; i < timeSpansLength; i++) {
    //     // await acceptCookiesPenny(page);
    //     let [timeSpan] = await page.$x('/html/body/main/div/div[4]/section[1]/div[1]/div[1]/div/div/div/div/div[' + (i+3) + ']');
        
    //     let elementHTML = await page.evaluate(el => el.outerHTML, timeSpan);
    //     console.log(elementHTML);

    //     await timeSpan.click();
    //     await new Promise(r => setTimeout(r, 100));
    //     await takeScreenshot(page, i);

    //     // getDays(timeSpan)

    // }
    
    await browser.close();
}

const initializeSqliteDB = () => {
    const db = new sqlite3.Database('food.db');
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS food (foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, pricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT, additionalInfo TEXT)");
    });
    db.close();
}

initializeSqliteDB();
clearDatabaseByStore(null);
clearDatabaseByStore("Penny");
main();