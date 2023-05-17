/*************************************************/
/* Book parsing algorithm below                  */
/*************************************************/

/**
 * Ingests all the books and call the callback for each when done.
 * param: {Callback} onReady callback that will be called with the Book object when done
 */
function ingestAllBooks(onReady) {
  parseBookFromText(dorianGrayText).then((book) => onReady(book));
  parseBookFromText(draculaText).then((book) => onReady(book));
  parseBookFromText(frankensteinText).then((book) => onReady(book));
  parseBookFromText(mobyDickText).then((book) => onReady(book));
}


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
 * param: {string} fileContent 
 * returns: Book object
 */
async function parseBookFromText(fileContent) {
  const lines = fileContent.split(/\r?\n/); // Split into list of lines
  const book = new Book(); // Create an empty book

  book.id = await generateBookId(fileContent);

  // let currentChapter = null;
  let currentParagraph = '';

  for (const line of lines) {
    const lowerLine = line.trim().toLowerCase();
    if (/^TITLE\./i.test(line)) {
      book.title = line.replace(/TITLE\./i, '').trim();

    } else if (/^AUTHOR\./i.test(line)) {
      book.author = line.replace(/AUTHOR\./i, '').trim();

    } else if (/^CHAPTER [\-\dIVX]+/i.test(line)) {
      // endCurrentChapter(book, currentChapter, currentParagraph);
      // const [prefix, suffix] = line.split('.');
      // const chapterId = prefix ? prefix.replace(/CHAPTER/i, '').trim() : '';
      // const chapterTitle = suffix ? suffix.trim() : '';
      // currentChapter = new Chapter(chapterId, chapterTitle);
      if (currentParagraph) {
        book.paragraphs.push(currentParagraph);
      }
      currentParagraph = line + ' ';

    } else if (lowerLine === 'prologue' || lowerLine === 'epilogue') {
      // endCurrentChapter(book, currentChapter, currentParagraph);
      // currentChapter = new Chapter(line.trim(), line.trim());
      if (currentParagraph) {
        book.paragraphs.push(currentParagraph);
      }
      currentParagraph = line + ' ';

    } else if (lowerLine != '') { // && currentChapter) {
      currentParagraph += line + ' ';

      if (!book.snippet || book.snippet.length < 300) {
        book.snippet += line + ' ';
        if (book.snippet.length > 300) {
          book.snippet = book.snippet.substring(0, 300);
        }
      }

    } else if (lowerLine == '' && currentParagraph != '') {
      // endCurrentParagraph(book, currentChapter, currentParagraph);
      if (currentParagraph) {
        book.paragraphs.push(currentParagraph);
      }
      currentParagraph = '';
    }
  }

  // endCurrentChapter(book, currentChapter, currentParagraph);

  console.log("ingested book!");//, book.chapters.length, book.id);

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

