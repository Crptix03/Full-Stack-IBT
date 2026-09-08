# Addis Eats

Addis Eats is a React food-ordering application built with Vite. It presents a menu of Ethiopian dishes and lets users browse dishes, manage a cart, sign in, and complete a protected checkout flow.

## What I Completed in Day 34

- Built the Addis Eats application with React 19 and Vite.
- Added client-side routing with React Router for:
  - Menu
  - Dish details
  - Cart
  - Sign in
  - Checkout
  - Not-found pages
- Added menu loading from `public/dishes.json` with loading and error states.
- Added menu categories for starters, mains, soups, desserts, and drinks.
- Added category filtering through URL search parameters.
- Added sorting by dish name and price.
- Added reusable dish list, dish card, and dish detail components.
- Added cart functionality with a cart badge and cart page.
- Added authentication context and a sign-in page.
- Protected the checkout route so only signed-in users can access it.
- Added lazy loading for the checkout page with a loading fallback.
- Added error boundaries around the menu, cart, and checkout experiences.
- Added theme context and shared application styling.
- Added an order form and checkout panel for submitting an order.
- Added a responsive application layout with navigation and footer.

## Technologies Used

- React
- React Router
- Zustand
- Vite
- JavaScript and CSS

## Run the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```
