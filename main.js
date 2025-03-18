// Processus principal

const {app, BrowserWindow, ipcMain, Menu, dialog} = require("electron")
const path = require('path');
const mysql = require('mysql2/promise')

require('dotenv').config()

// Fenêtre principale
let window;

// Configuration de l'accès à la base de données
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // Le nombre maximal de connexions simulatanés dans le pool
    waitForConnections: true,
    queueLimit: 0
}

// Créer le pool de connexion
const pool = mysql.createPool(dbConfig)

// Tester la connexion
async function testConnexion() {
    try {
        // Demander une connexion au pool
        const connexion = await pool.getConnection()
        console.log('Connexion avec la base de donnée établie')
        connexion.release() // On rend la connexion disponible dans le pool
    } catch(error) {
        console.error('Erreur de connexion à la base de données')
    }
}
testConnexion()

// Créer la fenêtre principale
function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Acces aux API Node depuis le processus
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'src/js/preload.js')
        }
    })
    // window.webContents.openDevTools()
    // Création du menu
    createMenu()
    window.loadFile('src/pages/index.html');
}

// Fonction permettant de créer un menu personnalisé
function createMenu() {
    // Créer un tableau qui va représenter le menu => modèle
    const template = [
        {
            label: 'App',
            submenu: [
                {
                    label: 'Versions',
                    click: () => window.loadFile('src/pages/index.html')
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quitter',
                    accelerator: process.platform === "darwin" ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Tâches',
            submenu: [
                {
                    label: 'Lister',
                    click: () => window.loadFile('src/pages/liste-taches.html')
                },
                {
                    label: 'Ajouter',
                    click: () => window.loadFile('src/pages/ajout-tache.html')
                }
            ]
        }
    ]
    // Créer le menu à partir du modèle
    const menu = Menu.buildFromTemplate(template)
    // Définir le menu comme étant le menu de l'application
    Menu.setApplicationMenu(menu)
}

// Attendre l'initialisation de l'application au démarrage
app.whenReady().then(() => {
    console.log('Application initialisée')
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit
    }
})

// Ecouter sur le canal "get-versions"
ipcMain.handle('get-versions', () => {
    // Renvoyer un objet contenant les versions des outils
    return {
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome
    }
})

async function getAllTodos() {
    try {
        const resultat = await pool.query('SELECT * FROM todos ORDER BY created_at DESC')
        return resultat[0] // Retourne une promesse avec le résultat
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches')
        throw error; // Retourne une promesse non résolue
    }
}

// Ecouter sur le canal "todos:getAll"
ipcMain.handle('todos:getAll', async () => {
    // Récupérer la liste des tâches dans la base de données avec mysql
    try {
        return await getAllTodos() // Retourne une promesse avec le résultat
    } catch(error) {
        dialog.showErrorBox('Erreur technique', 'Impossible de récupérer la liste des tâches')
        return []; // Retourne une promesse avec un tableau vide
    }
})