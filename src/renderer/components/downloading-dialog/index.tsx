import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import defaultStatus from "defaults/download-status";
import React, { useEffect, useMemo, useState } from "react";
import { IVideo, StatusDownloaded, StatusObject } from "types";
import ConfirmCancelDialog from "./confirm-cancel-dialog";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  episodesSelected: IVideo[];
  setEpisodesSelected: React.Dispatch<React.SetStateAction<IVideo[]>>;
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
  setEpisodesSelected,
  downloadVideos,
  downloadThumbnails,
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
  const [status, setStatus] = useState<StatusObject>(defaultStatus);

  useEffect(() => {
    (async () => {
      if (open) {
        const isDownloading =
          await window.electron.ipcRenderer.sendMessageWithResponseSync(
            "getIsDownloading"
          );

        if (!isDownloading) {
          window.electron.ipcRenderer.sendMessage("startDownload", [
            episodesSelected,
            downloadVideos,
            downloadThumbnails,
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
          ]);
        }
      }
    })();
  }, [open]);

  useEffect(() => {
    const removeGetDownloadStatus = window.electron.ipcRenderer.on(
      "getDownloadStatus",
      () => {
        window.electron.ipcRenderer.sendMessage("getDownloadStatus", [status]);
      }
    );

    const removeSetDownloadStatus = window.electron.ipcRenderer.on(
      "setDownloadStatus",
      (newStatusTemp) => {
        const newStatus = newStatusTemp as StatusObject;

        console.log(newStatus.downloaded.current, newStatus.downloaded.max);

        setStatus(newStatus);
      }
    );

    return () => {
      removeGetDownloadStatus();
      removeSetDownloadStatus();
    };
  }, [status]);

  const handleStop = () => {
    if (status.finished) {
      setOpen(false);
      setEpisodesSelected([]);
    } else {
      setOpenConfirmCancelDialog(true);
    }
  };

  const handleOpenDirectory = () => {
    window.electron.ipcRenderer.sendMessage("openPath", [outputPath]);
  };

  return (
    <>
      <Dialog fullScreen open={open}>
        <DialogTitle>
          {status.finished ? "Finished" : ""} Downloading{" "}
          {episodesSelected.length} Episode
          {episodesSelected.length === 0 || episodesSelected.length > 1
            ? "s"
            : ""}
        </DialogTitle>
        <DialogContent>
          {status.error && <h1>error</h1>}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3">
                Total Status
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>{printDownloaded(status.downloaded!, "current")}</span>
                <LinearProgress
                  style={{ flexGrow: 1, margin: "0 10px" }}
                  variant="determinate"
                  value={normalize(status.downloaded!)}
                />
                <span>{printDownloaded(status.downloaded!, "max")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DialogContentText>{status.status}</DialogContentText>
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3">
                Current Item
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>
                  {printDownloaded(status.currentItem!.downloaded!, "current")}
                </span>
                <LinearProgress
                  style={{ flexGrow: 1, margin: "0 10px" }}
                  variant="determinate"
                  value={normalize(status.currentItem!.downloaded!)}
                />
                <span>
                  {printDownloaded(status.currentItem!.downloaded!, "max")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DialogContentText>
                  {status.currentItem!.status}
                </DialogContentText>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleStop}>
            {status.finished ? "Close" : "Stop"}
          </Button>
          {status.finished && (
            <Button variant="contained" onClick={handleOpenDirectory}>
              Open Directory
            </Button>
          )}
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

const printDownloaded = (
  downloaded: StatusDownloaded,
  key: "current" | "max"
) => {
  if (downloaded.displayType === "bytes") {
    return bytesToString(downloaded[key]!);
  } else if (downloaded.displayType === "percent") {
    if (key === "current") {
      return (
        Math.round((downloaded.current! / downloaded.max!) * 10000) / 100 + "%"
      );
    } else if (key === "max") {
      return "100%";
    } else {
      return 0;
    }
  } else if (downloaded.displayType === "plain") {
    return downloaded[key];
  } else {
    return 0;
  }
};

const bytesToString = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const normalize = (downloaded: StatusDownloaded) =>
  ((downloaded.current! - 0) * 100) / (downloaded.max! - 0);

export default DownloadingDialog;
