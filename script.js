document.addEventListener("DOMContentLoaded", () => {

  // ✅ API key (inside is correct)
  const API_KEY = "fab9b6d2db473ddcfb43b90e080ca8ee";

  // ✅ DOM elements
  const searchBtn = document.getElementById("searchBtn");
  const locBtn = document.getElementById("locBtn");
  const aiBtn = document.getElementById("aiBtn");

  // ✅ Variables
  let lastWeatherData = null;

  // ✅ Event listeners (safe)
  if (searchBtn) {
    searchBtn.onclick = () => searchCity();
  }

  if (locBtn) {
    locBtn.onclick = () => useMyLocation();
  }

  if (aiBtn) {
    aiBtn.onclick = () => runAI();
  }

  // ✅ Functions (weather, area, map, AI)
  function searchCity() { /* existing code */ }
  function useMyLocation() { /* existing code */ }
  function runAI() { /* existing code */ }

});