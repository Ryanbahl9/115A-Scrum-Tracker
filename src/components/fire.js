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
  appId: "1:786660954800:web:7d8e6bc0eea6374d8aa175",
  measurementId: "G-R51Z09WJ2L"

})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();


//########## Main Function
export function ProductsPage(props) {

  const productsRef = firestore.collection('products');
  const query = productsRef.where("uid", "==", auth.currentUser.uid)
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, { idField: 'id' });


  //##submission Field, state and function
  const [formValue, setFormValue] = useState('');
  const enterProductName = async (e) => {
    // e.preventDefault();
    const { uid } = auth.currentUser;
    await productsRef.add({
      productName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })
    setFormValue('');
  }
  //##product state and setter // keep for now, put in App.js
  // const [product, setProduct] = useState();
  // const productSet = (event) => {
  //   // console.log("productSet: " + event.target.value)
  //   setProduct(event.target.value);
  // };
  //#### return
  return (<>
  <UserContext.Consumer>
    {({product, productSet}) =>
    <div>
    <FormControl fullWidth>
      <InputLabel id="basic-select-label">Product</InputLabel>
        <Select
          id="basic-select"
          value={product}
          onChange={productSet}
          >
            {products && products.map(doc =>
              <MenuItem value={doc} key={doc.id}> {doc.productName}</MenuItem>
            )}
        </Select>
    </FormControl>
    {/* <div>{product && product.productName}</div> */}
    <form onSubmit={enterProductName}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Entry New Product Name" />

      <button type="submit" disabled={!formValue}>🕊️</button>
    </form>
    </div>}
    </UserContext.Consumer>
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
