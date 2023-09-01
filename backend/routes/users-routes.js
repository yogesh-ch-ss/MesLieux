const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

// Get the list of users
router.get("/", usersControllers.getUsers);

// Signup
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), // normalizeEmail() = TesT@test.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

// Login
router.post("/login", usersControllers.login);

module.exports = router;
