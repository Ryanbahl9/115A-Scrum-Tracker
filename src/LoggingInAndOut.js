import {firebase, auth} from './fire.js';
// import {Button} from '@mui/material/Button';


export function SignIn() {

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
  
    return (
      <>
      
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      </>
    )
  
  }

export  function SignOut() {
    return auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
  }
  