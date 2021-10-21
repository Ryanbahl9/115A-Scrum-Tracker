import React from 'react'
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const UserStoryRow = (props) => {
    //this component will query the tasks collection to get all the tasks associated with this user story
    //will be adding soon
    return (<Box sx={{ display: "flex", justifyContent: "start", width: `${(props.numStages * 200) - 100}px`,}}>
            <DragHandleIcon sx={{minWidth:"100px", paddingTop:"100px"}}/>
            <Box sx={{ scrollSnapAlign: "start",
                       background:"white",
                       marginTop: "10px",
                       marginBottom: "10px",
                       width: `${props.numStages * 200}px`,
                       height: "200px",
                       borderRadius: "15px",
                       boxShadow:"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"}}>
            empty user story row
            </Box>
        </Box>
    )
}

export default UserStoryRow
