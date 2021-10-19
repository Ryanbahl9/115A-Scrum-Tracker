import UserContext from './UserContext';

import React, {useRef, useState} from 'react';

import firebase from 'firebase/compat/app';
import {auth, firestore} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {InputLabel} from '@material-ui/core';

import {
  Select,
  FormControl,
  MenuItem,
  Button,
  Input,
  From,
} from '@mui/material';
import {Box} from '@mui/system';

//########## Main Function
function ProductSelection(props) {
  const productsRef = firestore.collection('products');
  var query = productsRef
    .where('uid', '==', auth.currentUser.uid)
    .orderBy('createdAt', 'desc');
  query = productsRef.orderBy('createdAt');
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, {idField: 'id'});

  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;
    await productsRef.add({
      productName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });
    setFormValue('');
  };
  const style = {background: 'white'};
  const myForm = () => {
    return (
      <form onSubmit={enterProductName}>
        <Input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Entry New Product Name"
          sx={style}
        />

        <Button type="submit" disabled={!formValue}>
          🕊️
        </Button>
      </form>
    );
  };
  //##
  return (
    <UserContext.Consumer>
      {({product, productSet}) => (
        <Box id="selection container" style={{display: 'flex'}}>
          <FormControl>
            <InputLabel id="select-label">Product</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={product}
              onChange={productSet}
              sx={style}
            >
              {products &&
                products.map((doc) => (
                  <MenuItem value={doc} key={doc.id}>
                    {' '}
                    {doc.productName}
                  </MenuItem>
                ))}
              <MenuItem>{myForm()}</MenuItem>
            </Select>
          </FormControl>
          {/* {myForm()} */}
          {/* <myForm></myForm> */}
          {/* <form onSubmit={enterProductName}>
            <Input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Entry New Product Name"
              sx={style}
            />

            <Button type="submit" disabled={!formValue}>
              🕊️
            </Button>
          </form> */}
          {/* <form onSubmit={enterProductName}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Entry New Product Name"
            />

            <button type="submit" disabled={!formValue}>
              🕊️
            </button>
          </form> */}
        </Box>
      )}
    </UserContext.Consumer>
  );
}

export default ProductSelection;
