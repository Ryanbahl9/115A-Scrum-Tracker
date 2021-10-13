import React from 'react';
import { firebase, useAuthState, useCollectionData, auth, firestore, analytics } from '../fire.js';
import { SignIn, SignOut } from './LoggingInAndOut.js'

const Home = () => {
    const [user] = useAuthState(auth);

    return (
    <div>

       <header>
         <h1>Simple beginnings </h1>
         <SignOut />
       </header>
       <section>
         {user ? <div>Yay! Logged in!</div> : <SignIn />}
         {/* {user ? <div>VALID USER??</div> : <div>Invalid USER</div>} */}
       </section>
     </div>
    )
}

export default Home
