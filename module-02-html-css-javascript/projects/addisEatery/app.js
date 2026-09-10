document.addEventListener("DOMContentLoaded", () => {
  // State Management
  let cart = JSON.parse(localStorage.getItem("royale_cart")) || [];
  let orderHistory = JSON.parse(localStorage.getItem("royale_history")) || [];
  let favorites = JSON.parse(localStorage.getItem("royale_favorites")) || [];

  // DOM Elements
  const menuGridContainer = document.getElementById("menuGridContainer");
  const menuSearchInput = document.getElementById("menuSearchInput");
  const globalSearchInput = document.getElementById("globalSearchInput");
  
  const cartIconBtn = document.getElementById("cartIconBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");
  
  // CUSTOMER INPUTS
  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");
  const deliveryAddressInput = document.getElementById("deliveryAddress");
  
  const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
  const addressInputWrap = document.querySelector('.address-input-wrap');
  const deliveryFeeRow = document.getElementById("deliveryFeeRow");

  const checkoutBtn = document.getElementById("checkoutBtn");

  const historyIconBtn = document.getElementById("historyIconBtn");
  const historyDrawer = document.getElementById("historyDrawer");
  const historyOverlay = document.getElementById("historyOverlay");
  const historyCloseBtn = document.getElementById("historyCloseBtn");
  const historyItemsContainer = document.getElementById("historyItemsContainer");

  const orderModal = document.getElementById("orderModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOrderId = document.getElementById("modalOrderId");
  const modalAddress = document.getElementById("modalAddress");
  const modalItemsSummary = document.getElementById("modalItemsSummary");
  const toastContainer = document.getElementById("toastContainer");

  // ==========================================
  // SKELETON LOADING (MENU GRID)
  // ==========================================
  function renderMenuSkeleton(count = 6) {
    if (!menuGridContainer) return;
    menuGridContainer.innerHTML = Array.from({ length: count })
      .map(
        () => `
        <div class="menu-item skeleton-card">
          <div class="thumb skeleton-box"></div>
          <div class="menu-body">
            <div class="menu-item-top">
              <span class="skeleton-box skeleton-text" style="width: 60%;"></span>
              <span class="skeleton-box skeleton-text" style="width: 20%;"></span>
            </div>
            <span class="skeleton-box skeleton-text" style="width: 90%;"></span>
            <span class="skeleton-box skeleton-text" style="width: 40%; height: 38px; margin-top: 8px;"></span>
          </div>
        </div>
      `
      )
      .join("");
  }

  // ==========================================
  // IMAGE PRELOADING (used to detect real "slow internet")
  // ==========================================
  function preloadImages(urls) {
    const uniqueUrls = [...new Set(urls)];
    const promises = uniqueUrls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // don't hang the whole batch on one bad image
          img.src = src;
        })
    );
    return Promise.all(promises);
  }

  // ==========================================
  // MENU RENDER & FILTERING
  // ==========================================
  function renderMenu(currentCategory) {
    if (!menuGridContainer) return;
    
    let activeMenu = JSON.parse(localStorage.getItem("royale_menu"));
    if (!activeMenu || activeMenu.length === 0) {
        activeMenu = menuData;
    }

    const searchQuery = menuSearchInput ? menuSearchInput.value.toLowerCase().trim() : "";

    const filteredItems = activeMenu.filter((item) => {
      if (item.isHidden === true) return false; 

      let categoryMatch = false;
      if (currentCategory === "favorites") {
        categoryMatch = favorites.includes(item.id);
      } else {
        categoryMatch = currentCategory === "all" || item.category === currentCategory;
      }

      const textMatch = item.name.toLowerCase().includes(searchQuery) || 
                        item.description.toLowerCase().includes(searchQuery);
      return categoryMatch && textMatch;
    });

    if (filteredItems.length === 0) {
      if (currentCategory === "favorites") {
        menuGridContainer.innerHTML = `<p class="no-results">You haven't added any favorites yet. Tap the heart on an item to save it!</p>`;
      } else {
        menuGridContainer.innerHTML = `<p class="no-results">No menu items found matching your criteria.</p>`;
      }
      return;
    }

    menuGridContainer.innerHTML = filteredItems
      .map(
        (item) => `
        <div class="menu-item" data-category="${item.category}">
          <div class="thumb">
            <img src="${item.img}" alt="${item.name}" loading="lazy">
            ${item.tag ? `<span class="tag ${item.tagClass}">${item.tag}</span>` : ""}
            <button class="favorite-btn ${favorites.includes(item.id) ? 'active' : ''}" data-id="${item.id}">
              <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="menu-body">
            <div class="menu-item-top">
              <h3>${item.name}</h3>
              <span class="price">${item.price} Birr</span>
            </div>
            <p>${item.description}</p>
            <button 
              class="add-btn" 
              data-name="${item.name}" 
              data-price="${item.price}" 
              data-img="${item.img}">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/></svg>
              Add to Order
            </button>
          </div>
        </div>
      `
      )
      .join("");
      
    attachFavoriteListeners();
  }

  // ==========================================
  // FAVORITE BUTTON LOGIC
  // ==========================================
  function attachFavoriteListeners() {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        
        if (favorites.includes(id)) {
          favorites = favorites.filter(favId => favId !== id);
          btn.classList.remove("active");
          showToast("Removed from favorites");
        } else {
          favorites.push(id);
          btn.classList.add("active");
          showToast("Added to favorites ❤️");
        }
        
        localStorage.setItem("royale_favorites", JSON.stringify(favorites));
        
        const activeTab = document.querySelector(".menu-tab.active");
        if (activeTab && activeTab.dataset.category === "favorites") {
          renderMenu("favorites");
        }
      });
    });
  }

  // ==========================================
  // TAB BUTTON LOGIC
  // ==========================================
  const menuTabs = document.querySelectorAll(".menu-tab");
  let activeCategory = "all";

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", function() {
      menuTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.dataset.category;
      renderMenu(activeCategory);
    });
  });

  // ==========================================
  // SEARCH LOGIC
  // ==========================================
  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", () => renderMenu(activeCategory));
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener("input", (e) => {
      if (menuSearchInput) {
        menuSearchInput.value = e.target.value;
        renderMenu(activeCategory);
      }
    });
  }

  // ==========================================
  // CART MANAGEMENT
  // ==========================================
  function updateCartUI() {
    localStorage.setItem("royale_cart", JSON.stringify(cart));

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartIconBtn) cartIconBtn.setAttribute("data-count", totalCount);

    if (cart.length === 0) {
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `<p class="cart-empty">Your order list is currently empty.</p>`;
      }
      if (cartSubtotalEl) cartSubtotalEl.textContent = "0 Birr";
      if (cartTotalEl) cartTotalEl.textContent = "0 Birr";
      return;
    }

    let subtotal = 0;
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cart
        .map((item, index) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          return `
            <div class="cart-row">
              <img src="${item.img}" alt="${item.name}">
              <div class="cart-row-info">
                <div class="cart-row-top">
                  <span>${item.name}</span>
                  <span class="cart-item-price">${itemTotal} Birr</span>
                </div>
                <div class="qty-control">
                  <button onclick="changeQty(${index}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button onclick="changeQty(${index}, 1)">+</button>
                  <span class="remove-link" onclick="removeFromCart(${index})">Remove</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    const selectedType = document.querySelector('input[name="deliveryType"]:checked');
    const isDelivery = selectedType ? selectedType.value === "delivery" : true;
    const deliveryFee = isDelivery ? 100 : 0;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal} Birr`;
    if (cartTotalEl) cartTotalEl.textContent = `${subtotal + deliveryFee} Birr`;
  }

  window.addToCart = function (name, price, img) {
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price: Number(price), img, quantity: 1 });
    }
    updateCartUI();
    showToast(`Added ${name} to order`);
    toggleCart(true);
  };

  window.changeQty = function (index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  };

  window.removeFromCart = function (index) {
    const name = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`Removed ${name}`);
  };

  window.reorderOrder = function (index) {
    const order = orderHistory[index];
    if (!order) return;

    order.items.forEach(item => {
      const existing = cart.find(cartItem => cartItem.name === item.name);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push({
          name: item.name,
          price: Number(item.price),
          img: item.img,
          quantity: item.quantity
        });
      }
    });

    updateCartUI();
    showToast(`🔄 Reordered ${order.items.length} items from order ${order.id}`);
    toggleCart(true);
  };

  // ==========================================
  // EVENT DELEGATION FOR ADD BUTTONS
  // ==========================================
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (btn) {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      addToCart(name, price, img);
    }
  });

  // ==========================================
  // DELIVERY / PICKUP TOGGLE LOGIC
  // ==========================================
  function toggleAddressField() {
    const selectedType = document.querySelector('input[name="deliveryType"]:checked');

    if (selectedType && selectedType.value === "delivery") {
      addressInputWrap.style.display = "block";
      if(deliveryFeeRow) deliveryFeeRow.style.display = "flex";
    } else {
      addressInputWrap.style.display = "none";
      if(deliveryFeeRow) deliveryFeeRow.style.display = "none";
      if (deliveryAddressInput) deliveryAddressInput.value = ""; 
    }
    updateCartUI();
  }

  deliveryTypeRadios.forEach((radio) => {
    radio.addEventListener("change", toggleAddressField);
  });

  // ==========================================
  // DRAWER CONTROLS
  // ==========================================
  function toggleCart(open) {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.toggle("open", open);
    cartOverlay.classList.toggle("open", open);
  }

  function toggleHistory(open) {
    if (!historyDrawer || !historyOverlay) return;
    if (open) renderHistoryUI();
    historyDrawer.classList.toggle("open", open);
    historyOverlay.classList.toggle("open", open);
  }

  if (cartIconBtn) cartIconBtn.addEventListener("click", (e) => { e.preventDefault(); toggleCart(true); });
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener("click", () => toggleCart(false));

  if (historyIconBtn) historyIconBtn.addEventListener("click", (e) => { e.preventDefault(); toggleHistory(true); });
  if (historyCloseBtn) historyCloseBtn.addEventListener("click", () => toggleHistory(false));
  if (historyOverlay) historyOverlay.addEventListener("click", () => toggleHistory(false));

  // ==========================================
  // CHECKOUT & ORDER HISTORY (STRICT 13-CHAR PHONE VALIDATION)
  // ==========================================
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }

      // 1. Get & Validate Name
      const name = customerNameInput ? customerNameInput.value.trim() : "";
      if (!name) {
        showToast("Please enter your full name");
        if (customerNameInput) customerNameInput.focus();
        return;
      }

      // 2. Get & Validate Phone (Strict 13 characters: +251 + 9 digits)
      let phone = customerPhoneInput ? customerPhoneInput.value.trim() : "";
      
      if (!phone) {
        showToast("Please enter your phone number");
        if (customerPhoneInput) customerPhoneInput.focus();
        return;
      }

      // Remove any existing dashes to get clean input
      let rawPhone = phone.replace(/-/g, "");

      
      if (/^\+2519\d{8}$/.test(rawPhone)) {
        phone = rawPhone.slice(0, 4) + "-" + rawPhone.slice(4, 6) + "-" + rawPhone.slice(6, 9) + "-" + rawPhone.slice(9); // +251-91-234-5678
        customerPhoneInput.value = phone;
      }

      else if (/^9\d{8}$/.test(rawPhone)) {
        phone = "+251-" + rawPhone.slice(0, 2) + "-" + rawPhone.slice(2, 5) + "-" + rawPhone.slice(5); // +251-91-234-5678
        customerPhoneInput.value = phone;
      }

      else {
        showToast("Please enter a valid Ethiopian number: +251-9x-xxx-xxxx");
        if (customerPhoneInput) customerPhoneInput.focus();
        return;
      }

      // 3. Determine Delivery or Pickup
      const selectedType = document.querySelector('input[name="deliveryType"]:checked');
      const isDelivery = selectedType ? selectedType.value === "delivery" : true;

      let address = "";
      if (isDelivery) {
        address = deliveryAddressInput ? deliveryAddressInput.value.trim() : "";
        if (!address) {
          showToast("Please enter a delivery address");
          if (deliveryAddressInput) deliveryAddressInput.focus();
          return;
        }
      } else {
        address = "Pickup at Royale Bistro";
      }

      // 4. Generate Order
      const orderId = `#RB-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const deliveryFee = isDelivery ? 100 : 0;
      const total = subtotal + deliveryFee;

      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customerName: name,
        customerPhone: phone,
        address: address,
        items: [...cart],
        total: `${total} Birr`,
        status: isDelivery ? "In Preparation" : "Ready for Pickup",
      };

      orderHistory.unshift(newOrder);
      localStorage.setItem("royale_history", JSON.stringify(orderHistory));

      // 5. Update Confirmation Modal
      const modalCustomerName = document.getElementById("modalCustomerName");
      const modalCustomerPhone = document.getElementById("modalCustomerPhone");
      
      if (modalOrderId) modalOrderId.textContent = orderId;
      if (modalCustomerName) modalCustomerName.textContent = name;
      if (modalCustomerPhone) modalCustomerPhone.textContent = phone;
      if (modalAddress) modalAddress.textContent = address;
      
      if (modalItemsSummary) {
        modalItemsSummary.innerHTML = cart
          .map((item) => `
            <li>
              <span>${item.quantity}x ${item.name}</span>
              <span>${item.price * item.quantity} Birr</span>
            </li>
          `)
          .join("");
      }

      // 6. Reset Everything
      cart = [];
      updateCartUI();
      toggleCart(false);
      
      // Clear inputs
      if (customerNameInput) customerNameInput.value = "";
      if (customerPhoneInput) customerPhoneInput.value = "";
      if (deliveryAddressInput) deliveryAddressInput.value = "";
      
      if (orderModal) orderModal.classList.add("open");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (orderModal) orderModal.classList.remove("open");
    });
  }

  function renderHistoryUI() {
    if (!historyItemsContainer) return;

    if (orderHistory.length === 0) {
      historyItemsContainer.innerHTML = `<p class="cart-empty">No past orders found.</p>`;
      return;
    }

    historyItemsContainer.innerHTML = orderHistory
      .map((order, index) => `
        <div class="order-history-card">
          <div class="order-title">${order.id}</div>
          <div class="order-status">${order.status}</div>
          <div class="order-date">${order.date}</div>
          <div class="order-items-text">
            ${order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </div>
          <div class="order-total-text">Total: ${order.total}</div>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light-color);">
            <span>👤 ${order.customerName || 'Guest'}</span> &bull; 
            <span>📞 ${order.customerPhone || 'N/A'}</span>
          </div>
          <button class="reorder-btn" onclick="reorderOrder(${index})">🔄 Reorder</button>
        </div>
      `)
      .join("");
  }

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ==========================================
  // THEME TOGGLE LOGIC
  // ==========================================
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const currentTheme = localStorage.getItem("royale_theme");
  if (currentTheme === "light") {
      document.body.classList.add("light-theme");
      updateThemeIcon(true);
  }

  if (themeToggle) {
      themeToggle.addEventListener("click", () => {
          const isLight = document.body.classList.toggle("light-theme");
          localStorage.setItem("royale_theme", isLight ? "light" : "dark");
          updateThemeIcon(isLight);
      });
  }

  function updateThemeIcon(isLight) {
      if (!themeIcon) return;
      if (isLight) {
          themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
      } else {
          themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      }
  }

  // ==========================================
  // MOBILE MENU TOGGLE LOGIC
  // ==========================================
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    // Close the mobile menu when a link is clicked
    document.querySelectorAll("#navMenu a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // ==========================================
  // INITIAL LOAD EXECUTION (skeleton only shows on genuinely slow loads)
  // ==========================================
  (function initMenu() {
    let activeMenu = JSON.parse(localStorage.getItem("royale_menu"));
    if (!activeMenu || activeMenu.length === 0) {
      activeMenu = menuData;
    }

    const imageUrls = activeMenu.map((item) => item.img);

    let imagesReady = false;
    const SKELETON_THRESHOLD_MS = 300; // fast connections never see the skeleton

    const skeletonTimer = setTimeout(() => {
      if (!imagesReady) {
        renderMenuSkeleton();
      }
    }, SKELETON_THRESHOLD_MS);

    preloadImages(imageUrls).then(() => {
      imagesReady = true;
      clearTimeout(skeletonTimer);
      renderMenu("all");
      updateCartUI();
    });
  })();
});