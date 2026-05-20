const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showBreakNotification: (data) =>
    ipcRenderer.send("show-break-notification", data),

  onOpenTimer: (callback) => {
    const handler = () => callback();

    ipcRenderer.removeAllListeners("open-timer-page");
    ipcRenderer.on("open-timer-page", handler);
  },
});