const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Yogesh",
    email: "test@email.com",
    password: "tester",
  },
];

// Controller to: Get the list of users
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

//Controller to: Signup
const signup = async (req, res, next) => {
  // if the validation fails
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later.",
      500
    );
    return next(error);
  }

  // If the User credentials (email) already exists
  if (existingUser) {
    const error = new HttpError(
      "User exists already. Please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed. Please try again2.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Controller to: Login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed. Please try again later.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials. Could not Log you in.",
      401
    );
    return next(error);
  }

  // If the password matches
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
