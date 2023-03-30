import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import ColorScheme from './colorScheme';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Preferences: React.FC<IProps> = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent>
        <ColorScheme />
      </DialogContent>
    </Dialog>
  );
};

export default Preferences;
