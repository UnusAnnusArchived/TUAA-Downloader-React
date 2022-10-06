import { app, dialog, ipcMain, shell } from 'electron';
import { IVideo, StatusObject } from 'types';
import { mainWindow } from './main';
import { Paths } from './preload';

const handleIpc = () => {
  ipcMain.on('getPath', (evt, path: Paths) => {
    evt.returnValue = app.getPath(path);
  });

  ipcMain.on('selectDownloadDir', (evt) => {
    evt.returnValue = dialog.showOpenDialogSync(mainWindow!, {
      properties: ['openDirectory'],
    });
  });

  ipcMain.on('openPath', (evt, path: string) => {
    shell.openPath(path);
  });

  // ipcMain.on(
  //   'startDownload',
  //   async (
  //     evt,
  //     episodesSelected: IVideo[],
  //     downloadVideos: boolean,
  //     downloadDescription: boolean,
  //     downloadMetadata: boolean,
  //     downloadSubtitles: boolean,
  //     overwrite: boolean,
  //     filenmaeFormat: string,
  //     outputPath: string,
  //     videosPath: string,
  //     thumbnailsPath: string,
  //     descriptionsPath: string,
  //     metadataPath: string,
  //     subtitlesPath: string
  //   ) => {
  //     for (let i = 0; i < episodesSelected.length; i++) {
  //       setDownloadStatus({
  //         downloaded: 0,
  //         filesize: 0,
  //         currentItem: {
  //           filePath: 'ur mom',
  //           text: 'Refetching Metadata',
  //           downloaded: 0,
  //           filesize: 1,
  //         },
  //       });
  //     }
  //   }
  // );
};

const setDownloadStatus = (statusObject: StatusObject) => {
  mainWindow?.webContents.send('setDownloadStatus', statusObject);
};

export default handleIpc;
