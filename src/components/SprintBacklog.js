import {
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { firestore } from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import SprintSelector from './SprintSelector';
import {
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import {
  getCurrentSprintId,
  deleteSprint
} from '../backEnd/DataBaseQueries';
import { itemsStyle } from './CSS';
import AddSprint from './AddSprint';


const SprintBacklog = (props) => {

  /// ------States and Variables-----
  // get product state
  let { product } = useContext(UserContext);
  // if product state is null, set product id to null
  const productId = product ? product.id : null;

  // Set up states
  const [sprintId, setSprintId] = useState('');
  const [sprint, setSprint] = useState(null);
  const [sprintStories, setSprintStories] = useState([]);
  const [backlogStories, setBacklogStories] = useState([]);

  // Set Vars
  var sprintObserver = null;
  var backlogStoriesObserver = null;

  // Set initial sprint id
  useEffect(async () => {
    const wrap = async () => {
      setSprintId(await getCurrentSprintId(productId))
    }
    wrap();
  }, []);

  /// ------Effects and Firebase Hooks------
  // Set up hook for sprint inside useEffect watching sprint id state
  useEffect(() => {
    if (sprintId === '' || sprintId === null) return
    // Stop listening to the previous snapshot call back
    if (sprintObserver != null) { sprintObserver() }
    // set new query / reference using new sprintId
    let sprintRef = firestore.collection('sprints').doc(sprintId);
    // set up new callback function using new sprintRef
    sprintObserver = sprintRef.onSnapshot((snapShot) => {
      setSprint(snapShot);
    });
  }, [sprintId]);

  // Set up hook for sprint stories inside useEffect watching sprint state
  useEffect(() => {
    const wrap = async () => {
      if (sprint === null || sprintId === '' || sprintId === null) return;
      let tempSprintStories = [];
      for (const storyId of sprint.data().userStories) {
        await firestore
          .collection('userStory')
          .doc(storyId)
          .get()
          .then((doc) => {
            tempSprintStories.push(doc);
          })
          .catch((e) => {
            console.log('There was an error!!!');
            console.log(e);
          });
      }
      setSprintStories(tempSprintStories);
    }
    wrap();
  }

    , [sprint]);

  // Set up hook to watch all userStories with this product id in the product backlog
  useEffect(() => {
    if (backlogStoriesObserver != null) backlogStoriesObserver();
    const backlogStoriesRef = firestore.collection('userStory');
    let backlogStoriesQuery = backlogStoriesRef.where('productId', '==', productId);
    backlogStoriesQuery = backlogStoriesQuery.where('state', '==', 'productBacklog');
    backlogStoriesObserver = backlogStoriesQuery.onSnapshot((collection) => {
      setBacklogStories(collection.docs)
    })
  }, [])


  // Set up button handlers
  const moveStoryToSprint = (storyID) => {
    firestore
      .collection('sprints')
      .doc(sprintId)
      .update({
        userStories: arrayUnion(storyID),
      });
    firestore.collection('userStory').doc(storyID).update({
      state: 'sprintBacklog',
    });
  };

  const removeStoryFromSprint = (storyID) => {
    firestore
      .collection('sprints')
      .doc(sprintId)
      .update({
        userStories: arrayRemove(storyID),
      });
    firestore.collection('userStory').doc(storyID).update({
      state: 'productBacklog',
    });
  };

  const deleteCurrSprint = () => {
    var idCopy = sprintId
    setSprintStories([])
    setSprint(null)
    setSprintId('')
    deleteSprint(idCopy)
  }

  return (
    <Fragment>
      {/* <Button onClick={() => {
        const backlogStoriesRef = firestore.collection('userStory');
        let backlogStoriesQuery = backlogStoriesRef.where('productId', '==', productId);
        backlogStoriesQuery.get().then((col) => col.docs.forEach((doc) => {
          firestore.collection('userStory').doc(doc.id).update({state: 'productBacklog'})
        }))
      }}> fix </Button> */}
      {product ? (
        <Box>
          <SprintSelector sprintId={sprintId} setSprintId={setSprintId} />
          <Button onClick={deleteCurrSprint}>
            Delete Sprint
          </Button>
          {(sprintId != '' && sprintId != null) ?
            <Fragment>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: 275 }}>
                  <Typography variant="h4" component="div">
                    Backlog Stories
                  </Typography>
                  {(backlogStories.length > 0) &&
                    backlogStories.map((story) => {
                      return (
                        <p key={story.id}>
                          <UserStoryCard
                            storyID={story.id}
                            storyDescription={story.data().description}
                            btnText="Move To Sprint"
                            onClick={moveStoryToSprint}
                          />
                        </p>
                      );
                    })}
                </Box>
                <Box sx={{ width: 10 }} />
                <Box sx={{ width: 275 }}>
                  <Typography variant="h4" component="div">
                    Sprint Stories
                  </Typography>
                  {sprint != null &&
                    sprintStories.length > 0 &&
                    sprintStories.map((story) => {
                      return (
                        <p key={story.id}>
                          <UserStoryCard
                            storyID={story.id}
                            storyDescription={story.data().description}
                            btnText="Remove From Sprint"
                            onClick={removeStoryFromSprint}
                          />
                        </p>
                      );
                    })}
                </Box>
              </Box>
            </Fragment>
            :
            (<Box>Please Select Sprint</Box>)}
          <AddSprint product={product} />
        </Box>
      ) : (
        <Box>
          <Paper sx={itemsStyle}>Select Product for SprintBacklog</Paper>
        </Box>
      )}

    </Fragment>
  );
};

export default SprintBacklog;
