import React from 'react'
import { Box, List } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { useCollectionData} from 'react-firebase-hooks/firestore';
import Task from './Task';

import styles from './UserStoryRow.module.css';

const UserStoryRow = (props) => {

    return (<Box className={styles.outerDiv} sx={{width: `${(props.stageTitles.length * 200) + 300}px`}}>
                <Box className={styles.handleContainer}>
                    <DragHandleIcon sx={{cursor:"grab"}}/>
                </Box>
        <Box sx={{ margin: '0px', height: "200px", width: "201px", borderBottom: "1px solid black", borderRight: "1px solid black", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    {props.data.description}
                </Box>
                <Box className={styles.stagesDiv} sx={{width:`${props.stageTitles.length * 200 }px`}}>
                    {props.stageTitles.map((title, i)=>
                        (<Box key={i} className={styles.stage}>
                            <List sx={{paddingTop:"0px", paddingBottom:"0px"}} className={styles.taskList}>
                                {props.data.tasks.map((task, i) => {
                                    if (task.stage === title) {
                                        return <Task key={i} description={task.description}/>
                                    } else {
                                        return null;
                                    }
                                })}
                            </List>
                        </Box>))}
                </Box>
            </Box>
    )
}

export default UserStoryRow
