import React from "react";

import "./MainHeader.css";

// This component is the page header which will be constantly available throughout the SPA
// props here displays the children
// MainHeader -> MainNavigation

const MainHeader = (props) => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
