import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import firebase from 'firebase/compat/app';
import { firestore, auth } from './fire';
import { Button, Input } from '@mui/material';

import { doc, updateDoc } from '@firebase/firestore';
import UserContext from './UserContext';
import { itemsStyle, itemStyle, settingsItems } from './CSS.js';
import {
  useAvailableColors,
  useProductById,
  useProductOwnerByProduct,
  setUserColorForProduct,
  useProductColorById

} from '../backEnd/DataBaseQueries';

function ColorSelection(props) {
  let { product } = useContext(UserContext);
  const [colors] = useAvailableColors(product.id);
  const [productColors] = useProductColorById(product.id);
  const [curColor, setCurColor] = useState('');
  const setColor = (e) => {
    setUserColorForProduct(product.id, auth.currentUser.uid, e.target.value);
  };

  useEffect(() => {
    if (productColors) {
      var userColor = productColors.data().userColor;
      const colorObj = userColor[auth.currentUser.uid];
      if (colorObj) {
        setCurColor(colorObj.color);
      } else {
        setCurColor("Color Not Selected")
      }
    }
  }, [productColors]);


  return (
    <Box>
      <FormControl sx={{ minWidth: '25%' }}>
        <InputLabel id="select-label">Color</InputLabel>

        <Select
          labelId="select-label"
          id="select"
          value={curColor}
          onChange={setColor}
          sx={{ backgroundColor: curColor }}
        >
          {colors &&
            colors.availableColors.map((color) => (
              <MenuItem value={color} key={color} sx={{ backgroundColor: color, minWidth: '25%' }}>
                {color}
              </MenuItem>
            ))}
          <MenuItem disabled={true} value={curColor} key={curColor} sx={{ backgroundColor: curColor, minWidth: '25%'}}>
            {curColor}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function UserTiles(props) {
  let { product } = useContext(UserContext);
  const [productHooked] = useProductById(product.id);
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
            <h3 style={{ textAlign: 'center' }}>Current Users</h3>
            <Box sx={settingsItems}>
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
  let { product } = useContext(UserContext);
  const [productOwner] = useProductOwnerByProduct(product);

  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');
  const InviteSubmissionForm = () => {
    const style = { background: 'white' };

    const EnterProductName = async (e) => {
      e.preventDefault();
      // find user with this email
      const userRef = firestore
        .collection('users')
        .where('email', '==', formValue);
      //get user with this Reference
      const invitee = await userRef.get();
      // const invitee = await getUserByEmail(formValue)
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
          <h1 style={{ textAlign: 'center' }}>{product.productName}</h1>
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Box>Owner</Box>
            {productOwner.displayName}
          </Box>
          {productOwner.uid === auth.currentUser.uid && (
            <Box sx={{ textAlign: 'center' }}>
              Add Users {InviteSubmissionForm()}
            </Box>
          )}
        </Box>
      );
    } else {
      return <Box sx={{ margin: 2 }} No Product Selected></Box>;
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
          <Paper sx={itemsStyle}>
            <Box>
              <h3>Color Selection</h3>
              {ColorSelection()}
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
