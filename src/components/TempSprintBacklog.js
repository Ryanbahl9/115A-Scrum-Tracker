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
  import {dateSelector, itemSelectSytle, itemsStyle, itemStyle} from './CSS';
  import {SettingsSystemDaydreamTwoTone} from '@mui/icons-material';
  
  function AddSprint(props) {
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    var {product, hookedSprints} = props;
  
    useEffect(() => {
      if (hookedSprints) {
        if (hookedSprints.length === 0) {
          setDateStart(new Date());
          setDateEnd(new Date(Date.now() + 1000 * 3600 * 24 * 14));
        } else {
          //find end of last sprint, make that the start point
          var greatestDate = 0;
          var lastDate = null;
          var lastLength = null;
          hookedSprints.forEach((doc) => {
            if (doc.startDate.seconds > greatestDate) {
              greatestDate = doc.startDate.seconds;
              lastDate = doc.endDate;
              lastLength = doc.length
            }
          });
          setDateStart(new Date(lastDate.seconds * 1000));
          setDateEnd(new Date(lastDate.seconds * 1000 + 1000 * 3600 * 24 * lastLength));
        }
      }
    }, [hookedSprints]);
  
    return (
      <Paper variant={'outlined'} sx={itemSelectSytle}>
        <h3>Add Sprint</h3>
        <Box sx={{display: 'flex'}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className={'StartDate'} sx={dateSelector}>
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
            <Box className={'EndDate'} sx={dateSelector}>
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
              const days = Math.ceil(difference / (1000 * 3600 * 24));
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
  
    let {product} = useContext(UserContext);

    //for adding sprints
    const [hookedSprints] = useGetSprintsData(product ? product.id : null);
    
    return (
      <Fragment>
        {product ? (
          <Box>
              {hookedSprints}
            {/* <SprintSelector sprintId={sprintID} setSprintID={setSprintID} /> */}
            <AddSprint product={product} hookedSprints={hookedSprints} />
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
  