import React from 'react'
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const UserStoryRow = (props) => {
    return (<Box sx={{ display: "flex", justifyContent: "start", width: `${(props.stageTitles.length * 200) - 100}px`,}}>
        
            < Box sx={{
                minWidth: "100px", display: "flex", flexDirection: "row", justifyContent:"center", alignItems:"center", height: "200px",
                borderBottom: "1px solid black"
            }}>
            <DragHandleIcon />
            </Box>
            <Box sx={{ scrollSnapAlign: "start",
                       borderBottom: "1px solid black",
                       borderLeft: "1px solid black",
                       width: `${props.stageTitles.length * 200}px`,
                       height: "200px",
                       display:"inline-flex"}}>
                {props.stageTitles.map((_, i)=><Box key={i} sx={{borderRight: "1px solid black", minWidth:"200px", minHeight:"200px"}}/>)}
            </Box>
        </Box>
    )
}

export default UserStoryRow
