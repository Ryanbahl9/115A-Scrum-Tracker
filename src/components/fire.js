// ###################################################################################################
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

firebase.initializeApp({

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyDclao4L0sn-6hSUU5FYAdFSCzDy5TNM2k",
  authDomain: "a-scrumtracker.firebaseapp.com",
  projectId: "a-scrumtracker",
  storageBucket: "a-scrumtracker.appspot.com",
  messagingSenderId: "1050741778439",
  appId: "1:1050741778439:web:5f5d1c71faee2118b522a2",
  measurementId: "G-QL1D4RGPN6"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();


