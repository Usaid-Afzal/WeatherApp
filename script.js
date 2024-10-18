// Global variables
let barChart, doughnutChart, lineChart;
let currentPage = 1;
const rowsPerPage = 10;
let weatherData = [];
let filteredData = [];

const apiKey = 'e35ade715eba01a8cd81da5210718fb2';
const geminiApiKey = 'AIzaSyAAlCLxIa_64Z1DeNBFLUlhxBYhHk8ylG8';

// Function to fetch and update weather data
function updateWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") {
                alert("City not found");
                return;
            }

            // Get data for the next 5 days (every 24 hours)
            weatherData = data.list.map(item => ({
                date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                condition: item.weather[0].main,
                temperature: item.main.temp,
                humidity: item.main.humidity
            }));

            filteredData = [...weatherData];

            const fiveDayData = weatherData.filter((item, index) => index % 8 === 0).slice(0, 5);
            const labels = fiveDayData.map(item => item.date);
            const temperatures = fiveDayData.map(item => item.temperature);
            const weatherConditions = fiveDayData.map(item => item.condition);

            // Update the weather widget with current weather (first item in the list)
            updateWeatherWidget(data.city.name, data.list[0]);

            updateCharts(labels, temperatures, weatherConditions);
            displayTableData();
            updatePagination();
        })
        .catch(error => console.log('Error fetching weather data:', error));
}

function updateWeatherWidget(cityName, currentWeather) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
        weatherWidget.innerHTML = `
            <h2>Weather in ${cityName}</h2>
            <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="${currentWeather.weather[0].description}">
            <p>Temperature: ${currentWeather.main.temp.toFixed(1)}°C</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
            <p>Weather: ${currentWeather.weather[0].description}</p>
        `;
        weatherWidget.style.backgroundImage = getBackgroundImage(currentWeather.weather[0].main);
    }
}

function getBackgroundImage(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return "url('sunny.jpg')";
        case 'clouds':
            return "url('cloudy.jpg')";
        case 'rain':
            return "url('rainy.jpg')";
        case 'snow':
            return "url('snow.jpg')";
        case 'thunderstorm':
            return "url('thunderstorm.jpg')";
        default:
            return "url('default.jpg')";
    }
}

function updateCharts(labels, temperatures, weatherConditions) {
    // Destroy existing charts if they exist
    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    createBarChart(labels, temperatures);
    createDoughnutChart(weatherConditions);
    createLineChart(labels, temperatures);
}

function createBarChart(labels, data) {
    const ctx = document.getElementById('barChart');
    if (ctx) {
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    delay: (context) => context.dataIndex * 300
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function createDoughnutChart(conditions) {
    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('doughnutChart');
    if (ctx) {
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(conditionCounts),
                datasets: [{
                    data: Object.values(conditionCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                animation: {
                    delay: (context) => context.dataIndex * 300
                }
            }
        });
    }
}

function createLineChart(labels, data) {
    const ctx = document.getElementById('lineChart');
    if (ctx) {
        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function updateForecastTable(forecastData) {
    weatherData = forecastData.map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        condition: item.weather[0].main,
        temperature: item.main.temp,
        humidity: item.main.humidity
    }));

    currentPage = 1; // Reset to the first page
    displayTableData();
    updatePagination();
}

function displayTableData() {
    const tableBody = document.querySelector("#forecast-table tbody");
    if (tableBody) {
        tableBody.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = filteredData.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.condition}</td>
                <td>${row.temperature.toFixed(1)}°C</td>
                <td>${row.humidity}%</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    const pageInfo = document.getElementById("page-info");
    if (pageInfo) {
        pageInfo.innerText = `Page ${currentPage} of ${Math.ceil(filteredData.length / rowsPerPage)}`;
    }
}

function updatePagination() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (prevButton) prevButton.disabled = currentPage === 1;
    if (nextButton) nextButton.disabled = currentPage === totalPages;
}

// New filtering and sorting functions
function filterRainyDays() {
    filteredData = weatherData.filter(day => day.condition.toLowerCase().includes('rain'));
    currentPage = 1;
    displayTableData();
    updatePagination();
}

function showHighestTemperatureDay() {
    const highestTempDay = weatherData.reduce((max, day) => day.temperature > max.temperature ? day : max);
    filteredData = [highestTempDay];
    currentPage = 1;
    displayTableData();
    updatePagination();
}

function sortTemperaturesDescending() {
    filteredData = [...weatherData].sort((a, b) => b.temperature - a.temperature);
    currentPage = 1;
    displayTableData();
    updatePagination();
}

function sortTemperaturesAscending() {
    filteredData = [...weatherData].sort((a, b) => a.temperature - b.temperature);
    currentPage = 1;
    displayTableData();
    updatePagination();
}

function resetFilters() {
    filteredData = [...weatherData];
    currentPage = 1;
    displayTableData();
    updatePagination();
}

function handleUserQuery(query) {
    if (query.toLowerCase().includes("weather") || query.toLowerCase().includes("temperature")) {
        const cityMatch = query.match(/in\s+(\w+)/);
        if (cityMatch) {
            const city = cityMatch[1];
            fetchWeather(city).then(response => {
                displayChatbotResponse(response);
            });
        } else {
            displayChatbotResponse("Please specify a city for weather information.");
        }
    } else {
        fetchGeminiResponse(query).then(response => {
            displayChatbotResponse(response);
        });
    }
}

function displayChatbotResponse(response) {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) {
        const responseElement = document.createElement('div');
        responseElement.className = 'chatbot-response';
        responseElement.innerText = response;
        chatArea.appendChild(responseElement);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            return `Weather in ${city}: ${data.weather[0].description}, Temperature: ${data.main.temp.toFixed(1)}°C, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            return 'Sorry, I could not fetch the weather information.';
        });
}

function fetchGeminiResponse(prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        return data.candidates[0].content.parts[0].text || 'Sorry, I could not generate a response.';
    })
    .catch(error => {
        console.error('Error fetching Gemini response:', error);
        return 'Sorry, there was an issue with the chatbot.';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const chatForm = document.getElementById('chat-form');

    // Filter and sort buttons
    const rainyDaysButton = document.getElementById('rainy-days-button');
    const highestTempButton = document.getElementById('highest-temp-button');
    const sortDescButton = document.getElementById('sort-desc-button');
    const sortAscButton = document.getElementById('sort-asc-button');
    const resetButton = document.getElementById('reset-filters-button');

    if (searchButton && cityInput) {
        searchButton.addEventListener('click', () => {
            const city = cityInput.value;
            if (city) {
                updateWeatherData(city);
            } else {
                alert("Please enter a city name");
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableData();
                updatePagination();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredData.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayTableData();
                updatePagination();
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const chatInput = document.getElementById('chat-input');
            const userQuery = chatInput.value;
            if (userQuery) {
                handleUserQuery(userQuery);
                chatInput.value = ''; // Clear input field
            }
        });
    }

    // Event listeners for filter and sort buttons
    if (rainyDaysButton) {
        rainyDaysButton.addEventListener('click', filterRainyDays);
    }

    if (highestTempButton) {
        highestTempButton.addEventListener('click', showHighestTemperatureDay);
    }

    if (sortDescButton) {
        sortDescButton.addEventListener('click', sortTemperaturesDescending);
    }

    if (sortAscButton) {
        sortAscButton.addEventListener('click', sortTemperaturesAscending);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    // Initialize with a default city
    updateWeatherData('London');
});