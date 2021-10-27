import React, {useState, useContext, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {Box, Button} from '@mui/material';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';
import {doc, updateDoc} from '@firebase/firestore';
// import UserContext from './UserContext';

function Invites({children}) {
  const thisUserRef = firestore.collection('users').doc(auth.currentUser.uid);

  const [invites, setInvites] = useState(null);
  const [userDocData] = useDocumentData(thisUserRef, {idField: 'id'});

  const getProductPromises = (thisList) => {
    const PromiseList = [];
    thisList.map((id) => {
      PromiseList.push(firestore.collection('products').doc(id).get());
    });
    return Promise.all(PromiseList);
  };

  const getCreatorFromList = (thisList) => {
    const PromiseList = [];
    thisList.map((uid) => {
      PromiseList.push(firestore.collection('users').doc(uid).get());
    });
    return Promise.all(PromiseList);
  };

  //only effect userDocData
  useEffect(
    () => {
      if (userDocData) {
        if (userDocData.invites.length > 0) {
          var productList = [];
          var objectList = [];

          getProductPromises(userDocData.invites)
            .then((promiseList) => {
              const idList = [];
              promiseList.map((item) => {
                idList.push(item.data().uid);
              });
              productList = [...promiseList];
              return idList;
            })
            .then((idList) => {
              return getCreatorFromList(idList);
            })
            .then((userList) => {
              for (var i = 0; i < productList.length; ++i) {
                objectList.push({
                  productId: productList[i].id,
                  product: productList[i].data(),
                  user: userList[i].data(),
                });
              }
              setInvites(objectList);
            });
        } else {
          setInvites(null);
        }
      }
    },
    [userDocData] /**This is useEffect dependency */
  );

  // remove this productId from current User
  const removeFromInviteList = (productId) => {
    const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
    const thisDoc = doc(firestore, 'users', auth.currentUser.uid);
    updateDoc(thisDoc, {
      invites: arrayRemove(productId),
    });
  };

  // add this user uid to given product
  const addToProductUserList = (productId) => {
    const thisDoc = doc(firestore, 'products', productId);
    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
    updateDoc(thisDoc, {
      users: arrayUnion(auth.currentUser.uid),
    });
  };

  //display invites with Accept or Reject then do stuff with those buttons
  return (
    <Stack>
      {userDocData &&
        invites &&
        invites.map((index) => (
          <p key={index.user.id} style={{paddingLeft: '10%'}}>
            <Paper>
              <Box>
                Product
                <h style={{paddingLeft: '10%'}}>{index.product.productName}</h>
              </Box>
              <Box>
                Owner
                <h style={{paddingLeft: '10%'}}> {index.user.displayName}</h>
              </Box>
              <Button
                onClick={() => {
                  addToProductUserList(index.productId);
                  removeFromInviteList(index.productId);
                }}
              >
                Accept
              </Button>
              <Button
                onClick={() => {
                  removeFromInviteList(index.productId);
                }}
              >
                Reject
              </Button>
            </Paper>
          </p>
        ))}
    </Stack>
  );
}

export default Invites;
