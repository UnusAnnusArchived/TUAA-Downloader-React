import { app, dialog, ipcMain, shell } from "electron";
import { mainWindow } from "./main";
import { handleDownload } from "./download";

const handleIpc = () => {
  ipcMain.on("getPath", (evt, path: "downloads") => {
    evt.reply("getPath", app.getPath(path));
  });

  ipcMain.on("selectDownloadDir", (evt) => {
    evt.reply(
      "selectDownloadDir",
      dialog.showOpenDialogSync(mainWindow!, {
        properties: ["openDirectory"],
      })
    );
  });

  ipcMain.on("openPath", (_evt, [path]: string[]) => {
    console.log(path);
    shell.openPath(path);
  });

  ipcMain.on("startDownload", handleDownload);
};

export default handleIpc;
