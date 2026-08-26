# Day 26 - React Components with Props

## Project Overview

This project demonstrates core React concepts including components, props, array rendering, and component composition by building a simple food ordering app called "Royal Bistro."

---

## App.jsx - Main Application Component

### What Was Done:

1. **Imported the Dish Component**
   - Imported the `Dish` child component to use it in the App

2. **Created a Header Component**
   - Built a header with the restaurant name "Royal Bistro"
   - Added a navigation bar with Home and Contact links
   - Added a welcome message for the food ordering app

3. **Created a Menu Data Array**
   - Defined a `menu` array containing multiple dish objects
   - Each dish object contains: `id`, `name`, and `price` properties
   - Example dishes: kitfo, shiro, and kikl (Ethiopian dishes)

4. **Rendered Dishes Using Array.map()**
   - Used the `.map()` method to loop through the menu array
   - Passed each dish's data as props to the Dish component
   - Used the unique `id` as the key prop for proper React list rendering
   - Each dish is rendered with its name and price passed as props

5. **Component Composition**
   - Combined the Header component and mapped Dish components in the main App
   - Applied CSS class names for styling ("container")

---

## Dish.jsx - Menu Item Component

### What Was Done:

1. **Created a Functional Component with Props Destructuring**
   - Defined the `Dish` component that accepts `name` and `price` as destructured props
   - Used destructuring syntax: `function Dish({name, price})` instead of receiving a props object

2. **Rendered Dish Information**
   - Displayed "Our Menu" heading in each dish card
   - Showed the dish name from the `name` prop
   - Showed the dish price with the currency "birr" (Ethiopian currency)

3. **Applied Styling**
   - Used the CSS class "Dishes" for component styling

4. **Alternative Approach**
   - Included commented code showing the alternative method using a props object
   - This demonstrates props can be received as: `function Dish(props)` and then accessed as `props.name` and `props.price`

---

## Key Concepts Learned

- **Props**: Passing data from parent (App) to child (Dish) components
- **Props Destructuring**: Extracting specific props directly in function parameters
- **Array Rendering**: Using `.map()` to render lists of components
- **React Keys**: Using unique identifiers for list items (best practice for React rendering)
- **Component Composition**: Building larger interfaces from smaller, reusable components
- **Functional Components**: Creating components as JavaScript functions
