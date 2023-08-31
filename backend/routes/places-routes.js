const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

// Finding a place by PlaceID
router.get("/:pid", placesControllers.getPlaceById);

// Finding a place by Creator/UserID
router.get("/user/:uid", placesControllers.getPlaceByUserId);

// Posting a place
router.post('/', placesControllers.createPlace);

// Updating a place
router.patch('/:pid', placesControllers.updatePlace);

// Deleting a place
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
