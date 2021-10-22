import React from 'react';
import BasicMenu from './TaskMenu';
import { ListItem } from '@mui/material';

const Task = (props) => {
    return (
        <ListItem sx={{ display: "flex", justifyContent: "space-between", maxWidth: "180px", marginLeft: "10px", borderBottom: "1px solid grey" }}>
            <div>{props.data.name}</div>{' '}<BasicMenu />
        </ListItem>
    )
}

export default Task
