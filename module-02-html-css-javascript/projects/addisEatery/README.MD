# Royale Bistro

Royale Bistro is a static restaurant ordering website created with HTML, CSS, and JavaScript. The project includes a customer-facing menu and ordering experience, as well as a simple admin area for viewing orders and managing menu items.

## Features

- Browse restaurant menu items by category.
- Search menu items from the navigation bar or menu section.
- Add menu items to a shopping cart and change item quantities.
- Choose delivery or pickup when placing an order.
- Enter a delivery address and view the calculated delivery fee.
- Place orders and view order confirmation details.
- View previously placed orders in the order history drawer.
- Log in to an admin dashboard.
- View, update, and delete customer orders from the dashboard.
- Add, edit, delete, hide, or show menu items from the admin dashboard.
- Persist cart data, order history, menu changes, and admin login state in browser storage.

## Project Files

### Customer Pages

#### `index.html`

The main customer page for Royale Bistro. It contains:

- Header navigation and menu search.
- Hero section introducing the restaurant.
- Features banner and restaurant story section.
- Dynamic menu section with category tabs and search controls.
- Shopping cart drawer.
- Delivery and pickup controls.
- Order history drawer.
- Order confirmation and tracking modal.
- Footer with contact, opening hours, newsletter, and payment information.

The menu cards are rendered dynamically by `app.js` using data from `data/menu.js` or the menu saved by the admin dashboard.

#### `styles.css`

The main stylesheet for the customer website. It defines:

- The dark restaurant theme, colors, typography, spacing, and transitions.
- Header and responsive navigation styles.
- Hero, features, about, menu, and footer layouts.
- Menu cards, category tabs, search fields, and buttons.
- Cart and order history drawers.
- Order confirmation tracker modal.
- Toast notifications and responsive layouts for smaller screens.

### Admin Pages

#### `login.html`

The admin login page. It provides username and password fields and links back to the customer site. The login form is handled by `admin.js`.

Default demo credentials:

- Username: `admin`
- Password: `password123`

#### `dashboard.html`

The admin dashboard page. It contains:

- Sidebar navigation for Orders and Manage Menu.
- Order statistics for total, pending, and completed orders.
- Recent order cards with status controls and delete actions.
- Menu management cards with visibility toggles, edit buttons, and delete buttons.
- Add and edit menu item modal form.

#### `admin.css`

The stylesheet for the admin login page and dashboard. It defines the admin layout, sidebar, statistics cards, order cards, menu cards, modal form, buttons, visibility toggle switch, and mobile responsive behavior.

#### `admin.js`

The JavaScript controller for the admin area. It handles:

- Demo admin authentication using `sessionStorage`.
- Redirecting unauthenticated users to `login.html`.
- Loading and displaying customer orders from `localStorage`.
- Updating order statuses and deleting orders.
- Seeding the initial menu data when no saved menu exists.
- Adding, editing, deleting, hiding, and showing menu items.
- Switching between the Orders and Manage Menu dashboard sections.

### JavaScript Data and Application Logic

#### `app.js`

The main customer-side application logic. It manages:

- Menu rendering, category filtering, and search.
- Cart state and quantity updates.
- Cart drawer and order history drawer interactions.
- Delivery and pickup selection.
- Delivery fee and order total calculations.
- Order creation and storage.
- Order confirmation modal and toast messages.

Customer data is stored in the browser using these localStorage keys:

- `royale_cart` for the current cart.
- `royale_history` for placed orders.
- `royale_menu` for the current menu, including admin changes.

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

The project uses browser storage rather than a database or API. Data is saved only in the current browser profile. Clearing browser storage removes the cart, order history, and admin-managed menu changes. Admin authentication uses `sessionStorage`, so the login session ends when the browser tab or session is closed.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` and `sessionStorage`
- Google Fonts: Jost and Playfair Display
