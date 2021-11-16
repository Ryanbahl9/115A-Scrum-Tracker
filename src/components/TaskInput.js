import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { useDocument, useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore, auth} from './fire';
import UserContext from './UserContext';
import UserStoryCard from './UserStoryCard';
import { doc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { Grid } from '@mui/material';

const TaskInput = (props) => {
    const [value, setValue] = React.useState('');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    let taskQuery;
    const taskRef = firestore.collection('task');
    taskQuery = taskRef.where('userStoryId', '==', props.userStoryId);
    let [tasks, tasksLoading] = useCollectionData(taskQuery, { idField: 'id' });

    const createTask = () => {
      if (value == '') return;
      addDoc(collection(firestore, 'task'), {
        userId: null,
        userStoryId: props.userStoryId,
        description: value,
        stage: 'Queue'
      });
      if (props.userStoryState === "completed") {
        updateDoc(doc(firestore, 'userStory', props.userStoryId), {state: "sprintBacklog"})
      }
      setValue("")
    }

    const deleteTask = async (task) => {
      await deleteDoc(doc(firestore, "task", task.id));
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
                        <TextField id="filled-basic" value={value} label="Add Task" variant="filled" width="110ch" onChange = {handleChange}/>
                </Box>
                <Button onClick={createTask}>
                    Create Task
                </Button>
            </Stack>
            {tasksLoading ?
              <CircularProgress />
            :
              <>
              {
                tasks.map(task => (
                  <Stack>
                    <h3>
                      -{task.description}
                    </h3>
                    <Stack direction="row" justifyContent="right">
                      <Button color="error" onClick={() => deleteTask(task)}>
                        Delete
                      </Button>
                      <Button>
                        Edit
                      </Button>
                    </Stack>
                  </Stack>
                ))
              }
              </>
            }
        </Stack>
    );
}

export default TaskInput