// Menu data
const menuItems = {
    hotBeverages: [
        { id: 1, name: 'Espresso', price: 120, image: 'images/espresso.jpg', category: 'Hot Beverages' },
        { id: 2, name: 'Cappuccino', price: 150, image: 'images/cappuccino.jpg', category: 'Hot Beverages' },
        { id: 3, name: 'Latte', price: 180, image: 'images/latte.jpg', category: 'Hot Beverages' },
        { id: 4, name: 'Americano', price: 140, image: 'images/americano.jpg', category: 'Hot Beverages' }
    ],
    coldBeverages: [
        { id: 5, name: 'Iced Coffee', price: 160, image: 'images/iced_coffee.jpg', category: 'Cold Beverages' },
        { id: 6, name: 'Frappuccino', price: 200, image: 'images/frappuccino.jpg', category: 'Cold Beverages' },
        { id: 7, name: 'Cold Brew', price: 180, image: 'images/cold_brew.jpg', category: 'Cold Beverages' }
    ],
    refreshments: [
        { id: 8, name: 'Fresh Orange Juice', price: 100, image: 'images/orange_juice.jpg', category: 'Refreshments' },
        { id: 9, name: 'Lemonade', price: 80, image: 'images/lemonade.jpg', category: 'Refreshments' },
        { id: 10, name: 'Smoothie', price: 120, image: 'images/smoothie.jpg', category: 'Refreshments' }
    ],
    desserts: [
        { id: 11, name: 'Chocolate Cake', price: 180, image: 'images/chocolate_cake.jpg', category: 'Desserts' },
        { id: 12, name: 'Cheesecake', price: 200, image: 'images/cheesecake.jpg', category: 'Desserts' },
        { id: 13, name: 'Tiramisu', price: 220, image: 'images/tiramisu.jpg', category: 'Desserts' }
    ],
    snacks: [
        { id: 14, name: 'Burger', price: 250, image: 'images/burger.jpg', category: 'Snacks' },
        { id: 15, name: 'French Fries', price: 120, image: 'images/fries.jpg', category: 'Snacks' },
        { id: 16, name: 'Sandwich', price: 180, image: 'images/sandwich.jpg', category: 'Snacks' }
    ]
};

// Cart and state management
let cart = {};
let totalAmount = 0;

// DOM elements
const menuContainer = document.getElementById('menu-container');
const cartCount = document.getElementById('cart-count');
const totalAmountElement = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const cartModal = document.getElementById('cart-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const toast = document.getElementById('toast');

// Render menu items
function renderMenu() {
    if (!menuContainer) return; // Check if we're on the order page
    
    menuContainer.innerHTML = '';
    
    Object.keys(menuItems).forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'menu_category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category_title';
        categoryTitle.textContent = menuItems[category][0].category;
        categorySection.appendChild(categoryTitle);
        
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'menu_items_grid';
        
        menuItems[category].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu_item';
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/coffee_logo.png'">
                <div class="menu_item_content">
                    <h4>${item.name}</h4>
                    <p class="price">Rs ${item.price}</p>
                    <div class="quantity_controls">
                        <button class="quantity_btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="quantity" id="quantity-${item.id}">1</span>
                        <button class="quantity_btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="add_to_cart_btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            `;
            itemsGrid.appendChild(menuItem);
        });
        
        categorySection.appendChild(itemsGrid);
        menuContainer.appendChild(categorySection);
    });
}

// Find item by ID
function findItemById(id) {
    for (const category in menuItems) {
        const item = menuItems[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

// Increase quantity
function increaseQuantity(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = quantity;
}

// Decrease quantity
function decreaseQuantity(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
}

// Add to cart
function addToCart(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    const quantity = parseInt(quantityElement.textContent);
    
    const item = findItemById(id);
    if (!item) return;
    
    if (cart[item.name]) {
        cart[item.name].quantity += quantity;
    } else {
        cart[item.name] = {
            price: item.price,
            quantity: quantity
        };
    }
    
    quantityElement.textContent = '1';
    updateCart();
    showToast(`${item.name} added to cart!`);
}

// Update cart display
function updateCart() {
    let itemCount = 0;
    totalAmount = 0;
    
    for (const item in cart) {
        itemCount += cart[item].quantity;
        totalAmount += cart[item].price * cart[item].quantity;
    }
    
    if (cartCount) cartCount.textContent = itemCount;
    if (totalAmountElement) totalAmountElement.textContent = totalAmount;
    
    if (checkoutBtn) {
        checkoutBtn.disabled = itemCount === 0;
        checkoutBtn.style.opacity = itemCount === 0 ? '0.5' : '1';
    }
}

// Show toast notification
function showToast(message) {
    if (!toast) return;
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Initialize checkout
function initializeCheckout() {
    if (Object.keys(cart).length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    renderCartItems();
    cartModal.classList.remove('hidden');
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const modalTotal = document.getElementById('modal-total');
    
    cartItemsContainer.innerHTML = '';
    
    for (const item in cart) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart_item';
        cartItem.innerHTML = `
            <div class="cart_item_info">
                <span class="item_name">${item}</span>
                <span class="item_price">Rs ${cart[item].price} x ${cart[item].quantity}</span>
            </div>
            <div class="cart_item_controls">
                <button onclick="removeFromCart('${item}')">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    }
    
    modalTotal.textContent = totalAmount;
}

// Remove from cart
function removeFromCart(itemName) {
    delete cart[itemName];
    updateCart();
    renderCartItems();
    showToast(`${itemName} removed from cart`);
}

// Confirm order
function confirmOrder() {
    if (Object.keys(cart).length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    let orderSummary = 'Order Summary:\n\n';
    for (const item in cart) {
        const details = cart[item];
        orderSummary += `${item} x${details.quantity} - Rs${details.price * details.quantity}\n`;
    }
    orderSummary += `\nTotal: Rs${totalAmount}`;
    
    document.getElementById('confirmation-message').textContent = orderSummary;
    cartModal.classList.add('hidden');
    confirmationModal.classList.remove('hidden');
}

// Complete order
function completeOrder() {
    cart = {};
    totalAmount = 0;
    updateCart();
    confirmationModal.classList.add('hidden');
    showToast('Your order has been placed successfully! Thank you!');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Only render menu if we're on the order page
    if (menuContainer) {
        renderMenu();
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', initializeCheckout);
    }
    
    // Cart modal events
    const closeCart = document.getElementById('close-cart');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const cancelOrderBtn = document.getElementById('cancel-order-btn');
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.add('hidden');
        });
    }
    
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', confirmOrder);
    }
    
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', () => {
            cartModal.classList.add('hidden');
        });
    }
    
    // Confirmation modal events
    const completeOrderBtn = document.getElementById('complete-order-btn');
    const cancelConfirmationBtn = document.getElementById('cancel-confirmation-btn');
    
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', completeOrder);
    }
    
    if (cancelConfirmationBtn) {
        cancelConfirmationBtn.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            showToast('Order cancelled');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
        if (e.target === confirmationModal) {
            confirmationModal.classList.add('hidden');
        }
    });
});
