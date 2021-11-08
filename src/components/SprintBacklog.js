import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl,
  Paper,
} from '@mui/material';
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {
  useDocument,
  useCollection,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import SprintSelector from './SprintSelector';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import {
  addSprint,
  useGetSprintsData,
  useProductById,
  useProductOwnerByProduct,
} from '../backEnd/DataBaseQueries';
import {dateSelector, itemSelectSytle, itemStyle} from './CSS';
import {SettingsSystemDaydreamTwoTone} from '@mui/icons-material';


function AddSprint(props) {
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  var {product, hookedSprints} = props;

  useEffect(() => {
    if (hookedSprints) {
      if (hookedSprints.length === 0) {
        setDateStart(new Date());
        setDateEnd(new Date(Date.now() + 1000 *3600 * 24 * 14))
      } else {
        //find end of last sprint, make that the start point
        var greatestDate = 0;
        var lastDate = null;
        hookedSprints.forEach((doc) => {
          if (doc.startDate.seconds > greatestDate) {
            greatestDate = doc.startDate.seconds;
            lastDate = doc.endDate;
          }
        });
        setDateStart(new Date(lastDate.seconds * 1000))
        setDateEnd(new Date(lastDate.seconds * 1000 + 1000 *3600 * 24 * 14))
      }
    }
  }, [hookedSprints]);

  return (
    <Paper variant={'outlined'} sx={itemSelectSytle}>
      <h3>Add Sprint</h3>
      <Box sx={{display: 'flex'}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box className={"StartDate"} sx={dateSelector}>
            <DatePicker
              label="Sprint Start Date"
              value={dateStart}
              minDate={dateStart}
              onChange={(newValue) => {
                setDateStart(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Box className={"EndDate"}  sx={dateSelector}>
            <DatePicker
              label="Sprint End Date"
              value={dateEnd}
              minDate={dateStart}
              onChange={(newValue) => {
                setDateEnd(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
        <Button
          onClick={() => {
            const difference = dateEnd.getTime() - dateStart.getTime();
            const days = Math.floor(difference / (1000 * 3600 * 24));
            addSprint(dateStart, dateEnd, days, product.id);
          }}
        >
          Add Sprint
        </Button>
      </Box>
    </Paper>
  );
}
//######################################################
const SprintBacklog = (props) => {
  const [btnClk, setBtnClk] = useState(0);
  const fixDatabase = () => {
    setBtnClk(btnClk + 1);
  };

  let {product} = useContext(UserContext);

  const [sprintID, setSprintID] = useState('qoQPtehTrvrvLXjF4v9w');
  const [sprintStories, setSprintStories] = useState([]);

  let sprintRef = firestore.collection('sprints').doc(sprintID);

  let [sprintSS, setSprintSS] = useState(null);
  let sprintObserver = null;

  const backlogStoriesRef = firestore.collection('userStory');
  if (product) {
    var backlogStoriesQuery = backlogStoriesRef;
    backlogStoriesQuery = backlogStoriesQuery.where(
      'productId',
      '==',
      product.id
    );
    backlogStoriesQuery = backlogStoriesQuery.where(
      'state',
      '==',
      'productBacklog'
    );
  } else {
    var backlogStoriesQuery = backlogStoriesRef.where('productId', '==', 0);
  }
  const [backlogStories, backlogStoriesLoading] =
    useCollection(backlogStoriesQuery);

  useEffect(() => {
    console.log('updating sprintSS');
    // Stop listening to the previous snapshot call back
    if (sprintObserver != null) {
      sprintObserver();
    }
    // set new query / reference using new sprintID
    sprintRef = firestore.collection('sprints').doc(sprintID);
    // set up new callback function using new sprintRef
    sprintObserver = sprintRef.onSnapshot((snapShot) => {
      setSprintSS(snapShot);
    });
  }, [sprintID, btnClk]);

  useEffect(async () => {
    if (sprintSS === null) return;
    let tempSprintStories = [];
    for (const storyId of sprintSS.data().userStories) {
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
  }, [sprintSS]);

  const moveStoryToSprint = (storyID) => {
    firestore
      .collection('sprints')
      .doc(sprintID)
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
      .doc(sprintID)
      .update({
        userStories: arrayRemove(storyID),
      });
    firestore.collection('userStory').doc(storyID).update({
      state: 'productBacklog',
    });
  };

  const [hookedSprints] = useGetSprintsData(product ? product.id : null);

  return (
    <Fragment>
      {product && (
        <Box>
          <SprintSelector sprintId={sprintID} setSprintID={setSprintID} />
          {!sprintSS && <p>=================Data Is Nil==================</p>}
          {sprintSS != null && (
            <box>
              <p>Product ID: {product.id}</p>
              <p>Sprint ID: {sprintSS.id}</p>
              <p>Sprint Start Date: {sprintSS.data().startDate}</p>
              <p>Sprint Length: {sprintSS.data().length}</p>
              <p>Sprint ProductID: {sprintSS.data().ProductID}</p>
              <p>Sprint User Stories: {sprintSS.data().userStories}</p>
            </box>
          )}

          {/* {product && <SprintSelector productId={product.id} sprintCallback={backlogStoriesLoading}/>} */}
          <Box sx={{display: 'flex'}}>
            <Box sx={{width: 275}}>
              {!backlogStoriesLoading &&
                backlogStories.docs.map((story) => {
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
            <Box>| | |</Box>
            <Box sx={{width: 275}}>
              {sprintSS != null &&
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
          <Button variant="contained" onClick={fixDatabase}>
            for testing {btnClk}
          </Button>
          <AddSprint product={product} hookedSprints={hookedSprints} />
        </Box>
      )}
    </Fragment>
  );
};

export default SprintBacklog;
