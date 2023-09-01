const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userController = require("../controllers/user");

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin);

module.exports = router;