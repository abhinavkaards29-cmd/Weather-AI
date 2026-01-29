const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const input = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const voiceBtn = document.getElementById("voiceBtn");

const current = document.getElementById("current");
const forecast = document.getElementById("forecast");
const mapBox = document.getElementById("mapBox");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const forecastList = document.getElementById("forecastList");
const map = document.getElementById("map");

let spokenText = "";

searchBtn.addEventListener("click", () => {
  const q = input.value.trim();
  if (!q) return alert("Enter a location");
  loadWeather(q);
});

voiceBtn.addEventListener("click", () => {
  if (!spokenText) return;
  const utter = new SpeechSynthesisUtterance(spokenText);
  speechSynthesis.speak(utter);
});

async function loadWeather(query) {
  try {
    // GEOCODING (city / area / state / country)
    const geo = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`
    ).then(r => r.json());

    if (!geo[0]) throw new Error("Location not found");

    const { lat, lon, name, state, country } = geo[0];

    // WEATHER
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
    ).then(r => r.json());

    placeEl.textContent =
      `${name}${state ? ", " + state : ""}, ${country}`;
    tempEl.textContent = `${Math.round(data.current.temp)}°C`;
    descEl.textContent = data.current.weather[0].description;
    feelsEl.textContent = `Feels ${data.current.feels_like}°C`;
    humidityEl.textContent = `Humidity ${data.current.humidity}%`;
    windEl.textContent = `Wind ${data.current.wind_speed} m/s`;

    spokenText = `Weather in ${name}. Temperature ${Math.round(
      data.current.temp
    )} degrees. ${data.current.weather[0].description}.`;

    current.classList.remove("hidden");

    // FORECAST
    forecastList.innerHTML = "";
    data.daily.slice(0, 7).forEach(d => {
      const day = new Date(d.dt * 1000).toDateString().slice(0, 10);
      const div = document.createElement("div");
      div.innerHTML = `<span>${day}</span><span>${Math.round(
        d.temp.day
      )}°C</span>`;
      forecastList.appendChild(div);
    });
    forecast.classList.remove("hidden");

    // MAP
    map.src =
      `https://maps.google.com/maps?q=${lat},${lon}&z=11&output=embed`;
    mapBox.classList.remove("hidden");

  } catch (e) {
    alert(e.message);
  }
}
