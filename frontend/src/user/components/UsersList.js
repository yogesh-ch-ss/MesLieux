import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

import "./UsersList.css";

// UsersList passes every User to the UserItem component; shows "No users found" if there are no users
// props passed here are a list of users
// UsersList -> UserItem

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
