const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

const Place = require("../models/place");
const User = require("../models/user");

// This controller file is used to define middleware functions for /api/places/...

// Contoller to: Finding a place by PlaceID --------------------
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;

  try {
    place = await Place.findById(placeId); // Doesn't return a promise
  } catch (err) {
    // This error is thrown when something goes wrong while fetching data from the DB.
    const error = new HttpError(
      "Something went wrong. Fetching a place failed.",
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

// Controller to: Finding a place by Creator/UserID --------------------
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }

  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places"); // populate accesses the Place collection through 'places' feature
  } catch (err) {
    // This error is thrown when something goes wrong while fetching data from the DB.
    const error = new HttpError(
      "Something went wrong. Fetching a place failed.",
      500
    );
    return next(error);
  }

  // If we don't find a place - Error 404
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  }); // map is used since places will be an array
};

// Controller to: Posting a place --------------------
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

  let user;
  // Finding a user who created the place
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating the place failed. Please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess }); // Save the createdPlace to Place DB

    // One user can create multiple place
    // One place belongs to one user only

    user.places.push(createdPlace); // user.places array will have createdPlace
    await user.save({ session: sess }); // Save the user on User DB
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating the place failed. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// Controller to: Updating a place --------------------
const updatePlace = async (req, res, next) => {
  // if the validation fails
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Updating a place failed.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Updating a place failed.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Controller to: Deleting a place --------------------
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate("creator"); // populate("creator") lets us reference document from other collection => creator acts as a relational reference
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Deleting a place failed.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this place id.", 404);
    return next(error);
  }

  console.log(place);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // await place.remove({ session: sess });
    await Place.deleteOne({ _id: placeId }).session(sess);

    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Deleting a place failed2.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

// Exporting the pointer to the function to prevent express from executing the function
// Ex: getPlaceById =/= getPlaceById()
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
