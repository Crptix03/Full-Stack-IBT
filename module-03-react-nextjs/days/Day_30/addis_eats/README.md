# Addis Eats

Addis Eats is a small React restaurant-menu application built with Vite. It lets a customer browse dishes, filter the menu by category, add items to a cart, review the order total, and clear or remove cart items.

The project is a Day 30 React exercise focused on component composition, hooks, context, reducers, asynchronous data fetching, and controlled forms.

## What I Built

- A menu for starters, mains, soups, desserts, and drinks
- Category buttons for switching between menu groups
- Dish cards showing each item's name, price, and spicy status
- A reusable `Card` component for menu item layout
- An Add button that increases an item's cart quantity
- A cart badge in the header showing the total number of items
- An order panel with item quantities, prices, the total cost, remove actions, and a clear-cart action
- Menu loading and error states
- An auto-focused menu search input using `useRef`
- A light theme context and theme-specific dish styling
- A delivery form component with name, phone, and delivery-area validation

## How It Works

The app loads menu data from `public/dishes.json`. `Menu` fetches the data through the reusable `useFetch` hook. The hook tracks loading and error states and uses `AbortController` to cancel a request when the component unmounts or its dependencies change.

Cart state is shared through `CartProvider`. The `cartReducer` supports three actions:

- `ADD` adds a dish or increases its quantity
- `REMOVE` removes an item from the cart
- `CLEAR` empties the cart

`Header` and `CheckoutPanel` read the shared cart state through `CartContext`, while `ThemeProvider` makes the current theme available to dish components.

## Project Structure

```text
addis_eats/
├── public/
│   └── dishes.json              # Menu data
├── src/
│   ├── App.jsx                  # Application composition
│   ├── App.css                  # Application styles
│   ├── index.css                # Global styles and theme variables
│   ├── Menu.jsx                 # Menu fetching and category state
│   ├── CategoryBar.jsx           # Category filter buttons
│   ├── DishList.jsx              # Dish collection and empty state
│   ├── Dish.jsx                  # Individual dish display
│   ├── Card.jsx                  # Reusable card wrapper
│   ├── Header.jsx                # App header and cart count
│   ├── CheckoutPanel.jsx         # Cart summary and actions
│   ├── OrderForm.jsx             # Delivery form and validation
│   ├── api.js                    # Menu loading helper
│   ├── cart/
│   │   ├── CartProvider.jsx      # Shared cart context
│   │   ├── cartReducer.js        # Cart state transitions
│   │
│   ├── context/
│   │   └── ThemeContext.jsx      # Theme context provider
│   └── hooks/
│       └── useFetch.js            # Fetch hook used in the cart folder
├── package.json
└── vite.config.js
```

## React Concepts Practiced

- Functional components and props
- `useState` for local state
- `useEffect` for side effects and data fetching
- `useRef` for focusing an input
- `useReducer` for cart and form state
- `useContext` for shared cart and theme state
- `useMemo` and `memo` for derived values and component rendering
- `useCallback` for stable event handlers
- Controlled form inputs and validation
- Conditional rendering for loading, errors, empty carts, and empty categories
- Array filtering, sorting, mapping, and list keys
- Request cancellation with `AbortController`
