# Scryer

A web app that extracts internal links and relevant text content from a specified URL. The extracted data is then sent to Gemini AI for analysis.

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [License](#license)

## Features

- Crawl a given website to extract internal links.
- Scrape title, headings, and body text content.
- Send extracted data to the Gemini AI for analysis.
- Generate a detailed anaylisis report of the website.

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
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application locally:**

   You can test your application locally using:

   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
