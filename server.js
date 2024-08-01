const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'c!jP^Xtfquw,8<e"KECnsy', // Replace with your actual MySQL root password
    database: 'invoiceDB'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Endpoint to add a product
app.post('/add-product', (req, res) => {
    const { name, mrp, discount, quantity, discountedPrice, totalPrice } = req.body;

    if (!name || isNaN(mrp) || isNaN(discount) || isNaN(quantity) || isNaN(discountedPrice) || isNaN(totalPrice)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const uniqueId = uuidv4(); // Generate a unique ID

    const query = `INSERT INTO products (name, mrp, discount, quantity, discounted_price, total_price, unique_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [name, mrp, discount, quantity, discountedPrice, totalPrice, uniqueId];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Database error', error: err.message });
            return;
        }

        res.json({
            message: 'Product added successfully',
            product: { name, mrp, discount, quantity, discountedPrice, totalPrice },
            id: result.insertId
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
