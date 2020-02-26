import React, { useState } from "react";
import mime from "mime-types";
import { Modal, Input, Icon, Button } from "semantic-ui-react";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [data, setData] = useState({
    file: null,
    authorized: ["image/jpeg", "image/png"]
  });

  const addFile = e => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, file: file });
    }
  };

  const sendFile = () => {
    if (data.file !== null) {
      if (isAuthorized(data.file.name)) {
        const metadata = { contentType: mime.lookup(data.file.name) };
        uploadFile(data.file, metadata);
        resetFileState();
        closeModal();
      }
    }
  };

  const resetFileState = () => {
    setData({ ...data, file: null });
  };

  const closeModalHere = () => {
    closeModal();
    resetFileState();
  };

  const isAuthorized = fileName =>
    data.authorized.includes(mime.lookup(fileName));

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an image file</Modal.Header>
      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="File types: JPEG, PNG"
          name="file"
          type="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={sendFile} inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModalHere}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
