import React, { useState, useContext} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Divider from '@mui/material/Divider';
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {firestore, auth} from './fire';
import UserContext from './UserContext';
import {
    useDocumentData
} from 'react-firebase-hooks/firestore';

export default function BasicMenu(props) {
    const { product } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    let pid;
    if (product) {
      pid = product.id;
    } else {
      pid = '0';
    }
    const [productData] = useDocumentData(firestore
        .collection('products')
        .doc(pid), { idField: 'id' });

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDelete = (e) => {
      e.preventDefault();
      const taskRef = doc(firestore, "task", props.id);
      deleteDoc(taskRef);
      handleClose();
    }

    const handleMoveNext = async (e) => {
      e.preventDefault();
      if(props.data.stage === 'Queue'){
        await updateDoc(doc(firestore,"task",props.id), {stage: productData.stages[0]})
      } else if (productData.stages.indexOf(props.data.stage) === productData.stages.length - 1) {
        await updateDoc(doc(firestore, "task", props.id), { stage: 'Complete' })
      } else {
        await updateDoc(doc(firestore, "task", props.id), { stage: productData.stages[productData.stages.indexOf(props.data.stage) + 1] })
      }
      handleClose();
    }

    const handleMovePrev = async (e) => {
      e.preventDefault();
      if (props.data.stage === 'Complete') {
        await updateDoc(doc(firestore, "task", props.id), { stage: productData.stages[productData.stages.length - 1] })
      } else if (productData.stages.indexOf(props.data.stage) === 0) {
        await updateDoc(doc(firestore, "task", props.id), { stage: 'Queue' })
      } else {
        await updateDoc(doc(firestore, "task", props.id), { stage: productData.stages[productData.stages.indexOf(props.data.stage) - 1] })
      }
      handleClose();
    }

    const handleAssignOwner = async (e) => {
      e.preventDefault();
      await updateDoc(doc(firestore, "task", props.id), {userId: auth.currentUser.uid, displayName: auth.currentUser.displayName});
      handleClose();
    }



    return (
        <div>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ width: "50px", height: "30px" }}
            >
                <ArrowRightIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem disabled={props.data.stage === 'Complete'} onClick={handleMoveNext}>Move task to next stage</MenuItem>
                <MenuItem disabled={props.data.stage === 'Queue'} onClick={handleMovePrev}>Move task to prev stage</MenuItem>
                <MenuItem disabled={props.data.userId !== '' && typeof props.data.userId === 'string'} onClick={handleAssignOwner}>
                  {props.data.userId ?
                    `Assigned to ${props.data.displayName}`
                  :
                    <div>Assigne yourself to task</div>
                  }
                </MenuItem>
                <Divider />
                <MenuItem sx={{color: 'red'}}onClick={handleDelete}>Delete task</MenuItem>
            </Menu>
        </div>
    );
}