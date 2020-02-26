import React, { useState, useEffect, useCallback } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import SingleMessage from "./SingleMessage";

const Messages = ({ channel, user }) => {
  const [data, setData] = useState({
    messages: [],
    messageLoading: true,
    messageRef: firebase.database().ref("messages")
  });

  const addMessageListener = useCallback(
    channelId => {
      setData(prev => ({
        ...prev,
        messages: []
      }));
      let loadedMessages = [];
      data.messageRef.child(channelId).on("child_added", snap => {
        loadedMessages.push(snap.val());
        setData(prev => ({
          ...prev,
          messages: loadedMessages,
          messageLoading: false
        }));
      });
    },
    [data.messageRef]
  );

  const addListeners = useCallback(
    channelId => {
      addMessageListener(channelId);
    },
    [addMessageListener]
  );

  useEffect(() => {
    if (channel && user) {
      addListeners(channel.id);
    }
    return () => {
      data.messageRef.off();
    };
  }, [channel, user, addListeners]);

  const displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <SingleMessage key={message.timestamp} message={message} user={user} />
      ));
    }
  };

  const displayChannelName = channel => (channel ? channel.name : "");

  const usersAmount = messages => {
    const users = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    return users.length === 1
      ? `${users.length} user`
      : `${users.length} users`;
  };

  return (
    <React.Fragment>
      <MessagesHeader
        channelName={displayChannelName(channel)}
        userAmount={usersAmount(data.messages)}
      />
      <Segment className="messages">
        <Comment.Group>{displayMessages(data.messages)}</Comment.Group>
      </Segment>
      <MessageForm messageRef={data.messageRef} channel={channel} user={user} />
    </React.Fragment>
  );
};

export default Messages;
