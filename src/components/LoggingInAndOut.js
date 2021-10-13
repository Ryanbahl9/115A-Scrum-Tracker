import {firebase, auth} from '../fire.js';
import React from 'react';
import { Button } from '@mui/material';


export function SignIn() {

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
  
    return (
<<<<<<< HEAD
        <Button variant="contained" onClick={signInWithGoogle}>Sign in with Google</Button>
=======
      <>
        <Button variant="contained" className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
      </>
>>>>>>> main
    )
  
  }

export function SignOut() {
    return auth.currentUser && (
      <Button variant="contained" className="sign-out" onClick={() => auth.signOut()}>Sign Out</Button>
    )
}
  