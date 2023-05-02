// mongodb
require("./config/db");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./domains/user/model");

const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const routes = require("./routes");
const qrcode = require('qrcode')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const speakeasy = require('speakeasy');

// create server app
const app = express();
// app.use(express.urlencoded({ extended: true }));
// set up view engine
// app.set("view engine", "ejs");
app.use(bodyParser.json());
// set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// set up express-session middleware
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

// set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set up local strategy
passport.use(new LocalStrategy(User.authenticate()));

// set up passport-local-mongoose middleware
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set up cors middleware
app.use(cors());

// set up routes
app.use("/api/v1", routes);

module.exports = app;
