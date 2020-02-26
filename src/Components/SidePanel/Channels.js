import React from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { setChannel } from "../../Store/Actions/setChannel";
import firebase from "../../firebase";

class Channels extends React.Component {
  state = {
    modal: false,
    channelName: "",
    channelDetails: "",
    channels: [],
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: null
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    console.log("Unmount");
    this.state.channelsRef.off();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    if (this.state.firstLoad) {
      this.props.setChannel(this.state.channels[0]);
      this.setState({
        firstLoad: false,
        activeChannel: this.state.channels[0].id
      });
    }
  };

  closeModal = () => this.setState({ modal: false });

  openModal = () => this.setState({ modal: true });

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  addChannel = () => {
    const key = this.state.channelsRef.push().key;
    const { userData } = this.props;
    const { channelName, channelDetails } = this.state;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: userData.displayName,
        avatar: userData.photoURL
      }
    };
    this.state.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
      })
      .catch(err => {
        console.log(err);
      });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  changeChannel = channel => {
    this.props.setChannel(channel);
    this.setState({ activeChannel: channel.id });
  };

  displayChannels = channels => {
    return channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        active={this.state.activeChannel === channel.id}
      >
        #{channel.name}
      </Menu.Item>
    ));
  };
  render() {
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            ({this.state.channels.length}){" "}
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(this.state.channels)}
        </Menu.Menu>

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form.Field onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form.Field>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(null, { setChannel })(Channels);
