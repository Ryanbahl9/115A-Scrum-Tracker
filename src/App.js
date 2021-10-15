// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Drawer from './components/Drawer';
import Topbar from './components/Topbar';
import ScrumBoard from './components/ScrumBoard';
import Backlog from './components/Backlog';
import NotFound from './components/NotFound';
import {useAuthState, auth, firestore, useCollectionData} from './components/fire';
import Context from './components/Context';

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawerOpen = () => {
    drawerOpen === false ? setDrawerOpen(true) : setDrawerOpen(false)
  }
  const user = true

  return (
    <Container>
      <Router>
        <AppBar toggleDrawerOpen={toggleDrawerOpen} user={user}/>
        {user && <Drawer drawerOpen={drawerOpen}/>}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/board" component={ScrumBoard} />
          <Route path="*" component={Backlog} />
        </Switch>
      </Router>
    </Container>
  );

}

export default App;
