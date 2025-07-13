// Menu data
const menuItems = {
    hotBeverages: [
        { id: 1, name: 'Espresso', price: 120, category: 'Hot Beverages', description: 'Rich and bold coffee shot' },
        { id: 2, name: 'Cappuccino', price: 150, category: 'Hot Beverages', description: 'Creamy coffee with milk foam' },
        { id: 3, name: 'Latte', price: 180, category: 'Hot Beverages', description: 'Smooth coffee with steamed milk' },
        { id: 4, name: 'Americano', price: 140, category: 'Hot Beverages', description: 'Classic black coffee' }
    ],
    coldBeverages: [
        { id: 5, name: 'Iced Coffee', price: 160, category: 'Cold Beverages', description: 'Refreshing cold coffee' },
        { id: 6, name: 'Frappuccino', price: 200, category: 'Cold Beverages', description: 'Blended ice coffee drink' },
        { id: 7, name: 'Cold Brew', price: 180, category: 'Cold Beverages', description: 'Smooth cold brewed coffee' }
    ],
    refreshments: [
        { id: 8, name: 'Fresh Orange Juice', price: 100, category: 'Refreshments', description: 'Freshly squeezed orange juice' },
        { id: 9, name: 'Lemonade', price: 80, category: 'Refreshments', description: 'Fresh lemon drink' },
        { id: 10, name: 'Smoothie', price: 120, category: 'Refreshments', description: 'Fruit blend smoothie' }
    ],
    desserts: [
        { id: 11, name: 'Chocolate Cake', price: 180, category: 'Desserts', description: 'Rich chocolate layer cake' },
        { id: 12, name: 'Cheesecake', price: 200, category: 'Desserts', description: 'Creamy vanilla cheesecake' },
        { id: 13, name: 'Tiramisu', price: 220, category: 'Desserts', description: 'Italian coffee-flavored dessert' }
    ],
    snacks: [
        { id: 14, name: 'Burger', price: 250, category: 'Snacks', description: 'Juicy beef burger with fries' },
        { id: 15, name: 'French Fries', price: 120, category: 'Snacks', description: 'Crispy golden fries' },
        { id: 16, name: 'Sandwich', price: 180, category: 'Snacks', description: 'Fresh sandwich with filling' }
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

// Render menu items without images
function renderMenu() {
    if (!menuContainer) return;
    
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
                <div class="menu_item_content">
                    <h4>${item.name}</h4>
                    <p class="item_description">${item.description}</p>
                    <p class="price">₹${item.price}</p>
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

// Decrease quantity (minimum 1)
function decreaseQuantity(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
}

// Show toast notification with enhanced styling
function showToast(message) {
    if (!toast) return;
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
    
    // Add click to dismiss functionality
    const dismissToast = () => {
        toast.classList.add('hidden');
        toast.removeEventListener('click', dismissToast);
    };
    
    toast.addEventListener('click', dismissToast);
}

// Add to cart with better message formatting
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
    showToast(`${item.name} (${quantity}x) added to cart!`);
}

// Enhanced checkout initialization with loading state
function initializeCheckout() {
    if (Object.keys(cart).length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Add loading state to checkout button
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.classList.add('loading');
        checkoutButton.innerHTML = '<span class="btn-text">Processing...</span>';
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            checkoutButton.classList.remove('loading');
            checkoutButton.innerHTML = '<i class="bx bx-credit-card"></i><span class="btn-text">Checkout</span>';
            
            renderCartItems();
            cartModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }, 800);
    }
}

// Enhanced update cart function with button animation
function updateCart() {
    let itemCount = 0;
    totalAmount = 0;
    
    for (const item in cart) {
        itemCount += cart[item].quantity;
        totalAmount += cart[item].price * cart[item].quantity;
    }
    
    if (cartCount) {
        cartCount.textContent = itemCount;
        // Add bounce animation when count changes
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = totalAmount;
    }
    
    if (checkoutBtn) {
        const wasDisabled = checkoutBtn.disabled;
        checkoutBtn.disabled = itemCount === 0;
        
        if (itemCount === 0) {
            checkoutBtn.style.opacity = '0.7';
            checkoutBtn.innerHTML = '<i class="bx bx-credit-card"></i><span class="btn-text">Checkout</span>';
        } else {
            checkoutBtn.style.opacity = '1';
            checkoutBtn.innerHTML = '<i class="bx bx-credit-card"></i><span class="btn-text">Checkout (₹' + totalAmount + ')</span>';
            
            // Add a subtle animation when cart becomes ready
            if (wasDisabled && !checkoutBtn.disabled) {
                checkoutBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    checkoutBtn.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }
}

// Initialize checkout
function initializeCheckout() {
    if (Object.keys(cart).length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Add loading state to checkout button
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.classList.add('loading');
        checkoutButton.innerHTML = '<span class="btn-text">Processing...</span>';
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            checkoutButton.classList.remove('loading');
            checkoutButton.innerHTML = '<i class="bx bx-credit-card"></i><span class="btn-text">Checkout</span>';
            
            renderCartItems();
            cartModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }, 800);
    }
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const modalTotal = document.getElementById('modal-total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    let cartHasItems = false;
    for (const item in cart) {
        if (cart[item] && cart[item].quantity > 0) {
            cartHasItems = true;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart_item';
            cartItem.innerHTML = `
                <div class="cart_item_info">
                    <span class="item_name">${item}</span>
                    <span class="item_price">₹ ${cart[item].price} × ${cart[item].quantity} = ₹${cart[item].price * cart[item].quantity}</span>
                </div>
                <div class="cart_item_controls">
                    <button class="quantity_cart_btn" onclick="decreaseCartQuantity('${item}')" title="Decrease quantity">-</button>
                    <span class="cart_quantity">${cart[item].quantity}</span>
                    <button class="quantity_cart_btn" onclick="increaseCartQuantity('${item}')" title="Increase quantity">+</button>
                    <button class="remove_btn" onclick="removeFromCart('${item}')" title="Remove item">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        }
    }
    
    if (!cartHasItems) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
    }
    
    if (modalTotal) {
        modalTotal.textContent = totalAmount;
    }
}

// Increase quantity in cart with themed message
function increaseCartQuantity(itemName) {
    if (cart[itemName]) {
        cart[itemName].quantity += 1;
        updateCart();
        renderCartItems();
        showToast(`${itemName} quantity increased`);
    }
}

// Decrease quantity in cart with themed message
function decreaseCartQuantity(itemName) {
    if (cart[itemName]) {
        if (cart[itemName].quantity > 1) {
            cart[itemName].quantity -= 1;
            updateCart();
            renderCartItems();
            showToast(`${itemName} quantity decreased`);
        } else {
            showToast(`${itemName} is at minimum quantity. Use Remove to delete.`);
        }
    }
}

// Remove from cart with themed message
function removeFromCart(itemName) {
    if (cart[itemName]) {
        const removedQuantity = cart[itemName].quantity;
        delete cart[itemName];
        updateCart();
        renderCartItems();
        showToast(`${itemName} (${removedQuantity} item${removedQuantity > 1 ? 's' : ''}) removed from cart`);
    }
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
        orderSummary += `${item} x${details.quantity} - ₹${details.price * details.quantity}\n`;
    }
    orderSummary += `\nTotal: ₹${totalAmount}`;
    
    document.getElementById('confirmation-message').textContent = orderSummary;
    cartModal.classList.add('hidden');
    confirmationModal.classList.remove('hidden');
}

// Complete order with success message
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
