// ###################################################################################################
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

firebase.initializeApp({

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyBVtzPN4scCnsRdqc8fG88ZiV-v-ipkwHs",
  authDomain: "superchatdemo-53429.firebaseapp.com",
  projectId: "superchatdemo-53429",
  storageBucket: "superchatdemo-53429.appspot.com",
  messagingSenderId: "786660954800",
  appId: "1:786660954800:web:b2b7e0b8ea60546b8aa175",
  measurementId: "G-5483NEP5VJ"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();


