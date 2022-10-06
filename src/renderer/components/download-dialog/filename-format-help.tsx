import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilenameFormatHelpDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Filename Format Help</DialogTitle>
      <DialogContent>
        <p>This is the template we'll use to name your files.</p>
        <p>Make sure not to include a file extension!</p>
        <p>
          To use a variable, surround the variable name in curly brackets. For
          example, here's a format that could be used:
          <br />
          <code>
            Unus Annus - Season &#10100;season&#10101; - Episode
            &#10100;episode&#10101;
          </code>
        </p>
        <p>
          Below is a list of possible variables, followed by their output for
          Season&nbsp;1&nbsp;Episode&nbsp;1.
        </p>
        <ul>
          <li>
            <code>title</code> - <code>Unus Annus</code>
          </li>
          <li>
            <code>season</code> - <code>1</code>
          </li>
          <li>
            <code>episode</code> - <code>1</code>
          </li>
          <li>
            <code>uaid</code> - <code>s01.e001</code>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilenameFormatHelpDialog;
