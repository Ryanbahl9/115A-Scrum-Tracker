// https://mui.com/components/dialogs/
// copied from mui, then modified
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from 'mui-button';
import React, {useContext} from 'react';
import {deleteButtonStyle} from './CSS';
import {firestore} from './fire';
import UserContext from './UserContext';

export default function DeleteProduct(props) {
  const {value} = props;
  const [open, setOpen] = React.useState(false);
  const {product, setProduct} = useContext(UserContext);
  const handleClickOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //delete product accociated with value
  const handleCloseAffirm = (e) => {
    e.stopPropagation();
    setOpen(false);
    if (product && product.id === value.id) {
      setProduct(null);
    }
    firestore.collection('products').doc(value.id).delete();
  };

  //do nothing
  const handleCloseNeg = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <button

        onClick={handleClickOpen}
        // sx={deleteButtonStyle}
      >
        Delete
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete product: ' + value.productName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Permantely remove this Product From DataBase
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNeg} autoFocus>
            No
          </Button>
          <Button onClick={handleCloseAffirm}>DELETE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
