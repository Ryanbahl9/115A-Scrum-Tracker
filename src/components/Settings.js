import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import { firestore, auth } from './fire';


// import {admin} from 'firebase-admin';
import {
    Select,
    FormControl,
    MenuItem,
    Button,
    Input,
    From,
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { doc, updateDoc } from '@firebase/firestore';
import UserContext from './UserContext';
// import { updateDoc } from 'firebase/firestore';

const admin = require('firebase-admin');

const Item = styled(Paper)(({ theme }) => (
    {
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

const Thing = ({ children }) => {
    return (<div>{children}</div>)
}



function Settings() {

    let { product } = useContext(UserContext);

    //##submission Field, state and function
    const [formValue, setFormValue] = useState('');

    const EnterProductName = async (e) => {
        e.preventDefault();
        const { uid } = auth.currentUser;
        const userRef = firestore.collection('users').where(
            'email',
            '==',
            formValue
        );

        const invitee = await userRef.get();
        // console.log("did Get: " + formValue)

        if (!invitee.empty) {
            // if (invitee.docs.length > 0) {
            // console.log("true")
            const snapShot = invitee.docs[0];
            // console.log('id: ' + snapShot.id)
            // console.log('arr: ' + snapShot.data().invites)
            const temp = doc(firestore, 'users', snapShot.id)
            const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
            updateDoc(temp, {
            // invites: [...snapShot.data().invites, product.id]
            invites: arrayUnion(product.id)
            })

        } else {
            console.log("false")
        }

        setFormValue('');
    };

    const style = { background: 'white' };
    const myForm = () => {
        return (
            <form onSubmit={EnterProductName}>
                <Input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="Email"
                    sx={style}
                />
                <Button type="submit" disabled={!formValue}>
                    Add
            </Button>
            </form>
        );
    };
    //##Submission Field End
    return (

        <div>{product ?
            <Stack spacing={2}>
                <Paper>
                    <h style={{ textAlign: 'left' }}>Product Users</h>
                    <Box sx={{ textAlign: 'center' }}>Add Users {myForm()}</Box>
                    {/* <Box sx={{ display: '-ms-flexbox' }}>List users in a grid</Box> */}
                </Paper>
                {/* <Item><h style={{ textAlign: 'left' }}>Product Users</h></Item> */}
                {/* <Item>Item 2</Item> */}
                {/* <Item>Item 3</Item> */}
                {/* <Thing>Added thing */}
                {/* </Thing> */}
            </Stack>
            :
            <div>Please Select Product from Home</div>}
        </div>
    )
}
export default Settings;