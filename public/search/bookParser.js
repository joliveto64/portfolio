/*************************************************/
/* Data types below                              */
/*************************************************/

class Book {
  constructor(id='', title = '', author = '', snippet = '', chapters = []) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.snippet = snippet;
    this.chapters = chapters;
  }
}

class Chapter {
  constructor(id = 0, title = '', paragraphs = []) {
    this.id = id;
    this.title = title;
    this.paragraphs = paragraphs;
  }
}

/*************************************************/
/* Book parsing algorithm below                  */
/*************************************************/

/**
 * Creates a book object from a string of the contents.
 * Makes some assumptions on the input format:
 *  - The title will be listed like this: TITLE. Moby-Dick; or The Whale
 *  - The author like this: AUTHOR. Herman Melville
 *  - Chapters will be labeled like this: CHAPTER 1. Loomings.
 *  - Title/Author will come before the 1st chapter
 *  - Chapters are in order
 *  - A double line break means the end of a paragraph
 *  - File is in utf-8 format (https://en.wikipedia.org/wiki/UTF-8)
 * @param {string} fileContent 
 * @returns Book object
 */
function parseBookFromText(fileContent) {
  const lines = fileContent.split(/\r?\n/); // Split into list of lines
  const book = new Book(); // Create an empty book

  book.id = generateBookId(fileContent);

  let lastChapterId = -1;
  let currentChapter = null;
  let currentParagraph = '';

  for (const line of lines) {
    const lowerLine = line.trim().toLowerCase();
    if (/^TITLE\./i.test(line)) {
      book.title = line.replace(/TITLE\./i, '').trim();

    } else if (/^AUTHOR\./i.test(line)) {
      book.author = line.replace(/AUTHOR\./i, '').trim();

    } else if (/^CHAPTER \d+\./i.test(lowerLine)) {
      endCurrentChapter(book, currentChapter, currentParagraph);
      const [chapterIdentifier, chapterTitle] = line.split('. ');
      lastChapterId = parseInt(chapterIdentifier.replace(/CHAPTER/i, '').trim());
      currentChapter = new Chapter(lastChapterId, chapterTitle);
      currentParagraph = '';

    } else if (lowerLine === 'prologue' || lowerLine === 'epilogue') {
      endCurrentChapter(book, currentChapter, currentParagraph);
      currentChapter = new Chapter(++lastChapterId, line);
      currentParagraph = '';

    } else if (lowerLine != '' && currentChapter) {
      currentParagraph += ' ' + line;

    } else if (lowerLine == '' && currentParagraph != '') {
      endCurrentParagraph(book, currentChapter, currentParagraph);
      currentParagraph = '';
    }
  }

  endCurrentChapter(book, currentChapter, currentParagraph);

  return book;
}

async function generateBookId(fileContent) {
  const encoder = new TextEncoder();
  const data = encoder.encode(fileContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Adds the chapter and paragraph to the book, if they're valid (also generates the snippet if it's not set yet)
 * @param {Book} book 
 * @param {Chapter} currentChapter 
 * @param {string} currentParagraph 
 */
function endCurrentChapter(book, currentChapter, currentParagraph) {
  if (currentChapter) {
    endCurrentParagraph(book, currentChapter, currentParagraph);
    book.chapters.push(currentChapter);
  }
}

/**
 * Adds the paragraph to the chapter, if valid (also generates the snippet if it's not set yet)
 * @param {Book} book 
 * @param {Chapter} currentChapter 
 * @param {string} currentParagraph 
 */
function endCurrentParagraph(book, currentChapter, currentParagraph) {
  if (currentChapter && currentParagraph !== '') {
    currentChapter.paragraphs.push(currentParagraph);

    if (book.snippet === '') {
      book.snippet = currentParagraph.slice(0, Math.min(300, currentParagraph.length));
    }
  }
}

/**
 * Ingests a book from a file and calls the callback when done.
 * @param {File} bookFile 
 * @param {Callback} onReady callback that will be called with the Book object when done
 */
function ingestBook(bookFile, onReady) {
  const reader = new FileReader();

  // This is the callback that triggers once all the file reading is complete
  reader.onload = function() {
    const bookContents = reader.result;
    const book = parseBookFromText(bookContents);  // This is the function in bookParser.js
    onReady(book);
  };

  reader.readAsText(bookFile);
}
