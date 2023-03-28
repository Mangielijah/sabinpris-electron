const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
require('./app.js');

let mainWindow;
let serverWindow;

async function createWindow() {

    // serverWindow = new BrowserWindow({
    //     width: 0, height: 0,
    //     show: false,
    //     frame: false,
    //     hasShadow: false,
    //     });
    //
    // console.log('LOADING SERVER WINDOW');
    // await serverWindow.loadFile('server.html');

    mainWindow = new BrowserWindow({
        width: 1080, height: 720,
        resizable: false,
        show: true,
        frame: true,
        hasShadow: false,
        title: "Sabinpris",
    });
    console.log('LOADING MAIN WINDOW');
    await mainWindow.loadURL('http://localhost:5000/');

    /*mainWindow.loadURL(
        url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })
    );*/

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // serverWindow.webContents.once('did-finish-load', function ()
    // {
    //     mainWindow.show();
    //     serverWindow.close();
    // });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app-old supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        console.log('MAIN WINDOW CLOSED')
        // serverWindow.close();
        // serverWindow = null;

    });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app-old when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app-old's specific main process
// code. You can also put them in separate files and require them here.
