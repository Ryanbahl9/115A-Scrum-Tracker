import React from 'react'
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const UserStoryRow = (props) => {

    //this component will query the tasks collection to get all the tasks associated with this user story
    //will be adding soon
    return (<Box sx={{ display: "flex", justifyContent: "start", width: `${(props.numStages * 200) - 100}px`,}}>
        
            < Box sx={{
                minWidth: "100px", display: "flex", flexDirection: "row", justifyContent:"center", alignItems:"center", height: "200px",
                borderBottom: "1px solid black"
            }}>
            <DragHandleIcon />
            </Box>
            <Box sx={{ scrollSnapAlign: "start",
                       borderBottom: "1px solid black",
                       borderLeft: "1px solid black",
                       width: `${props.numStages * 200}px`,
                       height: "200px"}}>
            empty user story row
            </Box>
        </Box>
    )
}

export default UserStoryRow
