import React from 'react';
import { firestore, auth } from './fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box } from '@mui/system';
import UserContext from './UserContext';
import { Button } from '@mui/material';
const Home = () => {
  const productsRef = firestore.collection('products');
  var query = productsRef.where(
    'users',
    'array-contains',
    auth.currentUser.uid
  );
  query = productsRef.orderBy('createdAt');
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, { idField: 'id' });


  return (
    <UserContext.Consumer>
      {({ user, productSetWithEvent, setProduct }) => (
        <div>
          <header>
            <h1>Simple beginnings </h1>
          </header>
          <section>
            <div>MOVE OVER FOR SIDEBAR</div>
            <div>Temp, click product to change product state</div>
            {products && products.map((doc) =>
              <p 
                value={doc} 
                // onClick={productSetWithEvent} didn't work...
                onClick={() => setProduct(doc)}
              >
                {doc.productName}
              </p>
            )}
          </section>
        </div>
      )}
    </UserContext.Consumer>
  );
};

export default Home;
