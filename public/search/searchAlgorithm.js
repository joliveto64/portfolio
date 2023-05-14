/*************************************************/
/* Data types below                              */
/*************************************************/

/** This represents the data for a search result we will show in the UI */
class SearchResult {
  constructor(title = '', subtitle = '', description = '', matchCount = 0) { // This line sets the default values in case you don't pass in all the parameters
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.matchCount = matchCount;
    // TODO: add more fields here that are useful for ranking results
  }
}

/**
 * This is called automatically by the UI code — don't worry about that!
 * param: {Book[]} selectedBooks: the books to search through
 * param: {string} searchText: the text to search for
 */
function search(selectedBooks, searchText) {
  const rawSearchResults = [];

  // TODO: #1 go through all the books' paragraphs and find which match the searchText!
  // Below is a basic implementation to start (but it's not complete because countMatches always returns 0)
  // Some ideas to consider for finding matches (some of these are good ideas, some are bad, just planting some seeds):
  //  - Could start by seeing if the entire query appears in a paragraph to get something going
  //  - Splitting words like you did before is a good idea
  //  - Calculate stats / scores here for a given search result (that'll help you below when ranking your results) (see the 'TODO(john)' near the top of the file)
  // Book object fields:
  //  - book.title: string for the title
  //  - book.author: string for the author's name
  //  - book.paragraphs: string[] for the content of the book (search this!)
  for (const book of selectedBooks) {
    console.log(`Searching through ${book.title} for ${searchText}...`);

    for (const paragraph of book.paragraphs) {

      // TODO: #2 implement the countMatches function for real (see below)!
      const matchCount = countMatches(paragraph, searchText);
      if (matchCount > 0) {
        // SearchResult definition is found at the top of the file, fields: title, subtitle, content, matchCount
        rawSearchResults.push(new SearchResult(
          book.title,
          `Match Count: ${matchCount}`,
          paragraph,
          matchCount
        ));
      }
    }
  }

  // TODO: #3 implement comparator to enable ranking the search results from best to worst
  // Some ideas to consider (some of these are good ideas, some are bad, just planting some seeds):
  //  - Maybe if a larger % of the result was in the query, that's better?
  //  - Maybe if more words match the query, that's better?
  //  - Maybe matches on common words (eg 'the') are less important than matches on rare words?
  //  - Maybe matches earlier in the query are more important than matches later in the query?
  //  - Maybe strings of words matching is better (eg query 'cats and dogs' matches 'cats and dogs' better than 'cats some more words dogs')?
  //  - Maybe matches in order are better (eg query 'cats and dogs' matches 'cats ... dogs' better than 'dogs ... cats')?
  const sortedSearchResults = rawSearchResults.sort((searchResult1, searchResult2) => {
    // Return a number:
    // - 0 means the results are equal
    // - negative means searchResult1 is better
    // - positive means searchResult2 is better.
    return searchResult2.matchCount - searchResult1.matchCount;
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

/**
 * Counts the number of times searchText occured in paragraph
 * param: {string} paragraph
 * param: {string} searchText
 */
function countMatches(paragraph, searchText) {
  // TODO: #2 implement me for real!

  // Note: this only returns 1 if searchText appears in paragraph, otherwise 0.
  // That's not what we want (read the comment above the function for what it should do).
  // This basic / partially right implementation does show everything working end to end though.
  return paragraph && paragraph.includes(searchText) ? 1 : 0;
}
