document.addEventListener('DOMContentLoaded', () => {
    // Call populateCategorySelect() or any other initialization functions here
});

function addProduct() {
    const categorySelect = document.getElementById('categorySelect');
    const productSelect = document.getElementById('productSelect');
    const mrpInput = document.getElementById('productMRP');
    const discountInput = document.getElementById('productDiscount');
    const quantityInput = document.getElementById('productQuantity');

    if (!categorySelect || !productSelect || !mrpInput || !discountInput || !quantityInput) {
        console.error('One or more required elements are missing');
        return;
    }

    const name = productSelect.value;
    const mrp = parseFloat(mrpInput.value);
    const discount = parseFloat(discountInput.value);
    const quantity = parseInt(quantityInput.value, 10);
    const discountedPrice = mrp - (mrp * discount / 100);
    const totalPrice = discountedPrice * quantity;

    if (!name || isNaN(mrp) || isNaN(discount) || isNaN(quantity)) {
        alert('Please select a product and enter valid details.');
        return;
    }

    fetch('/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mrp, discount, quantity, discountedPrice, totalPrice })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        products.push({ ...data.product, id: data.id });
        updateProductList();
    })
    .catch(error => console.error('Error:', error));
}
