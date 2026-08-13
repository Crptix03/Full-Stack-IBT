# Country Facts Application

## Overview
This is a web-based application that allows users to search for countries and retrieve detailed information about them, including capital, population, region, and currencies. The application uses the REST Countries API to fetch real-time country data.

## Features

### index.html
The HTML structure provides a clean user interface with:
- **Title**: "Country Facts" heading
- **Search Form**: An input field and search button for users to enter a country name
  - Input field with id `country-input` for entering the country name
  - Submit button to trigger the search
- **Facts Container**: A div with id `facts` that displays the country information
- **External Script**: Loads `app.js` for all application logic

### app.js
The JavaScript code handles all the application functionality:

**DOM Elements:**
- Selects the facts container, search form, and input field for manipulation

**Render Function:**
- Helper function that creates and appends formatted paragraphs to the facts container
- Takes a label and value, creates a `<p>` tag with bold label text

**showCountry() Function:**
- Displays "Loading..." while fetching data
- Fetches country data from the REST Countries API using `async/await` syntax
- Dynamically searches by country name using `encodeURIComponent()` for URL safety
- **Error Handling**:
  - Checks HTTP response status
  - Handles 403 Forbidden errors (invalid/expired API key)
  - Handles other HTTP errors
  - Validates that country data exists in the response
- **Data Extraction**:
  - Capital (first capital in the array)
  - Population (formatted with commas using `toLocaleString()`)
  - Region
  - Currencies (joined from array)
- Clears previous results before displaying new ones

**Form Submission:**
- Event listener on the search form
- Prevents default form submission behavior
- Validates that input is not empty
- Calls `showCountry()` with the entered country name

**Initial Search:**
- Automatically searches for "Ethiopia" when the page loads

### styles.css
The CSS provides a clean, centered design:
- **Layout**: Centered container with max-width of 500px for readability
- **Typography**: Sans-serif font family
- **Spacing**: 40px top/bottom margin, 20px horizontal padding
- **Search Form**:
  - Uses flexbox layout with 8px gap between elements
  - Input field grows to fill available space (`flex: 1`)
  - 8px padding and 14px font size for the input
- **Button**: 
  - 8px vertical and 16px horizontal padding
  - Cursor changes to pointer on hover
- **Results**:
  - Minimal margin (6px) between fact paragraphs for compact display

## How to Use

1. Open `index.html` in a web browser
2. The page automatically loads and displays facts for Ethiopia
3. Use the search form to look up any other country:
   - Type a country name in the input field
   - Click the "Search" button or press Enter
4. The application displays:
   - Capital city
   - Population (formatted with commas)
   - Region
   - Currencies

## Technologies Used
- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with flexbox layout
- **JavaScript**: ES6+ features (async/await, arrow functions, template literals)
- **REST Countries API**: Free API for fetching country data (https://api.restcountries.com)

## API Information
- **Endpoint**: `https://api.restcountries.com/countries/v5?q={country_name}`
- **Method**: GET with Authorization header
- **Response**: JSON object containing country data including capital, population, region, and currencies

## Error Handling
The application handles various error scenarios:
- Missing or invalid API key (403 Forbidden)
- Country not found (404 or other HTTP errors)
- No data in API response
- Network failures

All errors are displayed to the user and logged to the browser console for debugging.

## Notes
- Requires internet connection to fetch data from the API
- Initial load searches for Ethiopia automatically
- Country names are URL-encoded for safe API requests
- Population numbers are formatted with locale-specific separators (e.g., commas in English)
