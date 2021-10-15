import React from 'react'

import { 
  AppBar as MUIAppBar,
  Toolbar as MUIToolbar,
  IconButton
} from '@mui/material';

import { 
  Menu 
} from '@mui/icons-material';
import logo from '../logo.svg'


const AppBar = () => {
  // const [open, setOpen] = React.useState(false);
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  return (
    <MUIAppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <MUIToolbar>
        <IconButton > {/* aria-label="open drawer" onClick={handleDrawerOpen} */}
          <Menu />
        </IconButton>
        <img src={logo}/>
      </MUIToolbar>
    </MUIAppBar>
  )
}

export default AppBar
