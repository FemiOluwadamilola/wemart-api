const cart = document.getElementById("cart");
const addToCartBtn = document.getElementById("addTocart-btn");
const form = document.querySelector("form");

// GET ITEMS IN CART
cart.addEventListener("click", async (e) => {
  let cartItems;
  if (sessionStorage.getItem("cartItems") === null) {
    cartItems = "Cart empty";
  } else {
    cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
  }

  console.log(cartItems);
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
