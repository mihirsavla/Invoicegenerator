async function generatePDF() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
      </head>
      <body>
          <h1>Invoice</h1>
          <p>Product: Example Product</p>
          <p>Quantity: 1</p>
          <p>MRP: 100</p>
          <p>Discount: 10%</p>
          <p>Final Price: 90</p>
      </body>
      </html>
      `;
      await page.setContent(htmlContent);
      await page.pdf({ path: 'invoice.pdf', format: 'A4' });
  
      await browser.close();
      console.log('PDF generated: invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  fetch('http://localhost:3001/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mrp, discount, quantity, discountedPrice, totalPrice })
})
