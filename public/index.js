// SEARCH STUFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create variables
const searchButton = document.getElementById("search-button");
const searchResultsContainer = document.getElementById("search-results-string");
const htmlTags = document.getElementsByTagName("a");
const linksArr = [];

// populate links array
for (let i = 0; i < htmlTags.length; i++) {
  linksArr.push(htmlTags[i].href);
}

// event listener for click
searchButton.addEventListener("click", () => {
  let filteredArr = [];
  const resultsArr = [];
  const inputArr = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim()
    .split(" ");

  // filter inputArr to get rid of empty spaces
  for (let index = 0; index < inputArr.length; index++) {
    if (inputArr[index] != "") {
      filteredArr.push(inputArr[index]);
    }
  }

  // nested loop to compare the user input array to the urls array
  for (let i = 0; i < filteredArr.length; i++) {
    for (let j = 0; j < linksArr.length; j++) {
      if (linksArr[j].includes(filteredArr[i])) {
        resultsArr.push(linksArr[j]);
      } else {
        continue;
      }
    }
  }

  if (resultsArr.length === 0) {
    resultsArr.push("No match");
  }

  searchResultsContainer.innerHTML = resultsArr;
  searchResultsContainer.classList.remove("hidden");

  searchResultsContainer.addEventListener("click", () => {
    for (let index = 0; index < resultsArr.length; index++) {
      window.location.href = resultsArr[index];
    }
  });
});

// events to close the search popup
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    searchResultsContainer.classList.add("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (
    !searchResultsContainer.contains(event.target) &&
    !searchButton.contains(event.target)
  ) {
    searchResultsContainer.classList.add("hidden");
  }
});
