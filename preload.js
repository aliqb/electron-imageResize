const { contextBridge, ipcRenderer } = require('electron')
const Toastify = require('toastify-js');

const os = require('os')
const path = require('path')

contextBridge.exposeInMainWorld('os', {
    homeDir: () => os.homedir()
})

contextBridge.exposeInMainWorld('path', {
    join: path.join
})

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: ipcRenderer.send,
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('Toastify', {
    toast: (options) => Toastify(options).showToast(),
});