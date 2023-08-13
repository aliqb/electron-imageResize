const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path')

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV !== 'production';

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    if (isDev) {
        win.webContents.openDevTools()
    }
    win.loadFile(path.join(__dirname, './renderer/index.html'))
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
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

ipcMain.on('image:resize', (event, options) => {
    console.log(options)
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})