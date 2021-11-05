import React, {useState, useEffect} from 'react'
import { Box, List } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { doc, updateDoc } from "firebase/firestore";
import { useCollectionData} from 'react-firebase-hooks/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Task from './Task';



const UserStoryRow = (props) => {
    let taskQuery;
    const taskRef = firestore.collection('task');
    const [complete, setComplete] = useState(false);
    taskQuery = taskRef.where('userStoryId', '==', props.data.id);
    let [tasks, tasksLoading] = useCollectionData(taskQuery, { idField: 'id' });

  const increasePriority = () => {
    if(props.data.priority === 1) return; 
    updateDoc(doc(firestore, 'userStory', props.id), {priority: props.data.priority - 1})
  };
  const decreasePriority = () => {
    if (props.data.priority === 8) return;
    updateDoc(doc(firestore, 'userStory', props.id), { priority: props.data.priority + 1 })
  };

  useEffect(() => {
    if (!tasksLoading && tasks.length !== 0) {
      if (tasks.every((task) => task.stage === 'Complete')) {
        setComplete(true);
      }
    }
  }, [setComplete, tasksLoading, tasks]);


    return (<Box sx={{display: 'flex'}}>
                <Box sx={{minWidth: '100px',
                          height: '200px',
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'column',
                          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}>
        <ArrowCircleUpIcon onClick={increasePriority} sx={{fontSize:  '2em', cursor: 'pointer'}}/>
                  <ArrowCircleDownIcon onClick={decreasePriority} sx={{fontSize: '2em', cursor: 'pointer'}} />
                </Box>
                <Box sx={{minWidth: '200px',
                          maxWidth: '200px',
                          height: '200px',
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'column',
                          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}>
                    <div><strong>{props.data.description}</strong></div>
                    {complete ?
                      <Box sx={{ border: '2px solid #0e0'}}>All tasks complete!</Box>
                    :
                      <div>Priority: {props.data.priority}</div>
                    }
                </Box>
                <Box sx={{display: 'flex'}}>
                    {props.stageTitles.map((title, i)=>
                    (<Box sx={{width: '200px',
                               height: '200px',
                               boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}
                          key={i} >
                            <List sx={{maxHeight: '90%', overflowY: 'scroll'}} >
                                {tasksLoading ?
                                  <CircularProgress />
                                :
                                  <>
                                  {
                                    tasks.map((task, i) => {
                                      if (task.stage === title) {
                                        return <Task key={task.id}
                                            userStoryId={props.data.id}
                                            data={task}/>
                                      } else {
                                        return null;
                                      }
                                    })
                                  }
                                  </>
                                }

                            </List>
                        </Box>))}
                </Box>
            </Box>
    )
}

export default UserStoryRow
