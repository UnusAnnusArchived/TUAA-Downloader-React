import { Channels, Paths } from 'main/preload';
import { IVideo } from 'types';

declare global {
  interface Window {
    electron: {
      app: {
        getPath(path: Paths): string;
      };

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
        thubnailsPath: string,
        descriptionsPath: string,
        metadataPath: string,
        subtitlesPath: string
      ): void;

      shell: {
        openPath(path: string): void;
      };

      selectDownloadDir(): string[] | undefined;

      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
