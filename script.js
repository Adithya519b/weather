// 0d36c6e4d5143385e1246c089d8f2323
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
// 66a5adad0d402c56b50aea5814aa19f3
const apiKey = "0d36c6e4d5143385e1246c089d8f2323";

// elements
const btn = document.querySelector("button");
const cityInput = document.getElementById("city");

const temp = document.querySelector("h1 span");
const statusTxt = document.getElementById("status");
const pressureTxt = document.getElementById("pressure");
const windTxt = document.getElementById("wind");
const sunriseTxt = document.getElementById("sunrise");
const humidityTxt = document.getElementById("humidity");
const visibilityTxt = document.getElementById("visibility");
const sunsetTxt = document.getElementById("sunset");

btn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if(city === "") {
        alert("Enter city name");
        return;
    }
    getWeather(city);
});

async function getWeather(city) {
    try {
        // Step 1 → get latitude & longitude from city name
        const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoRes = await fetch(geoURL);
        const geoData = await geoRes.json();

        if (geoData.length === 0) {
            alert("City not found");
            return;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Step 2 → get weather using lat & lon
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherRes = await fetch(weatherURL);
        const data = await weatherRes.json();

        updateUI(data);

    } catch (err) {
        alert("Error fetching weather");
        console.log(err);
    }
}

function updateUI(data) {
    temp.innerHTML = `${Math.round(data.main.temp)} °C`;
    statusTxt.innerHTML = data.weather[0].main;

    pressureTxt.innerHTML = "pressure "+data.main.pressure + " hPa";
    windTxt.innerHTML = "Wind speed "+data.wind.speed + " m/s";
    humidityTxt.innerHTML = "Humidity "+data.main.humidity + " %";
    visibilityTxt.innerHTML ="Visibility "+ (data.visibility / 1000) + " km";

    // convert sunrise & sunset time
    sunriseTxt.innerHTML = "Sunrise "+convertTime(data.sys.sunrise);
    sunsetTxt.innerHTML = "Sunset "+convertTime(data.sys.sunset);
}

function convertTime(unix) {
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString();
}