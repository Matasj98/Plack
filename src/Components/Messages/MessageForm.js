import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";

const MessageForm = ({ messageRef, channel, user }) => {
  const [data, setData] = useState({
    message: "",
    loading: false,
    error: ""
  });

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const createMessage = () => {
    const message = {
      content: data.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    return message;
  };

  const sendMessage = () => {
    if (data.message.length > 0) {
      setData(prev => ({ ...prev, loading: true, error: "" }));
      messageRef
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setData(prev => ({ ...prev, loading: false, message: "" }));
        })
        .catch(err => {
          console.log(err);
          setData(prev => ({
            ...prev,
            loading: false,
            message: "",
            error: err.message
          }));
        });
    } else setData(prev => ({ ...prev, error: "No data filled" }));
  };

  return (
    <Segment className="messageForm">
      <Input
        fluid
        name="message"
        label={<Button icon="add" />}
        labelPosition="left"
        className={data.error.length > 0 ? "error" : null}
        placeholder="Write your message"
        onChange={handleChange}
      />
      <Button.Group icon widths="2" style={{ marginTop: "10px" }}>
        <Button
          color="green"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
        />
        <Button
          color="red"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
