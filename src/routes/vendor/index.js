const router = require("express").Router();
// const passport = require("passport");
const {
  create_store,
  uploadProduct,
  productsPreview,
  deleteProduct,
  // verify_subscription,
  subscription_plan,
  verifyReferralId,
  dashboard,
} = require("../../controllers/vendors/index");
const {
  signup,
  signin,
  refreshToken,
  logout,
  forgotPassword,
} = require("../../controllers/vendors/auth");

const verifyAuth = require("../../middlewares/verifyAuth");

// const {initializePaystackPayment, initializePaystackSubscription} = require("../../services/paystack");

const {
  alreadyAuthenticated,
} = require("../../middlewares/verifyAuthWithPassport");

// VENDOR REGISTERATION ROUTE
router.post("/signup", signup);

// VENDOR LOGIN ROUTE
router.post("/signin", signin);

// REFRESH TOKEN ROUTE
router.post("/refreshToken", refreshToken);

// LOGOUT ROUTE
router.delete("/logout", logout);

// FORGOT PASSWORD ROUTE
router.post("/forgot_password", forgotPassword);

// VENDOR PRODUCTS REVIEW ROUTE
router.get("/products", verifyAuth, productsPreview);

// VENDOR DASHBOARD
router.get("/", verifyAuth, dashboard);

// VENDOR STORE SETUP ROUTE
// router.put("/store/:id", create_store);

router.put("/store", verifyAuth, create_store);

// VENDOR PRODUCT UPLOAD ROUTE
router.post("/", verifyAuth, uploadProduct);

// VENDOR PRODUCT ROUTE
router.delete("/:id", verifyAuth, deleteProduct);

// CHECK VENDOR SUBSCRIPTION PLAN
// router.get("/verify_subscription", verifyAuth, verify_subscription);

// VENDOR SUBSCRIPTION PLAN
router.patch("/subscription", verifyAuth, subscription_plan);

// VERIFY REFERRA CODE
router.get("/referra", verifyReferralId);

module.exports = router;
