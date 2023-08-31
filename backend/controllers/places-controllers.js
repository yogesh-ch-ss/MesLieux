const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // If we don't find a place - Error 404
  if (!place) {
    throw new HttpError(
      "Could not find a place for the provided place id.",
      404
    );
  }

  res.json({ place }); // => { place } => { place: place }
};

// Controller to: // Finding a place by Creator/UserID
const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  // If we don't find a place - Error 404
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ place }); // => { place } => { place: place }
};

// Controller to: Posting a place
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

// Controller to: Updating a place
const updatePlace = (req, res, next) => {
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
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId); // filter will only retain if the condition is true => keep the place when the ID of the place about to be deleted doesn't match with the available place IDs
  res.status(200).json({ message: "Deleted place." });
};

// Exporting the pointer to the function to prevent express from executing the function
// Ex: getPlaceById =/= getPlaceById()
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
