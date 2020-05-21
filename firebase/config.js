import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAYwjPn1tt-r0RbV_6daviFAv7Su1OIORM",
    authDomain: "auth-rn-492bd.firebaseapp.com",
    databaseURL: "https://auth-rn-492bd.firebaseio.com",
    projectId: "auth-rn-492bd",
    storageBucket: "auth-rn-492bd.appspot.com",
    messagingSenderId: "360874636766",
    appId: "1:360874636766:web:1703c51e0db5a50408194f"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export {auth, firestore, storage};