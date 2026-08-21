document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // SEED DATA FOR ROYALE BISTRO MENU (YOUR EXACT ITEMS)
    // ==========================================
    const menuData = [
      {
        id: "item-1",
        name: "Crispy Sambusa",
        category: "starters",
        price: 100,
        img: "images/sambusa.webp",
        description: "Lightly spiced brown lentils, green chilies, and herbs wrapped in a crispy pastry shell.",
        tag: "Veg",
        tagClass: "veg"
      },
      {
        id: "item-2",
        name: "Steak & Fries",
        category: "mains",
        price: 3000,
        img: "images/steak.jpg",
        description: "A juicy grilled steak served with crispy golden fries and fresh herbs for a simple, hearty meal.",
        tag: "Popular",
        tagClass: ""
      },
      {
        id: "item-3",
        name: "Big Smokey Burger",
        category: "mains",
        price: 750,
        img: "images/Big Smokey Burgers.jpg",
        description: "Tender beef cubes sautéed with onions, rosemary, jalapeños, and spiced clarified butter.",
        tag: null,
        tagClass: ""
      },
      {
        id: "item-4",
        name: "American Fried Rice",
        category: "mains",
        price: 180,
        img: "images/American Fried Rice.jpg",
        description: "Assortment of yellow split peas, misir wat, gomen, and cabbage served on warm teff injera.",
        tag: "Veg",
        tagClass: "veg"
      },
      {
        id: "item-5",
        name: "Pasta Campanelle",
        category: "mains",
        price: 800,
        img: "images/Pasta Campanelle2.webp",
        description: "A flavorful pasta dish with ruffled campanelle pasta, fresh tomatoes, greens, and a creamy, savory sauce.",
        tag: "Veg",
        tagClass: "veg"
      },
      {
        id: "item-6",
        name: "Italian Sausage Soup",
        category: "soups",
        price: 1800,
        img: "images/Italian Sausage Soup.jpg",
        description: "A flavorful pasta dish with ruffled campanelle pasta, fresh tomatoes, greens, and a creamy, savory sauce.",
        tag: "Soup",
        tagClass: "veg"
      },
      {
        id: "item-7",
        name: "Chicken Noodle Soup",
        category: "soups",
        price: 1000,
        img: "images/Chicken Noodle Soup.jpg",
        description: "Hearty, savory chicken noodle soup featuring tender meat, a rich broth, and soft noodles.",
        tag: "Soup",
        tagClass: "veg"
      },
      {
        id: "item-8",
        name: "Honey Baklava",
        category: "desserts",
        price: 100,
        img: "images/Baklava2.jpg",
        description: "Flaky pastry layers filled with crushed nuts and soaked in spiced honey syrup.",
        tag: null,
        tagClass: ""
      },
      {
        id: "item-9",
        name: "Oreo Cookies",
        category: "desserts",
        price: 180,
        img: "images/Oreo Cookies.jpg",
        description: "Creamy, chocolatey dessert layered with crushed Oreo cookies, whipped cream, and rich chocolate sauce in a stem glass.",
        tag: null,
        tagClass: ""
      },
      {
        id: "item-10",
        name: "Sprite",
        category: "drinks",
        price: 70,
        img: "images/sprite.jpg",
        description: "A crisp, clear, lemon-lime soda with a refreshing, zesty citrus flavor.",
        tag: null,
        tagClass: ""
      },
      {
        id: "item-11",
        name: "Coca-cola",
        category: "drinks",
        price: 70,
        img: "images/cocacola.jpg",
        description: "A refreshing, fizzy soft drink with a classic sweet and refreshing cola flavor.",
        tag: null,
        tagClass: ""
      },
      {
        id: "item-12",
        name: "Pepsi",
        category: "drinks",
        price: 70,
        img: "images/pepsi.jpg",
        description: "A classic, sweet, carbonated cola with a crisp, refreshing citrusy taste.",
        tag: null,
        tagClass: ""
      }
    ];

    // ==========================================
    // AUTHENTICATION CHECK
    // ==========================================
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem("royale_admin_logged_in");
        const currentPath = window.location.pathname.split("/").pop();

        if (isLoggedIn !== "true" && currentPath !== "login.html") {
            window.location.href = "login.html";
        }
        if (isLoggedIn === "true" && currentPath === "login.html") {
            window.location.href = "dashboard.html";
        }
    }
    checkAuth();

    // ==========================================
    // LOGIN LOGIC
    // ==========================================
    const loginForm = document.getElementById("adminLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("username").value;
            const pass = document.getElementById("password").value;

            if (user === "admin" && pass === "password123") {
                sessionStorage.setItem("royale_admin_logged_in", "true");
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid credentials! (Try: admin / password123)");
            }
        });
    }

    // ==========================================
    // DASHBOARD LOGIC (ORDERS)
    // ==========================================
    const ordersContainer = document.getElementById("adminOrdersContainer");
    const statTotal = document.getElementById("statTotal");
    const statPending = document.getElementById("statPending");
    const statCompleted = document.getElementById("statCompleted");
    const logoutBtn = document.getElementById("adminLogoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("royale_admin_logged_in");
            window.location.href = "login.html";
        });
    }

    function loadAdminDashboard() {
        let orders = JSON.parse(localStorage.getItem("royale_history")) || [];

        if (orders.length === 0) {
            if(ordersContainer) ordersContainer.innerHTML = `<p class="no-results">No orders have been placed yet.</p>`;
            if(statTotal) statTotal.textContent = "0";
            if(statPending) statPending.textContent = "0";
            if(statCompleted) statCompleted.textContent = "0";
            return;
        }

        const pendingCount = orders.filter(o => o.status !== "Arrived" && o.status !== "Ready for Pickup").length;
        const completedCount = orders.filter(o => o.status === "Arrived" || o.status === "Ready for Pickup").length;
        
        if(statTotal) statTotal.textContent = orders.length;
        if(statPending) statPending.textContent = pendingCount;
        if(statCompleted) statCompleted.textContent = completedCount;

        if(ordersContainer) {
            ordersContainer.innerHTML = orders.map((order, index) => `
                <div class="admin-card" data-index="${index}">
                    <div class="admin-card-info">
                        <h4>${order.id}</h4>
                        <p><strong>Date:</strong> ${order.date}</p>
                        
                        <!-- NEW: Customer Info Displays Here -->
                        <p><strong>Customer:</strong> ${order.customerName || 'Guest'}</p>
                        <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
                        
                        <p><strong>Address:</strong> ${order.address}</p>
                        <p><strong>Items:</strong> ${order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}</p>
                        <p><strong>Total:</strong> ${order.total}</p>
                    </div>
                    <div class="admin-card-actions">
                        <div class="admin-order-status">
                            <select class="status-select" data-index="${index}">
                                <option value="Received" ${order.status === "Received" ? "selected" : ""}>Received</option>
                                <option value="In Preparation" ${order.status === "In Preparation" ? "selected" : ""}>In Preparation</option>
                                <option value="On Way" ${order.status === "On Way" ? "selected" : ""}>On Way</option>
                                <option value="Arrived" ${order.status === "Arrived" ? "selected" : ""}>Arrived</option>
                                <option value="Ready for Pickup" ${order.status === "Ready for Pickup" ? "selected" : ""}>Ready for Pickup</option>
                            </select>
                        </div>
                        <button class="btn-delete delete-order-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `).join("");
        }

        document.querySelectorAll(".status-select").forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                let orders = JSON.parse(localStorage.getItem("royale_history")) || [];
                if(orders[index]) {
                    orders[index].status = e.target.value;
                    localStorage.setItem("royale_history", JSON.stringify(orders));
                    loadAdminDashboard();
                }
            });
        });

        document.querySelectorAll(".delete-order-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if(!confirm("Are you sure you want to delete this order?")) return;
                const index = e.target.dataset.index;
                let orders = JSON.parse(localStorage.getItem("royale_history")) || [];
                orders.splice(index, 1);
                localStorage.setItem("royale_history", JSON.stringify(orders));
                loadAdminDashboard();
            });
        });
    }

    // ==========================================
    // ADMIN MENU LOGIC (ADD, EDIT, DELETE & TOGGLE)
    // ==========================================
    const adminMenuContainer = document.getElementById("adminMenuContainer");
    
    function loadAdminMenu() {
        if (!adminMenuContainer) return;
        
        let menu = JSON.parse(localStorage.getItem("royale_menu"));
        
        if (!menu || menu.length === 0) {
            menu = menuData;
            localStorage.setItem("royale_menu", JSON.stringify(menu));
        }

        if (menu.length === 0) {
            adminMenuContainer.innerHTML = `<p class="no-results">No menu items found. Add your first item!</p>`;
            return;
        }

        adminMenuContainer.innerHTML = menu.map((item, index) => `
            <div class="admin-card" data-index="${index}">
                <div class="admin-card-info">
                    <h4>${item.name}</h4>
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Price:</strong> ${item.price} Birr</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Image:</strong> <img src="${item.img}" alt="${item.name}" class="admin-thumb"></p>
                    ${item.tag ? `<p><strong>Tag:</strong> ${item.tag}</p>` : ''}
                    <p><strong>Status:</strong> ${item.isHidden ? '<span style="color: #cf6679;">Hidden (Off)</span>' : '<span style="color: #5b8c5a;">Visible (On)</span>'}</p>
                </div>
                <div class="admin-card-actions" style="flex-direction: column; align-items: flex-end; gap: 1rem;">
                    
                    <!-- TOGGLE SWITCH -->
                    <div class="toggle-wrap">
                        <span class="toggle-label">${item.isHidden ? 'Off' : 'On'}</span>
                        <label class="toggle-switch">
                            <input type="checkbox" class="menu-toggle-input" data-index="${index}" ${item.isHidden ? '' : 'checked'}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div style="display: flex; gap: 0.8rem;">
                        <button class="btn-edit edit-menu-btn" data-index="${index}">Edit</button>
                        <button class="btn-delete delete-menu-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            </div>
        `).join("");

        // Handle TOGGLE (Hide/Show)
        document.querySelectorAll(".menu-toggle-input").forEach(checkbox => {
            checkbox.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                let menu = JSON.parse(localStorage.getItem("royale_menu")) || [];
                if(menu[index]) {
                    menu[index].isHidden = !e.target.checked; 
                    localStorage.setItem("royale_menu", JSON.stringify(menu));
                    loadAdminMenu();
                }
            });
        });

        // Handle DELETE
        document.querySelectorAll(".delete-menu-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if(!confirm("Are you sure you want to delete this menu item?")) return;
                const index = e.target.dataset.index;
                let menu = JSON.parse(localStorage.getItem("royale_menu")) || [];
                menu.splice(index, 1);
                localStorage.setItem("royale_menu", JSON.stringify(menu));
                loadAdminMenu();
            });
        });

        // Handle EDIT
        document.querySelectorAll(".edit-menu-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                let menu = JSON.parse(localStorage.getItem("royale_menu")) || [];
                const item = menu[index];

                if(item) {
                    document.getElementById("menuName").value = item.name;
                    document.getElementById("menuCategory").value = item.category;
                    document.getElementById("menuPrice").value = item.price;
                    document.getElementById("menuImg").value = item.img.replace("images/", "");
                    document.getElementById("menuDesc").value = item.description;
                    
                    document.getElementById("editIndex").value = index;
                    document.getElementById("modalSubmitBtn").textContent = "Save Changes";
                    document.getElementById("modalTitle").textContent = "Edit Menu Item";

                    document.getElementById("addMenuModal").classList.add("open");
                }
            });
        });
    }

    // ==========================================
    // ADD / EDIT MENU MODAL LOGIC
    // ==========================================
    const addMenuModal = document.getElementById("addMenuModal");
    const openAddMenuBtn = document.getElementById("openAddMenuBtn");
    const closeAddMenuBtn = document.getElementById("closeAddMenuBtn");
    const addMenuForm = document.getElementById("addMenuForm");
    const editIndexInput = document.getElementById("editIndex");
    const modalSubmitBtn = document.getElementById("modalSubmitBtn");
    const modalTitle = document.getElementById("modalTitle");

    if (openAddMenuBtn) {
        openAddMenuBtn.addEventListener("click", () => {
            addMenuForm.reset();
            editIndexInput.value = "-1";
            modalSubmitBtn.textContent = "Add Item";
            modalTitle.textContent = "Add New Menu Item";
            addMenuModal.classList.add("open");
        });
    }
    if (closeAddMenuBtn) {
        closeAddMenuBtn.addEventListener("click", () => addMenuModal.classList.remove("open"));
    }
    addMenuModal.addEventListener("click", (e) => {
        if (e.target === addMenuModal) addMenuModal.classList.remove("open");
    });

    if (addMenuForm) {
        addMenuForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("menuName").value;
            const category = document.getElementById("menuCategory").value;
            const price = parseInt(document.getElementById("menuPrice").value);
            const img = "images/" + document.getElementById("menuImg").value;
            const description = document.getElementById("menuDesc").value;
            const editIndex = parseInt(editIndexInput.value);

            let menu = JSON.parse(localStorage.getItem("royale_menu")) || [];

            if (editIndex === -1) {
                const newItem = {
                    id: "item-" + Date.now(),
                    name: name,
                    category: category,
                    price: price,
                    img: img,
                    description: description,
                    tag: null,
                    tagClass: ""
                };
                menu.push(newItem);
                alert(`"${name}" added to the menu successfully!`);
            } else {
                menu[editIndex].name = name;
                menu[editIndex].category = category;
                menu[editIndex].price = price;
                menu[editIndex].img = img;
                menu[editIndex].description = description;
                alert(`"${name}" updated successfully!`);
            }

            localStorage.setItem("royale_menu", JSON.stringify(menu));
            addMenuForm.reset();
            addMenuModal.classList.remove("open");
            loadAdminMenu();
        });
    }

    // ==========================================
    // TAB SWITCHING LOGIC
    // ==========================================
    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
    const ordersSection = document.getElementById("ordersSection");
    const menuSection = document.getElementById("menuSection");
    const pageTitle = document.getElementById("pageTitle");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const page = link.dataset.page;

            if (page === "orders") {
                ordersSection.style.display = "block";
                menuSection.style.display = "none";
                pageTitle.textContent = "Order Management";
                loadAdminDashboard();
            } else if (page === "menu") {
                ordersSection.style.display = "none";
                menuSection.style.display = "block";
                pageTitle.textContent = "Manage Menu";
                loadAdminMenu();
            }
        });
    });

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    if (window.location.pathname.includes("dashboard.html")) {
        loadAdminDashboard();
    }
});