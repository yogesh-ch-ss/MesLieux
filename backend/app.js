const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();


// This bodyParser will parse any incoming request to the body in json
app.use(bodyParser.json());

// Middleware to Places => /api/places/...
app.use("/api/places/", placesRoutes); // => /api/places/...

// This middleware will only execute on requests that have an error
app.use((error, req, res, next) => {
  // if the response is sent, we forward (next) the error
  if (res.headerSent) {
    return next(error);
  }

  // if no response has been sent
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

app.listen(5000);
