import {firebase, auth} from './fire.js';
import * as React from 'react';
import { Button } from '@mui/material';


export function SignIn() {

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
  
    return (
      <>
        <Button variant="contained" className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
      </>
    )
  
  }

export  function SignOut() {
    return auth.currentUser && (
      <Button variant="contained" className="sign-out" onClick={() => auth.signOut()}>Sign Out</Button>
    )
  }
  