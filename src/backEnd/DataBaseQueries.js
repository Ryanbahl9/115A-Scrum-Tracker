// import React from 'react';
import {firestore} from '../components/fire';
import {
  useCollectionData,
  useDocument,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';

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
