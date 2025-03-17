// Processus de rendu

const ajoutTaches = document.querySelector("#ajout-tache")

async function ajoutTaches() {
    // Appel de la fonction getVersions exposée par le preload
    const taches = await todosAPI.getAjout()

    
}

ajoutTaches()