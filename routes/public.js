const express = require("express");
const publicController = require("../controller/public");
const { body } = require("express-validator");

const routes = express.Router();

routes.get("/", publicController.getIndex);
routes.post("/", body("value").trim().isString(), publicController.postChat);

module.exports = routes;
