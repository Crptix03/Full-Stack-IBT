# Addis Eats

This project is a React menu application. The work in the main files is described below.

## Card.jsx

- Created a reusable `Card` component.
- Accepts `children` so different content can be placed inside the card.
- Wraps its content in a `div` with the `card` CSS class.
- Used as a layout component around each dish.

## Dish.jsx

- Created a reusable `Dish` component for displaying one menu item.
- Receives `name`, `price`, `currency`, and `spicy` as props.
- Uses `ETB` as the default currency.
- Uses `false` as the default value for `spicy`.
- Displays a spicy badge only when the dish is marked as spicy.
- Added PropTypes validation for the dish name, price, and spicy status.

## data.js

- Created the menu data array used by the application.
- Each menu item includes an `id`, `name`, `category`, `price`, and `spicy` value.
- Added menu categories for starters, mains, soups, desserts, and drinks.
- Exported the data so it can be imported by the `Menu` component.

## Menu.jsx

- Created the main menu component.
- Added category buttons for filtering the menu.
- Used React `useState` to track the selected category.
- Set `mains` as the initial category.
- Used `filter()` to display only dishes from the selected category.
- Used `map()` to render each filtered dish.
- Wrapped every dish in a `Card` component.
- Passed dish information from `data.js` to the `Dish` component.
- Added an empty-state message when a category has no dishes.
- Used each item's unique `id` as the React list key.

## React Concepts Practiced

- Functional components
- Props and default props
- PropTypes validation
- Component composition
- State with `useState`
- Conditional rendering
- Array filtering and mapping
- React list keys
