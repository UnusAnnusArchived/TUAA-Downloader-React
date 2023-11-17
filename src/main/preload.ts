import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export type Channels =
  | "getPath"
  | "selectDownloadDir"
  | "openPath"
  | "startDownload"
  | "openPreferences"
  | "setDownloadStatus"
  | "getDownloadStatus"
  | "getIsDownloading";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    sendMessageWithResponseSync<T>(
      channel: Channels,
      args?: unknown
    ): Promise<T> {
      return new Promise((resolve) => {
        ipcRenderer.send(channel, args);
        ipcRenderer.once(channel, (_evt, args) => {
          resolve(args);
        });
      });
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
