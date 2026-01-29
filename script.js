// 🔑 YOUR API KEY (OpenWeather)
const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

// DOM
const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const currentBox = document.getElementById("current");
const dailyBox = document.getElementById("daily");
const mapBox = document.getElementById("mapBox");

searchBtn.addEventListener("click", searchCity);

// ✅ GLOBAL FUNCTION (THIS IS WHAT YOU WERE MISSING)
function searchCity() {
  const city = input.value.trim();
  if (!city) return alert("Enter a city");
  loadWeather(city);
}

async function loadWeather(city) {
  try {
    // CURRENT
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();

    if (data.cod !== 200) throw new Error("City not found");

    const { lat, lon } = data.coord;

    document.getElementById("place").textContent =
      `${data.name}, ${data.sys.country}`;
    document.getElementById("temp").textContent =
      `${Math.round(data.main.temp)}°C`;
    document.getElementById("desc").textContent =
      data.weather[0].description;
    document.getElementById("extra").textContent =
      `Humidity ${data.main.humidity}% • Wind ${data.wind.speed} m/s`;

    currentBox.classList.remove("hidden");

    // MAP
    document.getElementById("map").src =
      `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1}%2C${lat-0.1}%2C${lon+0.1}%2C${lat+0.1}&layer=mapnik&marker=${lat}%2C${lon}`;
    mapBox.classList.remove("hidden");

    // 7-DAY
    const dailyRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=${API_KEY}`
    );
    const dailyData = await dailyRes.json();

    const list = document.getElementById("dailyList");
    list.innerHTML = "";

    dailyData.daily.slice(0, 7).forEach(day => {
      const d = new Date(day.dt * 1000).toLocaleDateString();
      list.innerHTML += `
        <div>
          <span>${d}</span>
          <span>${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</span>
        </div>
      `;
    });

    dailyBox.classList.remove("hidden");

  } catch (err) {
    alert(err.message);
  }
}
