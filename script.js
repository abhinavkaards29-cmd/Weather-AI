document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running");

  const searchBtn = document.getElementById("searchBtn");
  const locBtn = document.getElementById("locBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      alert("Search button works");
    });
  }

  if (locBtn) {
    locBtn.addEventListener("click", () => {
      alert("Location button works");
    });
  }
});
