// server.js
const express = require('express');
const sqlite3 = require('sqlite3');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('food.db');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.searchTerm;

    // Search the database based on the foodInfo column
    const query = `SELECT * FROM food WHERE foodInfo LIKE '%${searchTerm}%'`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('search', { results: rows });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});