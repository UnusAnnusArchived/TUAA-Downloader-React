import FileDownloader from 'nodejs-file-downloader';
import { mainWindow } from './main';
import type { DeepPartial, IVideo, StatusObject } from 'types';
import { download } from '../endpoints';
import axios from 'axios';
import { ipcMain } from 'electron';
import downloadDataUrl from './downloadDataUrl';

let downloading = false;
let cancelled = false;
let currentSize = 0;
export let currentDownloader: FileDownloader;

ipcMain.on('getIsDownloading', (evt) => {
  evt.reply('getIsDownloading', downloading);
});

ipcMain.on('cancelDownload', () => {
  cancelled = true;
});

type IProps = [
  episodesSelected: IVideo[],
  downloadVideos: boolean,
  downloadThumbnails: boolean,
  downloadDescription: boolean,
  downloadMetadata: boolean,
  downloadSubtitles: boolean,
  overwrite: boolean,
  filenameFormat: string,
  outputPath: string,
  videosPath: string,
  thumbnailsPath: string,
  descriptionsPath: string,
  metadataPath: string,
  subtitlesPath: string
];

export const handleDownload = async (
  _evt: Electron.IpcMainEvent,
  [
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
  ]: IProps
) => {
  currentSize = 0;
  cancelled = false;
  downloading = true;
  await fetchTotalBytes(
    episodesSelected,
    downloadVideos,
    downloadThumbnails,
    downloadDescription,
    downloadMetadata,
    downloadSubtitles
  );

  for (let i = 0; i < episodesSelected.length; i++) {
    const episode = episodesSelected[i];

    const formattedFilename = filenameFormat
      .replaceAll('{title}', episode.title)
      .replaceAll('{season}', episode.season.toString())
      .replaceAll('{episode}', episode.episode.toString())
      .replaceAll('{uaid}', getUAID(episode.season, episode.episode));

    if (downloadVideos) {
      await createDownloader({
        url: `${download}${episode.sources.find((src) => src.type === 'tuaa')!
          .resolutions![0].src!}`,
        directory: `${outputPath}/${videosPath}`,
        fileName: `${formattedFilename}.mp4`,
        overwriteFiles: overwrite,
        episode,
        type: 'video',
      });
    }
    if (downloadThumbnails) {
      await createDownloader({
        url: `${download}${episode.thumbnails.jpg.src}`,
        directory: `${outputPath}/${thumbnailsPath}`,
        fileName: `${formattedFilename}.jpg`,
        overwriteFiles: overwrite,
        episode,
        type: 'thumbnail',
      });
    }
    if (downloadDescription && episode.description.length > 0) {
      await createDownloader({
        url: `data:text/plain;base64,${Buffer.from(
          episode.description
        ).toString('base64')}`,
        directory: `${outputPath}/${descriptionsPath}`,
        fileName: `${formattedFilename}.txt`,
        overwriteFiles: overwrite,
        episode,
        type: 'description',
      });
    } else {
      console.log(episode.description);
    }
    if (downloadMetadata) {
      await createDownloader({
        url: `data:text/plain;base64,${Buffer.from(
          JSON.stringify(episode, null, 2)
        ).toString('base64')}`,
        directory: `${outputPath}/${metadataPath}`,
        fileName: `${formattedFilename}.json`,
        overwriteFiles: overwrite,
        episode,
        type: 'metadata',
      });
    }
    if (downloadSubtitles) {
      for (let c = 0; c < episode.captions.length; c++) {
        const caption = episode.captions[c];
        await createDownloader({
          url: `${download}${caption.src}`,
          directory: `${outputPath}/${subtitlesPath}`,
          fileName: `${formattedFilename}.${caption.srclang}.vtt`,
          overwriteFiles: overwrite,
          episode,
          type: 'captions',
        });
      }
    }
  }

  setDownloadStatus({
    finished: true,
    status: 'Finished downloading.',
    currentItem: {
      status: 'Finished downloading.',
    },
  });
};

const fetchTotalBytes = async (
  episodesSelected: IVideo[],
  downloadVideos: boolean,
  downloadThumbnails: boolean,
  downloadDescriptions: boolean,
  downloadMetadata: boolean,
  downloadSubtitles: boolean
) => {
  let totalBytes = 0;

  const updateTotalBytes = async (bytesToAdd: number) => {
    totalBytes += bytesToAdd;
    await setDownloadStatus({
      downloaded: { current: 0, max: totalBytes, displayType: 'bytes' },
    });
  };

  for (let i = 0; i < episodesSelected.length; i++) {
    await setDownloadStatus({
      currentItem: {
        status: `Fetching filesizes for ${getUAID(
          episodesSelected[i].season,
          episodesSelected[i].episode
        )}...`,
      },
    });
    if (downloadVideos) {
      const req = await axios.head(
        `${download}/${
          episodesSelected[i].sources.find((source) => source.type === 'tuaa')!
            .resolutions![0].src
        }`
      );
      const bytes = parseInt(req.headers['content-length'] ?? '0');
      await updateTotalBytes(bytes);
    }
    if (downloadThumbnails) {
      const req = await axios.head(
        `${download}/${episodesSelected[i].thumbnails.jpg.src}`
      );
      const bytes = parseInt(req.headers['content-length'] ?? '0');
      await updateTotalBytes(bytes);
    }
    if (downloadDescriptions) {
      const bytes = episodesSelected[i].description.length;
      await updateTotalBytes(bytes);
    }
    if (downloadMetadata) {
      const metadata = JSON.stringify(episodesSelected[i]);
      const bytes = metadata.length;
      await updateTotalBytes(bytes);
    }
    if (downloadSubtitles) {
      for (let s = 0; s < episodesSelected[i].captions.length; s++) {
        const req = await axios.head(
          `${download}/${episodesSelected[i].captions[s].src}`
        );
        const bytes = parseInt(req.headers['content-length'] ?? '0');
        await updateTotalBytes(bytes);
      }
    }
  }

  return totalBytes;
};

export interface IDownloaderProps {
  url: string;
  directory: string;
  fileName: string;
  overwriteFiles: boolean;
  episode: IVideo;
  type: 'video' | 'thumbnail' | 'description' | 'metadata' | 'captions';
}

const createDownloader = ({
  url,
  directory,
  fileName,
  overwriteFiles,
  episode,
  type,
}: IDownloaderProps) => {
  const negatedFileName = fileName.replace(/[^A-Za-z0-9._\-\40]/, '_');

  if (type === 'description' || type === 'metadata') {
    return downloadDataUrl({
      url,
      directory,
      fileName: negatedFileName,
      overwriteFiles,
      episode,
      type,
    });
  }
  setDownloadStatus({
    status: `Downloading ${getUAID(episode.season, episode.episode)}...`,
    currentItem: {
      status: `Downloading ${type}...`,
      downloaded: {
        displayType: 'percent',
        max: 100,
      },
    },
  });

  currentDownloader = new FileDownloader({
    url,
    directory,
    fileName: negatedFileName,
    cloneFiles: !overwriteFiles,
    onProgress(percentage, chunk) {
      currentSize += Buffer.byteLength(chunk as Buffer);
      setDownloadStatus({
        downloaded: {
          current: currentSize,
        },
        currentItem: {
          downloaded: {
            current: parseFloat(percentage),
          },
        },
      });
    },
  });
  return currentDownloader.download();
};

export const setDownloadStatus = (newStatus: DeepPartial<StatusObject>) => {
  return new Promise<void>((resolve) => {
    mainWindow?.webContents.send('getDownloadStatus');

    ipcMain.once('getDownloadStatus', (_evt, [status]: [StatusObject]) => {
      mainWindow?.webContents.send('setDownloadStatus', {
        finished: newStatus.finished ?? status.finished,
        error: newStatus.error ?? status.error,
        status: newStatus.status ?? status.status,
        downloaded: {
          current: newStatus.downloaded?.current ?? status.downloaded.current,
          max: newStatus.downloaded?.max ?? status.downloaded.max,
          displayType:
            newStatus.downloaded?.displayType ?? status.downloaded.displayType,
        },
        currentItem: {
          status: newStatus.currentItem?.status ?? status.currentItem.status,
          downloaded: {
            current:
              newStatus.currentItem?.downloaded?.current ??
              status.currentItem.downloaded.current,
            max:
              newStatus.currentItem?.downloaded?.max ??
              status.currentItem.downloaded.max,
            displayType:
              newStatus.currentItem?.downloaded?.displayType ??
              status.currentItem.downloaded.displayType,
          },
        },
      } as StatusObject);
      resolve();
    });
  });
};

export const getUAID = (season: number, episode: number) =>
  `s${season.toString().padStart(2, '0')}.e${episode
    .toString()
    .padStart(3, '0')}`;
