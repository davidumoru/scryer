# Scryer

This project is a Node.js-based web crawler and scraper that extracts internal links and relevant text content from a specified URL. The extracted data is then sent to Gemini AI for analysis.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- Crawl a given website to extract internal links.
- Scrape title, headings, and body text content.
- Send extracted data to the Gemini AI for analysis.

## Technologies Used

- Node.js
- Axios (for making HTTP requests)
- Cheerio (for parsing and manipulating HTML)
- Google Generative AI (Gemini AI integration)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/davidumoru/scryer.git
   cd scryer/server
   ```

2. **Install dependencies:**

   Make sure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add your Gemini API key:

   ```plaintext
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application locally:**

   You can test your application locally using:

   ```bash
   npm start
   ```

## Usage

To use the web crawler and scraper, send a POST request to the API endpoint `/api/crawl` with a JSON body containing the URL you want to crawl:

```json
{
    "url": "https://davidumoru.me"
}
```

## API Endpoints

- **POST `/api/crawl`**

  - **Description:** Crawls the specified URL and scrapes the internal links and text content.
  - **Request Body:**

    ```json
    {
      "url": "https://davidumoru.me"
    }
    ```

  - **Response:**
    - Success: Returns a JSON object with the results.
    - Error: Returns an error message if the operation fails.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
