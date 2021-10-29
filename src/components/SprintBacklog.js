import { Box } from '@mui/system'
import React, {useContext, useRef, useState} from 'react'
import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc } from "firebase/firestore";


const SprintBacklog = (props) => {
  //const newColumnRef = useRef(null);
  //const [stageTitles, setStageTitles] = useState([]);
  //const [stageTitleComponents, setStageTitleComponents] = useState([]);


  let { product } = useContext(UserContext);

  const allStoriesRef = firestore.collection('userStory');
  let allStoriesQuery;
  if (product) {
    allStoriesQuery = allStoriesRef.where('productId', '==', product.id);
  } else {
    allStoriesQuery = allStoriesRef.where('productId', '==', '0');
  }
  let [AllStories, allLoading] = useCollection(allStoriesQuery);


  const sprintDocRef = firestore.collection('sprints').doc('qoQPtehTrvrvLXjF4v9w')
  let [sprintDoc, sprintDocLoading, error] = useDocument(sprintDocRef);

  // const sprintStoriesRef = firestore.collection('userStory');
  // let sprintStoriesQuery;
  // if (sprint.data().userStories) {
  //   sprintStoriesQuery = sprintStoriesRef.where('id', 'in', sprint.data().userStories);
  // } else {
  //   sprintStoriesQuery = sprintStoriesRef.where('productID', '==', '0');
  // }
  // let [sprintStories, sprintLoading] = useCollection(sprintStoriesQuery);

  
  return (
    <Box>
      {error && <p>=================Error==================</p>}
      {!sprintDoc && <p>=================Data Is Nil==================</p>}
      {!sprintDocLoading && 
      <box>
        <p>Sprint ID: {sprintDoc.id}</p>
        <p>Sprint Start Date: {sprintDoc.data().startDate}</p>
        <p>Sprint Length: {sprintDoc.data().length}</p>
        <p>Sprint ProductID: {sprintDoc.data().ProductID}</p>
        <p>Sprint User Stories: {sprintDoc.data().userStories}</p>
      </box>
      }

      <Box sx={{display: "flex"}}>
        <Box>
          {!allLoading && AllStories.docs.map(doc => { 
            return (<p key={doc.id}>{<UserStoryCard storyID={doc.id} storyName={doc.data().name} storyDescription={doc.data().description}/>}</p>)
          })}
        </Box>
        <Box>|     |      |</Box>
        <Box>
          {!allLoading && AllStories.docs.map(doc => { 
            return (<p key={doc.id}>{<UserStoryCard storyID={doc.id} storyName={doc.data().name} storyDescription={doc.data().description}/>}</p>)
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default SprintBacklog
