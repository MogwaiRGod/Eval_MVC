/*
 * VARIABLES
 */
// chemin du jeu de données contenant les informations sur la musique de l'utilisateur
const menu = './src/model/data.json';   


/*
 * IMPORTS
 */
// file system
const fs = require('fs'); 
// fonctions du controller
const manipFiles = require('../utils/manipulate_files');

/*
 * TEST
 */

// fonction de test de route
exports.testRoute = (request, response) => {
    response.status(200).send({message: "La route est fonctionnelle !"});
} // FIN TEST ROUTE


/*
 * CRUD
 */

/*
 * CEATE
 */

// fonction pour créer (ajouter) un album à la bibliothèque de l'utilisateur, sans préciser son ID (calcul automatique)
exports.addAlbum = (request, response) => {
    console.log("ok")
} // FIN ADD ALBUM

// fonction pour créer (ajouter) un album à la bibliothèque de l'utilisateur, en précisant son ID
exports.addAlbumId = (request, response) => {
    
} // FIN ADD ALBUM ID


/*
 * READ
 */

// fonction qui affiche l'intégralité de la bibliothèque de l'utilisateur
exports.readLibrary = (request, response) => {

} // FIN READ LIBRARY

// fonction qui affiche la bibliothèque de l'utilisateur selon un service et (optionnel) une plateforme
exports.readLibraryFilter = (request, response) => {
    const service = request.params.service;
    const platform = request.params.platform;
    console.log(service, platform)
    response.status(200).send({message: "L'algo fonctionne GG"});
}


/* 
* fonction qui recherche et affiche le resultat de la recherche, selon 0 ou plusieurs filtres
* 0 filtres => cherche dans toute la bibliothèque ;
* avec filtres : le service (abonnement, local) 
* et (optionnel) la plateforme qui propose la musique (Spotify, Amazon Music...)
* /


/*
 * UPDATE
 */

// fonction qui met à jour une ou plusieurs données d'un album selon son ID

/*
 * DELETE
 */

// fonction qui supprime un album sélectionné par un son ID