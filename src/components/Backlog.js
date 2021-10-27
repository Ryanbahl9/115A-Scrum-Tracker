import React, { useState, useContext, useRef, useEffect  } from 'react'
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import { useCollection } from 'react-firebase-hooks/firestore';
import UserStoryInput from './UserStory';

import ProductContext from './ProductContext';
import UserContext from './UserContext';

import firebase from 'firebase/compat/app';
import {auth, firestore} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { ConnectedTvOutlined } from '@mui/icons-material';

const Backlog = () => {
    let {product} = useContext(UserContext)
    const userStoryRef = firestore.collection('userStory');
    let query;
    if(product){
        query = userStoryRef.where('productID', '==', product.id);
    } else {
        query = userStoryRef.where('productID', '==', '0');
    }
    let [UserStories, loading] = useCollection(query);

    const [inputOpen, setinputOpen] = React.useState(false);
    const toggleUserInput = () => {
        inputOpen === false ? setinputOpen(true) : setinputOpen(false)
    }

    const createUserStory = () => {
        toggleUserInput();
        //TODO
    }

    const CreateButton = () => {
        if (inputOpen) {
            return (
                <Button variant="text" onClick = {createUserStory}>
                    Create
                </Button>
            )
        } else {
            return <div/>
        }
    }

    return (
        <section>
            <h1/>
            <Stack direction="row" container justifyContent="flex-end">
                <Button variant="contained" endIcon={<AddBoxSharpIcon />} onClick = {toggleUserInput} >
                    Add User Story
                </Button>
            </Stack>
            <h1/>
            <Stack direction="row" container justifyContent="center">
                <UserStoryInput inputOpen={inputOpen}/>
                <CreateButton/>
            </Stack>
        </section>
    )
}
    
export default Backlog
