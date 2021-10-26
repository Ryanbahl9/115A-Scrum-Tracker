import * as React from 'react';
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import UserStoryInput from './UserStory';

import ProductContext from './ProductContext';

import firebase from 'firebase/compat/app';
import {auth, firestore} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Backlog = () => {
    const userStoryRef = firestore.collection('userStory');
    var query = userStoryRef.where('productID', '==', '2dxqW2D6PEWzlENymKTO')
    const [userStoryData] = useCollectionData(query, {idField: 'id'});

    const [inputOpen, setinputOpen] = React.useState(false);
    const toggleUserInput = () => {
        inputOpen === false ? setinputOpen(true) : setinputOpen(false)
    }

    const createUserStory = () => {
        toggleUserInput();
        console.log(userStoryData)
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
