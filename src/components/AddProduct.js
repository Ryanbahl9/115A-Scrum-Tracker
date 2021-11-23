import React, {useState} from 'react';
import {auth} from './fire';
import {Button, Input} from '@mui/material';
import {addProduct} from '../backEnd/DataBaseQueries';

const AddProduct = () => {
  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    e.preventDefault();
    addProduct(formValue, auth.currentUser.uid);

    setFormValue('');
  };

  const style = {background: 'white'};

  return (
    <form onSubmit={enterProductName}>
      <Input
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
        placeholder="Enter New Product Name"
        sx={style}
      />

      <Button type="submit" disabled={!formValue}>
        🕊️
      </Button>
    </form>
  );
};
export default AddProduct;
