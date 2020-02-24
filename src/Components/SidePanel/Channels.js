import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { setChannel } from "../../Store/Actions/setChannel";
import firebase from "../../firebase";

const Channels = ({ userData }) => {
  const [data, setData] = useState({
    modal: false,
    channelName: "",
    channelDetails: "",
    channels: [],
    channelsRef: firebase.database().ref("channels"),
    // firstLoad: true
    activeChannel: null
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const addListeners = () => {
      let loadedChannels = [];
      data.channelsRef.on("child_added", snap => {
        loadedChannels.push(snap.val());
        setData(prev => ({ ...prev, channels: loadedChannels }));
      });
    };
    addListeners();
    return () => data.channelsRef.off();
  }, [data.channelsRef]);

  const closeModal = () => setData(prev => ({ ...prev, modal: false }));

  const openModal = () => setData(prev => ({ ...prev, modal: true }));

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid(data)) {
      addChannel();
    }
  };

  const addChannel = () => {
    const key = data.channelsRef.push().key;

    const newChannel = {
      id: key,
      name: data.channelName,
      details: data.channelDetails,
      createdBy: {
        name: userData.displayName,
        avatar: userData.photoURL
      }
    };
    data.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setData(prev => ({ ...prev, channelName: "", channelDetails: "" }));
        closeModal();
        console.log("added channel");
      })
      .catch(err => {
        console.log(err);
      });
  };
  const isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  const changeChannel = channel => {
    dispatch(setChannel(channel));
    setData(prev => ({ ...prev, activeChannel: channel.id }));
  };

  const displayChannels = channels => {
    return channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        active={data.activeChannel === channel.id}
      >
        #{channel.name}
      </Menu.Item>
    ));
  };
  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          ({data.channels.length}) <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {displayChannels(data.channels)}
      </Menu.Menu>

      <Modal basic open={data.modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of channel"
                name="channelName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Channel"
                name="channelDetails"
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default Channels;
