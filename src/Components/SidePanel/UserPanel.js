import React from "react";
import { useDispatch } from "react-redux";
import { resetApp } from "../../Store/Actions/resetApp";
import { handleOnlineStatus } from "../../Helpers/handleOnlineStatus";
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Dropdown,
  Image
} from "semantic-ui-react";
import firebase from "../../firebase";

const UserPanel = ({ userData }) => {
  const dispatch = useDispatch();

  const handleSignout = () => {
    firebase.auth().signOut();
    handleOnlineStatus(userData.uid);
    dispatch(resetApp());
  };

  const dropdownOptions = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{userData.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];

  return (
    <Grid>
      <GridColumn>
        <GridRow style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <HeaderContent>Plack</HeaderContent>
          </Header>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={userData.photoURL} spaced="right" avatar />
                  {userData.displayName}
                </span>
              }
              options={dropdownOptions}
            />
          </Header>
        </GridRow>
      </GridColumn>
    </Grid>
  );
};

export default UserPanel;
