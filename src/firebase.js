import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBa643TjTtPD0rnjdOfuFLpYyzDdsqr0Iw",
    authDomain: "plack-23141.firebaseapp.com",
    databaseURL: "https://plack-23141.firebaseio.com",
    projectId: "plack-23141",
    storageBucket: "plack-23141.appspot.com",
    messagingSenderId: "360318459062",
    appId: "1:360318459062:web:a7d366336084667dacda17",
    measurementId: "G-E16F9YZVBR"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;