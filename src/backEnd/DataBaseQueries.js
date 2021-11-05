// import React from 'react';
import {firestore} from '../components/fire';
import {
  useCollectionData,
  useDocument,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {doc, updateDoc} from '@firebase/firestore';


//Return Array of Docs
export function useProductsByUID(uid) {
  const productsRef = firestore.collection('products');
  var query = productsRef.where('users', 'array-contains', uid);
  return useCollectionData(query, {idField: 'id'});
}

//Return Single Doc
export function useProductById(id) {
  const productHookedRef = firestore.collection('products').doc(id);
  return useDocument(productHookedRef, {idField: 'id'});
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

export const removeFromInviteList = (productId, uid) => {
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  const thisDoc = doc(firestore, 'users', uid);
  updateDoc(thisDoc, {
    invites: arrayRemove(productId),
  });
};

export const addProduct = async (name, currentUserUid) => {
  await firestore.collection('products').add({
    productName: name,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: currentUserUid,
    stages: ['Development'],
    users: [currentUserUid],
  })
}