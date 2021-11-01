import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl
} from '@mui/material'
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react'
import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const SprintBacklog = (props) => {

  const fixDatabase = () => {
    firestore.collection('userStory').get().then((result) => result.docs.map((doc) => firestore.collection('userStory').doc(doc.id).update({state: 'productBacklog'})))
    // firestore.collection('userStory')
    //   .where('productId', '==', 'DYcnuAejVq7k3e5CVYVR')
    //   .get().then(doc => firestore.collection('userStory').doc(doc.id).delete())
    // firestore.collection('userStory').get().map((doc) => doc.update({state: 'productBacklog'}))
  }

  //const newColumnRef = useRef(null);
  //const [stageTitles, setStageTitles] = useState([]);
  //const [stageTitleComponents, setStageTitleComponents] = useState([]);
  let { product } = useContext(UserContext);

  const [sprintID, setSprintID] = useState('qoQPtehTrvrvLXjF4v9w')
  const [sprintStories, setSprintStories] = useState([])


  const sprintRef = firestore.collection('sprints').doc(sprintID)
  let [sprint, sprintLoading, error] = useDocument(sprintRef);

  const backlogStoriesRef = firestore.collection('userStory');
  if (product) {
    var backlogStoriesQuery = backlogStoriesRef
    backlogStoriesQuery = backlogStoriesQuery.where('productId', '==', product.id)
    backlogStoriesQuery = backlogStoriesQuery.where('state', '==', 'productBacklog')
  } else {
    var backlogStoriesQuery = backlogStoriesRef.where('productId', '==', 0)
  }
  const [backlogStories, backlogStoriesLoading] = useCollection(backlogStoriesQuery);


  const readSprintIds = async (sprintStoryIds) => {
    let sprintStroyReads = sprintStoryIds.map(id => firestore.collection('userStories').doc(id).get())
    let result = await Promise.all(sprintStroyReads)
    return result
  }

  useEffect(() => {
    if (sprint) {
      readSprintIds(sprint.data().userStories)
        .then(response => setSprintStories(response))
    } else {
      setSprintStories([])
    }
  }, [sprint])

  const moveStoryToSprint = (storyID) => {
    firestore.collection('sprints').doc(sprintID).update({
      userStories: arrayUnion(storyID)
    })
    firestore.collection('userStory').doc(storyID).update({
      state: 'sprintBacklog'
    })
  }

  const removeStoryFromSprint = (storyID) => {
    firestore.collection('sprints').doc(sprintID).update({
      userStories: arrayRemove(storyID)
    })
    firestore.collection('userStory').doc(storyID).update({
      state: 'productBacklog'
    })
  }

  return (
    <Fragment>
    {product &&
    <Box>
      {error && <p>=================Error==================</p>}
      {!sprint && <p>=================Data Is Nil==================</p>}
      {!sprintLoading && 
      <box>
        <p>Product ID: {product.id}</p>
        <p>Sprint ID: {sprint.id}</p>
        <p>Sprint Start Date: {sprint.data().startDate}</p>
        <p>Sprint Length: {sprint.data().length}</p>
        <p>Sprint ProductID: {sprint.data().ProductID}</p>
        <p>Sprint User Stories: {sprint.data().userStories}</p>
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
          {!(backlogStoriesLoading) && backlogStories.docs.map(story => { 
            return (
              <p key={story.id}>
                <UserStoryCard 
                  storyID={story.id} 
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
                  storyDescription={story.id}
                  btnText='Remove From Sprint'
                  onClick={removeStoryFromSprint}
                />
              </p>
              )
          })}
        </Box>
      </Box>
      <Button variant="contained" onClick={fixDatabase}>Update Database</Button>
    </Box>
    }
    </Fragment>
  )
}

export default SprintBacklog
