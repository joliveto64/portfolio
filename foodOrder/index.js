import { menuArray } from "./data.js";
const main = document.querySelector(".main");
const orderContainer = document.querySelector(".order-container");
const bottomContainer = document.querySelector(".bottom-container");
const modal = document.querySelector(".modal");
const payBtn = document.querySelector(".pay-button");
const thanks = document.querySelector(".thanks-message");
const nameInput = document.querySelector("name");
const form = document.querySelector("form");

let totalPrice = 0;

renderItemsHtml();

function renderItemsHtml() {
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

document.addEventListener("click", (event) => {
  thanks.classList.add("hide-thanks");
  orderContainer.classList.remove("hidden");
  bottomContainer.classList.remove("hide-bottom");

  // ADD ITEMS TO THE ORDER SECTION**************
  menuArray.forEach((item) => {
    if (event.target.dataset.id === item.id.toString()) {
      orderContainer.innerHTML += `<div class="added-item">
      <div class="added-item-name">${item.name}<button class="remove-btn ${
        item.name
      }">remove</button></div>
      <div class="added-item-price">${"$" + item.price}</div>
    </div>`;
      totalPrice += item.price;
    }
  });

  if (bottomContainer.innerHTML === "") {
    renderTotalSection();
  }

  updatePrice();

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
  bottomContainer.classList.remove("hide-bottom");

  bottomContainer.innerHTML += `<div class="total-container">
    <h3>Total price:</h3>
    <div class="total-price">$$$</div>
    </div>
    <button class="order-btn">Complete Order</button>
  </div>`;
}

function updatePrice() {
  const totalPriceDiv = document.querySelector(".total-price");
  totalPriceDiv.innerText = "$" + totalPrice;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.classList.add("hide-modal");
  orderContainer.classList.add("hidden");
  bottomContainer.classList.add("hide-bottom");
  thanks.classList.remove("hide-thanks");
});

// 1. clicked anywhere works to show bottom content, when I tried to fix it it stopped displying added items
// 2. can't figure out how to make the remove button work
