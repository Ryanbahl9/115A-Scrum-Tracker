import React from 'react';
import TaskMenu from './TaskMenu';
import { ListItem } from '@mui/material';

const Task = (props) => {


    return (
        <ListItem sx={{ display: "flex", justifyContent: "space-between", maxWidth: "180px", marginLeft: "10px", borderBottom: "1px solid grey" }}>
            <div>{props.data.description}</div>{' '}<TaskMenu id={props.data.id}/>
        </ListItem>
    )
}

export default Task
