import React, { useState, useContext } from 'react'
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import { useCollection } from 'react-firebase-hooks/firestore';
import UserStoryInput, {getUserStoryDes, getPriority} from './UserStory';

//import ProductContext from './ProductContext';
import UserContext from './UserContext';

//import firebase from 'firebase/compat/app';
import {firestore} from './fire';
//import {useCollectionData} from 'react-firebase-hooks/firestore';
//import { ConnectedTvOutlined } from '@mui/icons-material';
//TODO: getUserStoryDes() to fetch string for firestore
const Backlog = () => {
    let {product} = useContext(UserContext)
    const userStoryRef = firestore.collection('userStory');
    let query;
    if (product) {
        query = userStoryRef.where('productId', '==', product.id);
    } else {
        query = userStoryRef.where('productId', '==', '0');
    }
    let [UserStories, loading] = useCollection(query);

    const [formValue, setFormValue] = useState('');
    const createUserStory = async (e) => {
        toggleUserInput();
        e.preventDefault();
        if (product) {
            await userStoryRef.add({
                productId: product.id,
                description: getUserStoryDes(),
                tasks: [],
                priorty: getPriority()
            });
        }
    }

    const [inputOpen, setinputOpen] = React.useState(false);
    const toggleUserInput = () => {
        inputOpen === false ? setinputOpen(true) : setinputOpen(false)
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
