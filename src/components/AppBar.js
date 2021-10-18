import React from 'react'

import {
  AppBar as MUIAppBar,
  Toolbar as MUIToolbar,
  IconButton,
  Box
} from '@mui/material';

import {
  Menu,
  Home
} from '@mui/icons-material';
import logo from '../logo.svg'

import { withRouter } from 'react-router';
import { SignIn, SignOut } from './LoggingInAndOut';
import {ProductsPage} from './fire';


const AppBar = props => {
  const {history, user, toggleDrawerOpen} = props
  // const [open, setOpen] = React.useState(false);
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  return (
    <MUIAppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <div style={{display: "flex"}}>
      <MUIToolbar>
        {user && <IconButton button onClick={toggleDrawerOpen}> {/* aria-label="open drawer" onClick={handleDrawerOpen} */}
          <Menu />
        </IconButton>}
        <IconButton button onClick={() => history.push('/')} >
          <Home />
        </IconButton>
      </MUIToolbar>
      {user && <ProductsPage/>}
      {user ? <SignOut/> : <SignIn user={user}/>}
      </div>
    </MUIAppBar>
  )
}

export default withRouter(AppBar)
