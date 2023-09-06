const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

const Place = require("../models/place");

// This controller file is used to define middleware functions for /api/places/...

let DUMMY_PLACES = [
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

// Contoller to: Finding a place by PlaceID
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;

  try {
    place = await Place.findById(placeId); // Doesn't return a promise
  } catch (err) {
    // This error is thrown when something goes wrong while fetching data from the DB.
    const error = new HttpError(
      "Something went wrong. Could not find a place.",
      500
    );

    return next(error);
  }

  // If we don't find a place - Error 404
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided place id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // mongoose returns id in string, which can be lost since id is an object. {getters: true} ensures that mongoose creates a id property for the document.
};

// Controller to: // Finding a place by Creator/UserID
const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  // If we don't find a place - Error 404
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({ places }); // => { places } => { places: places }
};

// Controller to: Posting a place
const createPlace = async (req, res, next) => {
  // if the validation fails
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.thestkittsnevisobserver.com/wp-content/uploads/apple-park.jpg",
    creator,
  });

  try {
    await createdPlace.save(); // saving the data to DB
  } catch (err) {
    const error = new HttpError(
      "Creating the place failed. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// Controller to: Updating a place
const updatePlace = (req, res, next) => {
  // if the validation fails
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // creating a copy of the old object
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace; // replacing the old object with the updated object

  res.status(200).json({ place: updatedPlace });
};

// Controller to: Deleting a place
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  // Check if a place exists before we delete
  if (DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId); // filter will only retain if the condition is true => keep the place when the ID of the place about to be deleted doesn't match with the available place IDs
  res.status(200).json({ message: "Deleted place." });
};

// Exporting the pointer to the function to prevent express from executing the function
// Ex: getPlaceById =/= getPlaceById()
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
