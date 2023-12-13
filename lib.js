const sqlite3 = require('sqlite3').verbose();

const takeScreenshot = async function(page, nr) {
    const path = "screenshots/" + nr + ".png";
    console.log("Taking screenshot: " + path);
    return await page.screenshot({ path: path });
}

const isAnyParentNotVisible = async function(page, elementHandle) {
    let parent = await elementHandle.evaluateHandle((node) => node.parentElement);
    while (parent) {
        const isVisible = await page.evaluate((element) => {
            const { display, visibility } = getComputedStyle(element);
            return display !== 'none' && visibility !== 'hidden';
        }, parent);
        if (!isVisible) {
            return true;
        }
        parent = await parent.evaluateHandle((node) => node.parentElement);
    }
    return false;
}

const isElementClickable = async function(page, elementHandle) {
    // get size of element
    const size = await elementHandle.boundingBox();
    console.log({size});
    if(!size) return false;
    return true;
}

const extractDates = async function(dateRange) {
    dateRangeSplit = dateRange.split(" ");
    // console.log({dateRangeSplit});
    const dates = [];
    dateRangeSplit.forEach(element => {
        const dateSplit = element.split(".");
        // console.log({dateSplit});
        if(dateSplit.length != 3) return;
        const date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
        // const txtDate = date.toString();
        // console.log({txtDate});
        dates.push(date);
    });
    
    if(dates.length != 2) return [new Date(undefined)];

    // get dates between first and last date
    const datesBetween = [];
    const lastDate = dates[1];
    let firstDate = dates[0];
    while(firstDate <= lastDate) {
        datesBetween.push(firstDate);
        firstDate = new Date(firstDate.getTime() + 24 * 60 * 60 * 1000);
        // firstDate.setDate(firstDate.getDate() + 1);
    }

    // console.log({dates});
    const datesJoined = datesBetween.join(";");

    return datesJoined;
}

const addFoodToDatabase = async function(brandName, foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates) {
    const db = new sqlite3.Database('food.db');
    const sql = `INSERT INTO food (brandName, foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [brandName, foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates];

    db.run(sql, params, function(err) {
        if (err) {
            console.log(err.message);
        }
        // console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        // console.log('Close the database connection.');
    });
}

const clearDatabaseByStore = async function(store) {
    const db = new sqlite3.Database('food.db');
    const sql = `DELETE FROM food WHERE store = ?`;
    const params = [store];

    db.run(sql, params, function(err) {
        if (err) {
            console.log(err.message);
        }
        // console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        // console.log('Close the database connection.');
    });
}


module.exports = { takeScreenshot, isElementClickable, extractDates, addFoodToDatabase, clearDatabaseByStore };

