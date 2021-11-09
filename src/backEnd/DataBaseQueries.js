// import React from 'react';
import { firestore } from '../components/fire';
import {
  useCollectionData,
  useDocument,
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import { doc, updateDoc } from '@firebase/firestore';

//Return Array of Docs
export function useProductsByUID(uid) {
  const productsRef = firestore.collection('products');
  var query = productsRef.where('users', 'array-contains', uid);
  return useCollectionData(query, { idField: 'id' });
}

//Return Single Doc
export function useProductById(id) {
  const productHookedRef = firestore.collection('products').doc(id);
  return useDocument(productHookedRef, { idField: 'id' });
}

export function useProductOwnerByProduct(product) {
  var productOwnerRef = firestore.collection('users');
  if (product) {
    productOwnerRef = firestore.collection('users').doc(product.uid);
  }
  return useDocumentDataOnce(productOwnerRef);
}

export function getUserByEmail(email) {
  const userRef = firestore.collection('users').where('email', '==', email);
  //get user with this Reference
  return userRef.get();
}

export const addProduct = async (name, currentUserUid) => {
  await firestore
    .collection('products')
    .add({
      productName: name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: currentUserUid,
      stages: ['Development'],
      users: [currentUserUid],
      howManySprints: 0,
      currentSprint: null,
    })
    .then((doc) => {
      firestore
        .collection('productColor')
        .doc(doc.id)
        .set({
          productId: doc.id,
          availableColors: [
            'silver',
            'gray',
            'red',
            'maroon',
            'yellow',
            'olive',
            'lime',
            'green',
            'aqua',
            'teal',
            'blue',
            'navy',
            'fuchsia',
            'purple',
          ],
          userColor: [], //{uid,color}
        });
    });
};

export function useAvailableColors(productId) {
  // const productsRef = firestore.collection('products');
  // var query = productsRef.where('users', 'array-contains', uid);
  // return useCollectionData(query, {idField: 'id'});
  const productColorRef = firestore.collection('productColor');
  const query = productColorRef.doc(productId);
  return useDocumentData(query);
}

export function deleteProduct(productId) {
  firestore.collection('products').doc(productId).delete();
  firestore.collection('productColor').doc(productId).delete();
  firestore
    .collection('sprints')
    .where('productId', '==', productId)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        doc.ref.delete()
      })
      // console.log(doc)
      // doc.delete();
    });
}

export function setProductColor(productId, uid, color) {
  const isUserColorSet = async (docRef, uid) => {
    //checks docRef if user is already there.
  };

  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  //check to see if user is already in color
  const docRef = doc(firestore, 'productColor', productId);
  if (isUserColorSet(docRef, uid)) {
    console.log('User Has Color Set');
  }
  // console.log(Object.keys(t)
  //if (no color selected) {
  // updateDoc(docRef, {
  // availableColors: arrayRemove(color)
  // })
  // updateDoc(docRef,{
  // userColor: arrayUnion({uid, color: color})
  // })
  // } else {
  // add color back and change color
  // }

  //Remove From available && and or add back from change
  // firestore.collection('productColor').doc(productId).get().then((doc)=> {

  //   updateDoc(doc,{
  //     availableColors: arrayRemove(color)
  //   })
  //   updateDoc(doc,{
  //     userColor: arrayUnion({uid, color: color})
  //   })
  // })
  //set this users color
}
export const removeFromInviteList = (productId, uid) => {
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  const thisDoc = doc(firestore, 'users', uid);
  updateDoc(thisDoc, {
    invites: arrayRemove(productId),
  });
};

export function addSprint(startDate, endDate, length, productId) {
  firestore.collection('sprints').add({
    productId,
    length,
    startDate,
    endDate,
    userStories: [],
  });
}

export function useGetSprintsData(productId) {
  const sprintRef = firestore.collection('sprints');
  const query = sprintRef.where('productId', '==', productId);
  return useCollectionData(query, { idField: 'id' });
}
