import React from 'react'
import { Box, List, ListItem } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import styles from './UserStoryRow.module.css';

const UserStoryRow = (props) => {
    console.log("test")
    console.log(props.id)
    const taskRef = firestore.collection('tasks');
    const query = taskRef.where('userStoryId', '==', props.id);
    let [tasks, loading] = useCollectionData(query);

    return (<Box className={styles.outerDiv} sx={{width: `${(props.stageTitles.length * 200) - 100}px`}}>
                <Box className={styles.handleContainer}>
                    <DragHandleIcon sx={{cursor:"grab"}}/>
                </Box>
                <Box className={styles.stagesDiv} sx={{width:`${props.stageTitles.length * 200}px`}}>
                    {props.stageTitles.map((title, i)=>
                        (<Box key={i} className={styles.stage}>
                            <List className={styles.taskList}>
                                {loading && <div>loading</div>}
                                {!loading && tasks && tasks.map(task => {
                                    if(task.stage === title) return <ListItem>{task.name}</ListItem>
                                })}
                            </List>
                         </Box>))}
                </Box>
            </Box>
    )
}

export default UserStoryRow
