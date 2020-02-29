import firebase from "../firebase";

export const handleOnlineStatus = (userId, action = "remove") => {
  const ref = firebase.database().ref("presence/" + userId);
  if (action === "add") {
    ref.set(true);
  } else {
    ref.remove();
  }
};
