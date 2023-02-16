/*
 * VARIABLES
 */



/*
 * IMPORTS
 */
// fonctions utiles au controller
const manipFiles = require('../utils/manipulate_files');

/*
 * TEST
 */

// fonction de test de route
exports.testRoute = (req, response) => {
    response.status(200).send({message: "La route est fonctionnelle !"});
} // FIN TEST ROUTE


/*
 * CRUD
 */

/*
 * CEATE
 */

// fonction pour créer (ajouter) un album à la bibliothèque de l'utilisateur, avec son ID spécifié ou non
exports.addAlbum = (request, response) => {
    // si un ID est spécifié, on le sélectionne
    const id = request.params.id;
    const body = request.body;
    const service = request.params.service;
    const action = "add";
    // on ajoute l'élément à la BDD
    manipFiles.addAlbum(response, body, service, action, id);
} // FIN ADD ALBUM


/*
 * READ
 */

// fonction qui affiche des données de la bibliothèque
exports.readLibrary = (request, response) => {
    // on récupère les arguments éventuels
    const service = request.params.service;
    const platform = request.params.platform;
    const id = request.params.id;

    // on affiche ce qui est demandé
    manipFiles.readFile(response, service, platform, id);
    return;
} // FIN READ LIBRARY

exports.searchLibrary = (request, response) => {
    // récupération des arguments
    const service = request.params.service;
    const name = request.params.name;

    // on effectue la recherche et affiche le résultat
    manipFiles.searchAlbum(response, name, service);
    return;
} // SEARCH LIBRARY


/*
 * UPDATE
 */

// fonction qui met à jour une ou plusieurs données d'un album selon son ID
exports.updateAlbum = (request, response) => {
    // récupération des arguments/données du corps de requête
    const id = request.params.id;
    const body = request.body;
    const service = request.params.service;
    const action = "upd";

    manipFiles.updateAlbum(response, service, id, body, action);
    return;
} // FIN UPDATE ALBUM


/*
 * DELETE
 */

// fonction qui supprime un album sélectionné par un son ID
exports.deleteAlbum = (request, response) => {
    const id = request.params.id;
    const service = request.params.service;
    const action = "del";

    manipFiles.deleteAlbum(response, service, id, action);
    return;
} // FIN DELETE ALBUM