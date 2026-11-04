/**
 * ==============================================================================
 * KraftAmore • Modern Atelier Application Logic
 * ==============================================================================
 */

// Application State
let currentCategory = "all";
let searchQuery = "";
let selectedProduct = null;
let inquiryBag = [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadInquiryBag();
  renderCategoryPills();
  renderCatalog();
  setupEventListeners();
  updateContactLinks();
  setupSettingsModal();
});

// Retrieve active configuration (stored in localStorage or from data/config.js)
function getActiveConfig() {
  try {
    const saved = localStorage.getItem("kraftamore_store_config");
    if (saved) {
      return { ...STORE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not load config from localStorage", e);
  }
  return STORE_CONFIG;
}

function saveStoreConfig(newConfig) {
  try {
    localStorage.setItem("kraftamore_store_config", JSON.stringify(newConfig));
    updateContactLinks();
    renderCatalog();
    showToast("Store settings updated successfully! ✨");
  } catch (e) {
    console.error("Failed to save config", e);
  }
}

// Update all phone/email anchors across the site
function updateContactLinks() {
  const config = getActiveConfig();
  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");

  // WhatsApp links
  const waElements = document.querySelectorAll(".wa-link");
  waElements.forEach(el => {
    el.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello KraftAmore! 🌸 I would like to inquire about your modern handcrafted creations.")}`;
    if (el.dataset.showText) {
      el.textContent = config.whatsappDisplay || config.whatsappNumber;
    }
  });

  // Email links
  const mailElements = document.querySelectorAll(".mail-link");
  mailElements.forEach(el => {
    el.href = `mailto:${config.email}?subject=${encodeURIComponent("Inquiry for KraftAmore")}`;
    if (el.dataset.showText) {
      el.textContent = config.email;
    }
  });

  // Instagram links
  const igElements = document.querySelectorAll(".ig-link");
  igElements.forEach(el => {
    el.href = config.instagramUrl;
    if (el.dataset.showHandle) {
      el.textContent = `@${config.instagramHandle}`;
    }
  });
}

// Render Category Filter Pills
function renderCategoryPills() {
  const container = document.getElementById("filter-pills");
  if (!container || typeof CATEGORIES === "undefined") return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="modern-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join("");

  container.querySelectorAll(".modern-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".modern-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderCatalog();
    });
  });
}

// Render Products Catalog
let currentSort = "featured";

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const countEl = document.getElementById("catalog-count");
  if (!grid || typeof PRODUCTS_DATA === "undefined") return;

  let filtered = PRODUCTS_DATA.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.categoryName.toLowerCase().includes(query) ||
      item.materials.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Apply sorting
  if (currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  } else if (currentSort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${PRODUCTS_DATA.length} handcrafted pieces`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5" style="grid-column: 1 / -1;">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🔍</span>
        <h3 class="fw-bold text-dark mb-2">No Handcrafted Pieces Found</h3>
        <p class="text-muted mx-auto mb-4" style="max-width: 420px;">We couldn't find any piece matching your search. Try checking another category or reset your search query.</p>
        <button class="btn btn-outline-dark rounded-pill px-4" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const isBootstrapGrid = grid.classList.contains("row");
  grid.innerHTML = filtered.map(item => isBootstrapGrid ? createBootstrapCard(item) : createProductCard(item)).join("");
}

/**
 * Clean, Standard Bootstrap 5 Product Card
 * Uses Bootstrap 5 grid (col-12 col-md-6 col-lg-4), cards, badges, and buttons.
 * Easily readable and updatable by any developer.
 */
function createBootstrapCard(item) {
  const config = getActiveConfig();
  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");
  
  const waMessage = `Hello KraftAmore! 🌸\n\nI would love to inquire about ordering this handcrafted piece:\n✨ *${item.name}* (₹${item.price})\nCategory: ${item.categoryName}\nDimensions: ${item.dimensions}\n\nPlease let me know about customization options and delivery timeline. Thank you!`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const inBag = inquiryBag.some(i => i.id === item.id);
  const discountPercent = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

  return `
    <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch" data-product-id="${item.id}">
      <article class="card product-bootstrap-card w-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative d-flex flex-column">
        
        <!-- Product Photo with Floating Badges & Wishlist -->
        <div class="card-img-wrap position-relative overflow-hidden" style="aspect-ratio: 1; cursor: pointer; background: #FAF6F0;" onclick="openQuickView('${item.id}')">
          <img src="${item.image}" alt="${item.name}" class="card-img-top w-100 h-100 object-fit-cover card-zoom-img" loading="lazy">
          
          ${item.badge ? `
            <span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill text-white fw-bold shadow-sm" style="background-color: var(--coral-primary, #8D4642); font-size: 0.78rem;">
              ${item.badge}
            </span>
          ` : ""}
          
          <span class="badge position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill bg-white text-dark fw-bold border shadow-sm" style="font-size: 0.75rem;">
            ${item.category === 'bags' ? '👜' : '🪔'} ${item.categoryName}
          </span>
          
          <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-0 shadow-sm d-flex align-items-center justify-content-center" 
                  style="width: 38px; height: 38px; border: 1px solid var(--border-soft); z-index: 5;"
                  onclick="event.stopPropagation(); toggleInquiryBag('${item.id}')" 
                  title="${inBag ? 'Remove from Bag' : 'Save to Inquiry Bag'}">
            <span style="font-size: 1.15rem; color: ${inBag ? 'var(--coral-primary, #8D4642)' : '#261610'};">${inBag ? '♥' : '♡'}</span>
          </button>
        </div>

        <!-- Card Content Body -->
        <div class="card-body d-flex flex-column p-4">
          
          <!-- Product Title -->
          <h3 class="card-title h5 fw-bold text-dark mb-2" role="button" onclick="openQuickView('${item.id}')" style="line-height: 1.35; font-size: 1.15rem;">
            ${item.name}
          </h3>
          
          <!-- Short Description (2 Lines Clamped) -->
          <p class="card-text text-muted small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.55;">
            ${item.description}
          </p>

          <!-- Specifications Pill -->
          <div class="p-2 px-3 mb-3 rounded-3 bg-light border small text-muted d-flex align-items-center gap-2" style="font-size: 0.82rem;">
            <span style="color: var(--ochre-primary, #B88242);">📐</span>
            <span class="text-truncate fw-medium">${item.dimensions}</span>
          </div>

          <!-- Price & Discount -->
          <div class="d-flex align-items-baseline gap-2 mb-3">
            <span class="fs-4 fw-bolder text-dark">₹${item.price}</span>
            ${item.originalPrice ? `<span class="text-decoration-line-through text-muted small">₹${item.originalPrice}</span>` : ""}
            ${discountPercent > 0 ? `
              <span class="badge rounded-pill fw-bold ms-auto" style="background-color: #EBF7F0; color: #2D4A33; font-size: 0.75rem;">
                ${discountPercent}% OFF
              </span>
            ` : ""}
          </div>

          <!-- Actions Footer (Order WhatsApp & Quick Details) -->
          <div class="d-flex gap-2 pt-3 border-top mt-auto align-items-center">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp flex-grow-1 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2" title="Order directly on WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Order via WhatsApp</span>
            </a>
            <button class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0" 
                    style="width: 40px; height: 40px;" 
                    onclick="openQuickView('${item.id}')" 
                    title="Quick Details">
              <span>👁️</span>
            </button>
          </div>

        </div>
      </article>
    </div>
  `;
}

function createProductCard(item) {
  const config = getActiveConfig();
  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");
  
  const waMessage = `Hello KraftAmore! 🌸,\n\nI would love to inquire about ordering this piece:\n✨ *${item.name}* (₹${item.price})\nCategory: ${item.categoryName}\nDimensions: ${item.dimensions}\n\nPlease let me know about customization options and delivery timeline. Thank you!`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const inBag = inquiryBag.some(i => i.id === item.id);

  return `
    <article class="product-boutique-card" data-id="${item.id}">
      <div class="card-image-wrap" onclick="openQuickView('${item.id}')">
        <img src="${item.image}" alt="${item.name}" loading="lazy" class="card-product-img">
        ${item.badge ? `<span class="card-badge-status">${item.badge}</span>` : ""}
        <span class="card-category-label">${item.categoryName}</span>
      </div>
      <div class="card-content-wrap">
        <h3 class="card-title-text" onclick="openQuickView('${item.id}')">${item.name}</h3>
        <p class="card-desc-text">${item.description}</p>
        <div class="card-specs-chip">
          <span>📏</span>
          <span>${item.dimensions}</span>
        </div>
        <div class="card-bottom-row">
          <div class="card-price-box">
            <div>
              <span class="price-current">₹${item.price}</span>
              ${item.originalPrice ? `<span class="price-old">₹${item.originalPrice}</span>` : ""}
            </div>
            <span class="price-shipping">✓ Pan-India Delivery</span>
          </div>
          <div class="card-actions-group">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-order-wa" title="Order via WhatsApp">
              <span>Order</span> ↗
            </a>
            <button type="button" class="btn-card-bag-toggle ${inBag ? 'active' : ''}" onclick="event.stopPropagation(); toggleInquiryBag('${item.id}')" title="${inBag ? 'Remove from Bag' : 'Save to Inquiry Bag'}">
              <span>${inBag ? '✓' : '👜'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function loadInquiryBag() {
  try {
    const saved = localStorage.getItem("kraftamore_modern_bag");
    if (saved) inquiryBag = JSON.parse(saved);
  } catch (e) {}
  updateBagUI();
}

function saveInquiryBag() {
  try {
    localStorage.setItem("kraftamore_modern_bag", JSON.stringify(inquiryBag));
  } catch (e) {}
  updateBagUI();
}

function toggleInquiryBag(productId) {
  const item = PRODUCTS_DATA.find(p => p.id === productId);
  if (!item) return;

  const idx = inquiryBag.findIndex(i => i.id === productId);
  if (idx > -1) {
    inquiryBag.splice(idx, 1);
    showToast(`Removed from inquiry bag`);
  } else {
    inquiryBag.push(item);
    showToast(`Added "${item.name}" to inquiry bag! 🌸`);
  }
  saveInquiryBag();
  renderCatalog();
}

function removeFromBag(productId) {
  inquiryBag = inquiryBag.filter(i => i.id !== productId);
  saveInquiryBag();
  renderCatalog();
}

function updateBagUI() {
  const badge = document.getElementById("bag-count-badge");
  if (badge) badge.textContent = inquiryBag.length;

  const bagList = document.getElementById("bag-items-list");
  const bagTotal = document.getElementById("bag-total-amount");
  const bagFooter = document.getElementById("bag-drawer-footer");

  if (!bagList) return;

  if (inquiryBag.length === 0) {
    bagList.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.75rem; margin-bottom: 0.75rem;">👜</div>
        <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.35rem;">Your inquiry bag is empty</h4>
        <p style="font-size: 0.92rem;">Explore the catalog and select pieces to inquire about multiple items together!</p>
      </div>
    `;
    if (bagTotal) bagTotal.textContent = "₹0";
    if (bagFooter) bagFooter.style.display = "none";
    return;
  }

  if (bagFooter) bagFooter.style.display = "block";

  let sum = 0;
  bagList.innerHTML = inquiryBag.map(item => {
    sum += Number(item.rawPrice || 0);
    return `
      <div class="bag-item-card">
        <img src="${item.image}" alt="${item.name}" class="bag-item-img">
        <div class="bag-item-details">
          <h4 class="bag-item-title">${item.name}</h4>
          <span class="bag-item-price">${item.price}</span>
        </div>
        <button class="bag-item-remove" onclick="removeFromBag('${item.id}')" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  if (bagTotal) bagTotal.textContent = `₹${sum.toLocaleString('en-IN')}`;

  // WhatsApp Multi-Item Link
  const config = getActiveConfig();
  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");
  const waSubmitBtn = document.getElementById("bag-wa-submit");
  if (waSubmitBtn) {
    const lines = inquiryBag.map((item, i) => `${i + 1}. *${item.name}* (${item.price}) - ${item.categoryName}`).join("\n");
    const msg = `Hello KraftAmore! 🌸\n\nI would love to inquire about these items in my inquiry bag:\n\n${lines}\n\n*Estimated Total:* ₹${sum.toLocaleString('en-IN')}\n\nPlease share details on customization options and delivery times. Thank you!`;
    waSubmitBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }

  // Email Multi-Item Link
  const mailSubmitBtn = document.getElementById("bag-mail-submit");
  if (mailSubmitBtn) {
    const lines = inquiryBag.map((item, i) => `${i + 1}. ${item.name} (${item.price}) - ${item.categoryName}`).join("\n");
    const body = `Hello KraftAmore,\n\nI am interested in placing an inquiry for the following pieces:\n\n${lines}\n\nEstimated Total: ₹${sum.toLocaleString('en-IN')}\n\nPlease let me know about timelines and customization details.\n\nThank you!`;
    mailSubmitBtn.href = `mailto:${config.email}?subject=${encodeURIComponent("Multi-Item Inquiry - KraftAmore")}&body=${encodeURIComponent(body)}`;
  }
}

function openBagDrawer() {
  const backdrop = document.getElementById("bag-drawer-backdrop");
  const drawer = document.getElementById("bag-drawer");
  if (backdrop) backdrop.classList.add("active");
  if (drawer) drawer.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBagDrawer() {
  const backdrop = document.getElementById("bag-drawer-backdrop");
  const drawer = document.getElementById("bag-drawer");
  if (backdrop) backdrop.classList.remove("active");
  if (drawer) drawer.classList.remove("active");
  document.body.style.overflow = "";
}

// Standalone Category Filtering (works via inline onclick and event listeners)
function filterByCategory(category) {
  currentCategory = category || "all";
  
  // Update pill buttons active state
  const pills = document.querySelectorAll(".two-cat-pill, .category-filter-pills .category-pill-btn, .category-filter-pills .nav-link, .modern-pill");
  pills.forEach(p => {
    if (p.getAttribute("data-category") === currentCategory) {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });

  // Keep URL query in sync cleanly without reload
  try {
    const url = new URL(window.location);
    if (currentCategory === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", currentCategory);
    }
    window.history.replaceState({}, "", url);
  } catch (e) {}

  renderCatalog();
}

// Standalone Search Handler
function handleSearchInput(query) {
  searchQuery = query || "";
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) {
    if (searchQuery.trim().length > 0) {
      clearBtn.classList.remove("d-none");
    } else {
      clearBtn.classList.add("d-none");
    }
  }
  renderCatalog();
}

// Standalone Clear Search
function clearSearch() {
  const searchInput = document.getElementById("catalog-search");
  if (searchInput) searchInput.value = "";
  searchQuery = "";
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) clearBtn.classList.add("d-none");
  renderCatalog();
}

// Standalone Sort Handler
function handleSortChange(sortVal) {
  currentSort = sortVal || "featured";
  renderCatalog();
}

// Quick View Modal
function openQuickView(productId) {
  const item = PRODUCTS_DATA.find(p => p.id === productId);
  if (!item) return;

  const modal = document.getElementById("quick-view-modal");
  const content = document.getElementById("quick-view-content");
  if (!modal || !content) return;

  const config = getActiveConfig();
  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");

  const waMessage = `Hello KraftAmore! 🌸,\n\nI would love to inquire about:\n✨ *${item.name}* (₹${item.price})\nCategory: ${item.categoryName}\nDimensions: ${item.dimensions}\n\nPlease let me know about customization options and delivery timeline. Thank you!`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const mailSubject = `Inquiry: ${item.name}`;
  const mailBody = `Hello KraftAmore,\n\nI would like more information on:\nProduct: ${item.name}\nPrice: ₹${item.price}\nCategory: ${item.categoryName}\n\nCould you please share details on how to personalize this?\n\nThank you!`;
  const mailUrl = `mailto:${config.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const inBag = inquiryBag.some(i => i.id === item.id);
  const turnaround = item.turnaround || '2-4 business days dispatch (Pan-India)';
  
  const highlights = (Array.isArray(item.features) && item.features.length > 0)
    ? item.features
    : [
        item.category === 'bags' ? '100% Unbleached Heavy Cotton Canvas' : 'Auspicious Indian Entrance Decor',
        item.category === 'bags' ? 'Permanent, Colorfast & Washable Paints' : 'Traditional Real Mirrors & Brass Bells',
        item.customization || 'Custom name or motif personalization available',
        'Proudly Handcrafted in Gujarat, India (#VocalForLocal)'
      ];

  const discountPercent = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

  content.innerHTML = `
    <div class="modal-grid">
      <div class="modal-gallery">
        <div class="main-preview-wrap position-relative">
          <img src="${item.image}" alt="${item.name}" class="w-100 rounded-4 shadow-sm" style="aspect-ratio: 1; object-fit: cover;">
          ${item.badge ? `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill text-white fw-bold shadow-sm" style="background-color: var(--coral-primary, #8D4642); font-size: 0.8rem;">${item.badge}</span>` : ''}
        </div>
      </div>
      <div class="modal-info">
        <span class="modal-category mb-2">${item.categoryName}</span>
        <h2 class="modal-title h3 fw-bold text-dark mb-2">${item.name}</h2>
        
        <div class="modal-price-wrap d-flex align-items-baseline gap-2 mb-3">
          <span class="modal-price fs-3 fw-bolder" style="color: var(--coral-primary);">₹${item.price}</span>
          ${item.originalPrice ? `<span class="text-decoration-line-through text-muted small">₹${item.originalPrice}</span>` : ''}
          ${discountPercent > 0 ? `<span class="badge rounded-pill fw-bold" style="background-color: #EBF7F0; color: #2D4A33; font-size: 0.75rem;">${discountPercent}% OFF</span>` : ''}
          <span class="modal-shipping-badge ms-auto">✨ Pan-India Delivery</span>
        </div>
        
        <p class="modal-desc text-muted mb-3" style="font-size: 0.95rem; line-height: 1.6;">${item.description}</p>
        
        <div class="modal-details-list p-3 rounded-3 bg-light border mb-3" style="font-size: 0.88rem;">
          <div class="detail-item mb-1">
            <strong>Dimensions:</strong> <span class="text-muted">${item.dimensions}</span>
          </div>
          <div class="detail-item mb-1">
            <strong>Materials:</strong> <span class="text-muted">${item.materials}</span>
          </div>
          <div class="detail-item mb-1">
            <strong>Turnaround:</strong> <span class="text-muted">${turnaround}</span>
          </div>
          ${item.customization ? `
            <div class="detail-item mt-2 pt-2 border-top">
              <strong style="color: var(--ochre-primary, #B88242);">Customization:</strong> <span class="text-dark fw-medium">${item.customization}</span>
            </div>
          ` : ''}
        </div>

        <div class="modal-features mb-4">
          <h4 class="h6 fw-bold text-dark mb-2">Handmade Highlights:</h4>
          <ul class="list-unstyled mb-0 d-flex flex-column gap-1 small text-muted">
            ${highlights.map(f => `<li class="d-flex align-items-center gap-2"><span style="color: var(--coral-primary, #8D4642); font-weight: bold;">✓</span> ${f}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-cta-box pt-2 border-top">
          <div class="d-flex gap-2 flex-wrap mb-2">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp flex-grow-1 rounded-pill fw-bold py-2 px-3 d-flex align-items-center justify-content-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Order on WhatsApp</span>
            </a>
            <button class="btn btn-outline-secondary rounded-pill py-2 px-3 fw-bold" onclick="toggleInquiryBag('${item.id}'); closeQuickView();">
              <span>${inBag ? '✓ In Bag' : '+ Save to Bag'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "block";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    try {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.show();
    } catch (e) {
      modal.classList.add("show", "active");
    }
  } else {
    modal.classList.add("show", "active");
  }
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (!modal) return;
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    } catch (e) {}
  }
  modal.classList.remove("show", "active");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  document.body.style.overflow = "";
  document.body.classList.remove("modal-open");
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();
}

// Custom Commission Form Submission
function handleCustomFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const config = getActiveConfig();

  const itemType = form.itemType ? form.itemType.value : "Handpainted Canvas Bag";
  const occasion = form.occasion ? form.occasion.value : "Festive Decor";
  const names = form.customNames ? form.customNames.value.trim() : "";
  const notes = form.notes ? form.notes.value.trim() : "";

  const summary = "🌸 *New Custom Commission Inquiry - KraftAmore* 🌸\\n\\n" +
    "• *Craft / Item:* " + itemType + "\\n" +
    "• *Occasion:* " + occasion + "\\n" +
    "• *Personalization / Name:* " + (names || "None specified") + "\\n" +
    "• *Special Notes & Details:* " + (notes || "None") + "\\n\\n" +
    "I would love to inquire about custom creation timeline, pricing, and details. Thank you!";

  const cleanPhone = String(config.whatsappNumber).replace(/[^0-9]/g, "");
  const waUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(summary);
  window.open(waUrl, "_blank");
  showToast("Opening WhatsApp with your custom request! 🌸");
}

// Live WhatsApp Preview & Interactive Virtual Hoop Simulator
function setupLiveCustomOrderPreview() {
  const form = document.getElementById("custom-order-form");
  if (!form) return;

  const itemEl = document.getElementById("preview-item");
  const occEl = document.getElementById("preview-occasion");
  const namesEl = document.getElementById("preview-names");
  const colorEl = document.getElementById("preview-color");

  const vFabric = document.getElementById("virtual-fabric");
  const vText = document.getElementById("v-stitched-text");
  const vSub = document.getElementById("v-stitched-sub");
  const vSize = document.getElementById("v-hoop-size");
  const vPalette = document.getElementById("v-floss-palette");
  const specFabric = document.getElementById("spec-fabric-name");
  const specMotif = document.getElementById("spec-motif-name");

  // Rich Indian Festive Toran & Canvas Bag SVGs
  const toranMotifs = {
    "Marigold & Mirror Bandhanwar": `<svg viewBox="0 0 240 240" class="wreath-svg">
      <!-- Auspicious Festive Garland -->
      <path d="M 20 60 Q 120 120 220 60" stroke="#DFB756" stroke-width="3" fill="none"/>
      <!-- Hanging Mango Leaves & Marigolds -->
      <path d="M 40 65 Q 45 95 35 125" stroke="#2D6A4F" stroke-width="2.5" fill="none"/>
      <circle cx="40" cy="70" r="10" fill="#E07A5F"/>
      <circle cx="40" cy="70" r="4" fill="#F4F1DE"/>
      
      <path d="M 80 85 Q 85 115 75 140" stroke="#2D6A4F" stroke-width="2.5" fill="none"/>
      <circle cx="80" cy="90" r="12" fill="#E9C46A"/>
      <circle cx="80" cy="90" r="5" fill="#E76F51"/>

      <path d="M 120 95 Q 120 135 120 160" stroke="#2D6A4F" stroke-width="2.5" fill="none"/>
      <circle cx="120" cy="100" r="14" fill="#E76F51"/>
      <circle cx="120" cy="100" r="6" fill="#F4A261"/>
      <polygon points="120,130 125,140 115,140" fill="#DFB756"/>

      <path d="M 160 85 Q 155 115 165 140" stroke="#2D6A4F" stroke-width="2.5" fill="none"/>
      <circle cx="160" cy="90" r="12" fill="#E9C46A"/>
      <circle cx="160" cy="90" r="5" fill="#E76F51"/>

      <path d="M 200 65 Q 195 95 205 125" stroke="#2D6A4F" stroke-width="2.5" fill="none"/>
      <circle cx="200" cy="70" r="10" fill="#E07A5F"/>
      <circle cx="200" cy="70" r="4" fill="#F4F1DE"/>

      <!-- Mirror Studs -->
      <circle cx="60" cy="78" r="6" fill="#FFFFFF" stroke="#DFB756" stroke-width="1.5"/>
      <circle cx="100" cy="92" r="6" fill="#FFFFFF" stroke="#DFB756" stroke-width="1.5"/>
      <circle cx="140" cy="92" r="6" fill="#FFFFFF" stroke="#DFB756" stroke-width="1.5"/>
      <circle cx="180" cy="78" r="6" fill="#FFFFFF" stroke="#DFB756" stroke-width="1.5"/>
    </svg>`,

    "Royal Shubh-Labh Toran": `<svg viewBox="0 0 240 240" class="wreath-svg">
      <path d="M 15 50 L 225 50" stroke="#94243C" stroke-width="4"/>
      <!-- Shubh Round Plaque Left -->
      <circle cx="70" cy="90" r="32" fill="#FAF5EE" stroke="#DFB756" stroke-width="2.5"/>
      <circle cx="70" cy="90" r="28" fill="#94243C"/>
      <text x="70" y="96" font-size="14" fill="#F4EBD9" font-family="serif" text-anchor="middle" font-weight="bold">शुभ</text>
      
      <!-- Kalash in Center -->
      <ellipse cx="120" cy="70" rx="14" ry="10" fill="#DFB756"/>
      <path d="M 112 60 Q 120 45 128 60" fill="#2D6A4F"/>
      <circle cx="120" cy="50" r="4" fill="#94243C"/>

      <!-- Labh Round Plaque Right -->
      <circle cx="170" cy="90" r="32" fill="#FAF5EE" stroke="#DFB756" stroke-width="2.5"/>
      <circle cx="170" cy="90" r="28" fill="#94243C"/>
      <text x="170" y="96" font-size="14" fill="#F4EBD9" font-family="serif" text-anchor="middle" font-weight="bold">लाभ</text>

      <!-- Brass Bells -->
      <polygon points="70,135 76,148 64,148" fill="#DFB756"/>
      <polygon points="120,110 126,122 114,122" fill="#DFB756"/>
      <polygon points="170,135 176,148 164,148" fill="#DFB756"/>
    </svg>`,

    "Home Sweet Home Plaque": `<svg viewBox="0 0 240 240" class="wreath-svg">
      <circle cx="120" cy="120" r="95" fill="none" stroke="#DFB756" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Floral Border -->
      <circle cx="120" cy="30" r="8" fill="#E76F51"/>
      <circle cx="106" cy="35" r="5" fill="#E9C46A"/>
      <circle cx="134" cy="35" r="5" fill="#E9C46A"/>
      <path d="M 40 120 Q 55 100 50 140" stroke="#2D6A4F" stroke-width="2" fill="none"/>
      <circle cx="45" cy="120" r="7" fill="#E76F51"/>
      <path d="M 200 120 Q 185 100 190 140" stroke="#2D6A4F" stroke-width="2" fill="none"/>
      <circle cx="195" cy="120" r="7" fill="#E76F51"/>
      <!-- Brass Bells at Bottom -->
      <polygon points="120,205 126,218 114,218" fill="#DFB756"/>
      <polygon points="100,200 105,212 95,212" fill="#DFB756"/>
      <polygon points="140,200 145,212 135,212" fill="#DFB756"/>
    </svg>`,

    "Wildflower Canvas Bag": `<svg viewBox="0 0 240 240" class="wreath-svg">
      <!-- Tote Bag Outline -->
      <rect x="55" y="70" width="130" height="135" rx="8" fill="#FAF5EE" stroke="#C4A379" stroke-width="2"/>
      <path d="M 85 70 C 85 35, 155 35, 155 70" stroke="#C4A379" stroke-width="3" fill="none"/>
      <!-- Hand Painted Wildflowers -->
      <path d="M 120 180 Q 110 130 120 95" stroke="#2D6A4F" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="120" cy="95" r="8" fill="#E76F51"/>
      <circle cx="120" cy="95" r="3" fill="#F4A261"/>
      <ellipse cx="108" cy="130" rx="10" ry="5" transform="rotate(-30 108 130)" fill="#7CA982"/>
      <ellipse cx="132" cy="115" rx="10" ry="5" transform="rotate(25 132 115)" fill="#5E8C61"/>
      <circle cx="95" cy="140" r="6" fill="#E9C46A"/>
      <circle cx="145" cy="135" r="6" fill="#94243C"/>
    </svg>`
  };

  function updatePreview() {
    const rawText = form.customNames ? form.customNames.value.trim() : "";
    
    let primaryText = rawText || "The Sharma Family";
    let subText = "Home Sweet Home • Shubh Labh";
    if (rawText.includes("•")) {
      const parts = rawText.split("•");
      primaryText = parts[0].trim();
      subText = parts[1].trim();
    } else if (rawText.includes("-")) {
      const parts = rawText.split("-");
      primaryText = parts[0].trim();
      subText = parts[1].trim();
    }

    if (itemEl && form.itemType) itemEl.textContent = form.itemType.value;
    if (occEl && form.occasion) occEl.textContent = form.occasion.value;
    if (namesEl) namesEl.textContent = rawText || "(Family Name / Custom Text)";
    if (colorEl && form.colorTheme) colorEl.textContent = form.colorTheme.value;

    if (vText) vText.textContent = primaryText;
    if (vSub) vSub.textContent = subText;
    if (vSize && form.itemType) {
      if (form.itemType.value.includes("Tote") || form.itemType.value.includes("Bag")) {
        vSize.textContent = "Hand-Painted Canvas Tote";
      } else if (form.itemType.value.includes("Plaque")) {
        vSize.textContent = '10" Wooden Door Plaque';
      } else {
        vSize.textContent = "3.5 ft Entrance Toran";
      }
    }
  }

  // Fabric Finish Buttons
  const fabricButtons = form.querySelectorAll(".fabric-btn");
  fabricButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      fabricButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const color = btn.dataset.color;
      const name = btn.dataset.name;
      const isDark = btn.dataset.dark === "true";
      
      if (form.fabricColor) form.fabricColor.value = color;
      if (form.fabricName) form.fabricName.value = name;
      if (vFabric) {
        vFabric.style.backgroundColor = color;
        if (isDark) {
          vFabric.classList.add("fabric-dark");
        } else {
          vFabric.classList.remove("fabric-dark");
        }
      }
      if (specFabric) specFabric.textContent = name;
    });
  });

  // Motif Style Buttons
  const motifButtons = form.querySelectorAll(".motif-btn");
  const wreathWrap = document.getElementById("virtual-wreath");
  motifButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      motifButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const motif = btn.dataset.motif;
      if (form.motifStyle) form.motifStyle.value = motif;
      if (wreathWrap && toranMotifs[motif]) {
        wreathWrap.innerHTML = toranMotifs[motif];
      }
      if (specMotif) specMotif.textContent = motif;
    });
  });

  // Color Swatch Buttons
  const swatchButtons = form.querySelectorAll(".swatch-btn");
  const paletteFlossMap = {
    "Festive Haldi & Kumkum (Marigold Yellow & Crimson Red)": ["#E9C46A", "#94243C", "#2D6A4F", "#DFB756"],
    "Royal Peacock & Gold (Emerald, Teal & Brass)": ["#005F73", "#0A9396", "#EE9B00", "#CA6702"],
    "Auspicious Mango Green & Ochre (Traditional & Earthy)": ["#2D6A4F", "#7CA982", "#E07A5F", "#F4F1DE"],
    "Boho Mirror & Raw Linen (Chic & Minimalist)": ["#E8E2D8", "#DFB756", "#C4A379", "#1D2434"],
    "Maker's Signature Festive Harmony": ["#DFB756", "#94243C", "#E9C46A", "#2D6A4F"]
  };

  swatchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      swatchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (form.colorTheme) {
        form.colorTheme.value = btn.dataset.palette;
      }
      if (vPalette && paletteFlossMap[btn.dataset.palette]) {
        vPalette.innerHTML = paletteFlossMap[btn.dataset.palette]
          .map(c => '<span class="v-dot" style="background: ' + c + ';"></span>')
          .join("");
      }
      updatePreview();
    });
  });

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  updatePreview();
}

function setupStoryHighlights() {
  const bubbles = document.querySelectorAll(".story-bubble[data-category]");
  bubbles.forEach(b => {
    b.addEventListener("click", () => {
      bubbles.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      currentCategory = b.dataset.category;
      
      // Sync with filter pills
      const pills = document.querySelectorAll(".modern-pill");
      pills.forEach(p => {
        if (p.dataset.category === currentCategory) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });

      renderCatalog();

      // Smooth scroll to catalog
      const catEl = document.getElementById("catalog");
      if (catEl) {
        catEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// 3D Parallax Tilt for Wooden Embroidery Hoops
function setupInteractiveHoopTilt() {
  const heroHoop = document.getElementById("hero-hoop");
  const virtualHoop = document.getElementById("virtual-hoop");

  function attachTilt(element) {
    if (!element) return;
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      element.style.transform = "perspective(800px) rotateX(" + rotateX.toFixed(1) + "deg) rotateY(" + rotateY.toFixed(1) + "deg) scale(1.02)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  }

  attachTilt(heroHoop);
  attachTilt(virtualHoop);
}

// Setup Event Listeners
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById("catalog-search");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        if (searchQuery.trim().length > 0) {
          clearBtn.classList.remove("d-none");
        } else {
          clearBtn.classList.add("d-none");
        }
      }
      renderCatalog();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearBtn.classList.add("d-none");
      renderCatalog();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("catalog-sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // Quick view close
  const modalClose = document.getElementById("quick-view-close");
  const modalBackdrop = document.getElementById("quick-view-modal");
  if (modalClose) modalClose.addEventListener("click", closeQuickView);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeQuickView();
    });
  }

  // Inquiry Bag Drawer Triggers
  const openBagBtn = document.getElementById("open-bag-btn");
  const closeBagBtn = document.getElementById("close-bag-btn");
  const drawerBackdrop = document.getElementById("bag-drawer-backdrop");

  if (openBagBtn) openBagBtn.addEventListener("click", openBagDrawer);
  if (closeBagBtn) closeBagBtn.addEventListener("click", closeBagDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", (e) => {
      if (e.target === drawerBackdrop) closeBagDrawer();
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      mobileToggle.classList.toggle("open");
    });
  }

  // Custom Form & Live WhatsApp Preview
  const customForm = document.getElementById("custom-order-form");
  if (customForm) {
    customForm.addEventListener("submit", handleCustomFormSubmit);
    setupLiveCustomOrderPreview();
  }

  // Escape key handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeBagDrawer();
      closeSettingsModal();
    }
  });
}

function resetFilters() {
  currentCategory = "all";
  searchQuery = "";
  const searchInput = document.getElementById("catalog-search");
  if (searchInput) searchInput.value = "";
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) clearBtn.classList.add("d-none");
  const sortSelect = document.getElementById("catalog-sort");
  if (sortSelect) sortSelect.value = "featured";
  currentSort = "featured";
  filterByCategory("all");
}

// Owner Settings Modal
function setupSettingsModal() {
  const openBtn = document.getElementById("open-settings-btn");
  const modal = document.getElementById("settings-modal");
  const closeBtn = document.getElementById("close-settings-btn");
  const form = document.getElementById("settings-form");

  if (!modal || !form) return;

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const config = getActiveConfig();
      form.settingWhatsapp.value = config.whatsappNumber;
      form.settingEmail.value = config.email;
      form.settingInstagram.value = config.instagramHandle;
      modal.classList.add("active");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeSettingsModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeSettingsModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cleanIg = form.settingInstagram.value.trim().replace("@", "");
    const newConfig = {
      ...getActiveConfig(),
      whatsappNumber: form.settingWhatsapp.value.trim(),
      whatsappDisplay: form.settingWhatsapp.value.trim(),
      email: form.settingEmail.value.trim(),
      instagramHandle: cleanIg,
      instagramUrl: `https://www.instagram.com/${cleanIg}`
    };
    saveStoreConfig(newConfig);
    closeSettingsModal();
  });
}

function closeSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) modal.classList.remove("active");
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById("toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ==============================================================================
// 6. Interactive Featured Carousel (Home Page)
// ==============================================================================
function initFeaturedCarousel() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  if (!track || typeof PRODUCTS_DATA === "undefined") return;

  // Render featured slides using full boutique cards
  const featured = PRODUCTS_DATA.filter(p => p.isFeatured);
  track.innerHTML = featured.map(item => `
    <div class="carousel-slide-item">
      ${createProductCard(item)}
    </div>
  `).join("");

  let currentIndex = 0;
  const slides = track.querySelectorAll(".carousel-slide-item");
  const totalSlides = slides.length;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, totalSlides - getVisibleCount());
  }

  // Render dots
  function renderDots() {
    if (!dotsContainer) return;
    const count = maxIndex() + 1;
    dotsContainer.innerHTML = Array.from({ length: count }).map((_, i) => `
      <span class="carousel-dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></span>
    `).join("");

    dotsContainer.querySelectorAll(".carousel-dot").forEach(d => {
      d.addEventListener("click", () => {
        currentIndex = parseInt(d.dataset.index, 10);
        updateCarousel();
      });
    });
  }

  function updateCarousel() {
    const firstSlide = track.querySelector(".carousel-slide-item");
    if (!firstSlide) return;
    const slideWidth = firstSlide.offsetWidth;
    const gap = 28; // 1.75rem in pixels
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    renderDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex();
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = currentIndex < maxIndex() ? currentIndex + 1 : 0;
      updateCarousel();
    });
  }

  window.addEventListener("resize", () => {
    if (currentIndex > maxIndex()) currentIndex = maxIndex();
    updateCarousel();
  });

  renderDots();
}

// ==============================================================================
// 7. URL Query Parameter Support for Category Filtering (products.html)
// ==============================================================================
function initCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("category");
  if (catParam && (catParam === "bags" || catParam === "torans")) {
    filterByCategory(catParam);
  }
}

// Hook up into window load
window.addEventListener("DOMContentLoaded", () => {
  initFeaturedCarousel();
  initCategoryFromUrl();

  // Two category filter pills click handler on products.html
  const filterPills = document.querySelectorAll(".two-cat-pill, .category-filter-pills .category-pill-btn, .category-filter-pills .nav-link");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const cat = pill.dataset.category || pill.getAttribute("data-category");
      filterByCategory(cat);
    });
  });
});

// Expose global methods for inline HTML event handlers
window.filterByCategory = filterByCategory;
window.handleSearchInput = handleSearchInput;
window.clearSearch = clearSearch;
window.handleSortChange = handleSortChange;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.toggleInquiryBag = toggleInquiryBag;
window.removeFromBag = removeFromBag;
window.openBagDrawer = openBagDrawer;
window.closeBagDrawer = closeBagDrawer;
window.resetFilters = resetFilters;
