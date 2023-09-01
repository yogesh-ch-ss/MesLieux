const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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
const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user: Email already exists.", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

// Controller to: Login
const login = (req, res, next) => {
  const { email, password } = req.body;

  // Checking if the user exists
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  // If user email is not found or if the password doesn't match
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user: Credentials seem to be wrong.",
      401
    );
  }

  // If the password matches
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
