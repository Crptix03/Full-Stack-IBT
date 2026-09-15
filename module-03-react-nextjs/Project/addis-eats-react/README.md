# Addis Eats React

A full React restaurant web app for a modern Ethiopian food brand. This project combines a customer-facing food ordering experience with a working admin panel for menu, order, and user management.

The app is built with Vite + React and uses localStorage as a mock backend so the project works fully in the browser without a separate server.

---

## Project overview

This project was built as a complete restaurant management and ordering experience for Addis Eats. It includes:

- Customer homepage and landing page
- Menu browsing with categories, search, and favorites
- Cart with quantity updates and totals
- Checkout flow with validation and order placement
- Customer order history
- Sign up / sign in / profile management
- Light and dark theme switching
- Admin dashboard with revenue and order stats
- Menu management for dishes
- Order tracking and status updates
- User management for customers and admin accounts

---

## Features

### Customer side

- Responsive restaurant landing page with hero, story, offers, and featured dishes
- Search and filtering by category
- Favorites section and favorite dish toggling
- Add-to-cart flow with persistent cart state
- Checkout form with validation for customer details
- Delivery and pickup options
- Order confirmation screen
- Profile page with avatar upload and username editing
- Account creation and sign-in flow
- Theme toggle between dark and light mode

### Admin side

- Protected admin route using role-based access
- Dashboard with revenue, average order value, top dishes, and recent orders
- Menu manager to add, edit, hide/show, and remove dishes
- Order manager to update statuses like pending, preparing, on-the-way, delivered, and cancelled
- User manager to inspect registered users and identify admin accounts
- Persistent localStorage-backed menu and order data

---

## Tech stack

- React
- Vite
- React Router
- Context API + useReducer
- CSS custom properties and responsive styling
- localStorage for demo persistence

---

## Default admin account

Use this account to access the admin panel:

- Username: admin
- Password: royale2026

---

## Project structure

```bash
addis-eats-react/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
├── public/
│   ├── menu-data.json
│   └── images/
├── src/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DishForm.jsx
│   │   ├── DishManager.jsx
│   │   ├── OrderManager.jsx
│   │   ├── RequireAdmin.jsx
│   │   └── UserManager.jsx
│   ├── Auth/
│   │   ├── Profile.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── PasswordInput.jsx
│   ├── Cart/
│   │   └── Cart.jsx
│   ├── Checkout/
│   │   ├── Checkout.jsx
│   │   └── OrderConfirmation.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   ├── MenuContext.jsx
│   │   ├── OrderContext.jsx
│   │   └── ThemeContext.jsx
│   ├── Home/
│   │   ├── BestFoods.jsx
│   │   ├── Features.jsx
│   │   ├── Hero.jsx
│   │   ├── Home.jsx
│   │   ├── Offers.jsx
│   │   └── Story.jsx
│   ├── Menu/
│   │   ├── CategoryBar.jsx
│   │   ├── DishCard.jsx
│   │   ├── DishList.jsx
│   │   ├── Favorites.jsx
│   │   ├── Menu.jsx
│   │   └── DishModal.jsx
│   ├── OrderHistory/
│   │   └── OrderHistory.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Spinner.jsx
│   ├── AccountMenu.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── Footer.jsx
│   ├── Home.jsx
│   ├── Layout.jsx
│   ├── main.jsx
│   ├── RequireAuth.jsx
│   ├── ScrollToHash.jsx
│   └── index.css
├── README.md
└── public/
```

---

## Installation and run

1. Open the project folder:

```bash
cd sq2-horenus-dessalegn/module-03-react-nextjs/Project/addis-eats-react
```

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (usually Vite default port 5173).

---

## Important notes

- This is a front-end demo project, so authentication and data are stored in localStorage.
- Passwords are not encrypted, which is fine for learning and demonstration but not production-safe.
- The app is designed to showcase a complete restaurant workflow in one browser-based project.

---

## Summary

This project demonstrates a working restaurant app from start to finish:

- user-facing ordering experience
- shopping cart and checkout flow
- profile and account system
- admin dashboard and store management
- responsive design and theme switching

It was built as a practical React project to simulate how a real restaurant website and business dashboard could work together in one application.
