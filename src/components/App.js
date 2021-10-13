// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './Home';
import Drawer from './Drawer';
import ScrumBoard from './ScrumBoard';
import NotFound from './NotFound';

function App() {
  return (
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
  );
  
}


export default App;