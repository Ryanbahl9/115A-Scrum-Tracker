// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Drawer from './components/Drawer';
import ScrumBoard from './components/ScrumBoard';
import NotFound from './components/NotFound';
import {useAuthState, auth, firestore, useCollectionData } from './components/fire';
import ProductContext from './components/ProductContext';
import UserContext from './components/UserContext';




function App() {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState(null);


  return (
    <UserContext.Provider value={{user, products, setProducts}}>
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
    </UserContext.Provider>
  );

}

export default App;
