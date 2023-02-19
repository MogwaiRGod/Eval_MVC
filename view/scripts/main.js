/*
 * Fichier .js qui contient toutes les fonctions nécessaires au traitement des requêtes envoyées côté client
 * Utilise AJAX (jQuery)
 */

/*
 * FONCTIONS GENERALES
 */
// fonction qui ajoute une rangée à un tableau parent (parent) entré en argument avec un nombre
// de cellules entré en argument (nbCells), avec le contenu de la librairie (lib)
// ne retourne rien car ajoute directement la rangée au tableau HTML
function addRow(parent, nbCells, lib) {

    // on boucle dans le tableau
    for (let i=0; i<lib.length; i++) {
        // pour chaque objet, on ajoute une rangée
        let newRow = document.createElement('tr');
        // pour chaque rangée, on ajoute et remplit le nombre de cellules adéquates
        for (const cellName in lib[i]) {
           let newCell = document.createElement('td');
           newCell.append(lib[i][cellName]);
           newRow.append(newCell);
        }
        // on ajoute la rangée au tableau
        parent.append(newRow);
        // console.log(lib[i])
    }
    return;
}



/*
 * TRAITEMENT DES REQUÊTES
 * fonctions et event listeners
 */
// fonction qui se lance dès que le document de base (ici : index.html) est entièrement chargé <=> ready
$(document).ready(() => {
    /*
     * VARIABLES ET CONSTANTES
     */
    // chemin à la base de notre API
    const apiBaseUrl = "http://localhost:80/";
    // les conteneurs de biliothèque
    const allContainers = document.getElementsByClassName("containers-lib");

    // affiche toute la bibliothèque à l'ouverture de la page correspondante
    showLibrary();

    /*
     * FONCTIONS DU CRUD
     */

    // pour afficher la bibliothèque complète sur le site
    function showLibrary() {
        /* 
         * on invoque AJAX, qui est une méthode permettant de réaliser une requête HTTP asynchrone <=>
         * envoie la requête et traitera la demande quand la réponse arrivera
         */
        $.ajax(
            {
            /* type de requête = verb ; on l'a standardisé en majuscule */
            type: "GET",
            /* route pour lire la bibliothèque en entier */
            url: apiBaseUrl + "library",

            /* 
             * result correspond à ce que la requête a renvoyé si elle a été un succès
             */
            success: (result) => {
                /* result est l'objet JSON contenant la bibliohèque complète sous forme d'objet JSON */
                // on va regarder si les tableaux à l'intérieur sont vides ou non
                for (arr in result) {
                    // sélection d'un tableau
                    let arrayLib = result[arr];
                    // si le tableau est vide
                    if (!arrayLib.length) {
                        $(`#container-${arr}`).children('table').css('display', 'none');
                        // on supprime le tableau et on affiche un message d'erreur
                        $(`#container-${arr}`).children('p').css('display', 'block');
                    } else {
                        let arrayHTML = $(`#container-${arr}`).children('table').children('tbody');
                        // on vide le tbody pour éviter qu'à chaque clic on ajoute toute la BDD dedans
                        $(`#container-${arr} tbody tr`).remove();
                        // arrayHTML.removeChild(arrayHTML.children[1]);
                        // arrayHTML.append(document.createElement('tbody'));
                        let cells;
                        // le nombre de cellules n'est pas le même pour les fichiers locaux
                        (arr === 'purchases') ? nbCells = 3 : nbCells = 4;
                        addRow(arrayHTML, cells, arrayLib);
                        // on affiche le container
                        $(`#container-${arr}`).css('display', 'block');
                        $(`#container-${arr}`).children('p').css('display', 'none');
                    }
                }

            },
            /* même chose en cas de retour d'erreur */
            error: (xhr, status, error) => {
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    } // FIN FONCTION SHOW LIBRARY


    // pour afficher la bibliothèque de l'utilisateur selon un filtre
    function showLibraryFilter(filter) {
        /* 
         * on invoque AJAX, qui est une méthode permettant de réaliser une requête HTTP asynchrone <=>
         * envoie la requête et traitera la demande quand la réponse arrivera
         */

        for (let i=0; i< allContainers.length; i++) {
            if (allContainers[i].id !== `container-${filter}`) {
                document.getElementById(`${allContainers[i].id}`).style.display = 'none';
            }
        }

        $.ajax(
            {
            /* type de requête = verb ; on l'a standardisé en majuscule */
            type: "GET",
            /* route pour lire la bibliothèque en entier */
            url: apiBaseUrl + "library/" + filter,

            /* 
                * result correspond à ce que la requête a renvoyé si elle a été un succès
                */
            success: (result) => {
                /* result est l'objet JSON contenant la bibliohèque complète sous forme d'objet JSON */
                // si la requête est un succès
                $(`container-${filter}`).css('display', 'block');
            },
            error: (xhr, status, error) => {
                // sinon
                // on sort le tableau du document 
                $(`#container-${filter}`).children('table').css('display', 'none');
                // on affiche un message d'erreur
                $(`#container-${filter}`).children('p').css('display', 'block');
            }
        });
    } // FIN FONCTION SHOW LIBRARY FILTER


    



    /*
     * EVENT LISTENERS
     */

    /* 
     * Event listeners des filtres de la bibliothèque
     */  
    // on sélectionne les filtres
    document.querySelectorAll(".filter").forEach(e => {
        // au clic d'un filter
        e.addEventListener('click', () => {
            // on récupère le filtre
            const filter = e.id.substring(2);
            if (filter === "all") {
                showLibrary();
                return;
            }
            // on lance la fonction pour afficher la bibliothèque filtrée
            showLibraryFilter(filter);
        });
    });

}); // FIN DOCUMENT.READY()