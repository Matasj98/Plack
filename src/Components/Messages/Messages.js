import React, { useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

const Messages = ({ channel, user }) => {
  const [message, setMessage] = useState(firebase.database().ref("messages"));
  return (
    <React.Fragment>
      <MessagesHeader />
      <Segment className="messages">
        <Comment.Group></Comment.Group>
      </Segment>
      <MessageForm messageRef={message} channel={channel} user={user} />
    </React.Fragment>
  );
};

export default Messages;
