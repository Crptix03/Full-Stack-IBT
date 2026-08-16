# 🌍 Country Facts Application - Field Atlas

## Overview

A premium, elegantly-designed web application that allows users to search for countries and discover detailed information about them. The application features a sophisticated "Field Atlas" design aesthetic with a manifest/ledger-style layout, using the REST Countries API to fetch real-time country data.

---

## Project Structure

### Files
- **index.html** - HTML markup with semantic structure
- **app.js** - JavaScript logic for API interaction and dynamic UI rendering
- **styles.css** - Sophisticated styling with custom CSS design system

---

## Features

### 1. **Country Search Functionality**
- Users can search for any country by name
- Real-time form submission with input validation
- Partial search support through the REST Countries API
- Automatic initial search for Ethiopia on page load

### 2. **Premium Design System**
- **Color Palette**: Dark ink background (#101b2d) with gold accents (#c9a227), teal highlights, and coral error states
- **Typography**: Multi-font approach using "Newsreader" (serif), "IBM Plex Mono" (monospace), and "Inter" (sans-serif)
- **Layout**: Centered, focused experience with 480px max-width container

### 3. **Sophisticated UI States**
- **Loading State**: Minimal loading indicator with monospace font
- **Error State**: Highlighted error messages with coral accent and left border
- **Success State**: Fact card with animated entrance, manifest-style ledger rows
- **Manifest/Ledger Design**: Dotted leader lines connecting labels to values (like a vintage ticket or manifest)

### 4. **Data Presentation**
- Country name displayed as italic serif heading in gold
- Organized fact rows with:
  - Uppercase monospace labels (capital, population, region, currencies)
  - Dotted leader lines for visual connection
  - Right-aligned monospace values
- Horizontal divider line under country name

---

## Technical Details

### index.html
The HTML provides a clean, semantic structure:

```
- Header Section:
  - .eyebrow: "Field Atlas" label in teal, monospace, uppercase
  - h1: "Country Facts" main title (serif font)
  
- Search Form:
  - id="search-form": Flex container with border and panel background
  - id="country-input": Text input with placeholder and autocomplete disabled
  - Submit button: Styled with gold background and monospace font
  
- Results Container:
  - id="facts": Container for dynamic country information
  
- Script: Loads app.js for all functionality
```

### app.js
The JavaScript handles all application logic:

#### DOM References
```javascript
- out: #facts container for results
- form: #search-form for submission handling
- input: #country-input for user entry
```

#### Key Functions

**`renderRow(container, label, value)`**
- Creates a styled fact row with three parts:
  - `.fact-label`: Uppercase label text
  - `.fact-leader`: Dotted line that expands to fill space
  - `.fact-value`: Right-aligned value text
- Semantic structure mimics a ledger or manifest format

**`showCountry(name)` - Async Function**
- Sets loading state with "Loading…" message
- Fetches from REST Countries API: `https://api.restcountries.com/countries/v5?q={name}`
- Includes Authorization header with API token
- **Error Handling**:
  - 403 Forbidden: Invalid or expired API key
  - Other HTTP errors: "Country not found"
  - Missing data: "No country data found"
  - All errors displayed in UI and logged to console
  
- **Data Extraction** (from `json.data.objects[0]`):
  - Display name: Common or provided name
  - Capital: First capital from capitals array (or "N/A")
  - Population: Formatted with commas using `toLocaleString()`
  - Region: Direct value from API
  - Currencies: Mapped from array of currency objects, joined with ", "

- **UI Building**:
  - Creates `.fact-card` container with animation
  - Renders h2 with country name (italic, serif, gold)
  - Adds horizontal divider
  - Renders 4 fact rows using `renderRow()` helper
  - Clears previous results before displaying new ones

#### Event Listeners

**Form Submission**
- Prevents default behavior
- Trims and validates input
- Calls `showCountry()` with entered name

**Page Load**
- Automatically searches for "Ethiopia" on page initialization

### styles.css
Comprehensive design system using CSS custom properties and semantic styling:

#### CSS Variables (Color System)
```css
--ink:        #101b2d    (Dark background)
--panel:      #16233a    (Card background)
--panel-line: rgba(255,255,255,0.08)  (Borders/dividers)
--leader:     rgba(255,255,255,0.22)  (Dotted lines)
--gold:       #c9a227    (Primary accent)
--gold-dim:   #a5851c    (Hover state)
--teal:       #3fa796    (Secondary accent)
--coral:      #e2694b    (Error state)
--text:       #f3efe6    (Primary text)
--muted:      #9aa7bd    (Secondary text)
```

#### Layout Components

**Page Container**
- Max-width 480px centered
- 64px top padding, 80px bottom padding for breathing room

**Eyebrow**
- Monospace, uppercase, 0.72rem font size
- Letter-spacing for elegance
- Teal color (#3fa796)

**Main Title (h1)**
- Serif font ("Newsreader"), 2.1rem size
- 600 font weight with negative letter-spacing for luxury feel

**Search Form**
- Flex container with 1px subtle border
- Rounded corners (6px), panel background
- Input expands with `flex: 1`, no border
- Button styled with monospace font, uppercase text
- Dashed left border between input and button
- Hover state with darker gold (#a5851c)
- Focus states with teal outline

**Result States**
- `.loading`: Light gray text with monospace styling
- `.error`: Coral text, left coral border, panel background

**Fact Card**
- Panel background with subtle border
- Smooth "rise" animation (0.2s ease-out)
- Generous padding (22px 24px)
- h2: Italic serif, gold color
- hr: Subtle panel-line color divider

**Fact Rows (Ledger Style)**
- Flex layout with baseline alignment
- Label: Uppercase monospace, muted color
- Leader: Dotted line that flexes to fill space
- Value: Monospace, right-aligned
- Subtle bottom border between rows (except last)
- 11px vertical padding for spacious feel

#### Typography Stack
- **Serif**: "Newsreader", Georgia, serif (headings, country names)
- **Monospace**: "IBM Plex Mono", ui-monospace, monospace (labels, values, buttons)
- **Sans-serif**: "Inter", system-ui, sans-serif (body text fallback)

#### Responsive Behavior
- Mobile-first design with fixed 480px max-width
- 20px horizontal padding on page
- All components sized proportionally

---

## User Experience Flow

1. **Page Load**
   - Displays "Field Atlas" eyebrow and title
   - Shows search form
   - Automatically loads Ethiopia country data

2. **Searching for a Country**
   - User enters country name
   - Form submission triggers `showCountry()`
   - Loading indicator appears ("Loading…")

3. **Successful Result**
   - Fact card appears with smooth animation
   - Country name displayed in gold italic serif
   - Four fact rows displayed in ledger format:
     - Capital
     - Population (formatted)
     - Region
     - Currencies
   - Dotted leader lines connect labels to values

4. **Error Scenarios**
   - Invalid API key: "403 Forbidden" message
   - Country not found: Error displayed in coral
   - Network failure: Error message shown
   - All errors logged to console for debugging

---

## API Details

### Endpoint
```
https://api.restcountries.com/countries/v5?q={country_name}
```

### Request
- **Method**: GET
- **Authorization**: Bearer token in headers
- **Query**: URL-encoded country name

### Response Structure
```json
{
  "data": {
    "objects": [
      {
        "name": { "common": "...", ... },
        "capitals": [{ "name": "..." }],
        "population": 1234567,
        "region": "...",
        "currencies": [{ "name": "..." }]
      }
    ]
  }
}
```

---

## Browser Compatibility

Requires modern browser supporting:
- ES6+ JavaScript (async/await, arrow functions)
- CSS Grid and Flexbox
- CSS Variables (custom properties)
- Fetch API
- Focus-visible pseudo-class

---

## Installation & Usage

1. Open `index.html` in a modern web browser
2. Application automatically loads Ethiopia data
3. Enter any country name in the search field
4. Click "Search" or press Enter
5. View detailed country information in the fact card

---

## Design Philosophy

The application embraces a **premium, editorial aesthetic** inspired by:
- Vintage field guides and atlases
- Ledger and manifest design patterns
- Modern luxury web design
- Restrained color palette with strategic accent colors
- Typography-focused hierarchy
- Generous whitespace and breathing room

---

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Custom properties, Flexbox, animations
- **JavaScript**: ES6+ (async/await, arrow functions, template literals, destructuring)
- **REST Countries API**: Country data source (https://api.restcountries.com)

---

## Notes

- Requires internet connection for API requests
- Initial load automatically searches for Ethiopia
- Country names are URL-encoded for safe API requests
- Population formatted with locale-specific number formatting
- All errors logged to browser console for debugging
- Elegant error states with coral highlighting
- Smooth animations for professional feel