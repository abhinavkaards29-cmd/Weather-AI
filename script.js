const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee";

const saveFavBtn = document.getElementById("saveFavBtn");
const favoritesDiv = document.getElementById("favorites");

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

// 🌦 WEATHER BY CITY / AREA
async function searchByCity(query) {
  if (!query) return alert("Enter area or city");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) return alert("Location not found");

  renderWeather(data);
  reverseGeocode(data.coord.lat, data.coord.lon);
  loadMap(data.coord.lat, data.coord.lon);
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
function renderWeather(data) {
  card.classList.remove("hidden");

  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descEl.textContent = data.weather[0].description;
  extraEl.textContent = `Humidity ${data.main.humidity}% • Wind ${data.wind.speed} m/s`;
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
