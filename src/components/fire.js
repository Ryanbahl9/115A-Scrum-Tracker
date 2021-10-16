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


firebase.initializeApp({

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyBVtzPN4scCnsRdqc8fG88ZiV-v-ipkwHs",
  authDomain: "superchatdemo-53429.firebaseapp.com",
  projectId: "superchatdemo-53429",
  storageBucket: "superchatdemo-53429.appspot.com",
  messagingSenderId: "786660954800",
  appId: "1:786660954800:web:7d8e6bc0eea6374d8aa175",
  measurementId: "G-R51Z09WJ2L"

})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();



export function ProductsPage(props) {
  const dummy = useRef();
  const productsRef = firestore.collection('products');
  const query = productsRef.where("uid", "==", auth.currentUser.uid)
  const [products] = useCollectionData(query, { idField: 'id' });



  const [formValue, setFormValue] = useState('');

  //###################Submission Field
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
  //###################
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    myInt += 10;
    console.log(event.target.value)
    // setAge(event.target.value);
    setAge(myInt)
  };
  var myInt = 10;
  //###################
  //###################
  const ProductItem = (props) => { //prints name
    const { productName } = props.product;
    return (<MenuItem value={productName}>{productName}</MenuItem>)

  }
  //###################
  //###################product
  const [product, setProduct] = useState("temp");
  const productSet = (event) => {
    console.log("productSet: " + event.target.value)
    setProduct(event.target.value);
  };
  //###################
  return (<>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Product</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={product}
            // value={age}
            label="Product Select"
            onChange={productSet}
            // onChange={handleChange}
            >
          {products && products.map(at => <ProductItem product={at} />)}
            {/* <MenuItem value={"4"}>Stupid Test</MenuItem> */}
            {/* <MenuItem value={10}>Ten</MenuItem> */}
            {/* <MenuItem value={20}>Twenty</MenuItem> */}
            {/* <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
      </FormControl>


    <form onSubmit={enterProductName}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Entry New Product Name" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)

}

//#############################################################################
// function ProductItem(props) { //prints name
//     const { productName } = props.products;
//     return (<>
//       <div>
//         <p>{productName}</p>
//       </div>
//     </>)
// }
//#############################################################################

export {firebase, useAuthState, useCollectionData};
