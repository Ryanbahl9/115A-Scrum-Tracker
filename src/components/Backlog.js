import * as React from 'react';
import Button from '@mui/material/Button';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import Stack from '@mui/material/Stack';
import {createUserStory} from './UserStory';

const Backlog = () => {
    return (
        <div>
            <section>
                <h1/> {/* White space styling */}
                <Stack direction="row" container justifyContent="flex-end">
                    <Button variant="contained" endIcon={<AddBoxSharpIcon />} onClick = {createUserStory} >
                        Add User Story
                    </Button>
                </Stack>
            </section>
        </div>
    )
}
    
export default Backlog
