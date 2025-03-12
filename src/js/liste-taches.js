// Processus de rendu

const listeTaches = document.querySelector("#liste-taches")

async function lesTaches() {
    // Appel de la fonction getVersions exposée par le preload
    const taches = await todosAPI.getAll()

    taches.forEach(tache => {
        if (tache.termine == 0) {
            tacheTermine = "En cours"
        } 
        if (tache.termine == 1) {
            tacheTermine = "Terminé"
        }
        const tacheElement = document.createElement('tr')
        tacheElement.innerHTML = `<td class="badge text-bg-warning">` + tacheTermine + `</td><td>` + tache.titre + `</td>`
        listeTaches.appendChild(tacheElement)
    });
}

lesTaches()