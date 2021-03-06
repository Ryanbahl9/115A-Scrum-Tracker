import React, {useEffect, useState} from 'react';
import {firestore, auth} from './fire';
import {Box} from '@mui/system';
import UserContext from './UserContext';
import {Paper, Grid} from '@mui/material';
import Invites from './Invites';
import {itemsStyle, itemStyle} from './CSS';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import {useProductsByUID} from '../backEnd/DataBaseQueries';
import {useHistory} from 'react-router-dom';

const Home = () => {
  const history = useHistory()

  const [products, productsLoading] = useProductsByUID(auth.currentUser.uid)

  const [productData, setProductData] = useState(null);

  function getUsersPromises(idList) {
    return Promise.all(
      idList.map((uid) => firestore.collection('users').doc(uid).get())
    );
  }

  useEffect(() => {
    if (!productsLoading) {
      var ownerId = [];
      var docs = [];
      products.forEach((doc) => {
        docs.push(doc);
        ownerId.push(doc.uid);
      });
      getUsersPromises(ownerId).then((userArr) => {
        setProductData({docs: [...docs], userArr: [...userArr]});
      });
    }
  }, [products, productsLoading]);

  return (
    <UserContext.Consumer>
      {({setProduct, product}) => (
        <Box>
          <Paper className={'productSelection'} sx={itemsStyle} variant={'outlined'} >
            <header>
              <h1>Select Product</h1>
            </header>

            <Grid>
              {productData &&
                productData.docs.map((doc, index) => {
                  return (
                    <Paper
                      key={doc.id}
                      elevation={4}
                      id={doc.id}
                      sx={itemStyle}
                      value={doc}
                      onClick={() => {
                        setProduct(doc);
                        history.push('/board')
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
          <Paper className={'addProduct'} sx={itemsStyle} variant={'outlined'}>
            <h1>Add Product</h1>
            <AddProduct />
          </Paper>
          <Paper sx={itemsStyle} variant={'outlined'}>
            <h1>Invites</h1>
            <Invites />
          </Paper>
        </Box>
      )}
    </UserContext.Consumer>
  );
};
export default Home;
