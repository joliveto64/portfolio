/*************************************************/
/* Data types below                              */
/*************************************************/

/** This represents the data for a search result we will show in the UI */
class SearchResult {
  constructor(title = "", subtitle = "", description = "") {
    this.title = title; // string
    this.subtitle = subtitle; // string
    this.description = description; // string
  }
}

/** data for one entire book */
class Book {
  constructor(id = "", title = "", author = "", snippet = "", paragraphs = []) {
    this.id = id; // string
    this.title = title; // string
    this.author = author; // string
    this.snippet = snippet; // string
    this.paragraphs = paragraphs; // string[]
  }
}

/**
 * This creates and returns search results (SearchResult[]) for any paragraphs that much accross the selectedBooks (Book[])
 * This is called automatically by the UI code — don't worry about that!
 * param: {Book[]} selectedBooks: the books to search through
 * param: {string} searchText: the text to search for
 */
function findMatches(selectedBooks, searchText) {
  const mySearchResults = [];
  const ignoreWords = [
    "",
    "a",
    "an",
    "and",
    "the",
    "in",
    "on",
    "at",
    "by",
    "for",
    "of",
    "to",
    "with",
    "from",
    "up",
    "over",
    "under",
    "between",
    "among",
    "through",
    "beside",
    "around",
    "about",
    "above",
    "across",
    "after",
    "against",
    "along",
    "among",
    "around",
    "as",
    "at",
    "before",
    "behind",
    "below",
    "beneath",
    "beside",
    "between",
    "beyond",
    "by",
    "down",
    "during",
  ];
  const splitWords = searchText.trim().split(" ");
  const filteredWords = splitWords.filter(
    (word) => !ignoreWords.includes(word)
  );

  for (const book of selectedBooks) {
    console.log(
      `Searching through ${book.title} for ${searchText}...`,
      splitWords,
      filteredWords
    );
    for (let p = 0; p < book.paragraphs.length; p++) {
      const curParagraph = book.paragraphs[p];
      // TODO(john): This is a very basic way to find if something matches, make it better (try to get to level 3 or 4).
      //  Level 0: (CURRENT) entire search text must be in paragraph — search for "cat and dog" matches only "I love cats and dogs"
      //  Level 1: individual word matching — search for "cat dog" matches "the cat and the dog are friends"
      //  Level 2: not all words must match — search for "cat and dog" matches "the cat is cool", "the dog is great", "the cat and dog are best"
      //  Level 3: ignore common words in search — search for "cat and dog" matches "the cat is cool", "the dog is great", but NOT "fish and ferrets are fun"
      //  Level 4: can match basic modified versions of words — search for "cats and dogs" matches "the cat is cool", "the dog is great" (ie cat -> cats, but not led -> lead or run -> running)
      //  Level 5: can match similar / advanced modified versions of words — search for "cats and dogs run fast" matches "felines are fun", "running is cool", "quick animals are cool" (Because cat->felines, run->running, fast->quick)
      // if (curParagraph.includes(searchText)) {
      //   const result = new SearchResult(
      //     /* title of result */ book.title,
      //     /* subtitle of result */ `Paragraph #${p + 1}`,
      //     /* description of result */ curParagraph
      //   );

      //   mySearchResults.push(result);
      // }

      for (let i = 0; i < filteredWords.length; i++) {
        if (curParagraph.includes(filteredWords[i])) {
          const result = new SearchResult(
            book.title,
            `Paragraph #${p + 1}`,
            curParagraph
          );
          mySearchResults.push(result);
        }
      }
    }
  }

  return mySearchResults;
}
