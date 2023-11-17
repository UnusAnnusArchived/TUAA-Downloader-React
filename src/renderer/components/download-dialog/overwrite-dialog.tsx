import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOverwrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const OverwriteDialog: React.FC<IProps> = ({ open, setOpen, setOverwrite }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleEnable = () => {
    setOverwrite(true);
    handleClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Overwrite?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to overwrite existing files? This could possibly delete
          important files!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleEnable}
          variant="contained"
          style={{ backgroundColor: "#d11a2a", color: "#ffffff" }}
        >
          Enable
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OverwriteDialog;
