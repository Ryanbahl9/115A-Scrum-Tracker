import {React, Fragment, useContext, useState, useEffect} from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {firestore} from './fire';
import UserContext from './UserContext';



const SprintSelector = (props) => {
  let { product } = useContext(UserContext);

  const {sprintId, setSprintId} = props
  const [sprintIdsArr, setSprintIdsArr] = useState([])
  var sprintsObserver = null

  useEffect(() => {
    if (sprintsObserver != null) sprintsObserver();
    const sprintsRef = firestore.collection('sprints');
    var sprintsQuery = sprintsRef.orderBy('endDate', 'desc')
    sprintsQuery = sprintsQuery.where('productId', '==', (product ? product.id : ''));
    sprintsQuery.onSnapshot((collection) => {
      console.log('Loading Sprints with productId ordered by endDate')
      let tempSprintIdsArr = []
      let sprintCounter = 0
      collection.docs.forEach((doc) => {
        sprintCounter++
        tempSprintIdsArr.push(
          'Sprint ' 
          + sprintCounter
          + ': '
          + doc.data().startDate.toDate().toLocaleDateString('en-us', {month:"numeric", day:"numeric"}) 
          + ' to ' 
          + doc.data().endDate.toDate().toLocaleDateString('en-us', {month:"numeric", day:"numeric"}))
      })
      setSprintIdsArr(tempSprintIdsArr)
    })
  }, [])

  const handleChange = (event) => {
    if (event.target.value === null) {
      setSprintId('');
    } else {
      setSprintId(event.target.value);
    }

  };

  return (
    <Fragment>
    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>Sprint</InputLabel>
      <Select
        value={sprintId}
        onChange={handleChange}
      >
        <MenuItem value={''}>(None)</MenuItem>
        {(sprintIdsArr.length > 0) && sprintIdsArr.map(id => {
          return( <MenuItem value={id}>{id}</MenuItem> )
        })}
      </Select>
    </FormControl>
    </Fragment>
  )
}

export default SprintSelector
