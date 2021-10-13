// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import './App.css';

import {firebase, useAuthState, useCollectionData, auth, firestore,analytics} from './fire.js';
import {SignIn, SignOut} from './LoggingInAndOut.js'
import Drawer from './components/Drawer';

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Drawer/>
      <header>
        <h1>Simple beginnings </h1>
        <SignOut />
      </header>

      <section>
        {user ? <div>Yay! Logged in!</div> : <SignIn />}
        {/* {user ? <div>VALID USER??</div> : <div>Invalid USER</div>} */}
      </section>

    </div>
  );
  
}


export default App;