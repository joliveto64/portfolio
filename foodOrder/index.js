import { menuArray } from "./data.js";
const main = document.querySelector(".main");
const orderContainer = document.querySelector(".order-container");
const bottomContainer = document.querySelector(".bottom-container");
const modal = document.querySelector(".modal");
const thanks = document.querySelector(".thanks-message");
const form = document.querySelector("form");

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
      <div class="added-item-name">${
        item.name
      }<button class="remove-btn" data-id="${item.id}">remove</button></div>
      <div class="added-item-price">${"$" + item.price}</div>
    </div>`;
  });
}

document.addEventListener("click", (event) => {
  // HACK!
  if (!event.target.dataset.id && orderArray.length == 0) {
    return;
  }

  thanks.classList.add("hide-thanks");
  orderContainer.classList.remove("hidden");
  bottomContainer.classList.remove("hide-bottom");

  // ADD ITEMS TO THE ORDER ARRAY**************
  if (event.target.classList.contains("add-btn")) {
    menuArray.forEach((item) => {
      if (event.target.dataset.id === item.id.toString()) {
        orderArray.push(item);
        renderOrdersHtml();
      }
    });
  }

  if (event.target.classList.contains("remove-btn")) {
    for (let i = 0; i < orderArray.length; i++) {
      const item = orderArray[i];
      if (item.id === parseInt(event.target.dataset.id)) {
        orderArray.splice(i, 1);
        renderOrdersHtml();
        break;
      }
    }
  }

  renderBottomSection();

  const clickedInsideModal = event.target.closest(".modal");

  if (event.target.classList.contains("order-btn")) {
    modal.classList.remove("hide-modal");
  } else if (!clickedInsideModal) {
    modal.classList.add("hide-modal");
  }
});

function renderBottomSection() {
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.classList.add("hide-modal");
  orderContainer.classList.add("hidden");
  bottomContainer.classList.add("hide-bottom");
  thanks.classList.remove("hide-thanks");
  orderArray = [];
});
