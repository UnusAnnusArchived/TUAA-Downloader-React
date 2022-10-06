import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IVideo } from 'types';

export type Channels = '';

export type Paths = 'downloads';

contextBridge.exposeInMainWorld('electron', {
  app: {
    getPath(path: Paths) {
      return ipcRenderer.sendSync('getPath', path);
    },
  },

  startDownload(
    episodesSelected: IVideo[],
    downloadVideos: boolean,
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
  ) {
    return ipcRenderer.sendSync(
      'startDownload',
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
  },

  shell: {
    openPath(path: string) {
      ipcRenderer.send('openPath', path);
    },
  },

  selectDownloadDir() {
    return ipcRenderer.sendSync('selectDownloadDir');
  },

  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
