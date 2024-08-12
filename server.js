const mysql = require('mysql2');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path'); // Required to serve static files
const { v4: uuidv4 } = require('uuid');
const generateInvoice = require('./generateInvoice.js');

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'c!jP^Xtfquw,8<e"KECnsy', // Replace with your actual MySQL password
    database: 'invoiceDB'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

const express = require('express');
const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let products = [];

// Route to handle adding a product
app.post('/add-product', (req, res) => {
    const { name, mrp, discount, quantity, discountedPrice, totalPrice } = req.body;

    const product = {
        id: uuidv4(),
        name,
        mrp,
        discount,
        quantity,
        discounted_price: discountedPrice,
        total_price: totalPrice
    };

    products.push(product);
    res.send('Product added successfully');
});

// Route to handle removing a product
app.post('/remove-product', (req, res) => {
    const { index } = req.body;

    if (index >= 0 && index < products.length) {
        products.splice(index, 1);
        res.send('Product removed successfully');
    } else {
        res.status(400).send('Invalid index');
    }
});

// Function to save products to Excel
function saveProductsToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'MRP', key: 'mrp', width: 10 },
        { header: 'Discount', key: 'discount', width: 10 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Discounted Price', key: 'discounted_price', width: 15 },
        { header: 'Total Price', key: 'total_price', width: 15 },
        { header: 'Unique ID', key: 'unique_id', width: 30 }
    ];

    products.forEach(product => {
        worksheet.addRow(product);
    });

    const outputPath = './Invoices.xlsx';
    return workbook.xlsx.writeFile(outputPath)
        .then(() => {
            console.log(`Data has been written to ${outputPath}`);
        })
        .catch(error => {
            console.error('Error writing to Excel file:', error);
        });
}

// Route to handle saving invoice to Excel
app.post('/save-invoice', (req, res) => {
    saveProductsToExcel().then(() => {
        res.send('Invoice saved to Excel');
    }).catch(error => {
        res.status(500).send('Error saving invoice to Excel');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});