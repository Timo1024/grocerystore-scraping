const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const db = new sqlite3.Database('food.db');  // Replace with your actual database file

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/search', (req, res) => {
    console.log(req.query);
    const query = req.query.query;
    const sql = `SELECT *, rowid FROM food WHERE foodInfo LIKE ? OR category LIKE ?`;
    db.all(sql, [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // rows.forEach(row => {
        //     console.log(row.rowid);  // Access the id of each row
        // });
        // console.log("--------------------");
        res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
        res.json(rows || []); // Send the response as JSON
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});