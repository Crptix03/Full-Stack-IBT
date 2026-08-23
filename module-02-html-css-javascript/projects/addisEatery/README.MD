# Royale Bistro

Royale Bistro is a browser-based restaurant ordering application built with HTML, CSS, and vanilla JavaScript. It includes a customer-facing menu and ordering experience as well as an admin dashboard for managing orders and menu items.

## Features

### Customer website

- Responsive restaurant landing page with:
  - Hero section and call-to-action
  - Restaurant story section
  - Feature highlights
  - Opening hours, contact links, newsletter form, and footer
- Dynamic menu loaded from `data/menu.js`
- Menu categories for starters, main courses, soups, desserts, and drinks
- Menu search by item name or description
- Favorites/wishlist functionality
- Shopping cart with quantity controls and item removal
- Delivery or pickup ordering
- Customer name, Ethiopian phone number, and delivery address validation
- Order confirmation modal with order details and delivery tracker
- Order history drawer with reorder functionality
- Light and dark theme toggle
- Toast notifications for cart and favorite actions

### Admin dashboard

- Admin login page
- Dashboard displaying:
  - Total orders
  - Pending orders
  - Completed orders
- Order management with status updates and deletion
- Menu management with:
  - Add item
  - Edit item
  - Delete item
  - Hide/show item toggle
- Responsive mobile sidebar navigation
- Admin light and dark theme toggle

## Files

### `index.html`

Defines the customer-facing restaurant page. It contains the navigation, hero section, restaurant story, menu controls, cart drawer, order history drawer, order confirmation modal, toast container, and footer. It loads `data/menu.js`, followed by `app.js`.

### `styles.css`

Provides the complete customer-site styling, including:

- Dark and light theme variables
- Responsive navigation and mobile menu behavior
- Hero, features, about, menu, and footer layouts
- Menu cards, category tabs, search controls, and favorite buttons
- Cart and order-history drawers
- Checkout form, confirmation modal, tracker, and toast notifications
- Responsive layouts for tablet and mobile screens

### `data/menu.js`

Contains the initial menu seed data for Royale Bistro. Each item includes an ID, name, category, price, image path, description, and optional tag information.

### `app.js`

Controls the customer-side application behavior. It renders and filters menu items, manages favorites and cart state, handles delivery or pickup selection, validates checkout information, creates orders, displays order history, supports reordering, and switches the customer theme.

Customer data is stored in browser local storage using these keys:

- `royale_cart`
- `royale_history`
- `royale_favorites`
- `royale_menu`
- `royale_theme`

### `login.html`

Provides the admin login form, admin branding, theme toggle, and a link back to the customer site.

### `dashboard.html`

Defines the admin interface. It includes the sidebar navigation, order statistics, order list, menu management section, and add/edit menu modal.

### `admin.css`

Provides styling for the admin login and dashboard pages, including:

- Admin dark and light themes
- Login form and modal styles
- Sidebar navigation
- Dashboard statistics and order cards
- Menu item management cards
- Responsive mobile sidebar controls
- Add/edit menu modal

### `admin.js`

Controls admin authentication, theme persistence, dashboard statistics, order status changes, order deletion, menu rendering, menu visibility toggles, and add/edit/delete menu actions.

Admin state uses these browser storage keys:

- `royale_admin_logged_in` in session storage for the login session
- `royale_admin_theme` in local storage for the admin theme
- `royale_history` in local storage for shared customer orders
- `royale_menu` in local storage for shared menu changes

## Running the project

Open `index.html` in a browser to use the customer website. Open `login.html` to access the admin area.

Because the application uses browser storage, customer orders and admin menu changes are stored in the browser used to run the project. A local development server can also be used if the browser restricts local file access.

## Demo admin login

- Username: `admin`
- Password: `password123`

## Ordering flow

1. Browse or search the menu.
2. Add menu items to the cart.
3. Choose delivery or pickup.
4. Enter the required customer details.
5. Place the order.
6. View the confirmation modal or track the order later from Order History.

The admin can update the order status from the dashboard, and those changes are visible in the shared browser order history.
