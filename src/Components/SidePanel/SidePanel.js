import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";

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
      <DirectMessages userData={userData} />
    </Menu>
  );
};

export default SidePanel;
