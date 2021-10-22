import React from 'react'
import { Box, List } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { useCollection} from 'react-firebase-hooks/firestore';
import Task from './Task';

import styles from './UserStoryRow.module.css';

const UserStoryRow = (props) => {
    const taskRef = firestore.collection('tasks');
    const query = taskRef.where('userStoryId', '==', props.id);
    let [tasks, loading] = useCollection(query);

    return (<Box className={styles.outerDiv} sx={{width: `${(props.stageTitles.length * 200) - 100}px`}}>
                <Box className={styles.handleContainer}>
                    <DragHandleIcon sx={{cursor:"grab"}}/>
                </Box>
                <Box className={styles.stagesDiv} sx={{width:`${props.stageTitles.length * 200}px`}}>
                    {props.stageTitles.map((title, i)=>
                        (<Box key={i} className={styles.stage}>
                            <List sx={{paddingTop:"0px", paddingBottom:"0px"}}className={styles.taskList}>
                                {loading && <div>loading</div>}
                                {!loading && tasks && tasks.docs.map(doc => {
                                    if (doc.data().stage === title) return <Task key={doc.id} id={doc.id} data={doc.data()}/>
                                })}
                            </List>
                         </Box>))}
                </Box>
            </Box>
    )
}

export default UserStoryRow
