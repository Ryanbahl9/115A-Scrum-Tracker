// ###################################################################################################
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

firebase.initializeApp({

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyA6NqhANpV81OdPjkAz9-hDjNffmpNegQE",
  authDomain: "a-167d2.firebaseapp.com",
  projectId: "a-167d2",
  storageBucket: "a-167d2.appspot.com",
  messagingSenderId: "121019454084",
  appId: "1:121019454084:web:8a589bcaa810dff09628d1",
  measurementId: "G-5GVS1DGZ3W"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();


