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

  const unsortedResults = findMatches(Object.values(selectedBooks), searchText);
  const sortedResults = rankMatches(unsortedResults);

  displayResults(sortedResults, /* isSearchResults */ true);  
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

  ingestAllBooks((book) => { // call the ingestBook function from bookParser
    allBooks[book.id] = book; // add the book to the books array
    selectedBooks[book.id] = book; // select the book by default
    clearSearchAndRefreshUi(); // update the UI to show the new book!
  });
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

  if (isSearchResults && results.length == 0) {
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




/*************************************************/
/* Helper functions below here                   */
/*************************************************/

function clearSearchAndRefreshUi() {
  let placeHolder = "Step 2. Type to search the selected books...";
  let disabled = false;
  if (Object.keys(allBooks).length === 0) {
    placeHolder = "Step 0. Create JS files for a book under books/..."
    disabled = true;
  } else if (Object.keys(selectedBooks).length === 0) {
    placeHolder = "Step 1. select at least one book below (click it)..."
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


//////////////////////////////
// STUFF FOR LATER VERSIONS
//////////////////////////////

/**
 * This is called automatically by the UI code — don't worry about that!
 * param: {Book[]} selectedBooks: the books to search through
 * param: {string} searchText: the text to search for
 */
function rankMatches(unsortedSearchResults) {

  // TODO: #3 implement comparator to enable ranking the search results from best to worst
  // Some ideas to consider (some of these are good ideas, some are bad, just planting some seeds):
  //  - Maybe if a larger % of the result was in the query, that's better?
  //  - Maybe if more words match the query, that's better?
  //  - Maybe matches on common words (eg 'the') are less important than matches on rare words?
  //  - Maybe matches earlier in the query are more important than matches later in the query?
  //  - Maybe strings of words matching is better (eg query 'cats and dogs' matches 'cats and dogs' better than 'cats some more words dogs')?
  //  - Maybe matches in order are better (eg query 'cats and dogs' matches 'cats ... dogs' better than 'dogs ... cats')?
  const sortedSearchResults = unsortedSearchResults.sort((searchResult1, searchResult2) => {
    // Return a number:
    // - 0 means the results are equal
    // - negative means searchResult1 is better
    // - positive means searchResult2 is better.

    const t2 = parseFloat((searchResult2.subtitle || "0").replace("Paragraph #", ""));
    const t1 = parseFloat((searchResult1.subtitle || "0").replace("Paragraph #", ""));
    let score = t1 - t2;
    if (score === 0) {
      score = searchResult2.title.localeCompare(searchResult1.title);
    }

    return score;
  });

  // Supplemental details on sorting:
  // Sorting is complicated. There are a million algorithms to do it, some better, some worse. This sort
  // function we use picks a good algorithm that's efficient. Regardless of what algorithm is used, the code
  // has no way to know how to compare two SearchResults. It doesn't know if you want to sort by title, or
  // by subtitle, or by description, or by poop. It doesn't know if you want to sort ascending or descending.
  // So, we pass in a callback (called a comparator) to do just that. It takes in 2 of the items to be sorted
  // and returns an integer that says which of the items is better: 0 means they're equal, negative means
  // searchResult1 is better, positive means searchResult2 is better.

  return sortedSearchResults;
}

// /**
//  * This is called automatically by the UI code — don't worry about that!
//  * param: {Book[]} selectedBooks: the books to search through
//  * param: {string} searchText: the text to search for
//  */
// function search(selectedBooks, searchText) {
//   const rawSearchResults = [];

//   // TODO: #1 go through all the books' paragraphs and find which match the searchText!
//   // Below is a basic implementation to start (but it's not complete because countMatches always returns 0)
//   // Some ideas to consider for finding matches (some of these are good ideas, some are bad, just planting some seeds):
//   //  - Could start by seeing if the entire query appears in a paragraph to get something going
//   //  - Splitting words like you did before is a good idea
//   //  - Calculate stats / scores here for a given search result (that'll help you below when ranking your results) (see the 'TODO(john)' near the top of the file)
//   // Book object fields:
//   //  - book.title: string for the title
//   //  - book.author: string for the author's name
//   //  - book.paragraphs: string[] for the content of the book (search this!)
//   for (const book of selectedBooks) {
//     console.log(`Searching through ${book.title} for ${searchText}...`);

//     for (const paragraph of book.paragraphs) {

//       // TODO: #2 implement the countMatches function for real (see below)!
//       const matchCount = countMatches(paragraph, searchText);
//       if (matchCount > 0) {
//         // SearchResult definition is found at the top of the file, fields: title, subtitle, content, matchCount
//         rawSearchResults.push(new SearchResult(
//           book.title,
//           `Match Count: ${matchCount}`,
//           paragraph,
//           matchCount
//         ));
//       }
//     }
//   }

//   // TODO: #3 implement comparator to enable ranking the search results from best to worst
//   // Some ideas to consider (some of these are good ideas, some are bad, just planting some seeds):
//   //  - Maybe if a larger % of the result was in the query, that's better?
//   //  - Maybe if more words match the query, that's better?
//   //  - Maybe matches on common words (eg 'the') are less important than matches on rare words?
//   //  - Maybe matches earlier in the query are more important than matches later in the query?
//   //  - Maybe strings of words matching is better (eg query 'cats and dogs' matches 'cats and dogs' better than 'cats some more words dogs')?
//   //  - Maybe matches in order are better (eg query 'cats and dogs' matches 'cats ... dogs' better than 'dogs ... cats')?
//   const sortedSearchResults = rawSearchResults.sort((searchResult1, searchResult2) => {
//     // Return a number:
//     // - 0 means the results are equal
//     // - negative means searchResult1 is better
//     // - positive means searchResult2 is better.
//     return searchResult2.matchCount - searchResult1.matchCount;
//   });

//   // Supplemental details on sorting:
//   // Sorting is complicated. There are a million algorithms to do it, some better, some worse. This sort
//   // function we use picks a good algorithm that's efficient. Regardless of what algorithm is used, the code
//   // has no way to know how to compare two SearchResults. It doesn't know if you want to sort by title, or
//   // by subtitle, or by description, or by poop. It doesn't know if you want to sort ascending or descending.
//   // So, we pass in a callback (called a comparator) to do just that. It takes in 2 of the items to be sorted
//   // and returns an integer that says which of the items is better: 0 means they're equal, negative means
//   // searchResult1 is better, positive means searchResult2 is better.

//   return sortedSearchResults;
// }

// /**
//  * Counts the number of times searchText occured in paragraph
//  * param: {string} paragraph
//  * param: {string} searchText
//  */
// function countMatches(paragraph, searchText) {
//   // TODO: #2 implement me for real!

//   // Note: this only returns 1 if searchText appears in paragraph, otherwise 0.
//   // That's not what we want (read the comment above the function for what it should do).
//   // This basic / partially right implementation does show everything working end to end though.
//   return paragraph && paragraph.includes(searchText) ? 1 : 0;
// }
