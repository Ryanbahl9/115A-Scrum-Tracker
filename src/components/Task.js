import React, { useContext, useEffect, useState } from 'react';
import TaskMenu from './TaskMenu';
import { ListItem } from '@mui/material';
import UserContext from './UserContext';
import { useProductColorById, useTaskById } from '../backEnd/DataBaseQueries';


const Task = (props) => {
    const { product } = useContext(UserContext);
    const [productColor] = useProductColorById(product.id);
    const [task] = useTaskById(props.data.id);
    const [taskStyle, setTaskStyle] = useState(null);

    useEffect(() => {
        if (productColor && productColor.data()) {
            setTaskStyle(
                {
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: "180px",
                    marginLeft: "2px",
                    border: '1px solid grey',
                    borderColor: productColor.data().userColor[props.data.userId] ?
                        productColor.data().userColor[props.data.userId].color : 'black',
                })
        }
    }, [productColor, task, props.data.id]);

    return (
        <ListItem sx={taskStyle}>
            <div>{props.data.description}</div>{' '}<TaskMenu id={props.data.id} data={props.data} />
        </ListItem>
    )
}

export default Task
