import React from 'react';
import {firestore, auth} from './fire';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {Box} from '@mui/system';
import UserContext from './UserContext';
const Home = () => {
  const productsRef = firestore.collection('products');
  var query = productsRef.where(
    'users',
    'array-contains',
    auth.currentUser.uid
  );
  // .where('uid', '==', auth.currentUser.uid)
  // .orderBy('createdAt', 'desc');
  query = productsRef.orderBy('createdAt');
  // access: products[#]["xxx"]
  const [products] = useCollectionData(query, {idField: 'id'});


  return (
    <UserContext.Consumer>
      {({user}) => (
        <div>
          <header>
            <h1>Simple beginnings </h1>
          </header>
          <section>
            <div>MOVE OVER FOR SIDEBAR</div>
            {products && products.map((doc) => <p>{doc.productName}</p>)}
          </section>
        </div>
      )}
    </UserContext.Consumer>
  );
};

export default Home;
