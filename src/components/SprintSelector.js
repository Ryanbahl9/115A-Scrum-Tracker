import { React, Fragment, useContext, useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { firestore } from './fire';
import UserContext from './UserContext';



const SprintSelector = (props) => {
  let { product } = useContext(UserContext);

  const { sprintId, setSprintId } = props
  const [sprintIdsArr, setSprintIdsArr] = useState([])
  var sprintsObserver = null

  useEffect(() => {
    if (sprintsObserver != null) sprintsObserver();
    const sprintsRef = firestore.collection('sprints');
    var sprintsQuery = sprintsRef.orderBy('endDate', 'desc')
    sprintsQuery = sprintsQuery.where('productId', '==', (product ? product.id : ''));
    sprintsQuery.onSnapshot((collection) => {
      let tempSprintIdsArr = []
      let sprintCounter = 0
      collection.docs.forEach((doc) => {
        sprintCounter++
        let name = 'Sprint '
          + sprintCounter
          + ': '
          + doc.data().startDate.toDate().toLocaleDateString('en-us', { month: "numeric", day: "numeric" })
          + ' to '
          + doc.data().endDate.toDate().toLocaleDateString('en-us', { month: "numeric", day: "numeric" })

        tempSprintIdsArr.push({
          "id": doc.id,
          "name": name
        })
      })
      setSprintIdsArr(tempSprintIdsArr)
    })
  }, []);

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
          {(sprintIdsArr.length > 0) && sprintIdsArr.map(item => {
            return (<MenuItem key={item['id']} value={item['id']}>{item['name']}</MenuItem>)
          })}
        </Select>
      </FormControl>
    </Fragment>
  )
}

export default SprintSelector
