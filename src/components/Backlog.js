import React, { useState, useContext } from 'react'
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
//import Typography from '@mui/material/Typography';
import {itemsStyle} from './CSS';
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
import UserStoryInput, {getUserStoryDes, getPriority} from './UserStory';
import TaskInput from './TaskInput';

//import ProductContext from './ProductContext';
import UserContext from './UserContext';

//import firebase from 'firebase/compat/app';
import {firestore} from './fire';
//import {useCollectionData} from 'react-firebase-hooks/firestore';
//import { ConnectedTvOutlined } from '@mui/icons-material';

const Backlog = () => {
    let {product} = useContext(UserContext)
    const userStoryRef = firestore.collection('userStory');
    let query;
    if (product) {
        query = userStoryRef.where('productId', '==', product.id);
    } else {
        query = userStoryRef.where('productId', '==', '0');
    }
    //let [UserStories, loading] = useCollectionData(query);
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
                priorty: getPriority(),
                state: 'productBacklog'
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

    const UserStoryTiles = () => {
        if (loading) return <div/>;
        if (UserStories.docs.length > 0) {
            return (
                <Stack direction="column" spacing={2}>
                    {UserStories.docs.map(userStory => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                m: 1,
                                width: 1024,
                                minHeight: 128,
                                },
                            }}
                            justifyContent="center"
                        >
                            <Paper key={userStory.data().description} sx={itemsStyle}>
                                <h1>
                                    {userStory.data().description}
                                </h1>
                                <h3>
                                    Priority: {userStory.data().priorty}
                                </h3>
                                <TaskInput userStoryId={userStory.id}/>
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            );
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
            <h1/>
            <UserStoryTiles/>
        </section>
    )
}
    
export default Backlog
