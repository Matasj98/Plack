import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ColorPanel from "../../Components/ColorPanel/ColorPanel";
import SidePanel from "../../Components/SidePanel/SidePanel";
import Messages from "../../Components/Messages/Messages";
import MetaPanel from "../../Components/MetaPanel/MetaPanel";
import { useSelector } from "react-redux";

import "../../App.css";

const MainPage = () => {
  const data = useSelector(state =>
    state.user.user !== null
      ? {
          user: state.user.user,
          channel: state.channel.channel,
          isPrivate: state.channel.isPrivate
        }
      : { user: "" }
  );
  return (
    <Grid columns="equal">
      {/* <GridColumn> */}
      <ColorPanel />
      {/* </GridColumn> */}
      {/* <GridColumn> */}
      <SidePanel userData={data.user} />
      {/* </GridColumn> */}
      <GridColumn style={{ marginLeft: "320px" }}>
        <Messages
          channel={data.channel}
          user={data.user}
          isPrivate={data.isPrivate}
        />
      </GridColumn>
      <GridColumn width={4}>
        <MetaPanel />
      </GridColumn>
    </Grid>
  );
};

export default MainPage;
