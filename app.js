const bodyParser = require("body-parser");
const express = require("express");
const port = "3000";
const path = require("path");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const publicRoutes = require("./routes/public");

app.use(publicRoutes);

app.listen(process.env.POST || port, () => {
  console.log(`listning to the port ${port}`);
});
