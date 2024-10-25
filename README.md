# Weather App

This is a React-based weather application that fetches and displays weather information for major Indian cities (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad) using the OpenWeatherMap API. The app updates the weather data every 5 minutes and is styled with Tailwind CSS.

## Features

- Displays weather information for multiple cities.
- Shows key weather metrics: Main weather condition, Temperature, Feels Like temperature, and Date/Time.
- Automatic data refresh every 5 minutes.
- Responsive and visually appealing UI with a blue gradient theme.

## Tech Stack

- *React*: Front-end JavaScript library for building user interfaces.
- *Tailwind CSS*: Utility-first CSS framework for styling.
- *Axios*: Promise-based HTTP client for making API requests.
- *OpenWeatherMap API*: Source of real-time weather data.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   > git clone https://github.com/Sanidhyavj/Zeotap-Weather-App.git
   >
   > cd weather-app

2. Install dependencies:

   > npm install

3. Start the development server:

   > npm start

   The app should now be running on http://localhost:3000.

## Usage

Once the application is running:

- The homepage will display weather information for six major Indian cities.
- Weather data for each city includes the main weather condition, temperature, feels like temperature, and the last updated date and time.
- The data will automatically refresh every 5 minutes.

## Configuration

You can change the list of cities by modifying the cities array in the App.js file.

## Deployment

To deploy the application, you can follow the standard deployment process for React applications using platforms like Netlify, Vercel, or GitHub Pages.
