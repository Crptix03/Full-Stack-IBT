# Addis Market Shopping List

## Overview
This is a functional shopping list application that allows users to add items with prices, mark items as bought, delete items, and automatically calculate the total cost of unbought items. The application uses Ethiopian Birr (ETB) as the currency.

## Features

### index.html
The HTML structure provides a clean interface with:
- **Title**: "Addis Market Shopping List" heading
- **Add Form** (id: `add-form`):
  - Text input for item name with placeholder "Item name"
  - Number input for price in ETB with step of 0.01 for decimal precision
  - Submit button to add items to the list
  - Both inputs are required fields
- **Shopping List** (id: `list`):
  - Unordered list that dynamically displays added items
  - Initially empty and populated via JavaScript
- **Total Display**:
  - Shows "Total:" label followed by the sum of unbought items
  - Displays in format "X.XX ETB"
  - Dynamically updates when items are added, deleted, or marked as bought

### app.js
The JavaScript code handles all application logic and interactivity:

**DOM Element Selection:**
- Selects form, name input, price input, list container, and total display elements

**Form Submission Handler:**
- Prevents default form submission behavior
- Trims whitespace from item name
- Converts price to a number
- Validates that both name and price are provided
- Calls `addRow()` to add item to list
- Resets the form for next entry
- Updates the total

**List Click Handler:**
- Uses event delegation with `closest()` to detect clicks on list items
- **Delete functionality**: 
  - Clicks on the delete button (class "del") remove the entire item
  - Updates total after deletion
- **Toggle functionality**:
  - Clicks on the item itself toggle the "bought" class
  - Bought items are visually marked but NOT removed from list

**addRow() Function:**
- Creates a new `<li>` element for each item
- Stores the price in a `data-price` attribute on the list item
- Creates a `<span>` displaying the formatted item name and price
- Creates a delete button with "x" text and "del" class
- Appends both elements to the list item, then to the list

**updateTotal() Function:**
- Selects all list items that do NOT have the "bought" class
- Uses `reduce()` to sum prices from remaining (unbought) items
- Updates the total display with 2 decimal places using `toFixed(2)`
- Automatically excludes bought items from the total calculation

### style.css
The CSS provides a clean, functional design:

**Layout:**
- **Body**: Sans-serif font, centered with max-width of 400px for readability
- **Margins & Padding**: 40px top/bottom margin, 20px horizontal padding

**Form Styling:**
- Uses flexbox layout with 8px gap between elements
- **Name input** (flex: 2): Takes up twice the space of price input
- **Price input** (flex: 1): Takes up one unit of space
- **Inputs & Buttons**: 8px padding, 14px font size for comfortable interaction

**List Styling:**
- Removes default bullet points with `list-style: none`
- **List Items**:
  - Flexbox layout with `space-between` to separate item text and delete button
  - Vertically centered with `align-items: center`
  - 10px padding for breathing room
  - Border-bottom creates visual separation between items
  - Cursor changes to pointer to indicate interactivity
- **Bought Items**:
  - Strikethrough text decoration
  - Gray color (#999) to visually distinguish completed items

**Delete Button:**
- Red background (#e74c3c) with white text
- Rounded corners (4px border-radius)
- 4px vertical and 8px horizontal padding
- Cursor changes to pointer on hover

**Total Display:**
- Bold text to emphasize the total cost

## How to Use

1. Open `index.html` in a web browser
2. **Add items**:
   - Enter the item name in the first input field
   - Enter the price in ETB in the second input field
   - Click "Add" button or press Enter
3. **Mark items as bought**:
   - Click on any item in the list to toggle the strikethrough effect
   - Bought items are grayed out and excluded from the total
4. **Delete items**:
   - Click the "x" button on the right side of any item to remove it completely
5. **View total**:
   - The total automatically updates to show only the cost of unbought items

## Technologies Used
- **HTML5**: Semantic markup for structure
- **CSS3**: Flexbox layout, responsive styling
- **JavaScript**: 
  - DOM manipulation and event handling
  - Array methods (`reduce()`, `querySelector()`, `querySelectorAll()`)
  - Template literals for string formatting
  - Data attributes for storing prices

## Key JavaScript Concepts Demonstrated
- **Event Delegation**: Single event listener for multiple list items
- **Closest Method**: Finding the nearest parent element matching a selector
- **Dataset API**: Storing and retrieving data from HTML elements
- **Array Reduce**: Summing up prices
- **String Formatting**: Using `toFixed()` for decimal precision
- **CSS Class Toggle**: Using `classList.toggle()` for visual state changes

## Features Explanation

### Automatic Total Calculation
- Only unbought items count toward the total
- Bought items remain visible but are excluded from the calculation
- Total updates instantly when items are added, deleted, or toggled

### Data Persistence Limitation
- Note: This application does NOT save data to local storage
- Refreshing the page will clear all items
- To add persistence, you could implement localStorage functionality

### Currency
- All prices are in Ethiopian Birr (ETB)
- Prices display with 2 decimal places for accuracy
- Number input allows decimal values with 0.01 step precision

## Notes
- Item names and prices are validated before adding
- Empty submissions are prevented
- Delete button provides immediate removal with visual feedback
- Bought items toggle provides a way to organize without losing the item record
