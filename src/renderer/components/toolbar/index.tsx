import { AppBar, Button, Checkbox, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { IVideo } from "types";
import DownloadDialog from "../download-dialog";

interface IProps {
  metadata: IVideo[];
  episodesSelected: IVideo[];
  setEpisodesSelected: React.Dispatch<React.SetStateAction<IVideo[]>>;
}

const AppToolbar: React.FC<IProps> = ({
  metadata,
  episodesSelected,
  setEpisodesSelected,
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const selected = episodesSelected?.length || 0;

  const handleCheckboxClick = (_: any, checked: boolean) => {
    if (checked) {
      setEpisodesSelected(metadata);
    } else {
      setEpisodesSelected([]);
    }
  };

  const openDownloadDialog = () => {
    setDownloadDialogOpen(true);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Checkbox
            onChange={handleCheckboxClick}
            checked={episodesSelected.length === metadata.length}
            indeterminate={
              episodesSelected.length !== 0 &&
              episodesSelected.length !== metadata.length
            }
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selected} Video
            {selected === 0 || selected > 1 ? "s" : ""} Selected
          </Typography>
          <Button
            variant="contained"
            disabled={selected === 0}
            onClick={openDownloadDialog}
          >
            Download
          </Button>
        </Toolbar>
      </AppBar>
      <DownloadDialog
        open={downloadDialogOpen}
        setOpen={setDownloadDialogOpen}
        episodesSelected={episodesSelected}
        setEpisodesSelected={setEpisodesSelected}
      />
    </>
  );
};

export default AppToolbar;
