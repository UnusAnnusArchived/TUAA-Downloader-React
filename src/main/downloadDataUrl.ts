import fs from "fs-extra";
import { getUAID, IDownloaderProps, setDownloadStatus } from "./download";

const downloadDataUrl = ({
  url,
  directory,
  fileName,
  overwriteFiles,
  episode,
  type,
}: IDownloaderProps) => {
  setDownloadStatus({
    status: `Downloading ${getUAID(episode.season, episode.episode)}...`,
    currentItem: {
      status: `Downloading ${type}...`,
      downloaded: {
        displayType: "percent",
        max: 100,
      },
    },
  });
  fs.mkdirSync(directory, { recursive: true });
  const buffer = Buffer.from(url, "base64");
  fs.writeFileSync(`${directory}/${fileName}`, buffer);
  setDownloadStatus({
    currentItem: {
      downloaded: {
        current: 100,
      },
    },
  });
};

export default downloadDataUrl;
