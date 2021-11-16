import React, {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import { firestore } from './fire';
import { doc, query, where, collection, getDocs, deleteDoc, updateDoc} from "firebase/firestore";
import UserContext from './UserContext';
import {useDocumentData} from 'react-firebase-hooks/firestore';

export default function BasicMenu(props) {
    const { product } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    let pid = product.id;
    const [productData,
      loadingProduct] = useDocumentData(firestore
        .collection('products')
        .doc(pid), { idField: 'id' });

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDelete = async () => {
      if (!loadingProduct) {
        const q = query(collection(firestore, 'task'),
          where('userStoryId', 'in', props.userStoryIds),
          where('stage', '==', props.stage));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async docRef => {
            await deleteDoc(doc(firestore, 'task', docRef.id));
        })
        const i = productData.stages.indexOf(props.stage);
        updateDoc(doc(firestore, 'products', product.id), { stages: [...productData.stages.slice(0, i), ...productData.stages.slice(i + 1, productData.stages.length)]});
      }
    }

  const handleMoveTasks = async (next) => {
      const q = query(collection(firestore, 'task'),
        where('userStoryId', 'in', props.userStoryIds),
        where('stage', '==', props.stage));
      const querySnapshot = await getDocs(q);
      let stage;
      if (next) {
        stage = productData.stages[productData.stages.indexOf(props.stage) + 1];
        if (!stage) stage = 'Complete';
      } else {
        stage = productData.stages[productData.stages.indexOf(props.stage) - 1];
        if (!stage) stage = 'Queue';
      }
      querySnapshot.forEach(async docRef => {
        updateDoc(doc(firestore, 'task', docRef.id), { stage });
      })
  }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{width:"50px", height:"30px"}}
            >
                <MenuIcon />
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
          <MenuItem onClick={() => handleMoveTasks(true)}>Move All tasks to next column</MenuItem>
          <MenuItem onClick={() => handleMoveTasks(false)}>Move All tasks to prev column</MenuItem>

                <Divider />
                <MenuItem sx={{color: 'red'}}onClick={handleDelete}>Delete Stage</MenuItem>
            </Menu>
        </div>
    );
}