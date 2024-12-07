# Capstone Project Chatbot
-------------

This repository contains a chatbot application built entirely in **React** with **Vite**, designed for interactive conversation and audio synthesis using the **ElevenLabs API**. The application supports dynamic scenarios, speech recognition, and real-time text-to-speech capabilities.

* * * * *

Prerequisites
-------------

Ensure you have the following installed:

-   **Node.js** (v16 or later) - Download and install from: <https://nodejs.org/>
-   **npm** (comes with Node.js)

* * * * *

Installation and Setup
----------------------

### 1\. Clone the Repository

```bash
git clone https://github.com/joseanzacarias/capstone-project-chatbot.git
cd capstone-project-chatbot
```

### 2\. Install Frontend Dependencies

```bash
`npm install`
```

### 3\. Create a `.env` File

Create a `.env` file in the root directory to store your ElevenLabs API key:

```plaintext
`VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key`
```
Replace `your-elevenlabs-api-key` with your ElevenLabs API key.

### 4\. Start the Development Server

```bash
`npm run dev`
```

Access the application at <http://localhost:5173>.

* * * * *

Features
--------

-   **Dynamic Scenarios**: Switch between different chatbot scenarios, each with unique prompts and behaviors.
-   **Speech Recognition**: Powered by the Web Speech API and `react-speech-recognition`, allowing voice input for interactions.
-   **Real-Time Text-to-Speech**: Converts chatbot responses into audio using the ElevenLabs API.
-   **Markdown Support**: Supports markdown formatting in responses for rich-text content.
-   **Feedback Generation**: Automatically generates feedback for completed sessions.
-   **Responsive Design**: Built with Tailwind CSS for a responsive and user-friendly interface.

* * * * *

Tools and Frameworks Used
-------------------------

### Core Frameworks and Libraries

-   **React**: Frontend framework for building user interfaces.
-   **Vite**: Build tool for fast development and optimized production builds.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **React Markdown**: For rendering markdown responses.
-   **Remark GFM**: Adds GitHub Flavored Markdown support.

### APIs and External Libraries

-   **ElevenLabs API**: For text-to-speech synthesis.
-   **React Speech Recognition**: For voice input and real-time speech-to-text conversion.

### Developer Tools

-   **TypeScript**: For type-safe development.
-   **ESLint**: For code linting and ensuring coding standards.
-   **PrimeReact**: For UI components like icons and styles.
-   **Lodash**: For utility functions.

* * * * *

Project Structure
-----------------


```plaintext
`src/
  components/
    Header.tsx             # Handles scenario selection
    ChatArea.tsx           # Displays the chat conversation
    FeedbackArea.tsx       # Manages feedback display
    Controls.tsx           # Provides recording and session control buttons
  scenarios/
    prompts.ts             # Scenario-specific prompts
    feedback-prompt.ts     # Feedback generation prompt
  App.tsx                  # Main application logic
  App.css                  # Global styles`
  ```

* * * * *

Known Issues
------------

1.  **Browser Compatibility**: The Web Speech API (used for speech recognition) is supported primarily in Google Chrome. Use Chrome for the best experience.

* * * * *

Future Improvements
-------------------

-   **Expanded Scenario Support**: Add more scenarios with customizable behaviors.
-   **Accessibility Enhancements**: Improve support for screen readers and keyboard navigation.