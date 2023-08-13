const { contextBridge, ipcRenderer } = require('electron')
const os = require('os')
const path = require('path')

contextBridge.exposeInMainWorld('os', {
    homeDir: () => os.homedir()
})

contextBridge.exposeInMainWorld('path',{
    join: path.join
})
