const fs = require("fs"); // file system module from node.js
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

const app = express();

// const DB_URL = process.env.DB_URL;

// This bodyParser will parse any incoming request to the body in json
app.use(bodyParser.json());

// Middleware to access image files
app.use("/uploads/images", express.static(path.join("uploads", "images"))); // return s the requested files

// Middleware to overcome CORS error - sending a header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Middleware to Places => /api/users/...
app.use("/api/users", usersRoutes); // => /api/users/...

// Middleware to Places => /api/places/...
app.use("/api/places", placesRoutes); // => /api/places/...

// This middleware is for requests without any response
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

// This middleware will only execute on requests that have an error
app.use((error, req, res, next) => {
  // if the failed request had a file
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  // if the response is sent, we forward (nsext) the error
  if (res.headerSent) {
    return next(error);
  }

  // if no response has been sent
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@meslieuxcluster0.xmck7lw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Listening to port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
