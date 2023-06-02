const characters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ",",
  "|",
  ":",
  ";",
  "<",
  ">",
  ".",
  "?",
  "/",
];

buttons = document.getElementById("buttons");
button1 = document.getElementById("gen1");
button2 = document.getElementById("gen2");

let firstPassword;
let secondPassword;

function generatePassword() {
  let password1 = "";
  let password2 = "";
  let selector = document.getElementById("select");
  let length = parseInt(selector.value);

  for (let i = 1; i < length + 1; i++) {
    password1 += characters[Math.floor(Math.random() * characters.length)];
    password2 += characters[Math.floor(Math.random() * characters.length)];
  }

  button1.textContent = password1;
  button2.textContent = password2;

  firstPassword = password1;
  secondPassword = password2;
}

function copy(event) {
  if (event.target.innerText != "xxxxxxxxxxxxxxx") {
    navigator.clipboard.writeText(event.target.innerText);
  }

  if (event.target.id === "gen1" && button1.textContent != "xxxxxxxxxxxxxxx") {
    button1.textContent = "Copied!";

    setTimeout(() => {
      button1.innerText = firstPassword;
    }, 1500);
  } else if (
    event.target.id === "gen2" &&
    button2.textContent != "xxxxxxxxxxxxxxx"
  ) {
    button2.textContent = "Copied!";

    setTimeout(() => {
      button2.innerText = secondPassword;
    }, 1500);
  }
}
