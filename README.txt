Weather Dashboard with Chatbot
This is a web-based weather dashboard application that provides weather forecasts for various cities using the OpenWeather API. It features interactive charts to visualize temperature trends and weather conditions, as well as a chatbot that can handle weather-related and general queries using the OpenWeather and Gemini APIs.

Features

Weather Forecast Dashboard

Displays a 5-day weather forecast for a specified city.
Provides temperature, weather conditions, and humidity details.
Uses interactive charts to present the data:
Bar chart for temperature forecast.
Doughnut chart for weather conditions percentage.
Line chart for temperature trends.
Changes background image based on current weather conditions.

Chatbot Integration

Chatbot interface allows users to ask weather-related and general questions.
Handles weather queries using the OpenWeather API.
Uses the Gemini API for non-weather-related queries.

Tables and Pagination

Shows a table with a temperature forecast for the next 5 days.
Includes pagination for large data sets.

Responsive Design

Features a sidebar with navigation options (Dashboard, Tables).
Chatbot is integrated into the layout, next to the forecast table.

Technologies Used

Frontend: HTML, CSS, JavaScript

APIs:
OpenWeather API for weather data.
Gemini API for general query handling.

Libraries:
Chart.js for rendering charts.

Getting Started

Prerequisites
To run this project, you need:

A web browser.
An OpenWeather API key.
A Gemini API key.

Usage

Weather Dashboard

Enter a city name in the search bar and click "Get Weather" to display the weather forecast.
The dashboard will update with the latest weather information and interactive charts.
Chatbot

Type a question in the chatbot's input field and click "Send."
The chatbot will respond to weather-related queries using the OpenWeather API, and other queries using the Gemini API.