class CartDrawer {
  constructor() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.toggleButton = document.getElementById('cart-toggle');
    this.cartCount = document.getElementById('cart-count');
    this.bindEvents();
  }

  bindEvents() {
    this.toggleButton.addEventListener('click', () => this.toggleDrawer());
    this.overlay.addEventListener('click', () => this.closeDrawer());
  }

  async toggleDrawer() {
    this.drawer.classList.toggle('active');
    this.overlay.classList.toggle('active');
    await this.updateCart();
  }

  closeDrawer() {
    this.drawer.classList.remove('active');
    this.overlay.classList.remove('active');
  }

  async updateCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.renderCart(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  renderCart(cart) {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h4>${item.title}</h4>
          <p>${item.price}</p>
          <div class="quantity-selector">
            <button data-id="${item.id}" class="quantity-decrease">-</button>
            <span>${item.quantity}</span>
            <button data-id="${item.id}" class="quantity-increase">+</button>
          </div>
        </div>
      </div>
    `).join('');
    
    this.cartCount.textContent = cart.item_count;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CartDrawer();
});