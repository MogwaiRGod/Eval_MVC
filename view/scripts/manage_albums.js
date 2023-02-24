
    //les inputs utilisateur pour chaque menu déroulant
    let optionService; let optionPlatform; let optionAction;

/**
 * FONCTIONS SPECIFIQUES
 * à manage_albums.html
 * 
 * 
 * fonction qui reset une mention d'erreur dans les inputs
 */
function resetAside() {
    if (document.getElementById("tmp-aside")) {
        document.getElementById("tmp-aside").setAttribute('id', 'default-aside');
    }
    document.getElementById("default-aside").textContent = "*Champs obligatoires";
    return;
}

function resetManageAlbums() {
    document.getElementById("label-menu-membership").style.display = 'none';
    document.getElementById("menu-membership").style.display = 'none';
    document.getElementById("label-menu-purchases").style.display = 'none';
    document.getElementById("menu-purchases").style.display = 'none';
    document.getElementById("menu-membership").style.display = 'none';
    document.getElementById("label-menu-action").style.display = 'none';
    document.getElementById("menu-action").style.display = 'none';
    return;
}

// fonction qui affiche un menu selon le service sélectionné
function getMenuSrvc(srvc) {
    switch (srvc) {
        case 'membership':
        case 'purchases':
            setMenu(srvc);
            setMenuPlatform (srvc);
            return;
        case 'local':
            // Pas de plateforme si on a choisi un import local
            optionPlatform = "";    
            // On peut directement ouvrir le menu d'options
            setMenuAction(); 
            return;
    } // FIN SWITCH SRVC
} // FIN GET MENU

// fonction qui affiche un menu selon une catégorie entrée en argument
function setMenu(type) {
    document.getElementById(`label-menu-${type}`).style.display = 'block';
    document.getElementById(`menu-${type}`).style.display = 'block';
    return;
}

// fonction qui affiche le formulaire selon l'action choisie par le client
function setForm(opt) {
    switch (opt) {
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
    return;
} // FIN SET FORM

function setMenuPlatform (srvc) {
    // une fois que l'utilisateur a fait son choix de plateforme
    document.getElementById(`menu-${srvc}`).addEventListener('change', function () {
        // stockage de la plateforme
        optionPlatform = $(`#menu-${srvc}`).val();

        // affichage de la bibliotèque triée par plateforme
        showLibraryMini(srvc, $( "#lib-albums" ), optionPlatform);
        
        setMenuAction();
    });
    return;
}

function setMenuAction() {
    // on ouvre le menu d'action
    setMenu('action');
    
    // au choix d'une action dans le menu action
    $("#menu-action").on("change", function() {
        // stockage de l'action
        optionAction = $( "#menu-action" );
        console.log(optionAction.val())
        // affichage du formulaire
        setForm(optionAction.val());
    });
    return;
}


/**
 * SCRIPT
 */

// une fois que la page est chargée
$(document).ready( () => {
    // on réinitialise les éléments de la page
    resetManageAlbums();

    /** 
     * EVENT LISTENERS
     * les menus déroulants apparaissent une fois le précédent ayant eu une option sélectionnée
     */

    // à la seléction d'une option du menu déroulant de services
    $("#menu-service").on("change", function() {
        /* RESET DE LA PAGE */
        resetAside();
        resetManageAlbums();
    
        // stockage de l'option sélectionnée par le client
        optionService = $( "#menu-service" ).val();
    
        // On va afficher la bibliothèque du service correspondant
        showLibraryMini(optionService, $( "#lib-albums" ));
            
        // Selon l'option sélectionnée, on va afficher le prochain menu 
        getMenuSrvc(optionService);
    });

    // avant l'envoi du formulaire (= au clic du bouton Valider) on va récupérer les inputs
    // et vérifier leur intégrité
    document.getElementById("btn-form").addEventListener('click', () => {
        console.log(optionAction.val())
        const optionId = $("#ipt-id").val();
        const optionName = $("#ipt-name").val();
        const optionArtist = $("#ipt-artist").val();

        // autre design d'aside pour envoyer une notification
        if(document.getElementById("default-aside")) {
            document.getElementById("default-aside").setAttribute('id', 'tmp-aside');
        }

        switch (optionAction.val()) {  
            case 'add':
                // si les inputs sont incomplets
                if (!optionName || !optionArtist) {
                    document.getElementById("tmp-aside").textContent = "Veuillez remplir les champs obligatoires";
                    break;
                } else {
                    // on invoque la fonction d'ajout d'album à la BDD
                }
                break;

            case 'delete':
                // si les inputs sont incomplets
                if (!optionId) {
                    document.getElementById("tmp-aside").textContent = "Veuillez remplir les champs obligatoires";
                    break;
                } else {
                    // on invoque la fonction de suppression
                    deleteAlbum ($( "#lib-albums" ), optionService, optionId);
                }
                break;
            case 'update':
                // si les inputs sont incomplets
                if (!optionId || !(optionName || optionArtist || optionPlatform)) {
                    document.getElementById("tmp-aside").textContent = "Veuillez remplir les champs obligatoires";
                    break;
                } else {
                    // on invoque la fonction de màj d'album
                    updateAlbum ($( "#lib-albums" ), optionService, optionId, [{"name": optionName}, {"artist":optionArtist}, {"platform":optionPlatform}]);
                }
        }
    });
}); // FIN MANAGE_ALBUMS.JS