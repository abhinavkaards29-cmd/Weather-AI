const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee";

const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const voiceBtn = document.getElementById("voiceBtn");

searchBtn.onclick = () => getCityWeather();
locBtn.onclick = () => navigator.geolocation.getCurrentPosition(getGeoWeather);

async function getCityWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city");
  fetchWeather(`q=${city}`);
}

function getGeoWeather(pos) {
  fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
}

async function fetchWeather(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();

    if (!data.main) throw "Invalid weather data";

    showWeather(data);
    loadForecast(data.coord.lat, data.coord.lon);
    loadMap(data.coord.lat, data.coord.lon);

  } catch (e) {
    alert("Weather error");
    console.error(e);
  }
}

function showWeather(d) {
  weatherBox.classList.remove("hidden");
  place.innerText = `${d.name}, ${d.sys.country}`;
  temp.innerText = `${Math.round(d.main.temp)}°C`;
  desc.innerText = d.weather[0].description;
  extra.innerText = `Humidity ${d.main.humidity}% • Wind ${d.wind.speed} m/s`;

  voiceBtn.onclick = () => speakWeather();
}

function speakWeather() {
  const msg = new SpeechSynthesisUtterance(
    `${place.innerText}. Temperature ${temp.innerText}. ${desc.innerText}`
  );
  speechSynthesis.speak(msg);
}

// 7 DAY FORECAST — NO API KEY
async function loadForecast(lat, lon) {
  forecast.innerHTML = "<h3>7-Day Forecast</h3>";

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  );
  const data = await res.json();

  data.daily.temperature_2m_max.forEach((t, i) => {
    forecast.innerHTML += `
      <div class="day">
        Day ${i + 1}: ${t}° / ${data.daily.temperature_2m_min[i]}°
      </div>`;
  });
}

function loadMap(lat, lon) {
  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;
}
