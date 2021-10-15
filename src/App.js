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

function App() {
  const [user] = useAuthState(auth);
  const projectsRef = firestore.collection('projects');
  const query = projectsRef.where("uid", "==", auth.currentUser.uid)
  const [projects] = useCollectionData(query, { idField: 'id' });
  Context.user = user;


  return (
    <Context.Provider value={
      {user,
      projects}
    }>
    <Container>
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/drawer" component={Drawer} />
                <Route path="/board" component={ScrumBoard} />
                <Route path="*" component={NotFound} />
            </Switch>
        </Router>
    </Container>
    </Context.Provider>
  );

}


export default App;