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
//import SprintSelector from './SprintSelector';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const SprintBacklog = (props) => {

  const [btnClk, setBtnClk] = useState(0)
  const fixDatabase = () => {
    // console.log(firestore.collection('userStory').get())
    // firestore.collection('userStory').get().then((result) => result.docs.map((doc) => firestore.collection('userStory').doc(doc.id).update({state: 'productBacklog'})))
    // firestore.collection('userStory')
    //   .where('productId', '==', 'DYcnuAejVq7k3e5CVYVR')
    //   .get().then(doc => firestore.collection('userStory').doc(doc.id).delete())
    // firestore.collection('userStory').get().map((doc) => doc.update({state: 'productBacklog'}))
    setBtnClk(btnClk+1)
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


  useEffect(async () => {
    if (sprintLoading) return;

    let tempSprintStories = []
    for (const storyId of sprint.data().userStories) {
      await firestore.collection('userStory').doc(storyId)
      .get()
      .then((doc) => {
        tempSprintStories.push(doc)
      })
      .catch(e => {
        console.log('There was an error!!!')
        console.log(e)
      })
    }
    setSprintStories(tempSprintStories)
  }, [sprintLoading, btnClk, sprint])
  

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
      {/* {product && <SprintSelector productId={product.id} sprintCallback={backlogStoriesLoading}/>} */}
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
          {!(sprintLoading || sprintStories.length === 0) && sprintStories.map(story => { 
            return (
              <p key={story.id}>
                <UserStoryCard 
                  storyID={story.id} 
                  storyDescription={story.data().description}
                  btnText='Remove From Sprint'
                  onClick={removeStoryFromSprint}
                />
              </p>
              )
          })}
        </Box>
      </Box>
      <Button variant="contained" onClick={fixDatabase}>for testing {btnClk}</Button>
    </Box>
    }
    </Fragment>
  )
}

export default SprintBacklog
