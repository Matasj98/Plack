import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from "./FileModal";
import firebase from "../../firebase";
import ProgressBar from "./ProgressBar";

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
              (snap.bytesTransferred / snap.totalBytes) * 100
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
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
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
    const {
      message,
      error,
      loading,
      modal,
      uploadState,
      percentUploaded
    } = this.state;
    return (
      <Segment className="messageForm">
        <Input
          value={message}
          fluid
          name="message"
          label={<Button icon="add" />}
          labelPosition="left"
          className={error.length > 0 ? "error" : null}
          placeholder="Write your message"
          onChange={this.handleChange}
          onKeyDown={e => (e.keyCode === 13 ? this.sendMessage() : null)}
        />
        <Button.Group icon widths="2" style={{ marginTop: "10px" }}>
          <Button
            color="green"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
            className={loading ? "loading" : null}
          />
          <Button
            color="red"
            content="Upload Media"
            disabled={uploadState === "uploading" ? true : false}
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar uploadState={uploadState} percents={percentUploaded} />
      </Segment>
    );
  }
}

export default MessageForm;
