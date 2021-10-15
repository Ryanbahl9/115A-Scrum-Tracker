// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Drawer from './components/Drawer';
import ScrumBoard from './components/ScrumBoard';
import NotFound from './components/NotFound';
import {useAuthState, auth, firestore, useCollectionData} from './components/fire';
import Context from './components/Context';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


function App() {
  return (
    <Container>
      <Router>
        <Drawer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/board" component={ScrumBoard} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </Container>
  );

}

export default App;
