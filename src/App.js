// Starting point from https://github.com/fireship-io/react-firebase-chat

import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./components/Home";
import Drawer from "./components/Drawer";
import AppBar from "./components/AppBar"
import ScrumBoard from "./components/ScrumBoard";
import NotFound from "./components/NotFound";

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
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
