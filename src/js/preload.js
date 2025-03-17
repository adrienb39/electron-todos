// Ce script sera exécuté avant le chargement de la page
// Accès aux API Node et Electron

const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('versions', {
    // Fonction qui récupère les versions via IPC
    getVersions: () => ipcRenderer.invoke('get-versions')
})

contextBridge.exposeInMainWorld('todosAPI', {
    // Fonction qui récupère les versions via IPC
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    getAjout: () => ipcRenderer.invoke('todos:gatAjout')
})

console.log("Preload chargé avec succès")