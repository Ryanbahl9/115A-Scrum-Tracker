import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

var currentInputString;
var currentPriority;

export const getUserStoryDes = () => {
    return currentInputString;
}

export const getPriority = () => {
    return currentPriority;
}

const UserStoryInput = (props) => {
    const {inputOpen, passDownStyle} = props;

    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
      setValue(event.target.value);
      currentInputString = event.target.value;
    };

    if (inputOpen) {
        return (
            <Box
                component="form"
                sx={passDownStyle}
                noValidate
                autoComplete="off"
                >
                <TextField
                    id="outlined-multiline-static"
                    fullWidth label="User Story Description"
                    multiline
                    rows={4}
                    onChange = {handleChange}
                />
                <BasicSelect/>
            </Box>
        )
    } else {
        return <Box/>
    }
}

function BasicSelect() {
  const [priority, setPriority] = React.useState(1);
  currentPriority = priority

  const handleChange = (event) => {
    setPriority(event.target.value);
    currentPriority = priority
  };

  return (
    <Box sx={{ m: 1, width: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="simple-select-label">Priority</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={priority}
          label="Priority"
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default UserStoryInput