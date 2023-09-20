const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Finding a place by PlaceID
router.get("/:pid", placesControllers.getPlaceById);

// Finding a place by Creator/UserID
router.get("/user/:uid", placesControllers.getPlacesByUserId);

//  Middleware to check if requests have a token to access the post, patch, delete routes.
router.use(checkAuth);

// Posting a place
router.post(
  "/",
  fileUpload.single("image"),
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
