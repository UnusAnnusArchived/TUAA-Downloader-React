import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDownloadingDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCanceled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmCancelDialog: React.FC<IProps> = ({
  open,
  setOpen,
  setOpenDownloadingDialog,
  setCanceled,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleStop = () => {
    setCanceled(true);
    handleClose();
    setOpenDownloadingDialog(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Stop Downloading?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you would like to cancel the download?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleStop} variant="contained">
          Stop Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCancelDialog;
