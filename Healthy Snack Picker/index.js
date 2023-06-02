import { healthyFoods } from "/data.js";
const flavorSelect = document.querySelector("#flavor-select");
const calorieSelect = document.querySelector("#calorie-select");
const button = document.querySelector("#find-snacks");
const snacksList = document.querySelector(".snacks-list");
const sortOptions = document.querySelector("#sort-options");

generateFlavorsList();
renderFlavors();
generateSortedSnacks();

function generateFlavorsList() {
  let flavorsArr = [];

  for (let food of healthyFoods) {
    if (!flavorsArr.includes(food.flavor)) {
      flavorsArr.push(food.flavor);
    }
  }
  console.log(flavorsArr);
  return flavorsArr;
}

function renderFlavors() {
  const flavors = generateFlavorsList();
  for (let flavor of flavors) {
    flavorSelect.innerHTML += `<option value="${flavor}">${flavor}</option`;
  }
}

document.addEventListener("click", (event) => {
  if (event.target === button) {
    snacksList.innerHTML = "";
    generateSortedSnacks();
  }
});

function generateSortedSnacks() {
  let snacksArray = filterSnacks();

  if (sortOptions.value === "calories") {
    snacksArray.sort((a, b) => {
      return a.calories - b.calories;
    });
  } else {
    snacksArray.sort((a, b) => {
      return b.satietyIndex - a.satietyIndex;
    });
  }

  if (snacksArray.length > 0) {
    for (let snack of snacksArray) {
      snacksList.innerHTML += `<h3 id="name">${snack.name}</h3>
    <p id="info">${snack.calories} calories | satiety: ${snack.satietyIndex}</p>`;
    }
  } else {
    snacksList.innerHTML = `<p id="no-results">No results 🤷‍♂️</p>`;
  }
}

function filterSnacks() {
  let filteredSnacks = [];

  for (let food of healthyFoods) {
    if (
      food.calories <= calorieSelect.value &&
      food.flavor === flavorSelect.value
    ) {
      filteredSnacks.push(food);
    }
  }

  console.log(filteredSnacks);
  return filteredSnacks;
}
