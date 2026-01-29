const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const voiceBtn = document.getElementById("voiceBtn");
const installBtn = document.getElementById("installBtn");

searchBtn.addEventListener("click", searchCity);
locBtn.addEventListener("click", useLocation);
voiceBtn.addEventListener("click", speakWeather);

async function searchCity() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a location");

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo[0]) return alert("Location not found");

  loadWeather(geo[0].lat, geo[0].lon, geo[0].name, geo[0].country);
}

function useLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => loadWeather(pos.coords.latitude, pos.coords.longitude, "Your Location", ""),
    () => alert("Location permission denied")
  );
}

async function loadWeather(lat, lon, name, country) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  if (!data.current) return alert("Weather error");

  document.getElementById("current").classList.remove("hidden");
  document.getElementById("place").innerText = `${name} ${country}`;
  document.getElementById("temp").innerText = Math.round(data.current.temp) + "°C";
  document.getElementById("desc").innerText = data.current.weather[0].description;
  document.getElementById("extra").innerText =
    `Humidity ${data.current.humidity}% • Wind ${data.current.wind_speed} m/s`;

  // 7-DAY
  const daily = document.getElementById("daily");
  daily.innerHTML = "";
  data.daily.slice(1, 8).forEach(d => {
    const el = document.createElement("div");
    el.className = "day";
    el.innerHTML = `
      <div>${new Date(d.dt * 1000).toLocaleDateString("en",{weekday:"short"})}</div>
      <strong>${Math.round(d.temp.day)}°</strong>
    `;
    daily.appendChild(el);
  });
  document.getElementById("dailyBox").classList.remove("hidden");

  // MAP (SAFE)
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
  document.getElementById("mapBox").classList.remove("hidden");
}

// 🔊 VOICE WEATHER
function speakWeather() {
  const text =
    `${place.innerText}. Temperature ${temp.innerText}. ${desc.innerText}`;
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// 📦 PWA INSTALL
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  deferredPrompt.prompt();
  deferredPrompt = null;
});

// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
