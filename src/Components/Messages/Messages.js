import React, { useState, useEffect, useRef } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import SingleMessage from "./SingleMessage";

const Messages = ({ channel, user }) => {
  const [data, setData] = useState({
    messages: [],
    messageLoading: null,
    messageRef: firebase.database().ref("messages"),
    listeners: [],
    searchTerm: ""
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (channel && user) {
      removeListeners(data.listeners);
      setData(data => ({ ...data, messageLoading: true }));
      addListeners(channel.id);
    }

    return () => {
      data.messageRef.off();
    };
  }, [channel, user]);

  useEffect(() => {
    scrollToBottom();
  });

  const removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  const addToListeners = (id, ref, event) => {
    const index = data.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      setData(prev => ({
        ...prev,
        listeners: data.listeners.concat(newListener)
      }));
    }
  };

  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  const addMessageListener = channelId => {
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
    addToListeners(channelId, data.messageRef, "child_added");
  };

  const displayMessages = messages => {
    if (messages.length > 0) {
      return messages
        .filter(filter => {
          if (data.searchTerm.length === 0) {
            return filter;
          } else if (
            filter.content !== undefined &&
            filter.content.includes(data.searchTerm)
          ) {
            return filter;
          }
          return null;
        })
        .map(message => (
          <SingleMessage
            key={message.timestamp}
            message={message}
            user={user}
          />
        ));
    }
  };

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
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
        handleChange={handleChange}
        channelName={displayChannelName(channel)}
        userAmount={usersAmount(data.messages)}
      />
      <Segment className="messages" loading={data.messageLoading}>
        <Comment.Group>
          {displayMessages(data.messages)}
          <div ref={messagesEndRef} />
        </Comment.Group>
      </Segment>
      <MessageForm messageRef={data.messageRef} channel={channel} user={user} />
    </React.Fragment>
  );
};

export default Messages;
