const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
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
    console.log(isDev)
    if (isDev) {
        console.log('isDev')
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
    // Remove variable from memory
    mainWindow.on('closed', () => (mainWindow = null));
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

ipcMain.on('image:resize', (event, options) => {
    options.dest = path.join(os.homedir(), 'imageresizer')
    resizeImage(options)
})

async function resizeImage({ imgPath, height, width, dest }) {
    try {
        // Resize image
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height,
        });

        const fileName = path.basename(imgPath);
        // Create destination folder if it doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // Write the file to the destination folder
        fs.writeFileSync(path.join(dest, fileName), newPath);

        // Send success to renderer
        mainWindow.webContents.send('image:done');

        // Open the folder in the file explorer
        shell.openPath(dest);
    } catch (error) {
        console.log('error')
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})