const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const resizeImg = require('resize-img');

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV !== 'production';
let mainWindow;
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

const createAboutWindow = () => {
    const win = new BrowserWindow({
        width: 500,
        height: 600
    })
    win.loadFile(path.join(__dirname, './renderer/about.html'))
}

const menu = [
    ...(isMac
        ? [
            {
                label: app.name,
                submenu: [
                    {
                        label: 'About',
                        click: createAboutWindow
                    },
                ],
            },
        ]
        : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac
        ? [
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: createAboutWindow
                    },
                ],
            },
        ]
        : []),
]

app.whenReady().then(() => {
    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)

    mainWindow.webContents.on('did-finish-load', () => {
        const picturesDirectoryPath = app.getPath('pictures');
        mainWindow.webContents.send('pictures-directory-path', picturesDirectoryPath);
    });
    // Remove variable from memory
    mainWindow.on('closed', () => (mainWindow = null));
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

ipcMain.on('image:resize', (event, options) => {
    resizeImage(options)
})

ipcMain.on('path:choose', async (event, options) => {
    const defaultPath = options.defaultPath;
    const dialogOptions = {
        title: 'Choose Path',
        defaultPath: defaultPath,
        buttonLabel: 'Save', // Change this to your preferred label
        filters: [
            { name: 'Image Files', extensions: ['jpg', 'jpeg', 'png'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    };

    const result = await dialog.showSaveDialog(dialogOptions);
    if (!result.canceled) {
        // The selected file path will be in result.filePath
        mainWindow.webContents.send('path:done', {
            path: result.filePath || defaultPath
        });
    }
})

async function resizeImage({ imgPath, height, width, dest }) {
    try {
        // Resize image
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height,
        });
        fs.writeFileSync(path.join(dest), newPath);

        // Send success to renderer
        mainWindow.webContents.send('image:done');

        // Open the folder in the file explorer
        shell.openPath(path.dirname(dest));
    } catch (error) {
        console.log(error)
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})