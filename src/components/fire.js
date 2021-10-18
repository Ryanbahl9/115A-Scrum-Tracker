// ###################################################################################################
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


import React, { useRef, useState } from 'react';
import Context from './ProductContext';

// import Select from '@mui/material/Select';
// import {FormControl, MenuItem} from '@mui/material';
import {InputLabel} from '@material-ui/core';

import {Select, FormControl, MenuItem} from '@mui/material';
import UserContext from './UserContext';


firebase.initializeApp({

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyBVtzPN4scCnsRdqc8fG88ZiV-v-ipkwHs",
  authDomain: "superchatdemo-53429.firebaseapp.com",
  projectId: "superchatdemo-53429",
  storageBucket: "superchatdemo-53429.appspot.com",
  messagingSenderId: "786660954800",
  appId: "1:786660954800:web:b2b7e0b8ea60546b8aa175",
  measurementId: "G-5483NEP5VJ"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();


//########## Main Function
export function ProductsPage(props) {

  const productsRef = firestore.collection('products');
  var query = productsRef.where("uid", "==", auth.currentUser.uid).orderBy('createdAt', 'desc')
  query = productsRef.orderBy('createdAt');
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, { idField: 'id' });


  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;
    await productsRef.add({
      productName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })
    setFormValue('');
  }
  //##
  return (
    <>
      <UserContext.Consumer>{({product, productSet}) =>
        <div style={{display: "flex"}}>
          <FormControl >
            <InputLabel id="select-label" style={{}}>Product</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={product}
                onChange={productSet}
                // defaultValue={product && product.productName}
                // label={product && product.productName}
              >
                  {products && products.map(doc =>
                    <MenuItem value={doc} key={doc.id}> {doc.productName}</MenuItem>
                  )}
              </Select>
          </FormControl>
          <div style={{}}>
            <div>-CurrProduct-Debuggin-</div>
            <div>{product && product.productName}</div>
          </div>
          <form onSubmit={enterProductName}>
              <input value={formValue} onChange={(e) =>
                setFormValue(e.target.value)} placeholder="Entry New Product Name" />

            <button type="submit" disabled={!formValue}>🕊️</button>
          </form>
        </div>
      }</UserContext.Consumer>
    </>)

}


export {firebase, useAuthState, useCollectionData};
