# Addis Eats

Addis Eats is a small React application for browsing a restaurant menu, filtering dishes by category, adding items to an order, and submitting a delivery form.

## Features

- Menu browsing for starters, mains, soups, desserts, and drinks
- Category filter buttons to switch between food groups
- Spicy dish badges for selected items
- Add button on each dish to increase quantity and update the running total
- Delivery form with validation for customer name, phone number, and delivery area
- Empty-state message when a category has no items

## Project Structure

- `src/Menu.jsx` – main menu component, category state, and order total logic
- `src/CategoryBar.jsx` – category filter buttons
- `src/Dish.jsx` – individual dish card with quantity and add-to-order behavior
- `src/OrderForm.jsx` – customer delivery form with validation
- `src/data.js` – restaurant menu data
- `src/Card.jsx` – reusable layout wrapper for menu items

## React Concepts Used

- Functional components
- Props and default props
- PropTypes validation
- State management with `useState`
- Conditional rendering
- Array filtering and mapping
- List keys in React
- Form validation and controlled inputs

## How to Run

1. Open the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL shown in the terminal in your browser.

## Notes

The app uses a sample menu with Ethiopian and international dishes and tracks a customer order total in ETB while the user adds items from the menu.
