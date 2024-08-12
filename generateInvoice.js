const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Function to generate a PDF invoice
async function generateInvoice(products) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Convert logo to Base64
        const logoPath = path.join(__dirname, 'duplicate_logo.png'); // Update with your logo path
        const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        const logoDataUrl = `data:image/png;base64,${logoBase64}`;

        // Generate the HTML content for the invoice
        const productsHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₹${product.mrp}</td>
                <td>${product.discount}%</td>
                <td>₹${product.discounted_price}</td>
                <td>₹${product.total_price}</td>
            </tr>
        `).join('');

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    background-color: #fff;
                }
                .invoice-box h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                .logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .logo img {
                    max-width: 150px;
                }
                .invoice-details table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .invoice-details table, .invoice-details th, .invoice-details td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                .invoice-details th {
                    background-color: #f2f2f2;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="logo">
                    <img src="${logoDataUrl}" alt="Craving Hub Logo">
                </div>
                <h1>Craving Hub Invoice</h1>
                <div class="invoice-details">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>MRP</th>
                                <th>Discount</th>
                                <th>Discounted Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        </body>
        </html>
        `;

        // Generate the PDF
        await page.setContent(htmlContent);
        const pdfPath = path.join(__dirname, 'invoice.pdf');
        await page.pdf({ path: pdfPath, format: 'A4' });

        await browser.close();
        console.log('PDF generated:', pdfPath);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

module.exports = generateInvoice;