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
                $(`container-${filter}`).style.display = 'block';
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

    /* 
     * Event listeners du formulaire de la page de gestion des albums
     */

    // J'ai plus le temps, le code est fait à l'arrache déso ! -> code à 0% optimisé :S

    /* Pour le formulaire : les informations obligatoires à entrer varient selon l'action choisie -> pas le
    temps de le faire */

    const dropdownService = document.getElementById("menu-service");
    let optionService; let optionPlatform; let optionAction;

    dropdownService.addEventListener('change', (event) => {
        optionService = $("#menu-service").val();

        document.getElementById("label-menu-membership").style.display = 'none';
        document.getElementById("menu-membership").style.display = 'none';
        document.getElementById("label-menu-purchase").style.display = 'none';
        document.getElementById("menu-purchase").style.display = 'none';
        document.getElementById("label-menu-action").style.display = 'none';
        document.getElementById("menu-action").style.display = 'none';

        switch (optionService) {
            case 'membership':
                document.getElementById("label-menu-membership").style.display = 'block';
                document.getElementById("menu-membership").style.display = 'block';
                break;
            case 'purchase':
                document.getElementById("label-menu-purchase").style.display = 'block';
                document.getElementById("menu-purchase").style.display = 'block';
                break;
            case 'local':
                // Pas de plateforme si on a choisi un import local
                optionPlatform = "";
                document.getElementById("label-menu-action").style.display = 'block';
                document.getElementById("menu-action").style.display = 'block';

                // On peut directement ouvrir le menu d'options
                document.getElementById("menu-action").addEventListener('change', () => {
                    optionAction = $("#menu-action").val();

                    switch (optionAction) {
                        case 'add':
                            document.getElementById("action").textContent = "Ajouter";
                            break;
                        case 'delete':
                            document.getElementById("action").textContent = "Supprimer";
                            break;
                        case 'update':
                            document.getElementById("action").textContent = "Mettre à jour";
                            break;
                    }

                    document.getElementById("last-form-albums").style.display = 'flex';
                    document.getElementById("btn-form").style.display = 'block';
                });
                break;
        }
    });

    // déploiement du formulaire si on a choisi le service abonnement
    document.getElementById("menu-membership").addEventListener('change', (event) => {
        optionPlatform = $("#menu-membership").val();

        document.getElementById("label-menu-action").style.display = 'block';
        document.getElementById("menu-action").style.display = 'block';

        document.getElementById("menu-action").addEventListener('change', () => {
            optionAction = $("#menu-action").val();

            switch (optionAction) {
                case 'add':
                    document.getElementById("action").textContent = "Ajouter";
                    break;
                case 'delete':
                    document.getElementById("action").textContent = "Supprimer";
                    break;
                case 'update':
                    document.getElementById("action").textContent = "Mettre à jour";
                    break;
            }

            document.getElementById("last-form-albums").style.display = 'flex';
            document.getElementById("btn-form").style.display = 'block';
        });
    });

    // déploiement du formulaire si on a choisi le service achat
    document.getElementById("menu-purchase").addEventListener('change', (event) => {
        optionAction = $("#menu-action").val();

        document.getElementById("label-menu-action").style.display = 'block';
        document.getElementById("menu-action").style.display = 'block';

        document.getElementById("menu-action").addEventListener('change', () => {
            switch (optionAction) {
                case 'add':
                    document.getElementById("action").textContent = "Ajouter";
                    break;
                case 'delete':
                    document.getElementById("action").textContent = "Supprimer";
                    break;
                case 'update':
                    document.getElementById("action").textContent = "Mettre à jour";
                    break;
            }

            document.getElementById("last-form-albums").style.display = 'flex';
            document.getElementById("btn-form").style.display = 'block';
        });
    });

    // avant l'envoi du formulaire (= au clic du bouton Valider) on va récupérer les inputs
    // et vérifier leur intégrité
    document.getElementById("btn-form").addEventListener('click', () => {
        const optionId = $("#ipt-id").val();
        const optionName = $("#ipt-name").val();
        const optionArtist = $("#ipt-artist").val();

        console.log(optionId);

        switch (optionAction) {
            case 'add':
                if (!optionName || !optionArtist) {
                    document.getElementById("default-aside").textContent = "Veuillez remplir les champs obligatoires";
                    document.getElementById("default-aside").setAttribute('id', 'tmp-aside');
                }
                break;
            case 'delete':
                if (!optionId) {
                    document.getElementById("default-aside").textContent = "Veuillez remplir les champs obligatoires";
                    document.getElementById("default-aside").setAttribute('id', 'tmp-aside');
                }
                break;
            case 'update':
                if (!optionId || !(optionName || optionArtist)) {
                    document.getElementById("default-aside").textContent = "Veuillez remplir les champs obligatoires";
                    document.getElementById("default-aside").setAttribute('id', 'tmp-aside');
                }
        }
    });


}); // FIN DOCUMENT.READY()