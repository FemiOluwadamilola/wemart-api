// dependencies
const express = require("express");
const path = require("path");
const vhost = require("vhost");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const methodOverride = require("method-override");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const expressSession = require("express-session");
const {
  passportLocalCustomerAuthInit,
  passportLocalVendorAuthInit,
} = require("./config/passport-config");
const dbConnection = require("./config/dbConnection");
const corsOptions = require("./config/corsOptions");
// routes
const vendorRoute = require("./routes/vendor");
const customerRoute = require("./routes/customer");
const SubdomainRouteHandler = require("./routes/SubdomainRouteHandler");
const Host = process.env.HOST;
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
app.use(cors(corsOptions));

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
app.use(vhost("*.localhost", SubdomainRouteHandler));

// routes middlewares
app.use("/api/vendors", vendorRoute);
app.use("/api/customers", customerRoute);

// server init
module.exports = app;
