const express = require("express");
const app = express();
const router = require("./controller/router");
const mongoose = require("./dataBase/mongodb_config");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("views"));
app.use(express.static("upload"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000,
    },
  })
);

app.use("/", router);
app.listen(8080);
