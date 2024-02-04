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
    const dateStartRaw = dateRange.split(" ")[2].split(".");
    const dateEndRaw = dateRange.split(" ")[4].split(".");
    // const dates = [];

    const firstDate = new Date(dateStartRaw[2], dateStartRaw[1] - 1, dateStartRaw[0]);
    const lastDate = new Date(dateEndRaw[2], dateEndRaw[1] - 1, dateEndRaw[0]);

    let currentDate = new Date(firstDate.getTime());
    let dates = [];
    let datesReadable = [];

    while (currentDate <= lastDate) {
        dates.push(new Date(currentDate));
        datesReadable.push(currentDate.toLocaleDateString());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // let dates = [];
    // for(let i = 0; i < 13; i++) {
    //     let date = new Date(start.getTime());
    //     date.setDate(start.getDate() + i);
    //     dates.push(date.toLocaleDateString());
    // }
    
    // dateRangeSplit.forEach(element => {
    //     const dateSplit = element.split(".");
    //     if(dateSplit.length != 3) return;
    //     const date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
    //     dates.push(date);
    // });
    
    // if(dates.length != 2) return [new Date(undefined)];

    // get dates between first and last date
    // const datesBetween = [];
    // const lastDate = dates[1];
    // let firstDate = dates[0];
    // while(firstDate <= lastDate) {
    //     datesBetween.push(firstDate);
    //     firstDate = new Date(firstDate.getTime() + 24 * 60 * 60 * 1000);
    //     // firstDate.setDate(firstDate.getDate() + 1);
    // }

    // from the datesBetween array, get the dates in the format "DD-MM-YYYY"
    // const datesShort = datesBetween.map((date) => {
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1;
    //     const year = date.getFullYear();
    //     return day + "-" + month + "-" + year;
    // });

    // console.log({dates});
    const datesJoined = datesReadable.join(";");

    return datesJoined;
}

const addFoodToDatabase = async function(foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates, additionalInfo) {
    const db = new sqlite3.Database('food.db');
    const sql = `INSERT INTO food (foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates, additionalInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [foodInfo, newPrice, oldPrice, discountFactor, PricePerUnit, image, category, store, dates, additionalInfo];

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

