import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";

const SidePanel = ({ userData }) => {
  return (
    <Menu
      style={{ backgroundColor: "#40123e" }}
      fixed="left"
      vertical
      inverted
      size="large"
    >
      <UserPanel userData={userData} />
      <Channels userData={userData} />
    </Menu>
  );
};

export default SidePanel;
