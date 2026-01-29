const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const current = document.getElementById("current");
const daily = document.getElementById("daily");
const mapBox = document.getElementById("mapBox");

const place = document.getElementById("place");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const extra = document.getElementById("extra");
const dailyList = document.getElementById("dailyList");
const map = document.getElementById("map");

searchBtn.onclick = () => loadCity(cityInput.value);

async function loadCity(city) {
  if (!city) return;

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo[0]) return alert("City not found");

  const { lat, lon, name, country } = geo[0];

  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  // Current
  place.textContent = `${name}, ${country}`;
  temp.textContent = `${Math.round(data.current.temp)}°C`;
  desc.textContent = data.current.weather[0].description;
  extra.textContent = `Humidity ${data.current.humidity}% • Wind ${data.current.wind_speed} m/s`;

  current.classList.remove("hidden");

  // Daily
  dailyList.innerHTML = "";
  data.daily.slice(0, 7).forEach(d => {
    const row = document.createElement("div");
    row.innerHTML = `
      <span>${new Date(d.dt * 1000).toDateString().slice(0, 10)}</span>
      <span>${Math.round(d.temp.day)}°C</span>
    `;
    dailyList.appendChild(row);
  });
  daily.classList.remove("hidden");

  // Map
  map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
  mapBox.classList.remove("hidden");

  window.currentCity = name;
}

// Favourite
document.getElementById("favBtn").onclick = () => {
  localStorage.setItem("favCity", window.currentCity);
  alert("Saved as favourite");
};

// Reminder
document.getElementById("remBtn").onclick = () => {
  setTimeout(() => {
    alert(`Weather reminder for ${window.currentCity}`);
  }, 5000);
};
