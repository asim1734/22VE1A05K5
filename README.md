# 22VE1A05K5

An Express microservice to shortern urls

# URL Shortener Microservice

This is a simple URL shortener microservice built with Express.js and the native MongoDB driver, featuring URL shortening, redirection, analytics, and structured logging.

## API Endpoints Showcase

### 1. Shorten URL

This endpoint allows you to convert a long URL into a short, manageable one, with optional validity and custom shortcodes.

![Shorten URL Response](outputs/shortenUrl.png)

### 2. Get Long URL (Redirection)

When a user accesses a shortened URL, they are redirected to the original long URL.

![Get Long URL Redirection](outputs/getLongUrl.png)

### 3. Short ID Analytics

Retrieve detailed usage statistics for any shortened URL, including click counts, creation/expiry dates, and last access time.

![Short ID Analytics Response](./outputs/shortidAnalytics.png)

### 4. Logs

![Logs](./outputs/logOutput.png)

## Architecture

├── Backend-Test-S.../  # Contains the main Express.js application
│   ├── app.js          # Main application entry point
│   ├── config/         # Database connection configuration
│   ├── controllers/    # Handles API request logic
│   ├── routes/         # Defines API endpoints
│   └── services/       # Contains core business logic (e.g., URL creation)
└── logging-middlw.../  # Contains the reusable logging middleware
├── loggingMiddleware.js # Express middleware for logging
    |utils
    └── logger.js            # Utility function for sending structured logs
