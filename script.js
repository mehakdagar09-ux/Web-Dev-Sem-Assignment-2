const API_KEY = "63a961253676e7015815ada73c1cab49";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
8
/* ---------- WEATHER FETCH ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
        alert("city not found");
        throw new Error("City not found");
    }
    const data = await res.json();
    return data;
}

/* ---------- BUTTON CLICK ---------- */
document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};

/* ---------- UI RENDER ---------- */
function renderWeather(d) {
    weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${d.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind Speed</label><span>${d.wind.speed} m/s</span></div>
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
    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.onclick = () => {
            cityInput.value = city;
            search(city);
        };
        historyBox.appendChild(btn);
    });
}

/* ---------- SEARCH FUNCTION ---------- */
async function search(city) {
    weatherBox.innerHTML = "";
    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
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