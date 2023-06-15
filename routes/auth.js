const express = require("express");
const routes = express.Router();
const authController = require("../controller/auth");
routes.get("/login", authController.getLogin);
routes.get("/signup", authController.getSignup);

module.exports = routes;
