import React from 'react'
import { CalendarViewMonth } from '@mui/icons-material';
import { 
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'


const Drawer = () => {
  return (
    <MUIDrawer variant="permanent">
      <List>
        <ListItem>
          <ListItemIcon><CalendarViewMonth/></ListItemIcon>
          <ListItemText primary="Scrum Board" />
        </ListItem>
      </List>
    </MUIDrawer>
  )
}

export default Drawer;
