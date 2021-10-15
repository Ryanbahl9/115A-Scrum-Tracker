import React from 'react'
import { 
  CalendarViewMonth,
  ListAlt 
} from '@mui/icons-material';
import { 
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { withRouter } from 'react-router';

// Note: Right now it is imposable to get back to the home page through the
// drawer, but we will make that possible later through the top bar, probably
// by clicking a logo in the top left

const Drawer = (props) => {
  {/*Since the Drawer is inside the router component
  the history object passed down through props. */}
  const { history } = props
  return (
    <MUIDrawer variant="permanent">
      <List>
      {/*Whe a list item is clicked, react uses the history 
      object to change the change the url, which in turn changes which
      components are visible in App.js*/}
      <ListItem button onClick={() => history.push('/board')}>
          <ListItemIcon><CalendarViewMonth/></ListItemIcon>
          <ListItemText primary="Scrum Board" />
        </ListItem>
        <ListItem button onClick={() => history.push('/backlog')}>
          <ListItemIcon><ListAlt/></ListItemIcon>
          <ListItemText primary="Backlog" />
        </ListItem>
      </List>
    </MUIDrawer>
  )
}

export default withRouter(Drawer);
