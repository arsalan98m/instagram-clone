import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYc2BX8dmNo_qVBor1y_3X6_V44kVNiow",
  authDomain: "instagram-clone-react-be777.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-be777.firebaseio.com",
  projectId: "instagram-clone-react-be777",
  storageBucket: "instagram-clone-react-be777.appspot.com",
  messagingSenderId: "273250195416",
  appId: "1:273250195416:web:523ac45555d190bbccc4ad",
  measurementId: "G-LV3NW5QPJ9",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
