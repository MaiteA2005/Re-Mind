const { app, BrowserWindow, Menu, ipcMain, Notification } = require("electron");
const path = require("path");

Menu.setApplicationMenu(null);

const isDev = !app.isPackaged;

// In dev gebruikt Windows anders soms de standaard Electron app
app.setName("Re-Mind");
app.setAppUserModelId(
  isDev ? process.execPath : "be.remind.desktop"
);

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

let mainWindow;

function getIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "icon.ico");
  }

  return path.join(__dirname, "build", "icon.ico");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadURL("https://re-mind-one.vercel.app/");
  }
}

function focusMainWindow() {
  if (!mainWindow) {
    createWindow();
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();

  mainWindow.webContents.send("open-timer-page");
}

ipcMain.on("show-break-notification", (_, data) => {
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title: data?.title || "Re:Mind",
    body: data?.body || "Tijd voor een korte pauze.",
    icon: getIconPath(),
  });

  notification.on("click", () => {
    focusMainWindow();
  });

  notification.show();
});

app.on("second-instance", () => {
  focusMainWindow();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      focusMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});