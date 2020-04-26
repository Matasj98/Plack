// import React, { useState, useEffect, useRef } from "react";
// import { Segment, Comment } from "semantic-ui-react";
// import firebase from "../../firebase";
// import MessagesHeader from "./MessagesHeader";
// import MessageForm from "./MessageForm";
// import SingleMessage from "./SingleMessage";

// const Messages = ({ channel, user, isPrivate }) => {
//   const [data, setData] = useState({
//     messages: [],
//     messageLoading: null,
//     messageRef: firebase.database().ref("messages"),
//     privateMessageRef: firebase.database().ref("privateMessages"),
//     listeners: [],
//     searchTerm: ""
//   });

//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (channel && user) {
//       removeListeners(data.listeners);
//       setData(data => ({ ...data, messageLoading: true }));
//       addListeners(channel.id);
//     }

//     return () => {
//       data.messageRef.off();
//     };
//   }, [channel, user]);

//   useEffect(() => {
//     scrollToBottom();
//   });

//   const removeListeners = listeners => {
//     listeners.forEach(listener => {
//       listener.ref.child(listener.id).off(listener.event);
//     });
//   };

//   const addToListeners = (id, ref, event) => {
//     const index = data.listeners.findIndex(listener => {
//       return (
//         listener.id === id && listener.ref === ref && listener.event === event
//       );
//     });

//     if (index === -1) {
//       const newListener = { id, ref, event };
//       setData(prev => ({
//         ...prev,
//         listeners: data.listeners.concat(newListener)
//       }));
//     }
//   };

//   const addListeners = channelId => {
//     addMessageListener(channelId);
//   };

//   const addMessageListener = channelId => {
//     const setChannel = isPrivate ? `${channelId}/messages` : channelId;
//     const setMessageRef = isPrivate ? data.privateMessageRef : data.messageRef;
//     setData(prev => ({
//       ...prev,
//       messages: []
//     }));
//     let loadedMessages = [];
//     setMessageRef.child(setChannel).on("child_added", snap => {
//       loadedMessages.push(snap.val());
//       setData(prev => ({
//         ...prev,
//         messages: loadedMessages,
//         messageLoading: false
//       }));
//     });

//     addToListeners(setChannel, setMessageRef, "child_added");
//   };

//   const displayMessages = messages => {
//     if (messages.length > 0) {
//       return messages
//         .filter(filter => {
//           if (data.searchTerm.length === 0) {
//             return filter;
//           } else if (
//             filter.content !== undefined &&
//             filter.content.includes(data.searchTerm)
//           ) {
//             return filter;
//           }
//           return null;
//         })
//         .map(message => (
//           <SingleMessage
//             key={message.timestamp}
//             message={message}
//             user={user}
//           />
//         ));
//     }
//   };

//   const handleChange = e => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const displayChannelName = channel => (channel ? channel.name : "");

//   const usersAmount = messages => {
//     const users = messages.reduce((acc, message) => {
//       if (!acc.includes(message.user.name)) {
//         acc.push(message.user.name);
//       }
//       return acc;
//     }, []);
//     return users.length === 1
//       ? `${users.length} user`
//       : `${users.length} users`;
//   };

//   return (
//     <React.Fragment>
//       <MessagesHeader
//         handleChange={handleChange}
//         channelName={displayChannelName(channel)}
//         userAmount={usersAmount(data.messages)}
//       />
//       <Segment className="messages" loading={data.messageLoading}>
//         <Comment.Group>
//           {displayMessages(data.messages)}
//           <div ref={messagesEndRef} />
//         </Comment.Group>
//       </Segment>
//       <MessageForm
//         messageRef={isPrivate ? data.privateMessageRef : data.messageRef}
//         isPrivate={isPrivate}
//         channel={channel}
//         user={user}
//       />
//     </React.Fragment>
//   );
// };

// export default Messages;

import React, { useRef } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import SingleMessage from "./SingleMessage";

class Messages extends React.Component {
  state = {
    messages: [],
    messageLoading: null,
    messageRef: firebase.database().ref("messages"),
    privateMessageRef: firebase.database().ref("privateMessages"),
    listeners: [],
    searchTerm: ""
  }

  messagesEndRef = useRef(null);

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount = () =>{
    if (this.props.channel && this.props.user) {
      this.removeListeners(this.state.listeners);
      this.setState({ messageLoading: true });
      this.addListeners(this.props.channel.id);
    }
  }

  componentWillUnmount = () =>{
    this.messageRef.off();
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listeners: this.state.listeners.concat(newListener)
      });
    }
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    const setChannel = this.props.isPrivate ? `${channelId}/messages` : channelId;
    const setMessageRef = this.props.isPrivate ? this.props.privateMessageRef : this.props.messageRef;
    this.setState({
     
      messages: []
    });
    let loadedMessages = [];
    setMessageRef.child(setChannel).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messageLoading: false
      });
    });

    this.addToListeners(setChannel, setMessageRef, "child_added");
  };

  displayMessages = messages => {
    if (messages.length > 0) {
      return messages
        .filter(filter => {
          if (this.state.searchTerm.length === 0) {
            return filter;
          } else if (
            filter.content !== undefined &&
            filter.content.includes(this.state.searchTerm)
          ) {
            return filter;
          }
          return null;
        })
        .map(message => (
          <SingleMessage
            key={message.timestamp}
            message={message}
            user={this.props.user}
          />
        ));
    }
  };

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value });
  };

  displayChannelName = channel => (channel ? channel.name : "");

  usersAmount = messages => {
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
render(){
  return (
    <React.Fragment>
      <MessagesHeader
        handleChange={this.handleChange}
        channelName={this.displayChannelName(this.props.channel)}
        userAmount={this.usersAmount(this.state.messages)}
      />
      <Segment className="messages" loading={this.state.messageLoading}>
        <Comment.Group>
          {this.displayMessages(this.state.messages)}
          <div ref={this.messagesEndRef} />
        </Comment.Group>
      </Segment>
      <MessageForm
        messageRef={this.props.isPrivate ? this.state.privateMessageRef : this.props.messageRef}
        isPrivate={this.props.isPrivate}
        channel={this.props.channel}
        user={this.props.user}
      />
    </React.Fragment>
  )
}
  
};

export default Messages;

