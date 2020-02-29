import React from "react";
import firebase from "../../firebase";
import { Menu, Icon, Image } from "semantic-ui-react";

class DirectMessages extends React.Component {
  state = {
    userRef: firebase.database().ref("users"),
    users: [],
    presenceRef: firebase.database().ref("presence")
  };

  componentDidMount() {
    if (this.props.userData) {
      this.addEventListeners();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.userRef.off();
    this.state.presenceRef.off();
  };

  addEventListeners = () => {
    this.setUsers(this.props.userData.uid);
  };

  setUsers = userId => {
    let loadedUsers = [];
    this.state.userRef.on("child_added", snap => {
      if (userId !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.presenceRef.on("child_added", snap => {
      if (userId !== snap.key) {
        console.log("added");
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", snap => {
      if (userId !== snap.key) {
        console.log("remove");
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    console.log(this.state.users);
    const updateUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updateUsers });
  };

  displayUsers = users => {
    return users.map(user => (
      <Menu.Item key={user.uid}>
        <span>
          <Image src={user.avatar} avatar />
          {user.name}
        </span>
        {console.log(user.status)}
        <Icon name="rss" color={user.status === "offline" ? "red" : "green"} />
      </Menu.Item>
    ));
  };
  render() {
    return (
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="lock" /> PRIVATE MESSAGES
          </span>
        </Menu.Item>
        {this.displayUsers(this.state.users)}
      </Menu.Menu>
    );
  }
}

export default DirectMessages;
