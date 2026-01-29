
const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee"; // keep your real key
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded");

  const searchBtn = document.getElementById("searchBtn");
  const locBtn = document.getElementById("locBtn");
  const input = document.getElementById("searchInput");

  let busy = false;

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      if (busy) return;
      busy = true;

      try {
        const query = input.value.trim();
        if (!query) {
          showStatus("Enter area / city / country");
          return;
        }

        showStatus("Searching weather...");
        await fetchWeatherByQuery(query); // your existing function
      } catch (err) {
        console.error(err);
        showStatus("Weather error");
      } finally {
        busy = false;
      }
    });
  }

  if (locBtn) {
    locBtn.addEventListener("click", async () => {
      if (busy) return;
      busy = true;

      try {
        showStatus("Getting location...");
        await fetchWeatherByLocation(); // your existing function
      } catch (err) {
        console.error(err);
        showStatus("Location error");
      } finally {
        busy = false;
      }
    });
  }
});

function showStatus(msg) {
  const status = document.getElementById("status");
  if (status) {
    status.innerText = msg;
    status.style.opacity = "1";
  }
}
  
