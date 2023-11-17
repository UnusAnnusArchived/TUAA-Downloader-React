import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { QuestionMark } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { IVideo } from "types";
import OverwriteDialog from "./overwrite-dialog";
import styles from "./switch-styles.module.scss";
import FilenameFormatHelpDialog from "./filename-format-help";
import DownloadingDialog from "../downloading-dialog";
import ConfirmDownloadDialog from "./confirm-download";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  episodesSelected: IVideo[];
  setEpisodesSelected: React.Dispatch<React.SetStateAction<IVideo[]>>;
}

const DownloadDialog: React.FC<IProps> = ({
  open,
  setOpen,
  episodesSelected,
  setEpisodesSelected,
}) => {
  const [downloadVideos, setDownloadVideos] = useState(true);
  const [downloadThumbnails, setDownloadThumbnails] = useState(false);
  const [downloadDescription, setDownloadDescription] = useState(false);
  const [downloadMetadata, setDownloadMetadata] = useState(false);
  const [downloadSubtitles, setDownloadSubtitles] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [filenameFormat, setFilenameFormat] = useState("{title}");
  const [showFilenameFormatHelpDialog, setShowFilenameFormatHelpDialog] =
    useState(false);
  const [outputPath, setOutputPath] = useState<string>();
  const [videosPath, setVideosPath] = useState("Videos");
  const [thumbnailsPath, setThumbnailsPath] = useState("Thumbnails");
  const [descriptionsPath, setDescriptionsPath] = useState("Descriptions");
  const [metadataPath, setMetadataPath] = useState("Metadata");
  const [subtitlesPath, setSubtitlesPath] = useState("Subtitles");
  const [openDownloadingDialog, setOpenDownloadingDialog] = useState(false);
  const [openConfirmDownloadDialog, setOpenConfirmDownloadDialog] =
    useState(false);

  useEffect(() => {
    (async () => {
      const path =
        await window.electron.ipcRenderer.sendMessageWithResponseSync<string>(
          "getPath",
          "downloads"
        );
      setOutputPath(path);
    })();
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setOverwrite(false);
  };

  const handleLocationChange = async () => {
    const paths = await window.electron.ipcRenderer.sendMessageWithResponseSync<
      string[]
    >("selectDownloadDir");
    console.log(paths);

    if (paths) {
      setOutputPath(paths[0]);
    }
  };

  const openOutputPath = () => {
    window.electron.ipcRenderer.sendMessage("openPath", [outputPath]);
  };

  const handleDownload = () => {
    setOpenConfirmDownloadDialog(true);
  };

  return (
    <>
      {" "}
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>
          Download {episodesSelected.length} Episode
          {episodesSelected.length === 0 || episodesSelected.length > 1
            ? "s"
            : ""}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex" }}>
            <FormGroup
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={downloadVideos}
                    onChange={(evt) => {
                      setDownloadVideos(evt.target.checked);
                    }}
                  />
                }
                label="Videos"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={downloadThumbnails}
                    onChange={(evt) => {
                      setDownloadThumbnails(evt.target.checked);
                    }}
                  />
                }
                label="Thumbnails"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={downloadDescription}
                    onChange={(evt) => {
                      setDownloadDescription(evt.target.checked);
                    }}
                  />
                }
                label="Description"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={downloadMetadata}
                    onChange={(evt) => {
                      setDownloadMetadata(evt.target.checked);
                    }}
                  />
                }
                label="Metadata"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={downloadSubtitles}
                    onChange={(evt) => {
                      setDownloadSubtitles(evt.target.checked);
                    }}
                  />
                }
                label="Subtitles"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={overwrite}
                    classes={{
                      track: styles.track,
                      colorPrimary: styles.colorPrimary,
                      checked: styles.checked,
                    }}
                    onChange={(evt) => {
                      if (evt.target.checked && !showOverwriteDialog) {
                        setShowOverwriteDialog(true);
                      } else {
                        setOverwrite(false);
                      }
                    }}
                  />
                }
                label="Overwrite"
                style={{ color: "#d11a2a" }}
              />
            </FormGroup>
            <div style={{ flexGrow: 1 }} />
            <FormGroup
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Button variant="contained" onClick={handleLocationChange}>
                Change Location
              </Button>
              <span
                onClick={openOutputPath}
                style={{
                  textDecoration: "underline",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {outputPath}
              </span>
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextField
                  size="small"
                  hidden={!downloadVideos}
                  label="Videos Folder Name"
                  style={{ margin: "8px 0" }}
                  value={videosPath}
                  onChange={(evt) => {
                    setVideosPath(evt.target.value);
                  }}
                />
                <TextField
                  size="small"
                  hidden={!downloadThumbnails}
                  label="Thumbnails Folder Name"
                  style={{ margin: "8px 0" }}
                  value={thumbnailsPath}
                  onChange={(evt) => {
                    setThumbnailsPath(evt.target.value);
                  }}
                />
                <TextField
                  size="small"
                  hidden={!downloadDescription}
                  label="Descriptions Folder Name"
                  style={{ margin: "8px 0" }}
                  value={descriptionsPath}
                  onChange={(evt) => {
                    setDescriptionsPath(evt.target.value);
                  }}
                />
                <TextField
                  size="small"
                  hidden={!downloadMetadata}
                  label="Metadata Folder Name"
                  style={{ margin: "8px 0" }}
                  value={metadataPath}
                  onChange={(evt) => {
                    setMetadataPath(evt.target.value);
                  }}
                />
                <TextField
                  size="small"
                  hidden={!downloadSubtitles}
                  label="Subtitles Folder Name"
                  style={{ margin: "8px 0" }}
                  value={subtitlesPath}
                  onChange={(evt) => {
                    setSubtitlesPath(evt.target.value);
                  }}
                />
              </div>
              <TextField
                onChange={(evt) => {
                  setFilenameFormat(evt.target.value);
                }}
                value={filenameFormat}
                variant="filled"
                label="Filename Format"
                style={{ margin: "4px 0 0 0" }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowFilenameFormatHelpDialog(true);
                      }}
                    >
                      <QuestionMark
                        htmlColor="rgba(255, 255, 255, 0.7)"
                        fontSize="small"
                      />
                    </IconButton>
                  ),
                }}
              />
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={
              !downloadVideos &&
              !downloadThumbnails &&
              !downloadDescription &&
              !downloadMetadata &&
              !downloadSubtitles
            }
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
      <OverwriteDialog
        open={showOverwriteDialog}
        setOpen={setShowOverwriteDialog}
        setOverwrite={setOverwrite}
      />
      <FilenameFormatHelpDialog
        open={showFilenameFormatHelpDialog}
        setOpen={setShowFilenameFormatHelpDialog}
      />
      <ConfirmDownloadDialog
        open={openConfirmDownloadDialog}
        setOpen={setOpenConfirmDownloadDialog}
        setOpenDownloadingDialog={setOpenDownloadingDialog}
        setOpenDownloadDialog={setOpen}
      />
      <DownloadingDialog
        open={openDownloadingDialog}
        setOpen={setOpenDownloadingDialog}
        episodesSelected={episodesSelected}
        setEpisodesSelected={setEpisodesSelected}
        downloadVideos={downloadVideos}
        downloadThumbnails={downloadThumbnails}
        downloadDescription={downloadDescription}
        downloadMetadata={downloadMetadata}
        downloadSubtitles={downloadSubtitles}
        overwrite={overwrite}
        filenameFormat={filenameFormat}
        outputPath={outputPath ?? ""}
        videosPath={videosPath}
        thumbnailsPath={thumbnailsPath}
        descriptionsPath={descriptionsPath}
        metadataPath={metadataPath}
        subtitlesPath={subtitlesPath}
      />
    </>
  );
};

export default DownloadDialog;
