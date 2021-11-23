import * as React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import {firestore} from './fire';
import { doc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";

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
      if (value === '') return;
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

    const TileTask = (props) => {
      const [editor, setEditor] = React.useState(false);
      let taskEditVal = ""

      const updateTask = () => {
        if (taskEditVal.length > 0) {
          updateDoc(doc(firestore,"task", props.task.id), {description : taskEditVal})
          setEditor(!editor)
        } else {
          deleteTask(props.task)
        }
      }

      const updateTaskInput = (e) => {
        taskEditVal = e.target.value
      }

      const TaskEditor = (props) => {
        return (
          <Stack direction="row">
            <Box
              component="form"
              sx={{
                  '& > :not(style)': { m: 1, width: '100ch' },
              }}
              noValidate
              autoComplete="off"
              >
              <TextField
                id="filled-basic"
                variant="filled"
                width="110ch"
                defaultValue={props.task.description}
                onChange={updateTaskInput}
              />
            </Box>
            <Button color="success" onClick={updateTask}>
              Save
            </Button>
          </Stack>
        );
      }

      return (
        <Stack>
          {editor ? <TaskEditor task={props.task}/> : <h3>-{props.task.description}</h3>}
          <Stack direction="row" justifyContent="right">
              <Button color="error" onClick={() => deleteTask(props.task)}>
                Delete
              </Button>
              <Button onClick={() => setEditor(!editor)}>
                {editor ? "Cancel" : "Edit"}
              </Button>
          </Stack>
        </Stack>
      );
    }

    return (
        <Stack>
            <Stack direction="row" spacing={1}>
                <Box
                    component="form"
                    sx={{width: '90%'}}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField
                          id="filled-basic"
                          value={value}
                          label="Add Task"
                          variant="filled"
                          sx={{width: '100%'}}
                          onChange = {(e) => handleChange(e)}/>
                </Box>
                <Button onClick={createTask} sx={{width: '10%'}}>
                    Create Task
                </Button>
            </Stack>
            {tasksLoading ?
              <CircularProgress />
            :
              <>
              {
                tasks.map(task => (
                  <TileTask key={task.id} task={task}/>
                ))
              }
              </>
            }
        </Stack>
    );
}

export default TaskInput