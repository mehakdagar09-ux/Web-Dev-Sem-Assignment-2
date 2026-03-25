const API_KEY = "63a961253676e7015815ada73c1cab49";

const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const searchBtn = document.getElementById("searchBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

/* ---------- WEATHER FETCH ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
        throw new Error("City not found");
    }
    const data = await res.json();
    return data;
}

/* ---------- BUTTON CLICK ---------- */
searchBtn.onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};

/* ---------- CLEAR HISTORY ---------- */
clearHistoryBtn.onclick = () => {
    if (confirm("Are you sure you want to clear search history?")) {
        localStorage.removeItem("weatherHistory");
        showHistory();
    }
};

/* ---------- UI RENDER WITH ANIMATIONS ---------- */
function renderWeather(d) {
    const weatherDescription = d.weather[0].description;
    const weatherMain = d.weather[0].main;
    const temp = Math.round(d.main.temp);
    const feelsLike = Math.round(d.main.feels_like);
    const humidity = d.main.humidity;
    const windSpeed = d.wind.speed;
    const pressure = d.main.pressure;
    const visibility = (d.visibility / 1000).toFixed(1);

    weatherBox.innerHTML = `
        <div class="weather-item city">
            <label>📍 Location</label>
            <span>${d.name}, ${d.sys.country}</span>
            <p class="weather-description">${weatherMain} - ${weatherDescription}</p>
        </div>
        
        <div class="weather-info-grid">
            <div class="weather-item">
                <label>🌡️ Temperature</label>
                <span>${temp}°C</span>
                <p class="weather-description">Feels like ${feelsLike}°C</p>
            </div>

            <div class="weather-item">
                <label>💨 Wind Speed</label>
                <span>${windSpeed}</span>
                <p class="weather-description">m/s</p>
            </div>

            <div class="weather-item">
                <label>💧 Humidity</label>
                <span>${humidity}%</span>
                <p class="weather-description">Current moisture</p>
            </div>

            <div class="weather-item">
                <label>🔽 Pressure</label>
                <span>${pressure}</span>
                <p class="weather-description">hPa</p>
            </div>

            <div class="weather-item">
                <label>👁️ Visibility</label>
                <span>${visibility}</span>
                <p class="weather-description">km</p>
            </div>

            <div class="weather-item">
                <label>☀️ UV Index</label>
                <span>${d.clouds ? d.clouds.all : 'N/A'}%</span>
                <p class="weather-description">Cloud coverage</p>
            </div>
        </div>
    `;
}

/* ---------- SHOW LOADING STATE ---------- */
function showLoading() {
    weatherBox.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Fetching weather data...</p>
        </div>
    `;
}

/* ---------- SHOW ERROR STATE ---------- */
function showError(message) {
    weatherBox.innerHTML = `
        <div class="empty-state">
            <p style="font-size: 48px;">❌</p>
            <p style="color: #ff6b6b; font-size: 16px; text-align: center;">
                ${message}
            </p>
            <p style="color: var(--text-secondary); font-size: 13px;">
                Please try another city
            </p>
        </div>
    `;
}

/* ---------- SAVE SEARCH HISTORY ---------- */
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    // Remove duplicate if city already exists
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
    // Add city to the beginning
    history.unshift(city);
    // Keep only last 10 searches
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
function showHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    historyBox.innerHTML = "";
    
    if (history.length === 0) {
        historyBox.innerHTML = '<p class="history-placeholder">No search history yet</p>';
        return;
    }
    
    history.forEach((city, index) => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.style.animationDelay = `${index * 0.05}s`;
        btn.onclick = () => {
            cityInput.value = city;
            search(city);
        };
        historyBox.appendChild(btn);
    });
}

/* ---------- SEARCH FUNCTION ---------- */
async function search(city) {
    showLoading();
    cityInput.value = city;
    
    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        showError(error.message);
    }
}

/* ---------- ENTER KEY SEARCH ---------- */
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            search(city);
        }
    }
});

/* ---------- INITIAL LOAD ---------- */
showHistory();