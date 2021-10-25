import firebase from 'firebase/compat/app';
import * as React from 'react';
import { Button } from '@mui/material';
import { auth, firestore } from './fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SettingsApplicationsRounded } from '@mui/icons-material';

export function SignIn(props) {

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  }


  function AddToDataBase() {
    const usersRef = firestore.collection('users');

    usersRef.where('uid', '==', auth.currentUser.uid).get().then((snapShot) => {
      if (snapShot.empty) {
        const { displayName, uid, email } = auth.currentUser;
        usersRef.add({
          uid,
          displayName,
          email,
          color: "NOT ASSIGNED",
          invites: []
        });
      }
    }
    )
  }
  
  function wrapper() {
    signInWithGoogle().then(AddToDataBase);
  }

  return (
    // <Button variant="contained" className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
    <Button variant="contained" className="sign-in" onClick={wrapper}>Sign in with Google</Button>
  )

}

export function SignOut() {
  return auth.currentUser && (
    <Button variant="contained" className="sign-out" onClick={() => auth.signOut()}>Sign Out</Button>
  )
}

