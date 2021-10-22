import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import firebase from 'firebase/compat/app';
import {auth, firestore} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const UserStoryInput = (props) => {
    const {inputOpen} = props;

    const [value, setValue] = React.useState('Controlled');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };

    if (inputOpen) {
        return (
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: 1000 },
                }}
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
            </Box>
        )
    } else {
        return <Box/>
    }
}

  export default UserStoryInput