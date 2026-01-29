document.addEventListener("DOMContentLoaded", () => {
const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee";

const saveFavBtn = document.getElementById("saveFavBtn");
const favoritesDiv = document.getElementById("favorites");

const hourlyDiv = document.getElementById("hourlyForecast");
let lastWeatherData = null;
let lastSearchQuery = "";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");

const placeName = document.getElementById("placeName");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const extraEl = document.getElementById("extra");
const card = document.getElementById("weatherCard");

let map, marker;

searchBtn.onclick = () => searchByCity(cityInput.value);
locBtn.onclick = () =>
  navigator.geolocation.getCurrentPosition(p =>
    searchByCoords(p.coords.latitude, p.coords.longitude)
  );

const aiBtn = document.getElementById("aiBtn");

if (aiBtn) {
  aiBtn.onclick = () => {
    if (!lastWeatherData) return;
    // existing AI logic
  };
}

  if (!lastWeatherData) return;

  const t = lastWeatherData.main.temp;
  const h = lastWeatherData.main.humidity;
  const w = lastWeatherData.wind.speed;
  const d = lastWeatherData.weather[0].description;

  let msg = `Current weather shows ${d}. `;

  if (t < 10) msg += "It is cold, wear warm clothes. ";
  else if (t < 20) msg += "The weather is cool and comfortable. ";
  else if (t < 30) msg += "It feels warm, light clothing is ideal. ";
  else msg += "It is very hot, stay hydrated and avoid sun exposure. ";

  if (h > 70) msg += "High humidity may cause discomfort. ";
  else msg += "Humidity levels are comfortable. ";

  if (w > 8) msg += "Windy conditions may affect travel. ";
  else msg += "Winds are calm. ";

  msg += "Overall, outdoor activity is ";
  msg += (t > 35 || h > 80) ? "not recommended for long periods." : "generally safe.";

  document.getElementById("aiText").textContent = msg;
  document.getElementById("aiBox").classList.remove("hidden");
};
// 🌦 WEATHER BY CITY / AREA
async function searchCity() {
  const input = document.getElementById("cityInput").value.trim();
  if (!input) return alert("Enter city / area");

  try {
    const loc = await getCoordinates(input);
    fetchWeatherByCoords(loc.lat, loc.lon, loc);
  } catch (err) {
    alert("Area / city not found");
  }
}

async function getCoordinates(place) {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(place)}&limit=1&appid=${API_KEY}`;
  const res = await fetch(geoURL);
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    state: data[0].state || "",
    country: data[0].country
  };
}

// ADD WEATHER BY COORDS
async function fetchWeatherByCoords(lat, lon, locationInfo) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) throw new Error("Weather error");

  updateUI(data, locationInfo);
}

// 📍 WEATHER BY LOCATION
async function searchByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  
localStorage.setItem("lastLocation", `${lat},${lon}`);
  
  renderWeather(data);
  reverseGeocode(lat, lon);
  loadMap(lat, lon);
}

// 🌍 AREA / LOCALITY FIX (IMPORTANT)
async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  const data = await res.json();
  const a = data.address || {};

  const area =
    a.suburb ||
    a.neighbourhood ||
    a.city_district ||
    a.residential ||
    a.village ||
    "";

  const city =
    a.city ||
    a.town ||
    a.state_district ||
    a.state ||
    "";

  const country = a.country || "";

  placeName.textContent = [area, city, country].filter(Boolean).join(", ");
}

// 🧊 UI UPDATE
function updateUI(data, loc) {
  document.getElementById("location").innerText =
    `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;

  document.getElementById("temp").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("desc").innerText =
    data.weather[0].description;

  document.getElementById("humidity").innerText =
    data.main.humidity + "%";

  document.getElementById("wind").innerText =
    data.wind.speed + " m/s";

  updateMap(data.coord.lat, data.coord.lon);
}

// 🗺 MAP (SAFE, NEVER CRASHES)
function loadMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 12);
    marker.setLatLng([lat, lon]);
  }
}

async function loadHourlyForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  hourlyDiv.innerHTML = "";

  // Next 6 forecasts (3-hour interval → next ~18 hours)
  data.list.slice(0, 6).forEach(item => {
    const time = new Date(item.dt * 1000).getHours();
    const temp = Math.round(item.main.temp);
    const cond = item.weather[0].main;

    const div = document.createElement("div");
    div.className = "hour-card";
    div.innerHTML = `
      <strong>${time}:00</strong>
      <span>${temp}°C</span>
      <span>${cond}</span>
    `;

    hourlyDiv.appendChild(div);
  });

