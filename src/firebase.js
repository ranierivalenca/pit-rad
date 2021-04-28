import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBjZDVVeYHO26_UL-jmo97QVec2jZoZhuw",
  authDomain: "pit-rad.firebaseapp.com",
  projectId: "pit-rad",
  storageBucket: "pit-rad.appspot.com",
  messagingSenderId: "113992607116",
  appId: "1:113992607116:web:2c953829750541f9a4a2a9"
};
// Initialize Firebase
firebase.default.initializeApp(firebaseConfig);

// utils
const db = firebase.default.firestore()
const auth = firebase.default.auth()

const pitsCollection = db.collection('pits')

const googleAuthProvider = new firebase.default.auth.GoogleAuthProvider()
googleAuthProvider.setCustomParameters({
  hd: "*"
});

export {
  db,
  auth,
  pitsCollection,
  googleAuthProvider
}