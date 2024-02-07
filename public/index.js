const text2 =
  "I'm John! I have experience with React, Javascript, HTML and CCS.";
const text3 = "(I also play the drums and lots of Monster Hunter)";

const el2 = document.querySelector(".line2");
const el3 = document.querySelector(".line3");

function typeText(str, element) {
  for (let i = 0; i < str.length; i++) {
    setTimeout(() => {
      element.innerHTML += str[i];
    }, 45 * i);
  }
}

typeText(text2, el2);
setTimeout(() => {
  console.log("now");
  typeText(text3, el3);
}, 50 * text2.length);
