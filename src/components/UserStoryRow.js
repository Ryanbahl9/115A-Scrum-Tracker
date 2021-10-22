import React from 'react'
import { Box, List, ListItem } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { firestore } from './fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const UserStoryRow = (props) => {
    console.log("test")
    console.log(props.id)
    const taskRef = firestore.collection('tasks');
    const query = taskRef.where('userStoryId', '==', props.id);
    let [tasks, loading] = useCollectionData(query);

    return (<Box sx={{ display: "flex", justifyContent: "start", width: `${(props.stageTitles.length * 200) - 100}px`,}}>
            <Box sx={{
                minWidth: "100px", display: "flex", flexDirection: "row", justifyContent:"center", alignItems:"center", height: "200px",
                borderBottom: "1px solid black"
            }}>
                <DragHandleIcon sx={{cursor:"grab"}}/>
            </Box>
            <Box sx={{ scrollSnapAlignY: "start",
                       scrollSnapAlignX: "end",
                       borderBottom: "1px solid black",
                       borderLeft: "1px solid black",
                       width: `${props.stageTitles.length * 200}px`,
                       height: "200px",
                       display:"inline-flex"}}>

                {props.stageTitles.map((title, i)=>
                    (<Box key={i} sx={{borderRight: "1px solid black", minWidth:"200px", minHeight:"200px"}}>
                        <List sx={{ margin:"0", padding:"0", height:"200px", width:"200px", overflowY:"scroll"}}>
                        {tasks && tasks.map(task => {
                            if(task.stage === title) return <ListItem>{task.name}</ListItem>})}
                        </List>
                     </Box>))}
    
            </Box>
        </Box>
    )
}

export default UserStoryRow
