document.addEventListener('DOMContentLoaded', function() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggle = document.querySelector('.cart-toggle');
  const cartClose = document.querySelector('.cart-drawer__close');
  
  // Toggle cart drawer
  cartToggle.addEventListener('click', () => {
    cartDrawer.classList.add('active');
  });
  
  cartClose.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
  });
  
  // Add to cart functionality
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addToCartForm);
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const cartData = await response.json();
          updateCart();
          cartDrawer.classList.add('active');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    });
  }
  
  // Update cart contents
  async function updateCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const cartContent = document.querySelector('.cart-drawer__content');
      
      // Update cart HTML here
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }
});