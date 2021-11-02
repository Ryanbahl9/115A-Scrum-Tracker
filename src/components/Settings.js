import React, {useState, useContext, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import {Box} from '@mui/material';
import {useDocument, useDocumentDataOnce} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';
import {Button, Input} from '@mui/material';

import {doc, updateDoc} from '@firebase/firestore';
import UserContext from './UserContext';
import {itemsStyle, itemStyle} from './CSS.js';

function UserTiles(props) {
  let {product} = useContext(UserContext);
  const productHookedRef = firestore.collection('products').doc(product.id);
  const [productHooked] = useDocument(productHookedRef, {idField: 'id'});

  const [userBoxes, setUserBoxes] = useState(<Box />);

  function getUsersPromises(usersUidList) {
    return Promise.all(
      usersUidList.map((uid) => firestore.collection('users').doc(uid).get())
    );
  }

  useEffect(() => {
    if (productHooked && productHooked.data() && productHooked.data().users) {
      getUsersPromises(productHooked.data().users).then((userArr) => {
        setUserBoxes(
          <Box>
            <h3 style={{textAlign: 'center'}}>Current Users</h3>
            <Box
              sx={{
                display: 'grid',
                rowGap: 2,
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {userArr.map((doc) => {
                return (
                  <Paper key={doc.id} sx={itemStyle}>
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
  const MyForm = () => {
    const style = {background: 'white'};

    const EnterProductName = async (e) => {
      e.preventDefault();
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

  const productTitleAndAdd = (product, productOwner) => {
    if (product && productOwner) {
      return (
        <Box>
          <h3>Product</h3>
          <h1 style={{textAlign: 'center'}}>{product.productName}</h1>
          <Box sx={{textAlign: 'center', marginBottom: 2}}>
            <Box>Owner</Box>
            {productOwner.displayName}
          </Box>
          {productOwner.uid === auth.currentUser.uid && (
            <Box sx={{textAlign: 'center'}}>Add Users {MyForm()}</Box>
          )}
        </Box>
      );
    } else {
      return <Box sx={{margin: 2}} No Product Selected></Box>;
    }
  };

  return (
    <div>
      {product ? (
        <Box>
          <Paper sx={itemsStyle}>
            {productTitleAndAdd(product, productOwner)}
            <UserTiles />
          </Paper>
          <Paper sx={itemsStyle}>
            <Box>
              <h3>Sprint</h3>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Paper sx={itemsStyle}>Select Product for Settings</Paper>
        </Box>
      )}
    </div>
  );
}
export default Settings;
