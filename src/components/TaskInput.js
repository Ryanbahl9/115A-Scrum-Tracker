import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const TaskInput = (props) => {
    const createTask = () => {
        console.log(props.userStoryId)
    }

    return (
        <Stack direction="row" spacing={1}>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '100ch' },
                }}
                noValidate
                autoComplete="off"
                >
                    <TextField id="filled-basic" label="Add Task" variant="filled" width="110ch"/>
            </Box>
            <Button onClick={createTask}>
                Create Task
            </Button>
        </Stack>
    );
}

export default TaskInput