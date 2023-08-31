const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

// Finding a place by PlaceID
router.get("/:pid", placesControllers.getPlaceById);

// Finding a place by Creator/UserID
router.get("/user/:uid", placesControllers.getPlaceByUserId);

module.exports = router;
