import React from 'react'
import { Box } from '@mui/material';

const UserStoryRow = (props) => {
    //this component will query the tasks collection to get all the tasks associated with this user story
    //will be adding soon
    return (
        <Box sx={{ scrollSnapAlign: "start",
                   background:"white",
                   marginTop: "10px",
                   marginBottom: "10px",
                   width: "100%",
                   height: "200px",
                   borderRadius: "15px",
                   boxShadow:"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"}}>
        empty user story row
        </Box>
    )
}

export default UserStoryRow
