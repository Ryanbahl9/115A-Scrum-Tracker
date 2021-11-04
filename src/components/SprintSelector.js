import {React, Fragment, useContext} from 'react'
import {
  Box,
  FormControl,
  Button,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {firestore} from './fire';
import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import UserContext from './UserContext';



const SprintSelector = (props) => {
  const {sprintId, setSprintID} = props

  let { product } = useContext(UserContext);

  const sprintsRef = firestore.collection('sprints');
  var sprintsQuery = sprintsRef
  sprintsQuery = sprintsQuery.orderBy('startDate', 'desc')
  const [sprints, sprintsLoading] = useCollection(sprintsQuery);

  const handleChange = (event) => {
    setSprintID(event.target.value);
  };

  return (
    <Fragment>
    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>Sprint</InputLabel>
      <Select
        value={sprintId}
        onChange={handleChange}
      >
        {!(sprintsLoading || !sprints) && sprints.docs.sort((a,b) => a.data().startDate - b.data().startDate).map(sprint => {
          return( <MenuItem value={sprint.id}>{sprint.id}</MenuItem> )
        })}
      </Select>
    </FormControl>
    {/* <Box>
      {!(sprintsLoading || !sprints) && sprints.docs.sort((a,b) => a.data().startDate - b.data().startDate).map(sprint => {
        return( <p>sprint id: {sprint.id}</p> )
      })}
    </Box> */}
    {/* <Button onClick={() => {
      console.log(product.id)
    }}>Testing</Button> */}
    </Fragment>
  )
}

export default SprintSelector
