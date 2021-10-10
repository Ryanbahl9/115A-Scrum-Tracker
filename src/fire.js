
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDS0qW6oD59BcH_CCL_q0SUg4JM9012zRU",
  authDomain: "fir-b5376.firebaseapp.com",
  projectId: "fir-b5376",
  storageBucket: "fir-b5376.appspot.com",
  messagingSenderId: "1058442370165",
  appId: "1:1058442370165:web:b77f6a798793a084b2ec3c",
  measurementId: "G-ESPCTH698Y"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


export function testUserID() {
  return auth.currentUser && (auth.currentUser.uid)
}


export {firebase, useAuthState, useCollectionData, auth, firestore,analytics};