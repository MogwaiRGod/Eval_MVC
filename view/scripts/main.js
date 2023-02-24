// chemin à la base de notre API : VERIFIER QUE LE PORT EST LE BON
const apiBaseUrl = "http://localhost:2000/";

/*
 * Fichier .js qui contient toutes les fonctions nécessaires au traitement des requêtes envoyées côté client
 * Utilise AJAX (jQuery)
 */

/**
 * FONCTIONS GENERALES
 * 
 * fonction qui ajoute une rangée à un tableau parent (parent) entré en argument avec un nombre
 * de cellules entré en argument (nbCells), avec le contenu de la librairie (lib)
 * ne retourne rien car ajoute directement la rangée au tableau HTML
 */
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





/**
 * FONCTIONS DU CRUD
 */



/**
 * CREATE
 */


/* PLUS LE TEMPS */
// fonction permettant de demander à ajouter un album à la BDD
function addAlbum (service, title, artist, platform, id) {

}

/*
* READ
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
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',

            /* 
                * result correspond à ce que la requête a renvoyé si elle a été un succès
                */
            success: (result) => {
                /* result est l'objet JSON contenant la bibliohèque complète sous forme d'objet JSON */
                // si la requête est un succès
                console.log(document.getElementById(`container-${filter}`).style.display)
                document.getElementById(`container-${filter}`).style.display = 'block';
            },
            error: (xhr, status, error) => {
                // sinon
                // on sort le tableau du document 
                $(`#container-${filter}`).children('table').style.display = 'none';
                // on affiche un message d'erreur
                $(`#container-${filter}`).children('p').style.display = 'block';
            }
        });
    } // FIN FONCTION SHOW LIBRARY FILTER

    // fonction pour afficher la bibliothèque interactive de la page manage albums
    function showLibraryMini(service, container, platform ="") {
        // on reset le tableau
        if (document.getElementById("table-mini")) {
            document.getElementById("table-mini").removeChild(document.getElementById("tbody-mini"));
        }

        container.children("p").css("display", "none");

        // On affiche la bibliothèque
        container.css('display', "inline-block");
        $( "#th-platform" ).css("display", "none");

        let translation; let nbCells;
        switch (service) {
            case 'local':
                nbCells = 3;
                translation = "Imports locaux";
                break;
            case 'membership':
                $( "#th-platform" ).css("display", "inline-block");
                nbCells = 4;
                translation = "Abonnements";
                break;
            case 'purchases':
                $( "#th-platform" ).css("display", "inline-block");
                nbCells = 4;
                translation = "Achats";
                break;
        }

        container.children("h4").text(translation);

        // on détermine la route de la requête
        let route;
        (!platform) ? route = apiBaseUrl + "library/" + service : route = apiBaseUrl + "library/" + service + "/" + platform;
        

        $.ajax(
            {

            type: "GET",
            url: route,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',

            success: (result) => {
                /* result est l'objet JSON contenant la bibliohèque complète sous forme d'objet JSON */
                // si la requête est un succès
                let tbody = document.createElement("tbody");
                container.children("table").append(tbody);
                tbody.setAttribute("id", "tbody-mini");
                addRow(container.children("table"), nbCells, result);
            },
            error: (xhr, status, error) => {
                // sinon
                // on sort le tableau du document 
                container.children("table").css("display", "none");
                // on affiche un message d'erreur
                container.children("p").css("display", "block");
            }
        });
    } // FIN FONCTION SHOW LIBRARY MINI

    


    /*
     * UPDATE
     */

    /* FONCTION UPDATE NE FONCTIONNE PLUS */
    // fonction permettant de modifier un album de la BDD
    function updateAlbum (container, service, id, arrayArgs) {

        // On crée l'objet avec les données mises à jour
        let dataRequest = {};
        const properties = ["name", "artist", "platform"];

        // on remplit l'objet à envoyer
        for (let i=0; i<arrayArgs.length; i++) {
            if (arrayArgs[i][properties[i]]) {
                dataRequest[properties[i]] =  arrayArgs[i][properties[i]];
            }
        }

        console.log(dataRequest)

        $.ajax(
            {
            type: "PUT",
            url: apiBaseUrl + "library/" + service + "/" + id,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(dataRequest),

            success: (result) => {
                // on rappelle la fonction d'affichage pour voir les données mises à jour
                showLibraryMini(service, container, platform ="");

                // affiche bien que l'album est mis à jour, pourtant rien ne se passe dans le jeu de données ?
                document.getElementById("tmp-aside").textContent = JSON.stringify(result.message);
            },
            error: (xhr, status, error) => {
                document.getElementById("tmp-aside").textContent = "L'album demandé n'existe pas";
            }
        });
    }



    /*
     * DELETE
     */

    // fonction permettant de supprimer un album de la BDD
    function deleteAlbum (container, service, id) {
        $.ajax(
            {
            type: "DELETE",
            url: apiBaseUrl + "library/" + service + "/" + id,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',

            success: (result) => {
                // on rappelle la fonction d'affichage pour voir les données mises à jour
                showLibraryMini(service, container, platform ="");

                // message de suppression
                document.getElementById("tmp-aside").textContent = JSON.stringify(result.message);
            },
            error: (xhr, status, error) => {
                document.getElementById("tmp-aside").textContent = "L'album demandé n'existe pas";
            }
        });
    } // FIN DELETE ALBUM

/*
 * TRAITEMENT DES REQUÊTES
 * fonctions et event listeners
 */
// fonction qui se lance dès que le document de base est entièrement chargé <=> ready
$(document).ready(() => {
    /*
     * VARIABLES ET CONSTANTES
     */
    
    // les conteneurs de biliothèque
    const allContainers = document.getElementsByClassName("containers-lib");
    // détermine quelle page en chargée
    var loadedPage = location.href.split("/").slice(-1);


   


    /**
     * 
     * EVENT LISTENERS
     * 
     */

    /**
     * Event listeners des filtres de la bibliothèque
     */ 
    if (loadedPage[0] === 'library.html') {
        // affiche toute la bibliothèque à l'ouverture de la page
        showLibrary();

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
    } // FIN LIBRARY. HTML

}); // FIN DOCUMENT.READY()