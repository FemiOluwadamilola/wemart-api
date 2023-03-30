const cart = document.getElementById("cart");
const addToCartBtn = document.getElementById("addTocart-btn");
const form = document.querySelector("form");

// GET ITEMS IN CART
cart.addEventListener("click", async (e) => {
  try {
    let cartItems;
    if (sessionStorage.getItem("cartItems") === null) {
      cartItems = "Cart empty";
    } else {
      cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
    }

    console.log(cartItems);
  } catch (error) {
    console.log(error.message);
  }
});

// SHOPPING CART FUNCTIONALITIES
addToCartBtn.addEventListener("click", async (e) => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const queryParamsObj = Object.fromEntries(queryParams);
    let cartItems;
    if (sessionStorage.getItem("cartItems") === null) {
      cartItems = [];
    } else {
      cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
    }
    const cartItemsObj = {
      productId: queryParamsObj.productId,
      price: queryParamsObj.price,
    };
    cartItems.push(cartItemsObj);
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(`${cartItems.length} items added to cart`);
  } catch (error) {
    console.log(error.message);
  }
});

// CUSTOMER TO VENDOR STORE LOGIN AND REGISTRATION
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const url = window.location.href;
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    if (url.split("/")[3] === "signup") {
      const request = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
        }),
      });
      const response = await request.json();
      console.log(response);
    } else {
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      const response = await request.json();
      console.log(response);
    }
  } catch (e) {
    console.log(e.message);
  }
});
