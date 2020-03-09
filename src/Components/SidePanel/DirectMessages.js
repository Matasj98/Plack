import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setChannel } from "../../Store/Actions/setChannel";
import { Menu, Icon, Image } from "semantic-ui-react";

class DirectMessages extends React.Component {
  state = {
    userRef: firebase.database().ref("users"),
    channelsRef: firebase.database().ref("privateMessages"),
    users: [],
    presenceRef: firebase.database().ref("presence"),
    activeChannel: null
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
      // this.createChannel(this.setChannelId(userId, snap.key));
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
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", snap => {
      if (userId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updateUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updateUsers });
  };

  setChannel = user => {
    this.setState({ activeChannel: user.uid });
    const channelId = this.setChannelId(this.props.userData.uid, user.uid);
    const channel = {
      id: channelId,
      name: user.name
    };
    this.createChannel(channelId, channel);
    this.props.setChannel(channel, true);
  };

  createChannel = (channelId, channel) => {
    this.state.channelsRef
      .child(channelId)
      .update(channel)
      .catch(err => console.log(err));
  };

  setChannelId = (userId, friendId) => {
    return userId > friendId
      ? `${userId}/${friendId}`
      : `${friendId}/${userId}`;
  };

  displayUsers = users => {
    return users.map(user => (
      <Menu.Item
        key={user.uid}
        onClick={() => this.setChannel(user)}
        active={this.state.activeChannel === user.uid}
      >
        <span>
          <Image src={user.avatar} avatar />
          {user.name}
        </span>
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

export default connect(null, { setChannel })(DirectMessages);
