/**
 * Inkwell & Co. - Main JavaScript
 * Handles navigation, cart state (localStorage), filtering, multi-step checkout, and interactive features.
 */

// --- Cart & Store State Management ---
const CART_STORAGE_KEY = 'inkwell_cart';
const WISHLIST_STORAGE_KEY = 'inkwell_wishlist';
const PROMO_STORAGE_KEY = 'inkwell_promo';
const VALID_PROMO_CODE = 'HAPPYPAGES';
const PROMO_DISCOUNT_PERCENT = 0.10; // 10%
const FREE_SHIPPING_THRESHOLD = 35.00;
const STANDARD_SHIPPING_FEE = 4.99;

// Get Cart from localStorage
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

// Save Cart to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
}

// Add item to cart
function addToCart(productId, quantity = 1, showToastNotice = true) {
  const product = getProductById(productId);
  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: productId,
      quantity: quantity
    });
  }

  saveCart(cart);

  if (showToastNotice) {
    showToast(`Added "${product.name}" to your cart! 🛍️`, 'success');
  }

  // Trigger custom event for reactive page elements
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  const product = getProductById(productId);
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);

  if (product) {
    showToast(`Removed "${product.name}" from your cart.`, 'info');
  }

  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

// Update item quantity
function updateCartQuantity(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = newQty;
    saveCart(cart);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }
}

// Clear all cart items
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(PROMO_STORAGE_KEY);
  updateCartBadges();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
}

// Get total item count in cart
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Calculate subtotal
function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const prod = getProductById(item.id);
    return total + (prod ? prod.price * item.quantity : 0);
  }, 0);
}

// Promo Code Management
function getAppliedPromo() {
  return localStorage.getItem(PROMO_STORAGE_KEY);
}

function applyPromo(code) {
  if (code.trim().toUpperCase() === VALID_PROMO_CODE) {
    localStorage.setItem(PROMO_STORAGE_KEY, VALID_PROMO_CODE);
    return { success: true, message: `Promo code "${VALID_PROMO_CODE}" applied! 10% discount added. ✨` };
  } else {
    return { success: false, message: 'Invalid promo code. Try "HAPPYPAGES"!' };
  }
}

function removePromo() {
  localStorage.removeItem(PROMO_STORAGE_KEY);
}

// Wishlist Helpers
function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function toggleWishlist(productId, btnElement) {
  let list = getWishlist();
  const index = list.indexOf(productId);
  const product = getProductById(productId);
  const prodName = product ? product.name : 'Item';

  if (index > -1) {
    list.splice(index, 1);
    if (btnElement) btnElement.classList.remove('active');
    showToast(`Removed "${prodName}" from your wishlist.`, 'info');
  } else {
    list.push(productId);
    if (btnElement) btnElement.classList.add('active');
    showToast(`Saved "${prodName}" to your wishlist! 💖`, 'success');
  }
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
}

// --- Toast Notification System ---
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutToast 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// Update Cart Badges across Header
function updateCartBadges() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.classList.remove('bump');
    void badge.offsetWidth; // Trigger reflow for animation restart
    badge.classList.add('bump');
  });
}

// Helper: Render Star Rating HTML
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  if (hasHalf) {
    starsHtml += '★';
  }
  while (starsHtml.length < 5) {
    starsHtml += '☆';
  }

  return `<span class="stars">${starsHtml}</span> <span class="rating-num">${rating.toFixed(1)}</span>`;
}

// Helper: Render Product Card HTML
function createProductCardHTML(product) {
  const wishlist = getWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const badgeHtml = product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : '';
  const originalPriceHtml = product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}">
      <div class="product-img-wrap">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        ${badgeHtml}
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}', this)" title="Add to Wishlist" aria-label="Add to Wishlist">
          ♥
        </button>
      </div>
      <div class="product-card-body">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="text-muted">(${product.reviewCount})</span>
        </div>
        <div class="product-price-row">
          <span class="current-price">$${product.price.toFixed(2)}</span>
          ${originalPriceHtml}
        </div>
        <button class="btn btn-add-cart" onclick="addToCart('${product.id}', 1)">
          <span>🛒 Add to Cart</span>
        </button>
      </div>
    </div>
  `;
}

// Global Nav & UI Setup
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();

  // Scroll handler for sticky header
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Hamburger Mobile Menu
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  if (hamburgerBtn && mobileDrawer) {
    const toggleMenu = () => {
      hamburgerBtn.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      if (mobileBackdrop) mobileBackdrop.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', toggleMenu);
    }
  }

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Newsletter Form handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast("Thanks for subscribing! Check your inbox for cozy book club updates. 💌", 'success');
        input.value = '';
      }
    });
  });

  // Detect and initialize page
  initCurrentPage();
});

// Routing initializer based on page presence
function initCurrentPage() {
  if (document.getElementById('home-bestsellers-grid')) {
    initHomePage();
  } else if (document.getElementById('shop-products-grid')) {
    initShopPage();
  } else if (document.getElementById('product-detail-view')) {
    initProductDetailPage();
  } else if (document.getElementById('cart-items-container')) {
    initCartPage();
  } else if (document.getElementById('checkout-wizard')) {
    initCheckoutPage();
  } else if (document.getElementById('auth-card')) {
    initLoginPage();
  } else if (document.getElementById('contact-form')) {
    initContactPage();
  }
}

// ==========================================
// 1. HOME PAGE
// ==========================================
function initHomePage() {
  const bestsellersGrid = document.getElementById('home-bestsellers-grid');
  if (!bestsellersGrid || typeof PRODUCTS === 'undefined') return;

  const bestsellers = getBestsellers(8);
  bestsellersGrid.innerHTML = bestsellers.map(createProductCardHTML).join('');
}

// ==========================================
// 2. SHOP PAGE
// ==========================================
function initShopPage() {
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('results-count');
  const categoryFiltersContainer = document.getElementById('category-filters');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('shop-search');
  const activeFiltersContainer = document.getElementById('active-filters');
  const resetBtn = document.getElementById('reset-filters-btn');

  if (!grid || typeof PRODUCTS === 'undefined') return;

  // Read URL query params (e.g. ?category=Notebooks or ?badge=Sale)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  const initialBadge = urlParams.get('badge');

  // Populate Category Checkboxes with dynamic item counts
  const categories = getCategories();
  if (categoryFiltersContainer) {
    categoryFiltersContainer.innerHTML = categories.map(cat => {
      const count = PRODUCTS.filter(p => p.category === cat).length;
      const isChecked = initialCategory && initialCategory.toLowerCase() === cat.toLowerCase();
      return `
        <label class="filter-item">
          <input type="checkbox" name="category" value="${cat}" ${isChecked ? 'checked' : ''}>
          <span>${cat}</span>
          <span class="count">${count}</span>
        </label>
      `;
    }).join('');
  }

  // Filter & Sort State
  function renderFilteredProducts() {
    // 1. Get selected categories
    const selectedCategories = Array.from(
      document.querySelectorAll('input[name="category"]:checked')
    ).map(cb => cb.value);

    // 2. Get badge filters if any
    const selectedBadges = Array.from(
      document.querySelectorAll('input[name="badge"]:checked')
    ).map(cb => cb.value);

    // 3. Price max
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 100;
    if (priceValue) {
      priceValue.textContent = `$${maxPrice.toFixed(0)}`;
    }

    // 4. Search query
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // 5. Filter list
    let filtered = PRODUCTS.filter(p => {
      // Category match
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }
      // Badge match
      if (selectedBadges.length > 0 && (!p.badge || !selectedBadges.includes(p.badge))) {
        return false;
      }
      // Price match
      if (p.price > maxPrice) {
        return false;
      }
      // Search match
      if (query && !p.name.toLowerCase().includes(query) && !p.description.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

    // 6. Sort
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update Result Count
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} products`;
    }

    // Render Active Filters Tag Chips
    if (activeFiltersContainer) {
      let tagsHtml = '';
      selectedCategories.forEach(cat => {
        tagsHtml += `<span class="filter-tag">${cat} <button onclick="removeFilter('category', '${cat}')">×</button></span>`;
      });
      selectedBadges.forEach(badge => {
        tagsHtml += `<span class="filter-tag">${badge} <button onclick="removeFilter('badge', '${badge}')">×</button></span>`;
      });
      if (query) {
        tagsHtml += `<span class="filter-tag">"${query}" <button onclick="clearSearchFilter()">×</button></span>`;
      }
      activeFiltersContainer.innerHTML = tagsHtml;
    }

    // Render Grid
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="icon">🔍</div>
          <h3>No products found!</h3>
          <p>We couldn't find any items matching your selected filters. Try broadening your criteria or reset filters.</p>
          <button class="btn btn-teal btn-sm" onclick="resetAllShopFilters()">Reset All Filters</button>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(createProductCardHTML).join('');
    }
  }

  // Global helper for tag chip removal
  window.removeFilter = function(name, value) {
    const cb = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (cb) {
      cb.checked = false;
      renderFilteredProducts();
    }
  };

  window.clearSearchFilter = function() {
    if (searchInput) {
      searchInput.value = '';
      renderFilteredProducts();
    }
  };

  window.resetAllShopFilters = function() {
    document.querySelectorAll('input[name="category"], input[name="badge"]').forEach(cb => cb.checked = false);
    if (priceRange) priceRange.value = 40;
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    renderFilteredProducts();
  };

  // Event Listeners
  if (categoryFiltersContainer) {
    categoryFiltersContainer.addEventListener('change', renderFilteredProducts);
  }

  const badgeFiltersContainer = document.getElementById('badge-filters');
  if (badgeFiltersContainer) {
    badgeFiltersContainer.addEventListener('change', renderFilteredProducts);
  }

  if (priceRange) {
    priceRange.addEventListener('input', renderFilteredProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', renderFilteredProducts);
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderFilteredProducts);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllShopFilters);
  }

  // Check initial badge if set in URL
  if (initialBadge && badgeFiltersContainer) {
    const targetBadgeCb = badgeFiltersContainer.querySelector(`input[value="${initialBadge}"]`);
    if (targetBadgeCb) targetBadgeCb.checked = true;
  }

  // Initial render
  renderFilteredProducts();
}

// ==========================================
// 3. PRODUCT DETAIL PAGE
// ==========================================
function initProductDetailPage() {
  const container = document.getElementById('product-detail-view');
  if (!container || typeof PRODUCTS === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'fic-1';
  const product = getProductById(productId) || PRODUCTS[0];

  // Set document title
  document.title = `${product.name} | Inkwell & Co.`;

  // Breadcrumbs
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbCat) breadcrumbCat.textContent = product.category;
  if (breadcrumbCat) breadcrumbCat.setAttribute('href', `shop.html?category=${encodeURIComponent(product.category)}`);
  if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

  // Main Image & Badges
  const mainImg = document.getElementById('detail-main-img');
  const badgeWrap = document.getElementById('detail-badge');
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }
  if (badgeWrap && product.badge) {
    badgeWrap.innerHTML = `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>`;
  }

  // Title, Category, Rating
  const titleEl = document.getElementById('detail-title');
  const catEl = document.getElementById('detail-category');
  const ratingWrap = document.getElementById('detail-rating');
  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.category;
  if (ratingWrap) {
    ratingWrap.innerHTML = `
      ${renderStars(product.rating)}
      <span class="text-muted">(${product.reviewCount} customer reviews)</span>
    `;
  }

  // Price & Discount
  const currentPriceEl = document.getElementById('detail-current-price');
  const originalPriceEl = document.getElementById('detail-original-price');
  const discountTagEl = document.getElementById('detail-discount-tag');

  if (currentPriceEl) currentPriceEl.textContent = `$${product.price.toFixed(2)}`;
  if (product.originalPrice) {
    if (originalPriceEl) originalPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    if (discountTagEl) {
      discountTagEl.textContent = `Save ${discountPercent}%`;
      discountTagEl.style.display = 'inline-block';
    }
  } else {
    if (originalPriceEl) originalPriceEl.style.display = 'none';
    if (discountTagEl) discountTagEl.style.display = 'none';
  }

  // Description
  const descEl = document.getElementById('detail-description');
  if (descEl) descEl.textContent = product.description;

  // Quantity controls
  const qtyInput = document.getElementById('detail-qty-input');
  const qtyMinus = document.getElementById('detail-qty-minus');
  const qtyPlus = document.getElementById('detail-qty-plus');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value) || 1;
      if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
      }
    });

    qtyPlus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value) || 1;
      qtyInput.value = currentVal + 1;
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) qtyInput.value = 1;
    });
  }

  // Add to Cart Button
  const addToCartBtn = document.getElementById('detail-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      addToCart(product.id, qty);
    });
  }

  // Wishlist Button
  const wishlistBtn = document.getElementById('detail-wishlist-btn');
  if (wishlistBtn) {
    const list = getWishlist();
    if (list.includes(product.id)) {
      wishlistBtn.classList.add('active');
      wishlistBtn.textContent = '♥ In Wishlist';
    }
    wishlistBtn.addEventListener('click', () => {
      toggleWishlist(product.id, wishlistBtn);
      const isNowIn = getWishlist().includes(product.id);
      wishlistBtn.textContent = isNowIn ? '♥ In Wishlist' : '♡ Add to Wishlist';
    });
  }

  // Specifications Details Table
  const detailsTableBody = document.getElementById('product-specs-table');
  if (detailsTableBody && product.details) {
    detailsTableBody.innerHTML = Object.entries(product.details).map(([key, value]) => `
      <tr>
        <th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>
        <td>${value}</td>
      </tr>
    `).join('');
  }

  // Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Review submission
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('review-author-name').value;
      const text = document.getElementById('review-text').value;
      const rating = document.getElementById('review-rating-select').value;

      const reviewsList = document.getElementById('reviews-list');
      if (reviewsList) {
        const newReview = document.createElement('div');
        newReview.className = 'review-item';
        newReview.innerHTML = `
          <div class="review-header">
            <span class="review-author">${author}</span>
            <span class="review-date">Just now</span>
          </div>
          <div class="stars" style="color:#FFB703; margin-bottom: 0.5rem;">${'★'.repeat(rating)}</div>
          <p>${text}</p>
        `;
        reviewsList.prepend(newReview);
      }

      showToast("Thank you for sharing your warm review! ⭐", 'success');
      reviewForm.reset();
    });
  }

  // Related Products
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    const related = getRelatedProducts(product.id, 4);
    relatedGrid.innerHTML = related.map(createProductCardHTML).join('');
  }
}

// ==========================================
// 4. SHOPPING CART PAGE
// ==========================================
function initCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('cart-empty-view');
  const filledView = document.getElementById('cart-filled-view');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount-amount');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  const shippingProgressText = document.getElementById('shipping-progress-text');
  const shippingProgressBar = document.getElementById('shipping-progress-bar');
  const promoInput = document.getElementById('cart-promo-input');
  const promoBtn = document.getElementById('cart-promo-btn');
  const promoMsg = document.getElementById('cart-promo-msg');

  if (!container) return;

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      if (emptyView) emptyView.style.display = 'block';
      if (filledView) filledView.style.display = 'none';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (filledView) filledView.style.display = 'grid';

    // Render Items
    container.innerHTML = cart.map(item => {
      const prod = getProductById(item.id);
      if (!prod) return '';
      const lineSubtotal = (prod.price * item.quantity).toFixed(2);

      return `
        <div class="cart-item" data-id="${item.id}">
          <a href="product.html?id=${prod.id}">
            <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
          </a>
          <div class="cart-item-info">
            <span class="item-cat">${prod.category}</span>
            <h4><a href="product.html?id=${prod.id}">${prod.name}</a></h4>
            <div class="item-unit-price">$${prod.price.toFixed(2)} each</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <input type="text" class="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
          <div class="cart-item-subtotal">$${lineSubtotal}</div>
          <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Remove item" aria-label="Remove item">
            🗑️
          </button>
        </div>
      `;
    }).join('');

    // Totals calculations
    const subtotal = getCartSubtotal();
    const appliedPromo = getAppliedPromo();
    let discount = 0;

    if (appliedPromo === VALID_PROMO_CODE) {
      discount = subtotal * PROMO_DISCOUNT_PERCENT;
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    // Shipping calculation
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    }

    // Free Shipping Progress
    if (shippingProgressBar && shippingProgressText) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressText.innerHTML = `🎉 Congratulations! You unlocked <strong>FREE Shipping!</strong>`;
        shippingProgressBar.style.width = '100%';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingProgressText.innerHTML = `Add <strong>$${remaining}</strong> more to unlock <strong>FREE Shipping!</strong>`;
        shippingProgressBar.style.width = `${percent}%`;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // Promo code event
  if (promoBtn && promoInput) {
    // Show current promo status
    if (getAppliedPromo() === VALID_PROMO_CODE) {
      promoInput.value = VALID_PROMO_CODE;
      if (promoMsg) {
        promoMsg.textContent = 'HAPPYPAGES applied (10% off)!';
        promoMsg.className = 'promo-message success';
      }
    }

    promoBtn.addEventListener('click', () => {
      const res = applyPromo(promoInput.value);
      if (promoMsg) {
        promoMsg.textContent = res.message;
        promoMsg.className = `promo-message ${res.success ? 'success' : 'error'}`;
      }
      if (res.success) {
        showToast(res.message, 'success');
      }
      renderCart();
    });
  }

  // Listen to cart update event
  window.addEventListener('cartUpdated', renderCart);

  // Initial render
  renderCart();
}

// ==========================================
// 5. MULTI-STEP CHECKOUT PAGE
// ==========================================
function initCheckoutPage() {
  const wizard = document.getElementById('checkout-wizard');
  if (!wizard) return;

  const step1 = document.getElementById('checkout-step-1');
  const step2 = document.getElementById('checkout-step-2');
  const step3 = document.getElementById('checkout-step-3');

  const stepInd1 = document.getElementById('step-ind-1');
  const stepInd2 = document.getElementById('step-ind-2');
  const stepInd3 = document.getElementById('step-ind-3');
  const stepLine1 = document.getElementById('step-line-1');
  const stepLine2 = document.getElementById('step-line-2');

  const toPaymentBtn = document.getElementById('btn-to-payment');
  const backToShippingBtn = document.getElementById('btn-back-shipping');
  const placeOrderBtn = document.getElementById('btn-place-order');

  const shippingForm = document.getElementById('shipping-form');
  const paymentForm = document.getElementById('payment-form');

  // Summary widgets
  const summaryItemsList = document.getElementById('checkout-summary-items');
  const checkoutSubtotal = document.getElementById('checkout-subtotal');
  const checkoutDiscount = document.getElementById('checkout-discount');
  const checkoutShipping = document.getElementById('checkout-shipping');
  const checkoutTotal = document.getElementById('checkout-total');

  function renderCheckoutSummary() {
    const cart = getCart();
    if (summaryItemsList) {
      summaryItemsList.innerHTML = cart.map(item => {
        const prod = getProductById(item.id);
        if (!prod) return '';
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem; font-size: 0.9rem;">
            <div style="display:flex; align-items:center; gap: 0.6rem;">
              <img src="${prod.image}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
              <span><strong>${prod.name}</strong> × ${item.quantity}</span>
            </div>
            <span>$${(prod.price * item.quantity).toFixed(2)}</span>
          </div>
        `;
      }).join('');
    }

    const subtotal = getCartSubtotal();
    const discount = getAppliedPromo() === VALID_PROMO_CODE ? subtotal * PROMO_DISCOUNT_PERCENT : 0;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);

    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutDiscount) {
      checkoutDiscount.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
    }
    if (checkoutShipping) {
      checkoutShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    }
    if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Navigate Steps
  function goToStep(stepNum) {
    if (stepNum === 1) {
      step1.style.display = 'block';
      step2.style.display = 'none';
      step3.style.display = 'none';

      stepInd1.className = 'step-indicator active';
      stepInd2.className = 'step-indicator';
      stepInd3.className = 'step-indicator';
      stepLine1.classList.remove('active');
      stepLine2.classList.remove('active');
    } else if (stepNum === 2) {
      step1.style.display = 'none';
      step2.style.display = 'block';
      step3.style.display = 'none';

      stepInd1.className = 'step-indicator completed';
      stepInd2.className = 'step-indicator active';
      stepInd3.className = 'step-indicator';
      stepLine1.classList.add('active');
      stepLine2.classList.remove('active');
    } else if (stepNum === 3) {
      step1.style.display = 'none';
      step2.style.display = 'none';
      step3.style.display = 'block';

      stepInd1.className = 'step-indicator completed';
      stepInd2.className = 'step-indicator completed';
      stepInd3.className = 'step-indicator active';
      stepLine1.classList.add('active');
      stepLine2.classList.add('active');

      // Hide summary sidebar on confirmation
      const summaryCol = document.getElementById('checkout-sidebar-col');
      if (summaryCol) summaryCol.style.display = 'none';

      // Generate Order Number
      const orderNumEl = document.getElementById('confirmation-order-id');
      const orderNum = `INK-${Math.floor(100000 + Math.random() * 900000)}`;
      if (orderNumEl) orderNumEl.textContent = orderNum;

      // Clear the cart
      clearCart();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Step 1 Validation & Proceed
  if (toPaymentBtn && shippingForm) {
    toPaymentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (shippingForm.checkValidity()) {
        goToStep(2);
      } else {
        shippingForm.reportValidity();
      }
    });
  }

  // Step 2 Back
  if (backToShippingBtn) {
    backToShippingBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }

  // Step 2 Submit & Confirm
  if (placeOrderBtn && paymentForm) {
    placeOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (paymentForm.checkValidity()) {
        goToStep(3);
        showToast("Order placed successfully! Thank you for supporting our cozy shop. 🎉", 'success');
      } else {
        paymentForm.reportValidity();
      }
    });
  }

  // Shipping Method Selection radio changes
  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.shipping-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.shipping-option').classList.add('selected');
    });
  });

  renderCheckoutSummary();
}

// ==========================================
// 6. LOGIN / REGISTER PAGE
// ==========================================
function initLoginPage() {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const forgotBtn = document.getElementById('forgot-password-link');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      if (target === 'login') {
        if (loginForm) loginForm.classList.add('active');
        if (registerForm) registerForm.classList.remove('active');
      } else {
        if (loginForm) loginForm.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      showToast(`Welcome back, ${email.split('@')[0]}! 📖 Happy reading!`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      showToast(`Welcome to the Inkwell family, ${name}! ✨`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  if (forgotBtn) {
    forgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt("Enter your email address to receive a cozy password reset link:");
      if (email) {
        showToast(`Reset instructions dispatched to ${email}! ✉️`, 'info');
      }
    });
  }
}

// ==========================================
// 7. CONTACT PAGE
// ==========================================
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`Thank you, ${name}! Your thoughtful note has been delivered to our library desk. 💌`, 'success');
      form.reset();
    });
  }

  // FAQ Accordion toggles
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        faqItems.forEach(i => {
          i.classList.remove('open');
          const ans = i.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });
}
