import React from 'react'
import { Box, List } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { useCollectionData} from 'react-firebase-hooks/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import Task from './Task';



const UserStoryRow = (props) => {
    let taskQuery;
    const taskRef = firestore.collection('task');
    taskQuery = taskRef.where('userStoryId', '==', props.data.id);
    let [tasks, tasksLoading] = useCollectionData(taskQuery, { idField: 'id' });

    return (<Box sx={{display: 'flex'}}>
                <Box sx={{minWidth: '100px',
                          height: '200px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}>
                    <DragHandleIcon />
                </Box>
                <Box sx={{minWidth: '200px',
                          height: '200px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}>
                    {props.data.description}
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
