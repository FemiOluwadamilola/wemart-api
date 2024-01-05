const router = require("express").Router();
const { findStore } = require("../services/vendor/store");
const { fetchVendor } = require("../services/vendor/vendor");
const { signin, signup } = require("../controllers/customer/auth");
const {
  fetchProductById,
  fetchProducts,
} = require("../services/vendor/product");

// GET VENDOR STORE FRONT FROM SUBDOMAIN
router.get("/", async (req, res) => {
  const subdomin = req.vhost;
  const store = await findStore({ name: subdomin[0] });
  if (store) {
    const vendor = fetchVendor({ store_id: store.id });
    const products = await fetchProducts({ vendorId: store.vendorId }, 8, {
      createdAt: -1,
    });
    res.status(200).render("store-front/home", {
      layout: "./layouts/store",
      title: `${store.name}`,
      store,
      products,
      subdomin,
      vendor,
    });
  } else {
    res.status(404).render("store-front/404page", {
      layout: "./layouts/store",
      title: "page not found!",
    });
  }
});

// GET CUSTOMER SIGNUP PAGE
router.get("/signup", (req, res) => {
  const subdomin = req.vhost;
  res.status(200).render("store-front/signup", {
    layout: "./layouts/store",
    title: "signup",
    storeName: subdomin,
  });
});

// GET CUSTOMER SIGNIN PAGE
router.get("/signin", (req, res) => {
  const subdomin = req.vhost[0];
  res.status(200).render("store-front/signin", {
    layout: "./layouts/store",
    title: "signin",
    storeName: subdomin,
  });
});

// GET CUSTOMER CART PAGE
router.get("/cart", async (req, res) => {
  const subdomin = req.vhost;
  const store = await findStore({ name: subdomin[0] });
  if (store) {
    const vendor = fetchVendor({ store_id: store.id });
    res.status(200).render("store-front/cart", {
      layout: "./layouts/store",
      title: "cart",
      store,
      vendor,
    });
  } else {
    res.status(404).render("store-front/404page", {
      layout: "./layouts/store",
      title: "page not found!",
    });
  }
});

// GET CUSTOMER FAVOURITE PRODUCTS PAGE
router.get("/favorite", async (req, res) => {
  const subdomin = req.vhost;
  const store = await findStore({ name: subdomin[0] });
  if (store) {
    const vendor = fetchVendor({ store_id: store.id });
    res.status(200).render("store-front/favorite", {
      layout: "./layouts/store",
      title: "favorite",
      store,
      vendor,
    });
  } else {
    res.status(404).render("store-front/404page", {
      layout: "./layouts/store",
      title: "page not found!",
    });
  }
});

// GET VENDOR PRODUCT DETAILS
router.get("/product-details", async (req, res) => {
  try {
    const storename = req.vhost[0];
    const productId = req.query.productId;
    const store = await findStore({ name: storename });
    if (store) {
      const vendor = fetchVendor({ store_id: store.id });
      if (vendor) {
        const product = await fetchProductById(productId);
        res.status(200).render("store-front/product-details", {
          layout: "./layouts/store",
          title: "product-details",
          vendor,
          product,
          store,
        });
      } else {
        return res.status(403).json({
          message: "vendor does not exist!",
        });
      }
    } else {
      return res.status(404).json({
        message: "error: store not found!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later!",
      error: err.message,
    });
  }
});

// GET PRODUCTS PAGE
router.get("/shop", async (req, res) => {
  const subdomin = req.vhost;
  const store = await findStore({ name: subdomin[0] });
  if (store) {
    const vendor = await fetchVendor({ store_id: store.id });
    const products = await fetchProducts({ vendorId: store.vendorId }, 9, {
      createdAt: -1,
    });
    res.status(200).render("store-front/shop", {
      layout: "./layouts/store",
      title: `${store.name}`,
      store,
      products,
      subdomin,
      vendor,
    });
  } else {
    res.status(404).render("store-front/404page", {
      layout: "./layouts/store",
      title: "page not found!",
    });
  }
});

// REGISTER CUSTOMER TO VENDOR STORE
router.post("/signup", signup);

// LOGIN CUSTOMER TO VENDOR STORE
router.post("/signin", signin);

module.exports = router;
