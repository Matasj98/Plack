import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const isOnMessage = (message, user) => {
  return message.user.id === user.uid ? "message_self" : null;
};

const isImage = message => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

const timeFromNow = timestamp => {
  return moment(timestamp).fromNow();
};

const SingleMessage = ({ message, user }) => {
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOnMessage(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>

        {isImage(message) ? (
          <Image src={message.image} className="message_image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default SingleMessage;
