import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore, auth} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const TaskInput = (props) => {
    const [value, setValue] = React.useState('');
    const handleChange = (event) => {
        setValue(event.target.value);
      };

    const createTask = () => {
        if (value == '') return;
            firestore.collection('userStory').doc(props.userStoryId).update({
                tasks: arrayUnion({
                    userId: auth.currentUser.uid,
                    userStoryId: props.userStoryId,
                    description: value,
                    stage: 'Queue',
                })
            })
    }

    return (
        <Stack>
            <Stack direction="row" spacing={1}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '100ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField id="filled-basic" label="Add Task" variant="filled" width="110ch" onChange = {handleChange}/>
                </Box>
                <Button onClick={createTask}>
                    Create Task
                </Button>
            </Stack>
            {props.taskArray.map(task => (
                <h3>
                    -{task.description}
                </h3>
            ))}
        </Stack>
    );
}

export default TaskInput