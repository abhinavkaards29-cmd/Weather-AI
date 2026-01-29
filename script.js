document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running");

  const searchBtn = document.getElementById("searchBtn");
  const locBtn = document.getElementById("locBtn");
  const searchInput = document.getElementById("searchInput");

  const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee"; // keep your real key
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  function setLoading(state) {
    document.body.style.cursor = state ? "wait" : "default";
  }

  function fetchWeatherByQuery(query) {
    setLoading(true);

    fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&units=metric&appid=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error("Location not found");
        return res.json();
      })
      .then(data => {
        setLoading(false);
        displayWeather(data);
      })
      .catch(err => {
        setLoading(false);
        alert("Area / City not found. Try: Area, City, Country");
        console.error(err);
      });
  }

  function fetchWeatherByCoords(lat, lon) {
    setLoading(true);

    fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        displayWeather(data);
      })
      .catch(err => {
        setLoading(false);
        alert("Location error");
        console.error(err);
      });
  }

  function displayWeather(data) {
    console.log("Weather data:", data);
    // 🔹 keep your existing UI update code here
  }

  // SEARCH BUTTON
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (!query) return alert("Enter area / city / country");
      fetchWeatherByQuery(query);
    });
  }

  // LOCATION BUTTON
  if (locBtn) {
    locBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => alert("Location permission denied")
      );
    });
  }
});
