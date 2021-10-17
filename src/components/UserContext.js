// import {auth, useAuthState} from './fire';
import { React, createContext} from 'react';

const UserContext = createContext();

export default UserContext;
// // export default ProductContext;
// export function UserProvider({children}) {
//     const [user] = useAuthState(auth);
//     return (
//         <UserContext.Provider value={{user}}>
//             {children}
//         </UserContext.Provider>
//     )
// }
 