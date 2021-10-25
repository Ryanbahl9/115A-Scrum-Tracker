// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Drawer from './components/Drawer';
import AppBar from './components/AppBar';
import ScrumBoard from './components/ScrumBoard';
import Backlog from './components/Backlog';
import SprintBacklog from './components/SprintBacklog';
import NotFound from './components/NotFound';
import { auth, firestore, useCollectionData } from './components/fire';
import { useAuthState} from 'react-firebase-hooks/auth';
import UserContext from './components/UserContext';
import { SignIn, SignOut } from './components/LoggingInAndOut';
import { Box } from '@mui/system';
import firebase from 'firebase/compat/app';
import Settings from './components/Settings';





function App() {
  const [user, loading] = useAuthState(auth);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawerOpen = () => {
    drawerOpen === false ? setDrawerOpen(true) : setDrawerOpen(false)
  }

  const [product, setProduct] = useState();
  const productSetWithEvent = (event) => {
    console.log("event?: ")
    setProduct(event.target.value);
  };

  return (
    <UserContext.Provider value={{user, product, setProduct, productSetWithEvent}}>
    <Box sx={{flexGrow: 1}}>
      <Router>
        <AppBar toggleDrawerOpen={toggleDrawerOpen} user={user} product={product}/>
        {user && <Drawer drawerOpen={drawerOpen}/>}
        {user ?
          <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/board" component={ScrumBoard} />
          <Route path="/backlog" component={Backlog} />
          <Route path="/sprintBacklog" component={SprintBacklog} />
          <Route path="/Settings" component={Settings} />
        </Switch>
        :
        <div>404:ADD ROUTE FOR /*</div>
        }
      </Router>
      {/* {user ? <SignOut/> : <SignIn user={user}/>} */}
    </Box>
    </UserContext.Provider>
  );

}

export default App;
