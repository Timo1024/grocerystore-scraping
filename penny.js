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
    
    // console.log({abMontag, abDonnerstag, abFreitag, abNaechstenMontag, abNaechstenDonnerstag, abNaechstenFreitag});

    // loop over time sections
    for(let i = 0; i < 1; i++) {
    // for(let i = 0; i < timeSections.length; i++) {
        
        // let timeSection = timeSections[i];
        let timeSection = timeSections[0];
        
        // get all top level section elements
        let sectionElements = await timeSection.$$('xpath/section');

        // loop over section elements
        // for(let j = 0; j < sectionElements.length; j++) {
        for(let j = 0; j < 1; j++) {
            // let sectionElement = sectionElements[j];
            let sectionElement = sectionElements[0];

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

            // console.log({category, id});

            // get the ul which contains all the food items
            let [ul] = await sectionElement.$$('ul');

            // loop over li elements in the lu element
            let liElements = await ul.$$('li');

            for(let k = 0; k < liElements.length; k++) {
                let liElement = liElements[k];
                
                // get the oldPrice
                let [oldPriceWrapper] = await liElement.$$('.bubble__small-value');

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

                console.log({oldPrice});

                // console.log({oldPriceWrapper});

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
        db.run("CREATE TABLE IF NOT EXISTS food (foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, PricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT)");
    });
    db.close();
}

initializeSqliteDB();
clearDatabaseByStore("Penny");
main();