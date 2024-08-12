app.post('/save-invoice', async (req, res) => {
    try {
        await saveProductsToExcel(); // Save products to Excel first
        await generateInvoice(products); // Generate the PDF with the current products
        res.send('Invoice saved to Excel and PDF generated');
    } catch (error) {
        res.status(500).send('Error saving invoice to Excel or generating PDF');
    }
});

