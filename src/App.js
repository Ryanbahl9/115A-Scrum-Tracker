// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import Drawer from './components/Drawer';
import AppBar from './components/AppBar';
import ScrumBoard from './components/ScrumBoard';
import Backlog from './components/Backlog';
import SprintBacklog from './components/SprintBacklog';
import {auth} from './components/fire';
import {useAuthState} from 'react-firebase-hooks/auth';
import UserContext from './components/UserContext';
import {Box} from '@mui/system';
import Settings from './components/Settings';

function App() {
  const [user] = useAuthState(auth);
  const [marginWidth, setmarginWidth] = useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawerOpen = () => {
    drawerOpen === false ? setDrawerOpen(true) : setDrawerOpen(false);
    if (!drawerOpen) {
      setmarginWidth(26);
    } else {
      setmarginWidth(0);
    }
  };

  const [product, setProduct] = useState(null);

  return (
    <UserContext.Provider value={{product, setProduct}}>
      <Box sx={{flexGrow: 1}}>
        <Router>
          <AppBar
            toggleDrawerOpen={toggleDrawerOpen}
            user={user}
            product={product}
          />
          {user && <Drawer drawerOpen={drawerOpen} />}
          <Box sx={{marginLeft: marginWidth}}>
            {user ? (
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/board" component={ScrumBoard} />
                <Route path="/backlog" component={Backlog} />
                <Route path="/sprintBacklog" component={SprintBacklog} />
                <Route path="/Settings" component={Settings} />
              </Switch>
            ) : (
              <div>404:ADD ROUTE FOR /*</div>
            )}
          </Box>
        </Router>
      </Box>
    </UserContext.Provider>
  );
}

export default App;
