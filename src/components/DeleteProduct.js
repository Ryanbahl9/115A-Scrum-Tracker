// https://mui.com/components/dialogs/
// copied from mui, then modified
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {Box} from '@mui/system';
import Button from 'mui-button';
import React, {useContext, useState} from 'react';
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
    firestore.collection('products').doc(value.id).delete();
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const Delete = () => {
    return (
      <Box>
        <button
          style={deleteButtonStyle}
          onClick={() => {
            setDeleteConfirmation(!deleteConfirmation);
          }}
        >
          Delete
        </button>
      </Box>
    );
  };

  const clickKeep = (e) => {
    setDeleteConfirmation(false);
  };
  const clickDelete = (e) => {
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

// export default function DeleteProduct(props) {
//   const {value} = props;
//   const [open, setOpen] = React.useState(false);
// // const [open, setOpen] = React.useState(true);
//   const {product, setProduct} = useContext(UserContext);
//   const handleClickOpen = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   //delete product accociated with value
//   const handleCloseAffirm = (e) => {
//     e.stopPropagation();
//     setOpen(false);
//     if (product && product.id === value.id) {
//       setProduct(null);
//     }
//     firestore.collection('products').doc(value.id).delete();
//   };

//   //do nothing
//   const handleCloseNeg = (e) => {
//     e.stopPropagation();
//     setOpen(false);
//   };

//   return (
//     <div>
//       <button

//         onClick={handleClickOpen}
//         // sx={deleteButtonStyle}
//       >
//         Delete
//       </button>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {'Delete product: ' + value.productName}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Permantely remove this Product From DataBase
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNeg} autoFocus>
//             No
//           </Button>
//           <Button onClick={handleCloseAffirm}>DELETE</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
