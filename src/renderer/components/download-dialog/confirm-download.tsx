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
  setOpenDownloadDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmDownloadDialog: React.FC<IProps> = ({
  open,
  setOpen,
  setOpenDownloadingDialog,
  setOpenDownloadDialog,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleStart = () => {
    setOpenDownloadingDialog(true);
    handleClose();
    setOpenDownloadDialog(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Start Downloading?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you would like to start downloading? You cannot change
          your download settings while downloading!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleStart} variant="contained">
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDownloadDialog;
