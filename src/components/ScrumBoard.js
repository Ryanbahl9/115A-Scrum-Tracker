import React from 'react'
import { Grid } from '@mui/material';

const Board = () => {
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <h3>Backlog</h3>
                </Grid>
                <Grid item xs={2}>
                    <h3>User Stories</h3>
                </Grid>
                <Grid item xs={2}>
                    <h3>To Do</h3>
                </Grid>
                <Grid item xs={2}>
                    <h3>In Progress</h3>
                </Grid>
                <Grid item xs={3}>
                    <h3>Completed</h3>
                </Grid>


                <Grid item xs={3}>
                    <div>backlogged tasks</div>
                </Grid>
                <Grid item xs={2}>
                    <div>Example User Story</div>
                </Grid>
                <Grid item xs={2}>
                    <div>to do tasks</div>
                </Grid>
                <Grid item xs={2}>
                    <div>in porgress tasks</div>
                </Grid>
                <Grid item xs={3}>
                    <div>completed tasks</div>
                </Grid>

            </Grid>
        </>
    )
}

export default Board

