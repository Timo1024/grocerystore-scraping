const sqlite3 = require('sqlite3').verbose();

const initializeSqliteDB = () => {
    const db = new sqlite3.Database('food.db');
    db.serialize(function() {
        // db.run("CREATE TABLE IF NOT EXISTS food (brandName TEXT, foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, pricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS food (foodInfo TEXT, newPrice TEXT, oldPrice TEXT, discountFactor TEXT, pricePerUnit TEXT, image TEXT, category TEXT, store TEXT, dates TEXT)");
    });
    db.close();
}

const clearNullRows = async function() {
    const db = new sqlite3.Database('food.db');
    const sql = `DELETE FROM food WHERE store IS NULL OR foodInfo IS NULL OR newPrice IS NULL`;

    db.run(sql, function(err) {
        if (err) {
            console.log(err.message);
        }
        console.log(`Deleted NULL rows`);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

initializeSqliteDB();
clearNullRows();