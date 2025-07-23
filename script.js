const API_KEY = 'your_openweathermap_api_key'; // You'll need to get this from OpenWeatherMap
const weatherContainer = document.getElementById('weatherContainer');
const locationInput = document.getElementById('locationInput');

// For demo purposes, we'll use mock data since API key is needed
const mockWeatherData = {
    name: "New York",
    main: {
        temp: 22,
        feels_like: 25,
        humidity: 65,
        pressure: 1013
    },
    weather: [{
        main: "Clear",
        description: "clear sky",
        icon: "01d"
    }],
    wind: {
        speed: 3.5
    },
    visibility: 10000
};

function displayLoading() {
    weatherContainer.innerHTML = '<div class="loading">🌍 Fetching weather data...</div>';
}

function displayError(message) {
    weatherContainer.innerHTML = `<div class="error">❌ ${message}</div>`;
}

function getWeatherIcon(weatherMain) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌫️',
        'Fog': '🌫️',
        'Sand': '🌫️',
        'Ash': '🌫️',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return icons[weatherMain] || '🌤️';
}

function displayWeather(data) {
    const icon = getWeatherIcon(data.weather[0].main);
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const visibility = (data.visibility / 1000).toFixed(1);
    
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <div class="weather-icon">${icon}</div>
            <div class="location">${data.name}</div>
            <div class="temperature">${temp}°C</div>
            <div class="description">${data.weather[0].description}</div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Feels like</div>
                    <div class="detail-value">${feelsLike}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${data.main.humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${data.wind.speed} m/s</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Visibility</div>
                    <div class="detail-value">${visibility} km</div>
                </div>
            </div>
        </div>
    `;
}

async function fetchWeatherByCity(city) {
    displayLoading();
    
    // For demo purposes, we'll simulate an API call and return mock data
    // In a real implementation, you would use:
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    setTimeout(() => {
        try {
            // Simulate different cities with different weather
            const cityWeatherData = {
                ...mockWeatherData,
                name: city,
                main: {
                    ...mockWeatherData.main,
                    temp: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
                }
            };
            displayWeather(cityWeatherData);
        } catch (error) {
            displayError('City not found. Please try again.');
        }
    }, 1000);
}

async function fetchWeatherByCoords(lat, lon) {
    displayLoading();
    
    // For demo purposes, we'll simulate an API call
    // In a real implementation, you would use:
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
    setTimeout(() => {
        try {
            const locationWeatherData = {
                ...mockWeatherData,
                name: "Your Location",
                main: {
                    ...mockWeatherData.main,
                    temp: Math.floor(Math.random() * 25) + 10,
                }
            };
            displayWeather(locationWeatherData);
        } catch (error) {
            displayError('Unable to fetch weather data for your location.');
        }
    }, 1000);
}

function searchWeather() {
    const city = locationInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        displayError('Please enter a city name.');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        displayLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            error => {
                let errorMessage = 'Unable to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                displayError(errorMessage);
            },
            {
                timeout: 10000,
                enableHighAccuracy: true
            }
        );
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
}

// Allow Enter key to search
locationInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Load default weather on page load
window.addEventListener('load', () => {
    fetchWeatherByCity('London');
});

/* 
TO USE WITH REAL API:

1. Get a free API key from OpenWeatherMap (https://openweathermap.org/api)
2. Replace 'your_openweathermap_api_key' with your actual API key
3. Uncomment the real fetch calls in fetchWeatherByCity and fetchWeatherByCoords functions
4. Remove the setTimeout mock implementations

Real API endpoints:
- By city: https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
- By coordinates: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
*/