import React from "react";

import UsersList from "../components/UsersList";


// Users page displays all the users and their places.
// Connected to UsersList component 
// Users -> UsersList -> UserItem

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Yogesh",
      image:
        "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png",
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
