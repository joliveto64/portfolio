const input = document.getElementById("input");
const button = document.getElementById("convert-btn");
const lengthText = document.getElementById("length-text");
const volumeText = document.getElementById("volume-text");
const massText = document.getElementById("mass-text");
const container = document.getElementById("container");
const upperDiv = document.getElementById("upper-div");
let value;

function convertAndDisplay() {
  let feet = (value * 3.281).toFixed(1);
  let meter = (value / 3.281).toFixed(1);
  let gallon = (value * 0.264).toFixed(1);
  let liter = (value / 0.264).toFixed(1);
  let pound = (value * 2.204).toFixed(1);
  let kilogram = (value / 2.204).toFixed(1);

  lengthText.textContent = `${value} m = ${feet} ft  |  ${value} ft = ${meter} m`;
  volumeText.textContent = `${value} L = ${gallon} gal  |  ${value} gal = ${liter} L`;
  massText.textContent = `${value} kg = ${pound} lbs  |  ${value} lbs = ${kilogram} kg`;
}

button.addEventListener("click", () => {
  value = Math.round(input.value);
  convertAndDisplay();

  button.classList.add("move");

  setTimeout(() => {
    button.classList.remove("move");
  }, 75);
});

input.addEventListener("focus", () => {
  input.removeAttribute("placeholder");
});

window.addEventListener("click", (event) => {
  if (event.target != input) {
    input.setAttribute("placeholder", "20");
  }
});

document.addEventListener("mousemove", (event) => {
  const userInput = input.value;
  if (isNaN(userInput) && event.target === button) {
    button.classList.add("hide");
  } else if (event.target === input || event.target != upperDiv) {
    button.classList.remove("hide");
  }
});
