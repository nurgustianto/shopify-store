// assets/application.js

document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const sizeSelectors = document.querySelectorAll('.size-selector');
    const patchSelectors = document.querySelectorAll('.patch-selector');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const selectedSize = getSelectedSize();
            const selectedPatches = getSelectedPatches();

            if (selectedSize) {
                addToCart(productId, selectedSize, selectedPatches);
            } else {
                alert('Please select a jersey size.');
            }
        });
    });

    function getSelectedSize() {
        let selectedSize = null;
        sizeSelectors.forEach(selector => {
            if (selector.checked) {
                selectedSize = selector.value;
            }
        });
        return selectedSize;
    }

    function getSelectedPatches() {
        const selectedPatches = [];
        patchSelectors.forEach(selector => {
            if (selector.checked) {
                selectedPatches.push(selector.value);
            }
        });
        return selectedPatches;
    }

    function addToCart(productId, size, patches) {
        const data = {
            items: [{
                id: productId,
                quantity: 1,
                properties: {
                    'Size': size,
                    'Patches': patches.join(', ')
                }
            }]
        };

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Item added to cart!');
            } else {
                alert('Failed to add item to cart.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
});