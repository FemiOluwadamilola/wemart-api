// dependencies
const express = require("express");
const path = require("path");
const vhost = require("vhost");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
// const morgan = require("morgan");
const methodOverride = require("method-override");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const expressSession = require("express-session");
const rateLimit = require("express-rate-limit");
const {
  passportLocalCustomerAuthInit,
  passportLocalVendorAuthInit,
} = require("./config/passport-config");
const dbConnection = require("./config/dbConnection");
// const corsOptions = require("./config/corsOptions");

// routes
const vendorRoute = require("./routes/vendor");
const customerRoute = require("./routes/customer");
const SubdomainRouteHandler = require("./routes/SubdomainRouteHandler");

// init app
const app = express();

require("dotenv").config();

// database connection
dbConnection(mongoose);

// passport local init

// passportLocalCustomerAuthInit(passport);
passportLocalVendorAuthInit(passport);

// passportLocalAuth(passport)

// cors
app.use(cors("*"));

// API REQUEST LIMITER
// const limit = rateLimit({
//   windowMS: 10 * 60 * 1000,
//   max: 5,
// });

// app.use(limit);
// app.set("trust proxy", 1);

// express-session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// helmet middlewares
app.use(helmet());

// morgan  middleware
// app.use(morgan("dev"));

// ejs middleware
app.use(expressLayouts);
app.set("layout", "./layouts/client");
app.set("layout");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(methodOverride("_method"));

// vhost middleware for custom subdomain creation for vendors
app.use(vhost(`*.${process.env.DOMAIN_PORT}`, SubdomainRouteHandler));

// routes middlewares
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to wemart.ng API server",
  });
});

app.use("/api/vendors", vendorRoute);
app.use("/api/customers", customerRoute);

// error handler middleware
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

// server init
module.exports = app;
