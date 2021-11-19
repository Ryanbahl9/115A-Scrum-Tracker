import {
  Button,
  Box,
  Paper,
} from '@mui/material';
import React, {useState, useEffect} from 'react';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { addSprint } from '../backEnd/DataBaseQueries';
import {dateSelector, itemSelectSytle} from './CSS';
import {useGetSprintsData} from '../backEnd/DataBaseQueries'


const AddSprint = (props) => {
  var {product} = props;
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [hookedSprints] = useGetSprintsData(product ? product.id : null);

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

export default AddSprint
