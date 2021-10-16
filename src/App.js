// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Drawer from './components/Drawer';
import AppBar from './components/AppBar';
import ScrumBoard from './components/ScrumBoard';
import Backlog from './components/Backlog';
import NotFound from './components/NotFound';
import {useAuthState, auth, firestore, useCollectionData } from './components/fire';
import ProductContext from './components/ProductContext';
import UserContext from './components/UserContext';
import { SignIn, SignOut } from './components/LoggingInAndOut';




function App() {
  const [user] = useAuthState(auth);
  // const user = true
  const [products, setProducts] = useState(null);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawerOpen = () => {
    drawerOpen === false ? setDrawerOpen(true) : setDrawerOpen(false)
  }
  
  return (
    <UserContext.Provider value={{user, products, setProducts}}>
    <Container>
      {/* <SignIn/> */}
      <Router>
        <AppBar toggleDrawerOpen={toggleDrawerOpen} user={user}/>
        {user && <Drawer drawerOpen={drawerOpen}/>}

          <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/board" component={ScrumBoard} />
          <Route path="*" component={Backlog} />
        </Switch>
      </Router>
      {user ? <SignOut/> : <SignIn/>}
    </Container>
    </UserContext.Provider>
  );

}

export default App;
