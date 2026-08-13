# Text Summarizer Application

## Overview
This is a web-based text summarizer application that allows users to input text and generate AI-powered summaries using the Puter AI API.

## Features

### index.html
The HTML structure provides a user-friendly interface with:
- **Title & Description**: A header explaining the purpose of the application
- **Textarea Input**: A text area where users can paste or type the text they want summarized
- **Buttons**:
  - **Summarize Button** (primary): Triggers the summarization process
  - **Clear Button** (secondary): Clears the input text and hides results
  - **Copy Button** (secondary, small): Copies the summary text to clipboard
- **Result Section**: Displays the generated summary with a styled header
- **Status Message**: Shows feedback messages like "Summarizing..." or error messages
- **External Dependencies**: Uses Puter.js library (`https://js.puter.com/v2/`) for AI API access

### app.js
The JavaScript code handles the application logic:
- **DOM Element Selection**: Retrieves references to all input and output elements
- **Summarize Button Functionality**:
  - Validates that the user has entered text
  - Disables the button and shows "Summarizing..." status while processing
  - Calls `puter.ai.chat()` API with a summarization prompt
  - Displays the result in the result box
  - Shows error messages if the request fails
  - Re-enables the button after completion
- **Clear Button Functionality**: Resets input, hides results, and clears status
- **Copy Button Functionality**: 
  - Copies the summary text to clipboard using `navigator.clipboard.writeText()`
  - Shows "Copied!" feedback that reverts to "Copy" after 1.5 seconds
  - Handles copy errors gracefully

### style.css
The CSS provides a clean, modern design:
- **Layout**: Centered container with flexbox styling
- **Color Scheme**: 
  - Primary blue (#4a6cf7) for main actions
  - Light blue background (#f0f4ff) for results
  - Gray text (#666, #888) for secondary content
- **Components**:
  - **Container**: White box with padding, border-radius, and shadow
  - **Buttons**: Blue primary buttons with hover effects, secondary gray buttons, and disabled states
  - **Textarea**: Styled with borders and padding for better UX
  - **Result Box**: Light blue background with left border accent
  - **Hidden Class**: Toggles visibility of result section
- **Responsive**: Uses flexible widths to adapt to different screen sizes

## How to Use

1. Open the `index.html` file in a web browser
2. Paste or type the text you want summarized in the textarea
3. Click the **Summarize** button
4. Wait for the AI to generate a summary (2-3 sentences)
5. Use the **Copy** button to copy the summary to your clipboard
6. Click **Clear** to reset and summarize more text

## Technologies Used
- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with flexbox and responsive design
- **JavaScript**: ES6+ with async/await for API calls
- **Puter AI API**: Cloud-based AI summarization service

## Notes
- Requires internet connection to access the Puter.js library and AI API
- The summarization is powered by the Puter AI service
- Error handling is included for network and API failures
