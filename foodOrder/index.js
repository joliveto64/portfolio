import { menuArray } from "./data.js";
const main = document.querySelector(".main");
const orderContainer = document.querySelector(".order-container");
const bottomContainer = document.querySelector(".bottom-container");
const modal = document.querySelector(".modal");
const payBtn = document.querySelector(".pay-button");
const thanks = document.querySelector(".thanks-message");
const nameInput = document.querySelector("name");
const form = document.querySelector("form");

// let totalPrice = 0;
let orderArray = [];

renderItemsHtml();

function renderItemsHtml() {
  main.innerHTML = "";
  menuArray.forEach((item) => {
    main.innerHTML += `<div class="item-container">
        <div class="emoji-info-price">
            <h1 class="emoji">${item.emoji}</h1>
            <div class="info">
                <h3 class="name">${item.name}</h3>
                <p class="ingredients">${item.ingredients.join(", ")}</p>
                <p class="price">$${item.price}</p>
            </div>
        </div>
        <button class="add-btn" data-id="${item.id}">+</button>
    </div>
    `;
  });
}

function renderOrdersHtml() {
  orderContainer.innerHTML = "";
  orderArray.forEach((item) => {
    orderContainer.innerHTML += `<div class="added-item">
      <div class="added-item-name">${item.name}<button class="remove-btn" data-id="${item.id}">remove</button></div>
      <div class="added-item-price">${"$" + item.price}</div>
    </div>`;
  });
}

// Neater way to handle clicks:
// document.addEventListener("click", (event) => {
//   // These just handle changing your internal state (ie orderArray and menuArray), no ui work
//   if (event === 'add') {
//     handleAddClick(event);
//   } else if (event === 'remove') {
//     handleRmClick(event);
//   } else if (event === 'order') {
//     handleOrderClick(event);
//   }

//   // redraw from scratch all the parts of your UI that maybe change 
//   // here using your internal state (ie orderArray and menuArray)
// });

document.addEventListener("click", (event) => {
  // HACK!
  if (!event.target.dataset.id && orderArray.length == 0) {
    return;
  }

  thanks.classList.add("hide-thanks");
  orderContainer.classList.remove("hidden");
  bottomContainer.classList.remove("hide-bottom");

  // ADD ITEMS TO THE ORDER SECTION**************
  if (event.target.classList.contains("add-btn")) {
    menuArray.forEach((item) => {
      if (event.target.dataset.id === item.id.toString()) {
      //   orderContainer.innerHTML += `<div class="added-item">
      //   <div class="added-item-name">${item.name}<button class="remove-btn" data-id="${item.id}">remove</button></div>
      //   <div class="added-item-price">${"$" + item.price}</div>
      // </div>`;
        // totalPrice += item.price;
        orderArray.push(item);
        renderOrdersHtml();
      }
    });
  }

  if (event.target.classList.contains("remove-btn")) {
    for (let i = 0; i < orderArray.length; i++) {
      const item = orderArray[i];
      if (item.id === parseInt(event.target.dataset.id)) {
        // totalPrice -= item.price;
        orderArray.splice(i, 1);
        renderOrdersHtml();
        break;
      }
    }
  }

  // updatePrice();
  renderTotalSection();

  const orderBtn = document.querySelector(".order-btn");
  const clickedInsideModal = event.target.closest(".modal");

  if (event.target === orderBtn) {
    modal.classList.remove("hide-modal");
  } else if (!clickedInsideModal) {
    modal.classList.add("hide-modal");
  }

  // const removeBtn = document.querySelector("remove-btn");

  // // if (event.target === removeBtn) {
  // //   console.log(event.target.dataset.id);
  // // }
});

function renderTotalSection() {
  let totalPrice = 0;
  orderArray.forEach((item) => {
    totalPrice += item.price;
  });

  bottomContainer.classList.remove("hide-bottom");
  bottomContainer.innerHTML = `<div class="total-container">
    <h3>Total price:</h3>
    <div class="total-price">$${totalPrice}</div>
    </div>
    <button class="order-btn">Complete Order</button>
  </div>`;
}

// // function updatePrice() {
// //   let totalPrice = 0;
// //   orderArray.forEach((item) => {
// //     totalPrice += item.price;
// //   });

// //   const totalPriceDiv = document.querySelector(".total-price");
// //   totalPriceDiv.innerText = "$" + totalPrice;
// }

form.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.classList.add("hide-modal");
  orderContainer.classList.add("hidden");
  bottomContainer.classList.add("hide-bottom");
  thanks.classList.remove("hide-thanks");
});

// 1. clicked anywhere works to show bottom content, when I tried to fix it it stopped displying added items
// 2. can't figure out how to make the remove button work
