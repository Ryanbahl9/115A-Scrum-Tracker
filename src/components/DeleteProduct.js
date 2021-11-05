import {Box} from '@mui/system';
import React, {useContext, useState} from 'react';
import {deleteProduct} from '../backEnd/DataBaseQueries';
import {deleteButtonStyle} from './CSS';
import {auth, firestore} from './fire';
import UserContext from './UserContext';

export default function DeleteProduct(props) {
  const {value} = props;
  const {product, setProduct} = useContext(UserContext);

  const deleteFromDataBase = (e) => {
    e.stopPropagation();
    if (product && product.id === value.id) {
      setProduct(null);
    }
    deleteProduct(value.id)
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const Delete = () => {
    return (
      <Box>
        <button
          style={deleteButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            setDeleteConfirmation(!deleteConfirmation);
          }}
        >
          Delete
        </button>
      </Box>
    );
  };

  const clickKeep = (e) => {
    e.stopPropagation();
    setDeleteConfirmation(false);
  };
  const clickDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirmation(false);
    deleteFromDataBase(e);
  };

  function canUserDelete(val) {
    if (auth.currentUser.uid === value.uid) {
      return true;
    } else {
      return false;
    }
  }
  const confirmDelete = () => {
    return (
      <Box style={deleteButtonStyle}>
        <h3>Confirm Delete</h3>
        <button style={{width: '50%', color: 'red'}} onClick={clickKeep}>
          Keep
        </button>
        <button style={{width: '50%', color: 'red'}} onClick={clickDelete}>
          Delete
        </button>
      </Box>
    );
  };

  return (
    <Box key={value.id}>
      {canUserDelete(value) ? (!deleteConfirmation ? Delete() : confirmDelete()) : null}
    </Box>
  );
}
