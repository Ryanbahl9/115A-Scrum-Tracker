import React, {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {Box, Button} from '@mui/material';
import {useDocumentData} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import {firestore, auth} from './fire';
import {doc, updateDoc} from '@firebase/firestore';
import {itemStyle} from './CSS';

function Invites({children}) {
  const thisUserRef = firestore.collection('users').doc(auth.currentUser.uid);

  const [invites, setInvites] = useState(null);
  const [userDocData] = useDocumentData(thisUserRef, {idField: 'id'});

  const getProductPromises = (productIdList) => {
    return Promise.all(
      productIdList.map((id) => firestore.collection('products').doc(id).get())
    );
  };

  const getCreatorFromList = (userUidList) => {
    return Promise.all(
      userUidList.map((uid) => firestore.collection('users').doc(uid).get())
    );
  };

  //only effect userDocData
  useEffect(
    () => {
      if (userDocData) {
        if (userDocData.invites.length > 0) {
          var productList = [];

          getProductPromises(userDocData.invites)
            .then((promiseList) => {
              productList = [...promiseList];
              productList = promistList.map((doc) => {
                if(doc.exists){
                  return doc;
                }
              });
              return promiseList.map((item) => item.data().uid);
            })
            .then((idList) => getCreatorFromList(idList))
            .then((userList) => {
              setInvites(
                productList.map((doc, i) => {
                  return {
                    productId: productList[i].id,
                    product: productList[i].data(),
                    user: userList[i].data(),
                  };
                })
              );
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
    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
    const thisDoc = doc(firestore, 'products', productId);
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
          <Paper key={index.user.uid} sx={itemStyle}>
            <Box>
              Product
              <h3 style={{paddingLeft: '10%'}}>{index.product.productName}</h3>
            </Box>
            <Box>
              Owner
              <h3 style={{paddingLeft: '10%'}}> {index.user.displayName}</h3>
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
        ))}
    </Stack>
  );
}

export default Invites;
