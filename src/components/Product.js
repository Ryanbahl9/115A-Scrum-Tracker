import {ProductContext} from './ProductContext';
import UserContext from './UserContext';


export function ProductSelector() {
    const projectsRef;
    const query;
    return (
        <UserContext.Consumer>
            {({user, products, setProducts}) => 
                user ? 
                    const projectsRef = firestore.collection('projects');
                    const query = projectsRef.where("uid", "==", auth.currentUser.uid)
                    //  = useCollectionData(query, { idField: 'id' });
                    : "NOT ready"
            }
        </UserContext.Consumer>
    )

}


                          //  .orderBy('createdAt', "asc")
  // const query = projectsRef.where("uid", "==", auth.currentUser.uid);
  // query.orderBy("createdAt");
  // const query = projectsRef.orderBy("createdAt");

  