import React, {useState, useContext, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {useCollectionData, useDocument} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';

// import {admin} from 'firebase-admin';
import {
  Select,
  FormControl,
  MenuItem,
  Button,
  Input,
  From,
} from '@mui/material';
import {
  AdminPanelSettings,
  CountertopsOutlined,
  Repeat,
} from '@mui/icons-material';
import {doc, updateDoc} from '@firebase/firestore';
import UserContext from './UserContext';
import Invites from './Invites';

// const admin = require('firebase-admin');

const Item = styled(Paper)(({theme}) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Thing = ({children}) => {
  return <div>{children}</div>;
};

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
        <Paper>
          <h style={{textAlign: 'left'}}>Product Users</h>
          {product ?
            <div>
              <Box sx={{textAlign: 'center'}}>Add Users {myForm()}</Box>
              <UserTiles />
            </div>
            :
            <div>Select Product for User Detail</div>
          }
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
