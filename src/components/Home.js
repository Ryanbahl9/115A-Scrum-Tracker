import React, {useState} from 'react';
import firebase from 'firebase/compat/app';
import { firestore, auth } from './fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box } from '@mui/system';
import UserContext from './UserContext';
import {
  Select,
  FormControl,
  MenuItem,
  Button,
  Input,
  From,
} from '@mui/material';



const Home = () => {
  const productsRef = firestore.collection('products');
  var query = productsRef.where(
    'users',
    'array-contains',
    auth.currentUser.uid
  );
  query = productsRef.orderBy('createdAt');
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, { idField: 'id' });
  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;
    await productsRef.add({
      productName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      users: [uid]
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

  return (
    <UserContext.Consumer>
      {({ user, productSetWithEvent, setProduct }) => (
        <div>
          <header>
            <h1>Simple beginnings </h1>
          </header>
          <section>
            <div>MOVE OVER FOR SIDEBAR</div>
            <div>Temp, click product to change product state</div>
              <p>{myForm()}</p>
              {products && products.map((doc) =>
                <p 
                  value={doc} 
                  // onClick={productSetWithEvent} didn't work...
                  onClick={() => setProduct(doc)}
                >
                  {doc.productName}
                </p>
              )}
                
          </section>
        </div>
      )}
    </UserContext.Consumer>
  );
};

export default Home;
