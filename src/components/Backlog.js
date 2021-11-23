import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { itemsStyle } from './CSS';
import { useCollection } from 'react-firebase-hooks/firestore';
import UserStoryInput, { getUserStoryDes, getPriority } from './UserStory';
import TaskInput from './TaskInput';
import UserContext from './UserContext';
import { firestore } from './fire';
import { deleteDoc, getDocs, doc } from '@firebase/firestore';


const Backlog = () => {
    let { product } = useContext(UserContext)
    const userStoryRef = firestore.collection('userStory');
    let query;
    if (product) {
        query = userStoryRef.where('productId', '==', product.id);
    } else {
        query = userStoryRef.where('productId', '==', '0');
    }
    let [UserStories, loading] = useCollection(query);

    const createUserStory = async (e) => {
        toggleUserInput();
        e.preventDefault();
        if (product) {
            await userStoryRef.add({
                productId: product.id,
                description: getUserStoryDes(),
                priority: getPriority(),
                state: 'productBacklog'
            });
        }
    }

    const deleteUserStory = async (userStory) => {
        let userStoryTasks = firestore.collection('task').where('userStoryId', '==', userStory.id)
        let taskArray = await getDocs(userStoryTasks)
        taskArray.forEach((task) => {
            deleteDoc(doc(firestore, 'task', task.id))
        });
        deleteDoc(doc(firestore, 'userStory', userStory.id))
    }

    const [inputOpen, setinputOpen] = React.useState(false);
    const toggleUserInput = () => {
        inputOpen === false ? setinputOpen(true) : setinputOpen(false)
    }

    const CreateButton = () => {
        if (inputOpen) {
            return (
                <Button variant="text" onClick={createUserStory}>
                    Create
                </Button>
            )
        } else {
            return <div />
        }
    }

    const DeleteButton = (props) => {
        return (
            <Button color="error" onClick={() => deleteUserStory(props.userStory)}>
                Delete User Story
            </Button>
        )
    }

    const UserStoryTiles = () => {
        if (loading) return <div />;
        let complete = [];
        let incomplete = [];
        UserStories.docs.forEach(userStoryDoc => {
            if (userStoryDoc.data().state === "completed") {
                complete.push(userStoryDoc)
            } else {
                incomplete.push(userStoryDoc)
            }
        })

        if (complete.length > 0 && incomplete.length > 0) {
            return (
                <Stack direction="column" spacing={2}>
                    <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>Incomplete</h1>
                    {incomplete.map(userStory => (
                        <Box
                            key={userStory.data().description}
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
                            <Paper key={userStory.data().description} variant="elevation" elevation={5} sx={itemsStyle}>
                                <h1>
                                    {userStory.data().description}
                                </h1>
                                <h3>
                                    Priority: {userStory.data().priority}
                                </h3>
                                <TaskInput userStoryId={userStory.id} userStoryState={userStory.data().state} />
                                <DeleteButton userStory={userStory}/>
                            </Paper>
                        </Box>
                    ))}
                    <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>Complete</h1>
                    {complete.map(userStory => (
                        <Box
                            key={userStory.data().description}
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
                            <Paper key={userStory.data().description} variant="elevation" elevation={5} sx={itemsStyle}>
                                <h1>
                                    {userStory.data().description}
                                </h1>
                                <h3>
                                    Priority: {userStory.data().priority}
                                </h3>
                                <TaskInput userStoryId={userStory.id} userStoryState={userStory.data().state} />
                                <DeleteButton userStory={userStory}/>
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            );
        } else if (complete.length > 0) {
            return (
                <Stack direction="column" spacing={2}>
                    <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>Complete</h1>
                    {complete.map(userStory => (
                        <Box
                            key={userStory.data().description}
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
                            <Paper key={userStory.data().description} variant="elevation" elevation={5} sx={itemsStyle}>
                                <h1>
                                    {userStory.data().description}
                                </h1>
                                <h3>
                                    Priority: {userStory.data().priority}
                                </h3>
                                <TaskInput userStoryId={userStory.id} userStoryState={userStory.data().state} />
                                <DeleteButton userStory={userStory}/>
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            );
        } else if (incomplete.length > 0) {
            return (
                <Stack direction="column" spacing={2}>
                    <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>Incomplete</h1>
                    {incomplete.map(userStory => (
                        <Box
                            key={userStory.data().description}
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
                            <Paper key={userStory.data().description} variant="elevation" elevation={5} sx={itemsStyle}>
                                <h1>
                                    {userStory.data().description}
                                </h1>
                                <h3>
                                    Priority: {userStory.data().priority}
                                </h3>
                                <TaskInput userStoryId={userStory.id} userStoryState={userStory.data().state} />
                                <DeleteButton userStory={userStory}/>
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            );
        } else {
            return <div />
        }
    }

    return (
        <div> {product ?
            <section>
                {!inputOpen ?
                    <Stack direction="row" justifyContent="flex-end" sx={{ paddingTop: 3 }}>
                        <Button variant="contained" endIcon={<AddBoxSharpIcon />} onClick={toggleUserInput} >
                            Add User Story
                        </Button>
                    </Stack>
                    :
                    <Paper sx={itemsStyle}>
                        <Stack direction="row" justifyContent="center">
                            <UserStoryInput
                                inputOpen={inputOpen}
                                passDownStyle={{ width: '90%' }} />
                            <CreateButton />

                        </Stack>
                    </Paper>
                }

                <UserStoryTiles />
            </section>
            : <div>Select Product to view Backlog</div>
        }
        </div>
    )
}

export default Backlog
