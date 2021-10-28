import React, {useContext, useState} from 'react';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';
import UserContext from './UserContext';
import {
  Button,
  Input,
} from '@mui/material';

const AddProduct = () => {
  const {setProduct} = useContext(UserContext);
  const productsRef = firestore.collection('products');

  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    e.preventDefault();

    const {uid} = auth.currentUser;
    await productsRef.add({
      productName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      users: [uid],
    }).then((docRef) => {
        return docRef.get();
    }).then((doc) => {
        setProduct(doc.data())
    })
    setFormValue('');
  };

  const style = {background: 'white'};

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
export default AddProduct;
