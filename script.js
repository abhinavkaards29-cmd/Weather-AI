const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const currentBox = document.getElementById("current");
const place = document.getElementById("place");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const extra = document.getElementById("extra");

const forecastBox = document.getElementById("forecast");
const days = document.getElementById("days");

const mapBox = document.getElementById("mapBox");
const map = document.getElementById("map");

searchBtn.addEventListener("click", searchCity);

async function searchCity() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city");

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found");
    return;
  }

  place.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  desc.textContent = data.weather[0].description;
  extra.textContent =
    `Humidity ${data.main.humidity}% · Wind ${data.wind.speed} m/s`;

  currentBox.classList.remove("hidden");

  loadForecast(data.coord.lat, data.coord.lon);
  loadMap(data.coord.lat, data.coord.lon);
}

async function loadForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  days.innerHTML = "";

  data.daily.slice(0, 7).forEach(d => {
    const date = new Date(d.dt * 1000).toDateString();
    const div = document.createElement("div");
    div.textContent = `${date} — ${Math.round(d.temp.day)}°C`;
    days.appendChild(div);
  });

  forecastBox.classList.remove("hidden");
}

function loadMap(lat, lon) {
  map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
  mapBox.classList.remove("hidden");
}
