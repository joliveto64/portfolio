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
  constructor(id = '', title = '', paragraphs = []) {
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
async function parseBookFromText(fileContent) {
  const lines = fileContent.split(/\r?\n/); // Split into list of lines
  const book = new Book(); // Create an empty book

  book.id = await generateBookId(fileContent);

  let currentChapter = null;
  let currentParagraph = '';

  for (const line of lines) {
    const lowerLine = line.trim().toLowerCase();
    if (/^TITLE\./i.test(line)) {
      book.title = line.replace(/TITLE\./i, '').trim();

    } else if (/^AUTHOR\./i.test(line)) {
      book.author = line.replace(/AUTHOR\./i, '').trim();

    } else if (/^CHAPTER [\-\dIVX]+/i.test(line)) {
      endCurrentChapter(book, currentChapter, currentParagraph);
      const [prefix, suffix] = line.split('.');
      const chapterId = prefix ? prefix.replace(/CHAPTER/i, '').trim() : '';
      const chapterTitle = suffix ? suffix.trim() : '';
      currentChapter = new Chapter(chapterId, chapterTitle);
      currentParagraph = '';

    } else if (lowerLine === 'prologue' || lowerLine === 'epilogue') {
      endCurrentChapter(book, currentChapter, currentParagraph);
      currentChapter = new Chapter(line.trim(), line.trim());
      currentParagraph = '';

    } else if (lowerLine != '' && currentChapter) {
      currentParagraph += ' ' + line;

    } else if (lowerLine == '' && currentParagraph != '') {
      endCurrentParagraph(book, currentChapter, currentParagraph);
      currentParagraph = '';
    }
  }

  endCurrentChapter(book, currentChapter, currentParagraph);

  console.log("ingested book!", book.chapters.length, book.id);

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
    console.log("-got chapter", currentChapter.id, currentChapter.title, currentChapter.paragraphs.length)

    if (book.snippet === '') {
      let snippet = '';
      for (const p in currentChapter.paragraphs) {
        snippet += currentChapter.paragraphs[p];
        if (snippet.length > 300) {
          snippet = snippet.substring(0, 300);
          break;
        }
      }

      book.snippet = snippet;
    }
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
    parseBookFromText(bookContents).then((book) => {
      // The book has been parsed!
      onReady(book);
    });
  };

  reader.readAsText(bookFile);
}
