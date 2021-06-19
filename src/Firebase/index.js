import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/messaging';
import 'firebase/storage';
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAb9fczqJxaScicue6L0rfkCLtX78MQNUE",
  authDomain: "mandarent-5cb24.firebaseapp.com",
  databaseURL: "https://mandarent-5cb24.firebaseio.com",
  projectId: "mandarent-5cb24",
  storageBucket: "mandarent-5cb24.appspot.com",
  messagingSenderId: "924345255228",
  appId: "1:924345255228:web:97e7a7995194e7efabca39",
  measurementId: "G-D8469HFDNS"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();
export { firebase, db, storage };
