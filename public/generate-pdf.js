document.addEventListener('DOMContentLoaded', () => {
    const generatePDFButton = document.getElementById('generate-pdf-button');
    
    if (generatePDFButton) {
        generatePDFButton.addEventListener('click', async () => {
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

            try {
                const response = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ htmlContent })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = response.headers.get('Content-Disposition').split('filename=')[1]; // Get filename from header
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    console.error('Error generating PDF:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        });
    }
});
