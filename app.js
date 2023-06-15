const bodyParser = require("body-parser");
const express = require("express");
const mongoos = require("mongoose");
const port = "3000";
const path = require("path");
require("dotenv").config();
const MONGO_CONNECT = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}mymongoinit.6md0cxy.mongodb.net/chatguru?retryWrites=true&w=majority`;

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const { Console } = require("console");

app.use(authRoutes);
app.use(publicRoutes);

mongoos
  .connect(MONGO_CONNECT)
  .then((result) => {
    app.listen(process.env.POST || port, () => {
      console.log(`listning to the port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
