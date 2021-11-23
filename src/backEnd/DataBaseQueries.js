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
import {
  arrayRemove,
} from 'firebase/firestore';

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

export function useProductColorById(id) {
  const productColorRef = firestore.collection('productColor').doc(id);
  return useDocument(productColorRef);
}

export function useTaskById(id) {
  const productColorRef = firestore.collection('task').doc(id);
  return useDocument(productColorRef);
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

function addProductColor(doc) {
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
      userColor: {},
    });
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
    })
    .then((doc) => {
      addProductColor(doc);
    });
};

export function useAvailableColors(productId) {

  const productColorRef = firestore.collection('productColor');
  const query = productColorRef.doc(productId);
  return useDocumentData(query);
}



export function deleteProduct(productId) {
  // TEMP NO DELETE TESTING FOR TASK DELETION.

  firestore.collection('products').doc(productId).delete();
  firestore.collection('productColor').doc(productId).delete();
  // delete sprints
  firestore
    .collection('sprints')
    .where('productId', '==', productId)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        doc.ref.delete()
      });
    });

  // delete userStories
  firestore.collection('userStory')
    .where('productId', '==', productId)
    .get()
    .then((userStoryDocs) => {
      userStoryDocs.forEach((userStoryDoc) => {
        firestore.collection('task').where('userStoryId', '==', userStoryDoc.id).get().then((taskDocs) => {
          taskDocs.forEach((task) => {
            task.ref.delete();
          });
        });

        userStoryDoc.ref.delete();
      });

    })

  // ADD DELETE ALL USER STORIES AND TASKS
}

export function deleteSprint(sprintId) {
  let sprintRef = firestore.collection('sprints').doc(sprintId);
  sprintRef.get().then((snapShot) => {
    for (const storyId of snapShot.data().userStories) {
      firestore.collection('userStory').doc(storyId).update({
        state: 'productBacklog'
      });
    }
  });
  sprintRef.delete()
}

export function setUserColorForProduct(productId, uid, color) {


  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  //check to see if user is already in color
  const docRef = firestore.collection('productColor').doc(productId);
  docRef.get().then((doc) => {
    var docUserColor = doc.data().userColor;
    const oldColor = docUserColor[uid] ? docUserColor[uid].color : null;

    docUserColor[uid] = { "color": color };
    updateDoc(docRef, { userColor: docUserColor });
    updateDoc(docRef, { availableColors: arrayRemove(color) });

    if (oldColor) {
      updateDoc(docRef, { availableColors: arrayUnion(oldColor) });
    }

  });
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

// Returns sprint with the closest endDate after the current date
// if that DNE, then returns sprint with closest endDate before
// current date
export async function getCurrentSprintId(productId) {
  if (productId === null) return '';
  var id = ''
  const sprintRef = firestore.collection('sprints');
  let queryAsc = sprintRef.orderBy('endDate')
  queryAsc = queryAsc.limit(1);
  queryAsc = queryAsc.where('endDate', '>', new Date(Date.now()));
  queryAsc = queryAsc.where('productId', '==', productId);
  await queryAsc.get().then((colAsc) => {
    if (!colAsc.empty) {
      id = colAsc.docs[0].id
    } else {
      let queryDesc = sprintRef.orderBy('endDate', 'desc')
      queryDesc = sprintRef.limit(1)
      queryDesc = queryDesc.where('endDate', '>', new Date(Date.now()));
      queryDesc = queryDesc.where('productId', '==', productId);
      queryDesc.get().then((colDesc) => {
        if (!colDesc.empty) {
          id = colDesc.docs[0].id
        } else {
          id = ''
        }
      })
    }
  })
  return id
}

export function deleteUserStoryFromSprints(userStoryId) {
  if (userStoryId === null) return '';
  const sprintRef = firestore.collection('sprints');
  sprintRef.where('userStories', 'array-contains', userStoryId).get().then((col) => {
    col.docs.forEach((sprintDoc) => {
      firestore
      .collection('sprints')
      .doc(sprintDoc.id)
      .update({
        userStories: arrayRemove(userStoryId),
      });
    })
  })
}