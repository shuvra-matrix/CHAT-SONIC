const express = require("express");
const publicController = require("../controller/public");

const routes = express.Router();

routes.get("/", publicController.getIndex);
routes.post("/", publicController.postChat);

module.exports = routes;
