document.addEventListener('DOMContentLoaded', function() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggle = document.querySelector('.cart-toggle');
  const cartClose = document.querySelector('.cart-drawer__close');
  const cartCount = document.querySelector('.cart-count');
  
  // Toggle cart drawer
  cartToggle?.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  cartClose?.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Handle quantity changes
  document.addEventListener('click', async (e) => {
    if (e.target.matches('.quantity-adjust')) {
      const input = e.target.closest('.quantity-wrapper').querySelector('input');
      const variantId = input.dataset.variantId;
      const currentQty = parseInt(input.value);
      const change = e.target.dataset.change === 'increase' ? 1 : -1;
      const newQty = Math.max(1, currentQty + change);

      if (currentQty !== newQty) {
        input.value = newQty;
        await updateItemQuantity(variantId, newQty);
      }
    }
  });

  // Add to cart functionality with animation
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = addToCartForm.querySelector('[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = 'Adding...';
      
      const formData = new FormData(addToCartForm);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const cartData = await response.json();
          await updateCart();
          cartDrawer.classList.add('active');
          
          // Show success animation
          submitButton.innerHTML = 'Added to Cart!';
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Add to Cart';
          }, 2000);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        submitButton.innerHTML = 'Error - Try Again';
        submitButton.disabled = false;
      }
    });
  }

  // Update cart contents with enhanced display
  async function updateCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const cartContent = document.querySelector('.cart-drawer__content');
      
      if (!cartContent) return;

      if (cart.item_count === 0) {
        cartContent.innerHTML = `
          <div class="cart-drawer__empty">
            <i class="fas fa-shopping-cart fa-3x"></i>
            <p>Your cart is empty</p>
            <a href="/collections/all" class="button button--secondary">Continue Shopping</a>
          </div>
        `;
      } else {
        cartContent.innerHTML = `
          <form action="${window.Shopify.routes.cart}" method="post" novalidate>
            ${cart.items.map(item => `
              <div class="cart-item" data-variant-id="${item.variant_id}">
                <div class="cart-item__image">
                  <img src="${item.image || ''}" alt="${item.title}">
                </div>
                <div class="cart-item__details">
                  <h3>${item.product_title}</h3>
                  <p class="cart-item__variant">${item.variant_title || ''}</p>
                  ${item.properties ? Object.entries(item.properties)
                    .map(([key, value]) => `<p class="cart-item__property">${key}: ${value}</p>`).join('') : ''}
                  <div class="quantity-wrapper">
                    <button type="button" class="quantity-adjust" data-change="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-variant-id="${item.variant_id}">
                    <button type="button" class="quantity-adjust" data-change="increase">+</button>
                  </div>
                </div>
                <div class="cart-item__price">
                  ${formatMoney(item.final_line_price)}
                </div>
                <button type="button" class="cart-item__remove" data-variant-id="${item.variant_id}">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `).join('')}
            <div class="cart-drawer__footer">
              <div class="cart-drawer__subtotal">
                <span>Subtotal:</span>
                <span>${formatMoney(cart.total_price)}</span>
              </div>
              <button type="submit" name="checkout" class="button button--primary">
                Proceed to Checkout
              </button>
            </div>
          </form>
        `;
      }

      // Update cart count badge
      if (cartCount) {
        cartCount.textContent = cart.item_count;
        cartCount.classList.toggle('hidden', cart.item_count === 0);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  // Helper function for price formatting
  function formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  // Initialize cart on page load
  updateCart();
});