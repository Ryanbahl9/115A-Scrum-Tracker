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
import ProductSelection from './ProductSelection';


const AppBar = props => {
  const {history, user, toggleDrawerOpen} = props

  return (
    <MUIAppBar position='sticky' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <div style={{display: "flex"}}>
      <MUIToolbar>
        {user && <IconButton button onClick={toggleDrawerOpen}> {/* aria-label="open drawer" onClick={handleDrawerOpen} */}
          <Menu />
        </IconButton>}
        <IconButton button onClick={() => history.push('/')} >
          <Home />
        </IconButton>
      </MUIToolbar>
      <Box sx={{flexGrow: 1}}>{user && <ProductSelection/>}</Box>

      <Box>{user ? <SignOut/>: <SignIn user={user}/>}</Box>
      </div>
    </MUIAppBar>
  )
}

export default withRouter(AppBar)
