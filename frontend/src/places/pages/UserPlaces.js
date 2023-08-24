import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

// UserPlaces displays the places of the user
// UserPlaces -> PlaceList -> PlaceItems

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
    title: "Kabali Temple",
    description: "A famous temple of lord Shiva in Chennai",
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

const UserPlaces = () => {
  const userId = useParams().userId; 
  // useParams() returns the component that is dynamically encoded in the URL
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
