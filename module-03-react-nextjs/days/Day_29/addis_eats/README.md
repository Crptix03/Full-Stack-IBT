# Addis Eats

Addis Eats is a React application for browsing a restaurant menu, filtering dishes by category, adding items to an order, and submitting a delivery form. It fetches menu data from an external JSON file and uses modern React patterns for data fetching and component composition.

## Features

- Menu browsing for starters, mains, soups, desserts, and drinks
- Category filter buttons to switch between food groups
- Spicy dish badges for selected items
- Add button on each dish to increase quantity and update the running total
- Delivery form with validation for customer name, phone number, and delivery area
- Empty-state message when a category has no items
- Search input with auto-focus (using `useRef`)
- Loading state while fetching menu data
- Error handling for failed API requests
- Async data fetching with AbortController for cleanup

## Project Structure

- `src/App.jsx` – top-level app wrapper with main heading
- `src/Menu.jsx` – main menu component with category state, order total logic, and data fetching
- `src/CategoryBar.jsx` – category filter buttons
- `src/DishList.jsx` – renders list of dishes with empty-state handling
- `src/Dish.jsx` – individual dish card with quantity and add-to-order behavior
- `src/OrderForm.jsx` – customer delivery form with validation
- `src/api.js` – async function to fetch menu data from `/dishes.json`
- `src/Card.jsx` – reusable layout wrapper for menu items

## React Concepts Used

- Functional components with hooks
- Props and default props
- PropTypes validation
- State management with `useState`
- Side effects with `useEffect`
- Refs with `useRef` for DOM access and auto-focus
- Async data fetching and promise handling
- AbortController for cleanup and cancellation
- Conditional rendering
- Array filtering and mapping
- List keys in React
- Form validation and controlled inputs
- Component composition and extraction

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

- The app fetches menu data from a `/dishes.json` file, demonstrating async data fetching patterns
- Loading and error states provide feedback during data fetching
- The search input auto-focuses on page load using `useRef`
- AbortController is used to cancel in-flight requests when dependencies change or the component unmounts
