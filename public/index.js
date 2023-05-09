const clouds = document.getElementById("clouds");
const fireworks = document.getElementById("fireworks");
const stars = document.getElementById("stars");
const header = document.getElementById("header");
const searchButton = document.getElementById("search-button");

clouds.addEventListener("click", () => {
  window.location.href = "clouds.html";
});

fireworks.addEventListener("click", () => {
  window.location.href = "fireworks.html";
});

stars.addEventListener("click", () => {
  window.location.href = "stars.html";
});

// TO HIDE HEADER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// window.addEventListener("scroll", () => {
//   if (window.scrollY < 100) {
//     header.classList.remove("hide");
//   } else {
//     header.classList.add("hide");
//   }
// });

searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("search-input").value;
  const searchResultsContainer = document.getElementById("search-results");
});
