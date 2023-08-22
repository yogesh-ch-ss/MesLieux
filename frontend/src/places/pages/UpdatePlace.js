import React from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Kapaleeshwarar Temple",
    description: "A famous temple in Chennai",
    imageUrl:
      "https://www.gosahin.com/go/p/g/1547927567_kapaleeshwarar-temple3.jpg",
    address:
      "Ramakrishna Mutt Rd, Vinayaka Nagar Colony, Mylapore, Chennai, Tamil Nadu 600004",
    location: {
      lat: 13.0335973,
      lng: 80.2674289,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Kapaleeshwarar Temple",
    description: "A famous temple in Chennai",
    imageUrl:
      "https://chennaitourism.travel/images/places-to-visit/headers/kapaleeswarar-temple-chennai-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    address:
      "Ramakrishna Mutt Rd, Vinayaka Nagar Colony, Mylapore, Chennai, Tamil Nadu 600004",
    location: {
      lat: 13.0335973,
      lng: 80.2674289,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }

  return (
    <form>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={() => {}}
        value={identifiedPlace.title}
        valid={true}
      />
      <Input
        id="description"
        element="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={() => {}}
        value={identifiedPlace.description}
        valid={true}
      />
      <Button type="submit" disabled={true}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
