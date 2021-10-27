import React, {useState, useContext, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {
  useCollectionData,
  useDocument,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';
import {Button, Input} from '@mui/material';

import {doc, updateDoc} from '@firebase/firestore';
import UserContext from './UserContext';
import Invites from './Invites';

function UserTiles(props) {
  let {product} = useContext(UserContext);
  const productHookedRef = firestore.collection('products').doc(product.id);
  const [productHooked] = useDocument(productHookedRef, {idField: 'id'});

  const [userBoxes, setUserBoxes] = useState(<Box />);

  function getUsersPromises(idList) {
    const promiseList = [];
    //build list of queries
    idList.map((uid) => {
      promiseList.push(firestore.collection('users').doc(uid).get());
    });
    return Promise.all(promiseList);
  }
  useEffect(() => {
    if (productHooked) {
      getUsersPromises(productHooked.data().users).then((userArr) => {
        console.log('re-render product');
        setUserBoxes(
          <Box>
            <h style={{textAlign: 'center'}}>Current Users</h>
            <Box
              sx={{
                display: 'grid',
                rowGap: 2,
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {userArr.map((doc) => {
                return (
                  <Paper sx={{padding: 2, margin: 2}}>
                    <Box>{doc.data().displayName}</Box>
                    <Box>{doc.data().email}</Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        );
      });
    }
  }, [productHooked]); //useEffect END
  return userBoxes;
}

function Settings() {
  let {product} = useContext(UserContext);
  var productOwnerRef = firestore.collection('users');
  if (product) {
    productOwnerRef = firestore.collection('users').doc(product.uid);
  }
  const [productOwner] = useDocumentDataOnce(productOwnerRef);

  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');

  const EnterProductName = async (e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;
    //find user with this email
    const userRef = firestore
      .collection('users')
      .where('email', '==', formValue);
    //get user with this Reference
    const invitee = await userRef.get();

    //if user exists
    if (!invitee.empty) {
      const snapShot = invitee.docs[0];
      const temp = doc(firestore, 'users', snapShot.id);
      const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
      updateDoc(temp, {
        invites: arrayUnion(product.id),
      });
    }

    setFormValue('');
  };

  const style = {background: 'white'};
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
    <div>
      <Stack spacing={2}>
        <Paper sx={{minHeight: 40, margin: 2}}>
          <h style={{textAlign: 'left'}}>Product</h>
          <h1 style={{textAlign: 'center'}}>
            {product && product.productName}
          </h1>
          <Box sx={{textAlign: 'center', marginBottom: 2}}>
            <Box>Owner</Box>
            {productOwner && productOwner.displayName}
          </Box>

          {product ? (
            productOwner && productOwner.uid === auth.currentUser.uid ? (
              <div>
                <Box sx={{textAlign: 'center'}}>Add Users {myForm()}</Box>
                <UserTiles />
              </div>
            ) : (
              <div>
                <UserTiles />
              </div>
            )
          ) : (
            <Box sx={{margin: 2}} No Product Selected></Box>
          )}
        </Paper>
        <Paper>
          <h style={{textAlign: 'left'}}>Invites</h>
          <Invites />
        </Paper>
      </Stack>
    </div>
  );
}
export default Settings;
