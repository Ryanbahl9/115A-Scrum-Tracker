import React, {useEffect, useState} from 'react';
import {firestore, auth} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {Box} from '@mui/system';
import UserContext from './UserContext';
import {Paper, Grid} from '@mui/material';
import Invites from './Invites';
import {itemsStyle, itemStyle} from './CSS';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';

const Home = () => {
  const productsRef = firestore.collection('products');
  var query = productsRef.where(
    'users',
    'array-contains',
    auth.currentUser.uid
  );

  const [products] = useCollectionData(query, {idField: 'id'});

  const [productData, setProductData] = useState(null);

  function getUsersPromises(idList) {
    const promiseList = [];
    //build list of queries
    idList.map((uid) => {
      promiseList.push(firestore.collection('users').doc(uid).get());
    });
    return Promise.all(promiseList);
  }

  useEffect(() => {
    if (products) {
      var ownerId = [];
      var docs = [];
      products.map((doc) => {
        docs.push(doc);
        ownerId.push(doc.uid);
      });
      getUsersPromises(ownerId).then((userArr) => {
        setProductData({docs: [...docs], userArr: [...userArr]});
      });
    }
  }, [products]);

  return (
    <UserContext.Consumer>
      {({setProduct, product}) => (
        <Box>
          <Paper className={'productSelection'} sx={itemsStyle}>
            <header>
              <h1>Select Product</h1>
            </header>

            <Grid>
              {productData &&
                productData.docs.map((doc, index) => {
                  return (
                    <Paper
                      elevation={4}
                      id={doc.id}
                      sx={itemStyle}
                      value={doc}
                      onClick={() => {
                        setProduct(doc);
                      }}
                    >
                      <h1>{doc.productName}</h1>
                      {'Owner: '}
                      {productData.userArr &&
                        productData.userArr[index].data().displayName}
                      <DeleteProduct value={doc} />
                    </Paper>
                  );
                })}
            </Grid>
          </Paper>
          <Paper sx={itemsStyle}>
            <h1>Add Product</h1>
            <AddProduct />
          </Paper>
          <Paper sx={itemsStyle}>
            <h1>Invites</h1>
            <Invites />
          </Paper>
        </Box>
      )}
    </UserContext.Consumer>
  );
};
export default Home;
