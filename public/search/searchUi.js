/**
 * This is what the UI calls to do a search. 
 * It does this by calling the search algorithm (from searchAlgorithm.js).
 * 
 * This function also handles some corner cases (ie no search) and passing the search
 * results onto the UI, so the search algorithm doesn't have to think
 * about that stuff.
 * param: {string} searchText - the text to search for
 */
function handleSearch(searchText) {
  if (searchText.trim() == '') {
    const sortedListOfBooks = Object.values(allBooks).sort((bookA, bookB) => bookA.title.localeCompare(bookB.title));
    displayResults(sortedListOfBooks, /* isSearchResults */ false);  
    return;
  }

  const results = search(Object.values(selectedBooks), searchText);
  displayResults(results, /* isSearchResults */ true);  
}

/** These are all the Book objects (see bookParser.js for definition of Book) that the use has uploaded */
const allBooks = {};

/** These are the Book objects (see bookParser.js for definition of Book) the user has clicked and selected (search these!) */
const selectedBooks = {};

// This change listener will trigger DEBOUNCE_TIME_MS after the user stops typing.
// This is useful to make sure you don't trigger your search way too often needlessly.
// It works by having a timer for X ms from now, and if we trigger the function again
// we cancel the previous timer and set another one. This is called debouncing - idk why
let debounceTimeout;
const DEBOUNCE_TIME_MS = 300;
document.getElementById('searchBar').addEventListener('input', (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    handleSearch(e.target.value);
  }, DEBOUNCE_TIME_MS);
});
document.addEventListener("DOMContentLoaded", function() {
  clearSearchAndRefreshUi();
});

/**
 * Takes this list of search results and puts it into the UI
 * This works by creating a new searchRestuls div, populating it, then swapping the old for the new.
 * We do this so we can fade out the old and fade in the new (oooooh ahhhhhh fancy).
 * param: {SearchResult[] or Book[]} results 
 */
async function displayResults(results, isSearchResults) {
  const oldResultsDiv = document.getElementById("results");
  const newResultsDiv = oldResultsDiv.cloneNode(); // Copy the old results so the structure is the same (eg css class)
  newResultsDiv.innerHTML = ""; // Clear the old results

  results.forEach((result) => {
    const resultElement = isSearchResults
      ? createSearchResultElement(result)
      : createBookResultElement(result);
    newResultsDiv.appendChild(resultElement);
  });

  if (!isSearchResults) {
    newResultsDiv.appendChild(createBookInputElement());
  } else if (results.length == 0) {
    const noResults = document.createElement("p");
    noResults.className = "no-results";
    noResults.textContent = "No results found.";
    newResultsDiv.appendChild(noResults);
  }

  // Add the new results to the UI
  newResultsDiv.style.opacity = 0.0; // Make the new results invisible
  oldResultsDiv.parentNode.insertBefore(newResultsDiv, oldResultsDiv);
  fadeIn(newResultsDiv); // Kick off the fade in of the new

  // Kick off the fade out of the old (then when it's done, remove it from the DOM)
  fadeOut(oldResultsDiv).then(() => {
    oldResultsDiv.parentNode.removeChild(oldResultsDiv);
  }); 
}

/**
 * Given one search result, create a DOM element to display it.
 * param: {SearchResult} searchResult 
 * returns: a div element containing the search result
 */
function createSearchResultElement(searchResult) {
  const resultDiv = document.createElement("div");
  resultDiv.className = "result";

  const title = document.createElement("h3");
  title.textContent = searchResult.title;
  resultDiv.appendChild(title);

  const subtitle = document.createElement("h4");
  subtitle.textContent = searchResult.subtitle;
  resultDiv.appendChild(subtitle);

  const description = document.createElement("p");
  description.textContent = searchResult.description;
  description.className = 'notes notes-limited';
  resultDiv.appendChild(description);

  return resultDiv;
}

/**
 * Given one book result, create a DOM element to display it.
 * param: {Book} bookResult 
 * returns: a div element containing the book result
 */
function createBookResultElement(bookResult) {
  const resultDiv = document.createElement("div");
  resultDiv.className = "result";
  if (selectedBooks[bookResult.id]) {
    resultDiv.className += " result-selected"
  }

  const title = document.createElement("h3");
  title.textContent = bookResult.title;
  resultDiv.appendChild(title);

  const author = document.createElement("h4");
  author.textContent = bookResult.author;
  resultDiv.appendChild(author);

  const snippet = document.createElement("p");
  snippet.className = 'notes';
  snippet.textContent = bookResult.snippet;
  resultDiv.appendChild(snippet);

  resultDiv.onclick = () => {
    if (selectedBooks[bookResult.id]) {
      selectedBooks[bookResult.id] = null;
    } else {
      selectedBooks[bookResult.id] = bookResult;
    }
    clearSearchAndRefreshUi();
  };

  return resultDiv;
}

/**
 * Creates a DOM element for uploading a new book
 */
function createBookInputElement() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'inputFile';
  fileInput.className = 'custom-file-input';
  fileInput.accept = '.txt';
  fileInput.multiple = true;
  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files)
    files.forEach((file) => { // go thru all files selected
      ingestBook(file, (book) => { // call the ingestBook function from bookParser
        allBooks[book.id] = book; // add the book to the books array
        clearSearchAndRefreshUi(); // update the UI to show the new book!
      });
    });
  });

  const fileContainer = document.createElement('div');
  fileContainer.className = 'result';

  const fileContainerText = document.createElement('h3');
  fileContainerText.textContent = 'Upload a Book to Search';

  const notesText = document.createElement('p');
  notesText.className = 'notes';
  notesText.innerHTML = `Format reqruirements:<br>
   - The title will be listed like this: "TITLE. Moby-Dick"<br>
   - The author like this: "AUTHOR. Herman Melville"<br>
   - Chapters will be labeled like this: "CHAPTER 1. Loomings."<br>
   - Only other allowable sections are "EPILOGUE" and "PROLOGUE"<br>
   - Title/Author will come before the 1st chapter<br>
   - Chapters are in order<br>
   - A double line break means the end of a paragraph<br>
   - File is in <a href="https://en.wikipedia.org/wiki/UTF-8">utf-8 format</a>
  `;

  fileContainer.appendChild(fileContainerText);
  fileContainer.appendChild(fileInput);
  fileContainer.appendChild(notesText);

  return fileContainer;
}



/*************************************************/
/* Helper functions below here                   */
/*************************************************/

function clearSearchAndRefreshUi() {
  let placeHolder = "Step 3. Type to search the selected books...";
  let disabled = false;
  if (Object.keys(allBooks).length === 0) {
    placeHolder = "Step 1. upload a book below..."
    disabled = true;
  } else if (Object.keys(selectedBooks).length === 0) {
    placeHolder = "Step 2. select at least one book below (click it)..."
    disabled = true;
  }

  const searchBar = document.getElementById("searchBar");
  searchBar.placeholder = placeHolder;
  searchBar.disabled = disabled;
  if (searchBar.value === "") {
    // If already empty, then manually call search to update the UI
    handleSearch("");
  } else {
    // Otherwise clear it and let the event listener handle it
    document.getElementById("searchBar").value = "";
  }
}

/**
 * Returns value clamped between min and max
 * (eg if min is 0, and max is 1, we'll return value unless it's <0 or >1 in which case we'll return 0 or 1 respectively)
 * param: {number} min 
 * param: {number} max 
 * param: {number} value 
 */
function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

const ANIMATION_DURATION_MS = 200;
const FADE_ANIMATION_STEPS = 10;

/**
 * This is kind of a janky way to do this - there are libraries that do this better, but w/e
 * param: {*} element 
 * param: {boolean} fadeIn
 * returns: promise that resolves after the fade out is complete
 */
function fade(element, fadeIn) {
  const sleepBtwnSteps = ANIMATION_DURATION_MS / FADE_ANIMATION_STEPS;
  const opacityStep = (fadeIn ? 1.0 : -1.0) / FADE_ANIMATION_STEPS;

  const currentOpacity = parseFloat(element.style.opacity);
  let opacity = isNaN(currentOpacity) 
    ? (fadeIn ? 0 : 1) // if not a valid number, assume it's fully faded out if fading in, or vice versa
    : currentOpacity;

  return new Promise(resolve => {
    function fadeStep() {
      opacity = clamp(0, 1, opacity + opacityStep);
      element.style.opacity = opacity
      const isDone = fadeIn
        ? (opacity >= 1) // done when opacity is at least 1
        : (opacity <= 0); // done when at most 0

      if (isDone) {
        resolve();
      } else {
        // Not done, so run this again!
        setTimeout(fadeStep, sleepBtwnSteps);
      }
    }

    fadeStep();
  });
}

function fadeIn(element) {
  return fade(element, true);
}

function fadeOut(element) {
  return fade(element, false);
}