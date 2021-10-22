import * as React from 'react';
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import UserStoryInput from './UserStory';

const Backlog = () => {
    const [inputOpen, setinputOpen] = React.useState(false);
    const toggleUserInput = () => {
        inputOpen === false ? setinputOpen(true) : setinputOpen(false)
    }

    const CreateButton = () => {
        if (inputOpen) {
            return (
                <Button>
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
