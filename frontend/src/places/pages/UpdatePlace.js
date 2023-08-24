import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

// importing a defined custom hook to manage the Form
import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

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
  const [isLoading, setIsLoading] = useState(true);

  const placeId = useParams().placeId;

  // Passing initialInputs, initialFormValidity to useForm
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    setFormData(
      {
        title: {
          value: identifiedPlace.title,
          isValid: true,
        },
        description: {
          value: identifiedPlace.description,
          isValid: true,
        },
      },
      true
    );
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  // placeUpdateSubmitHandler is triggered when the form is submitted.
  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="text"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
  );
};

export default UpdatePlace;
