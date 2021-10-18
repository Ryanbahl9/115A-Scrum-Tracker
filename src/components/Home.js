import React from 'react';
import { firebase, useAuthState, useCollectionData, auth, firestore, analytics, Testing, ProductsPage } from './fire.js';
import { SignIn, SignOut } from './LoggingInAndOut.js';
import { ProductSelector } from './Product.js';
import UserContext from './UserContext.js';

const Home = () => {
    // const [user] = useAuthState(auth);

    return (
    <div>

       <header>
         <h1>Simple beginnings </h1>
       </header>
       <section>
         <div>Adjust so header is visable I thinking adjust Router stying... or Maybe Container</div>
        {/* <UserContext.Consumer> */}
          {/* {({user}) => user ? <ProductsPage/> : "User Not logged in"  } */}
        {/* </UserContext.Consumer> */}
       </section>
     </div>
    )
}

export default Home
