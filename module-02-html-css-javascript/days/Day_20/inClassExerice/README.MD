# 🎬 Movie & Series Search Application

## Overview

A modern, responsive web application that allows users to search for movies and TV series using the TMDB (The Movie Database) API. The application features a sleek dark-themed UI with real-time search results, error handling, and loading states.

---

## Project Structure

### Files

- **index.html** - HTML markup and structure
- **app.js** - JavaScript logic for API interaction and DOM manipulation
- **style.css** - Styling and responsive design

---

## Features

### 1. **Search Functionality**

- Users can search for movies and TV series by title
- Real-time form submission with validation
- Supports partial matches and various search terms

### 2. **API Integration**

- Integrates with TMDB API (`https://api.themoviedb.org/3/search/multi`)
- Uses Bearer token authentication
- Fetches both movies and TV series data
- Handles multiple API response formats for flexibility

### 3. **User Interface States**

- **Loading State**: Displays a spinner while fetching results
- **Empty State**: Shows message when no results are found
- **Error State**: Displays error messages with a retry button
- **Results State**: Grid layout of movie/series cards

### 4. **Responsive Design**

- Mobile-first approach with flexible grid layout
- Auto-fill grid with minimum card width of 200px
- Adapts to all screen sizes
- Touch-friendly button and input sizing

---

## Technical Details

### index.html

The HTML file provides the structure for the application:

- **Header Section**: App title and subtitle
- **Search Form**: Input field and submit button with proper form semantics
- **State Containers**: Separate divs for loading, error, and empty states
- **Results Grid**: Container for dynamically rendered movie cards
- **Script Imports**: Links to app.js for functionality

### app.js

The JavaScript file handles all application logic:

#### Key Variables

- `API_URL`: TMDB search endpoint
- `API_OPTIONS`: Request headers with authentication token
- `lastQuery`: Tracks the most recent search for retry functionality

#### Main Functions

- **searchMovies(query)**: Fetches data from API, handles errors, and manages UI state
- **extractMovies(data)**: Filters and extracts movie/series data from various API response formats
- **renderMovies(movies)**: Dynamically creates and appends movie cards to the DOM
- **showState(state)**: Toggles visibility of loading, error, and empty states
- **setLoadingUI(isLoading)**: Updates button state during API requests

#### Event Listeners

- Form submission triggers search
- Retry button re-runs the last search

#### Error Handling

- Network error catching with descriptive messages
- JSON parsing error handling
- HTTP status code validation
- Fallback SVG poster for missing images

### style.css

Comprehensive styling for a modern dark-themed interface:

#### Design Elements

- **Color Scheme**: Dark background (#0f0f1a) with purple accent (#7c5cff)
- **Typography**: Segoe UI/Roboto font family for clean appearance
- **Layout**: CSS Grid for responsive card arrangement

#### Key Components

- **Search Form**: Flex layout with smooth focus transitions
- **Movie Cards**:
  - 2:3 aspect ratio for poster images
  - Type badges (Movie/Series) with color coding
  - Hover effects with subtle upward translation
  - Truncated overview text with -webkit-line-clamp
  - Flexible info section that expands to fill available space

- **Loading Spinner**: CSS animation rotating at 0.8s intervals
- **State Boxes**: Centered messaging with appropriate spacing
- **Buttons**: Styled with hover and disabled states

#### Responsive Features

- Mobile-friendly padding and margins
- Flexible input field with flex: 1
- Auto-fill grid that adjusts column count based on viewport
- Maximum container width of 1000px with centered alignment

---

## API Details

### TMDB API Endpoint

- **URL**: `https://api.themoviedb.org/3/search/multi`
- **Method**: GET
- **Authentication**: Bearer Token (included in headers)
- **Query Parameter**: `query` - the search term

### Response Format

The API returns results that may include movies, TV series, and people. The application filters out people and displays only movies and TV series with:

- Title/Name
- Poster image
- Release/Air date
- Overview/Description
- Media type

---

## User Experience Flow

1. **User enters search term** in the search input
2. **Form submission** triggers searchMovies()
3. **Loading spinner appears** while fetching from API
4. **API returns results** or error
5. **Results displayed** in grid layout with:
   - Movie/Series type badge
   - Poster image (or fallback SVG)
   - Title
   - Release/Air date
   - Overview text (truncated to 3 lines)
6. **Interactive elements**:
   - Cards scale up on hover
   - Images lazy-load for performance
   - Retry button available if error occurs

---

## Browser Compatibility

- Modern browsers supporting:
  - Fetch API
  - CSS Grid
  - CSS Flexbox
  - CSS Animations
  - Lazy loading attribute

---

## Future Enhancement Ideas

- Add genre filtering
- Implement pagination for large result sets
- Add favorites/bookmarks feature
- Display detailed movie/series information
- Add sorting options (by rating, year, etc.)
- Implement local storage for search history
