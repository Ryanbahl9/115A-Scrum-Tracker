import { Box, FormControl } from '@mui/system'
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react'
import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const SprintBacklog = (props) => {
  //const newColumnRef = useRef(null);
  //const [stageTitles, setStageTitles] = useState([]);
  //const [stageTitleComponents, setStageTitleComponents] = useState([]);

  const [sprintID, setSprintID] = useState('qoQPtehTrvrvLXjF4v9w')
  

  let { product } = useContext(UserContext);

  const sprintDocRef = firestore.collection('sprints').doc(sprintID)
  let [sprintDoc, sprintDocLoading, error] = useDocument(sprintDocRef);
 

  const allStoriesRef = firestore.collection('userStory');
  if (product) {
    var allStoriesQuery = allStoriesRef.where('productId', '==', product.id)
  } else {
    var allStoriesQuery = allStoriesRef.where('productId', '==', 0)
  }
  const [AllStories, allLoading] = useCollection(allStoriesQuery);



  const [sprintStories, setSprintStories] = useState([])
  const [backlogStories, setBacklogStories] = useState([])
  
  useEffect(() => {
    if (AllStories && sprintDoc) {
      setSprintStories(AllStories.docs.filter(story => sprintDoc.data().userStories.includes(story.id)))
      setBacklogStories(AllStories.docs.filter(story => !sprintDoc.data().userStories.includes(story.id)))
    } else {
      setSprintStories([])
      setBacklogStories([])
    }
  }, [AllStories, sprintDoc])

  const moveStoryToSprint = (storyID) => {
    firestore.collection('sprints').doc(sprintID).update({
      userStories: arrayUnion(storyID)
    })
  }

  const removeStoryFromSprint = (storyID) => {
    firestore.collection('sprints').doc(sprintID).update({
      userStories: arrayRemove(storyID)
    })
  }

  return (
    <Fragment>
    {product &&
    <Box>
      {error && <p>=================Error==================</p>}
      {!sprintDoc && <p>=================Data Is Nil==================</p>}
      {!sprintDocLoading && 
      <box>
        <p>Product ID: {product.id}</p>
        <p>Sprint ID: {sprintDoc.id}</p>
        <p>Sprint Start Date: {sprintDoc.data().startDate}</p>
        <p>Sprint Length: {sprintDoc.data().length}</p>
        <p>Sprint ProductID: {sprintDoc.data().ProductID}</p>
        <p>Sprint User Stories: {sprintDoc.data().userStories}</p>
      </box>
      }
      {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-filled-label">Sprint</InputLabel>
        <Select
          value={sprintID}
          onChange={}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl> */}
      <Box sx={{display: "flex"}}>
        <Box>
          {!allLoading && backlogStories.map(story => { 
            return (
              <p key={story.id}>
                <UserStoryCard 
                  storyID={story.id} 
                  storyName={story.data().name} 
                  storyDescription={story.data().description}
                  btnText='Move To Sprint'
                  onClick={moveStoryToSprint}/>
              </p>
            )
          })}
        </Box>
        <Box>|     |      |</Box>
        <Box>
          {!(sprintStories.length === 0) && sprintStories.map(story => { 
            return (
              <p key={story.id}>
                <UserStoryCard 
                  storyID={story.id} 
                  storyName={story.data().name} 
                  storyDescription={story.data().description}
                  btnText='Remove From Sprint'
                  onClick={removeStoryFromSprint}
                />
              </p>
              )
          })}
        </Box>
      </Box>
    </Box>
    }
    </Fragment>
  )
}

export default SprintBacklog
