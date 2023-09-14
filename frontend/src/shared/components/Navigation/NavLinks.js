import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

// NavLinks components has the navigational links (in the header) to other pages in the SPA

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>

      {auth.isLoggedIn && (
        // renders only when logged in
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        // renders only when logged in
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        // renders only when NOT logged in
        <li>
          <NavLink to="/auth">LOGIN</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
