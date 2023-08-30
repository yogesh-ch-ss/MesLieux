const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
  },
];

// Finding a place by PlaceID
router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // If we don't find a place - Error 404
  if (!place) {
    const error = new Error(
      "Could not find a place for the provided place id."
    );
    error.code = 404;
    throw error;
  }

  res.json({ place }); // => { place } => { place: place }
});

// Finding a place by Creator/UserID
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  // If we don't find a place - Error 404
  if (!place) {
    const error = new Error(
      "Could not find a place for the provided user id."
    );
    error.code = 404;
    return next(error);
  }

  res.json({ place }); // => { place } => { place: place }
});

module.exports = router;
