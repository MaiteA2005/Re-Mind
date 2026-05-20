const { app, BrowserWindow, Menu, ipcMain, Notification } = require("electron");
const path = require("path");

Menu.setApplicationMenu(null);

// Belangrijk voor Windows notificaties
app.setAppUserModelId("com.remind.app");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "favicon.ico"),
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadURL("https://re-mind-one.vercel.app/");
  }
}

ipcMain.on("show-break-notification", (_, data) => {
  console.log("Electron notificatie ontvangen:", data);

  if (!Notification.isSupported()) {
    console.log("Notifications worden niet ondersteund.");
    return;
  }

  const notification = new Notification({
    title: data?.title || "Re:Mind",
    body: data?.body || "Tijd voor een korte pauze.",
    icon: path.join(__dirname, "favicon.ico"),
  });

  notification.on("click", () => {
    if (!mainWindow) return;

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send("open-timer-page");
  });

  notification.show();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});