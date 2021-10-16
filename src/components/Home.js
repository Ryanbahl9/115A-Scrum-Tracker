import React from 'react';
import { firebase, useAuthState, useCollectionData, auth, firestore, analytics, Testing } from './fire.js';
import { SignIn, SignOut } from './LoggingInAndOut.js';
import { ProductSelector } from './Product.js';
import UserContext from './UserContext.js';

const Home = () => {
    // const [user] = useAuthState(auth);

    return (
    <div>

       <header>
         <h1>Simple beginnings </h1>
        
         <SignOut />
       </header>
       <section>
         {/* <ProductSelector></ProductSelector> */}
        <UserContext.Consumer>
          {({user}) => 

        !user ? "User Is logged In. I am consuming State"
          : <div>Returned a div, from consumed state</div>
      }
      </UserContext.Consumer>
       </section>
     </div>
    )
}

export default Home
