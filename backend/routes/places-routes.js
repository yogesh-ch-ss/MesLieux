const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

// Finding a place by PlaceID
router.get("/:pid", placesControllers.getPlaceById);

// Finding a place by Creator/UserID
router.get("/user/:uid", placesControllers.getPlacesByUserId);

// Posting a place
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

// Updating a place
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

// Deleting a place
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
