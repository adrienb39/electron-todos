// Processus de rendu

var title = document.getElementById("titre")
const submitTitre = document.querySelector('#ajout-tache')

document.getElementById('ajout-tache').onclick = async function () {
    if (title) {
        title =  title.value
        title = await todosAPI.add(title)
    }
}