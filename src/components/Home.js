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
       </header>
       <section>
        <UserContext.Consumer>
          {({user}) => user ? "User Is logged in" : "User Not logged in"  }
        </UserContext.Consumer>
       </section>
     </div>
    )
}

export default Home
