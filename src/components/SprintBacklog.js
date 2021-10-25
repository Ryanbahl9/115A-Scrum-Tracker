import { Box } from '@mui/system'
import React, {useContext, useRef, useState} from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';

const SprintBacklog = (props) => {
  //const newColumnRef = useRef(null);
  //const [stageTitles, setStageTitles] = useState([]);
  //const [stageTitleComponents, setStageTitleComponents] = useState([]);
  let { product } = useContext(UserContext);
  const userStoryRef = firestore.collection('userStory');
  let query;
  if (product) {
    query = userStoryRef.where('productID', '==', product.id);
  } else {
    query = userStoryRef.where('productID', '==', '0');
  }

  let [UserStories, loading] = useCollection(query);

  return (
    <Box>
      {!loading && UserStories.docs.map(doc => { 
        return (<p key={doc.id}>{doc.data().name}</p>)
      })}
    </Box>
  )
}

export default SprintBacklog
