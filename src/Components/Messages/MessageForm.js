import React from "react";
import uuidv4 from "uuid/v4";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from "./FileModal";
import firebase from "../../firebase";

// const MessageForm = ({ messageRef, channel, user }) => {
//   const [data, setData] = useState({
//     message: "",
//     loading: false,
//     error: "",
//     modal: false,

//     uploadTask: null,
//     uploadState: "",
//     storageRef: firebase.storage().ref()
//   });

//   const handleChange = e => {
//     setData({
//       ...data,
//       [e.target.name]: e.target.value
//     });
//   };

//   const createMessage = () => {
//     const message = {
//       content: data.message,
//       timestamp: firebase.database.ServerValue.TIMESTAMP,
//       user: {
//         id: user.uid,
//         name: user.displayName,
//         avatar: user.photoURL
//       }
//     };
//     return message;
//   };

//   const uploadFile = (file, metadata) => {
//     const filePath = `chat/public/${uuidv4()}.jpg`;

//     setData(prev => ({
//       ...prev,
//       uploadState: "uploading",
//       uploadTask: data.storageRef.child(filePath).put(file, metadata)
//     }));
//   };

//   const sendMessage = () => {
//     if (data.message.length > 0) {
//       setData(prev => ({ ...prev, loading: true, error: "" }));
//       messageRef
//         .child(channel.id)
//         .push()
//         .set(createMessage())
//         .then(() => {
//           setData(prev => ({ ...prev, loading: false, message: "" }));
//         })
//         .catch(err => {
//           console.log(err);
//           setData(prev => ({
//             ...prev,
//             loading: false,
//             message: "",
//             error: err.message
//           }));
//         });
//     } else setData(prev => ({ ...prev, error: "No data filled" }));
//   };

//   const openModal = () => setData(prev => ({ ...prev, modal: true }));

//   const closeModal = () => setData(prev => ({ ...prev, modal: false }));

//   return (
//     <Segment className="messageForm">
//       <Input
//         value={data.message}
//         fluid
//         name="message"
//         label={<Button icon="add" />}
//         labelPosition="left"
//         className={data.error.length > 0 ? "error" : null}
//         placeholder="Write your message"
//         onChange={handleChange}
//       />
//       <Button.Group icon widths="2" style={{ marginTop: "10px" }}>
//         <Button
//           color="green"
//           content="Add Reply"
//           labelPosition="left"
//           icon="edit"
//           onClick={sendMessage}
//           disabled={data.loading}
//           className={data.loading ? "loading" : null}
//         />
//         <Button
//           color="red"
//           content="Upload Media"
//           labelPosition="right"
//           icon="cloud upload"
//           onClick={openModal}
//         />
//         <FileModal
//           modal={data.modal}
//           closeModal={closeModal}
//           uploadFile={uploadFile}
//         />
//       </Button.Group>
//     </Segment>
//   );
// };

class MessageForm extends React.Component {
  constructor() {
    super();

    this.state = {
      message: "",
      loading: false,
      error: "",
      modal: false,
      uploadTask: null,
      uploadState: "",
      percentUploaded: 0,
      storageRef: firebase.storage().ref()
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      content: this.state.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.user.uid,
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    console.log(message)
    return message;
  };

  uploadFile = (file, metadata) => {
    const filePath = `chat/public/${uuidv4()}.jpg`;
    const pathToUpload = this.props.channel.id;
    const ref = this.props.messageRef;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransfered / snap.totalBytes) * 100
            );

            this.setState({ percentUploaded });
          },
          err => {
            console.log(err);
            this.setState({ uploadState: "error", uploadTask: null });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.log(err);
                this.setState({ uploadState: "error", uploadTask: null });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: err.message });
      });
  };

  sendMessage = () => {
    const { messageRef, channel } = this.props;
    if (this.state.message.length > 0) {
      this.setState({ loading: true, error: "" });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "" });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            message: "",
            error: err.message
          });
        });
    } else this.setState({ error: "No data filled" });
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });
  render() {
    return (
      <Segment className="messageForm">
        <Input
          value={this.state.message}
          fluid
          name="message"
          label={<Button icon="add" />}
          labelPosition="left"
          className={this.state.error.length > 0 ? "error" : null}
          placeholder="Write your message"
          onChange={this.handleChange}
        />
        <Button.Group icon widths="2" style={{ marginTop: "10px" }}>
          <Button
            color="green"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={this.state.loading}
            className={this.state.loading ? "loading" : null}
          />
          <Button
            color="red"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
          <FileModal
            modal={this.state.modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
