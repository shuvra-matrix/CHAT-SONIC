const express = require("express");
const publicController = require("../controller/public");
const { body } = require("express-validator");

const routes = express.Router();

routes.get("/", publicController.getChatIndex);
routes.post("/", body("value").trim().isString(), publicController.postChat);

routes.get(
  "/dalle",

  publicController.getImageIndex
);
routes.post(
  "/dalle",
  body("value").trim().isString(),
  publicController.postImage
);

module.exports = routes;
