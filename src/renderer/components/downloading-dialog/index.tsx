import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IVideo, StatusObject } from 'types';
import ConfirmCancelDialog from './confirm-cancel-dialog';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  episodesSelected: IVideo[];
  downloadVideos: boolean;
  downloadThumbnails: boolean;
  downloadDescription: boolean;
  downloadMetadata: boolean;
  downloadSubtitles: boolean;
  overwrite: boolean;
  filenameFormat: string;
  outputPath: string;
  videosPath: string;
  thumbnailsPath: string;
  descriptionsPath: string;
  metadataPath: string;
  subtitlesPath: string;
}

const DownloadingDialog: React.FC<IProps> = ({
  open,
  setOpen,
  episodesSelected,
  downloadVideos,
  downloadDescription,
  downloadMetadata,
  downloadSubtitles,
  overwrite,
  filenameFormat,
  outputPath,
  videosPath,
  thumbnailsPath,
  descriptionsPath,
  metadataPath,
  subtitlesPath,
}) => {
  const [canceled, setCanceled] = useState(false);
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [status, setStatus] = useState<StatusObject>({
    downloaded: 0,
    filesize: 0,
    currentItem: { filePath: '', text: 'Loading', downloaded: 0, filesize: 0 },
  });

  useEffect(() => {
    window.electron.startDownload(
      episodesSelected,
      downloadVideos,
      downloadDescription,
      downloadMetadata,
      downloadSubtitles,
      overwrite,
      filenameFormat,
      outputPath,
      videosPath,
      thumbnailsPath,
      descriptionsPath,
      metadataPath,
      subtitlesPath
    );

    window.electron.ipcRenderer.on('setDownloadStatus', (status) => {
      setStatus(status as StatusObject);
    });
  });

  const handleStop = () => {
    setOpenConfirmCancelDialog(true);
  };

  return (
    <>
      <Dialog fullScreen open={open}>
        <DialogTitle>
          Downloading {episodesSelected.length} Episode
          {episodesSelected.length === 0 || episodesSelected.length > 1
            ? 's'
            : ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {JSON.stringify(status, null, 2)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStop}>Stop</Button>
        </DialogActions>
      </Dialog>

      <ConfirmCancelDialog
        open={openConfirmCancelDialog}
        setOpen={setOpenConfirmCancelDialog}
        setOpenDownloadingDialog={setOpen}
        setCanceled={setCanceled}
      />
    </>
  );
};

export default DownloadingDialog;
