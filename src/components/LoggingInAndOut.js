import firebase from 'firebase/compat/app';
import * as React from 'react';
import { Button } from '@mui/material';
import { auth } from './fire';

export function SignIn(props) {

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
    return (
        <Button variant="contained" className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
    )

  }

export  function SignOut() {
    return auth.currentUser && (
      <Button variant="contained" className="sign-out" onClick={() => auth.signOut()}>Sign Out</Button>
    )
  }

