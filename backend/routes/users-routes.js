const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

// Get the list of users
router.get("/", usersControllers.getUsers);

// Signup
router.post("/signup", usersControllers.signup);

// Login
router.post("/login", usersControllers.login);

module.exports = router;
