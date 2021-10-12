// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import './App.css';

import {firebase, useAuthState, useCollectionData, auth, firestore,analytics} from './fire.js';
import {SignIn, SignOut} from './LoggingInAndOut.js'

//import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function App() {

  const [user] = useAuthState(auth);



  return (
    <div className="App">

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              This is the Topbar!
            </Typography>
            {user ? <SignOut /> : <SignIn />}
          </Toolbar>
        </AppBar>
      </Box>


    </div>
  );
  
}


export default App;