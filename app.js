const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const publicRoutes = require("./routes/public");

app.use(publicRoutes);

app.listen("3000");
