# Royale Bistro

Royale Bistro is a static restaurant ordering website created with HTML, CSS, and JavaScript. The project includes a customer-facing menu and ordering experience, as well as a simple admin area for viewing orders and managing menu items.

## Features

### Customer Features

- Browse restaurant menu items by category.
- Search menu items from the navigation bar or menu section.
- Add menu items to a shopping cart and change item quantities.
- Choose delivery or pickup when placing an order.
- Enter a delivery address and view the calculated delivery fee.
- Place orders and view order confirmation details.
- View previously placed orders in the order history drawer.
- **Theme Toggle**: Switch between dark and light themes for a personalized viewing experience.
- Mobile-responsive design for all screen sizes.

### Admin Features

- Log in to an admin dashboard with secure authentication.
- View, update, and delete customer orders from the dashboard.
- Monitor order statistics (total, pending, and completed orders).
- Add, edit, delete, hide, or show menu items from the admin dashboard.
- **Admin Theme Toggle**: Switch between dark and light themes in the admin area.
- Mobile-responsive admin interface.

### General Features

- Persist cart data, order history, menu changes, and admin login state in browser storage.
- Responsive navigation and layouts for desktop, tablet, and mobile devices.

## Project Files

### Customer Pages

#### `index.html`

The main customer page for Royale Bistro. It contains:

- Header navigation with search functionality and theme toggle button.
- Menu toggle button for mobile devices.
- Hero section introducing the restaurant with featured imagery.
- Features banner highlighting key dining experience aspects.
- Restaurant story and "about" section with founder information.
- Dynamic menu section with category tabs and search controls.
- Shopping cart drawer for order management.
- Delivery and pickup selection controls with conditional address input.
- Order history drawer for viewing past orders.
- Order confirmation and tracking modal.
- Footer with contact information, opening hours, newsletter subscription, and payment details.

The menu cards are rendered dynamically by `app.js` using data from `data/menu.js` or the menu saved by the admin dashboard.

#### `styles.css`

The main stylesheet for the customer website. It defines:

- **Dark and Light Theme**: CSS variable system supporting both dark (default) and light themes with automatic theme switching.
- Header and responsive navigation styles, including theme toggle button.
- Hero, features, about, menu, and footer layouts.
- Menu cards, category tabs, search fields, and buttons.
- Cart and order history drawers.
- Order confirmation tracker modal.
- Toast notifications and responsive layouts for smaller screens.
- Mobile-first responsive design with breakpoints for tablets and phones.

### Admin Pages

#### `login.html`

The admin login page. It provides:

- Username and password input fields for secure admin authentication.
- Theme toggle button (positioned at the top-right) for dark/light theme switching.
- Link to return to the customer site.
- Login form handled by `admin.js`.

Default demo credentials:

- Username: `admin`
- Password: `password123`

#### `dashboard.html`

The admin dashboard page. It contains:

- Responsive sidebar navigation for Orders and Manage Menu sections.
- Mobile menu toggle button for responsive navigation.
- **Theme Toggle Button**: Dark/light theme switcher with label in the top-right area.
- Admin topbar with page title and user profile indicator.
- **Orders Section**:
  - Order statistics cards (total, pending, completed orders).
  - Recent order cards with order details and status management.
  - Status update dropdown and delete action buttons for each order.
- **Manage Menu Section**:
  - Menu item cards with visibility toggles, edit buttons, and delete buttons.
  - "Add New Item" button to open the menu item form modal.
  - Ability to manage visibility (hide/show) of menu items without deletion.
- Add and edit menu item modal form with fields for name, category, price, image URL, and description.
- Mobile responsive layout with collapsible sidebar.

#### `admin.css`

The stylesheet for the admin login page and dashboard. It defines:

- **Dark and Light Theme**: CSS variable system supporting both dark (default) and light themes with seamless switching.
- Admin login page layout, styling, and form inputs.
- Admin dashboard layout with sidebar navigation and main content area.
- Statistics cards, order cards, and menu management cards.
- Modal form styling for adding and editing menu items.
- Visibility toggle switch for hiding/showing menu items.
- Theme toggle button styling for the admin area.
- Mobile responsive behavior with hamburger menu and adaptive layouts.

#### `admin.js`

The JavaScript controller for the admin area. It handles:

- Demo admin authentication using `sessionStorage`.
- Redirecting unauthenticated users to `login.html`.
- Loading and displaying customer orders from `localStorage`.
- Updating order statuses and deleting orders.
- **Admin Theme Toggle**: Switching between dark and light themes with persistent preference storage.
- Seeding the initial menu data when no saved menu exists.
- Adding, editing, deleting, hiding, and showing menu items.
- Switching between the Orders and Manage Menu dashboard sections.
- Mobile sidebar menu toggle and responsive interactions.

### JavaScript Data and Application Logic

#### `app.js`

The main customer-side application logic. It manages:

- Menu rendering, category filtering, and search functionality.
- Cart state and quantity updates with real-time UI synchronization.
- Cart drawer and order history drawer interactions.
- Delivery and pickup selection with conditional address field visibility.
- Delivery fee and order total calculations.
- Order creation and storage in localStorage.
- Order confirmation modal and toast notification messages.
- **Customer Theme Toggle**: Switching between dark and light themes with persistent preference storage.
- Mobile navigation menu toggle.

Customer data is stored in the browser using these localStorage keys:

- `royale_cart` for the current cart.
- `royale_history` for placed orders.
- `royale_menu` for the current menu, including admin changes.
- `royale_theme` for the customer theme preference (dark or light).

#### `data/menu.js`

Contains the initial `menuData` array used to seed the restaurant menu. Each menu item includes an ID, name, category, price, image path, description, and optional tag information.

### Images

#### `images/`

Stores the food, drink, restaurant, chef, ingredient, and hero images used throughout the website. Menu image paths are defined in `data/menu.js` and can also be entered when adding or editing an item in the admin dashboard.

The current menu references images such as:

- Sambusa
- Steak and fries
- Burger
- Fried rice
- Pasta
- Soups
- Baklava
- Oreo dessert
- Sprite
- Coca-Cola
- Pepsi
- Hero, chef, spice, and restaurant story images

Keep image filenames and paths consistent with the values in the menu data so menu cards load correctly.

## How to Run

This project does not require a build tool or backend server.

1. Open `index.html` in a browser to use the customer site.
2. Open `login.html` to access the admin area.
3. Sign in with the demo admin credentials listed above.
4. Use the dashboard to manage orders and menu items.

For the most reliable local experience, open the project folder in VS Code and use a simple local server extension such as Live Server. This helps browser features work consistently across pages.

## Data Notes

The project uses browser storage rather than a database or API. Data is saved only in the current browser profile. Clearing browser storage removes the cart, order history, menu changes, and theme preferences. Admin authentication uses `sessionStorage`, so the login session ends when the browser tab or session is closed.

**Theme Storage:**

- Customer theme preference is stored in `royale_theme` (localStorage).
- Admin theme preference is stored in `royale_admin_theme` (sessionStorage).
- Both default to dark theme if no preference is saved.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` and `sessionStorage`
- Google Fonts: Jost and Playfair Display
