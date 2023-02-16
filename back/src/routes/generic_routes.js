/*
 * IMPORTS
 */

// import des fonctions du controller
const controllers = require('../controller/generic_controller');
// import de la fonction de base de manipulate_files
const manipFiles = require('../utils/manipulate_files.js');
// import du module express
const express = require("express");


/* 
 * ROUTER
 */

// instanciation du router
const router = express.Router();


/*
 * ROUTES
 */

/*
 * TEST
 */

// tests de route pour tous les verbes utilisés par l'API (POST, GET, PUT, DELETE)
router.post('/', controllers.testRoute);
router.get('/', controllers.testRoute);
router.put('/', controllers.testRoute);
router.delete('/', controllers.testRoute);


/*
 * POST
 */

// route permettant de demander à ajouter un album selon le service (abonnement, fichier local...)
router.post('/library/:service', controllers.addAlbum);

// route permettant de demander à ajouter un album selon le service (abonnement, fichier local...) et l'ID de l'album
router.post('/library/:service/:id', controllers.addAlbum);


/*
 * GET
 */

/* 
 * AFFICHAGE
 */

// route permettant de demander à afficher l'intégralité de la bibliothèque de l'utilisateur
router.get('/library', controllers.readLibrary);

// // route permettant de demander à afficher une bibliothèque selon le service (abonnement, fichier local)
router.get('/library/:service', controllers.readLibrary);

// // route permettant de demander à afficher une bibliothèque selon le service ET la plateforme (Spotify, iTunes...)
router.get('/library/:service/:platform', controllers.readLibrary);

// // route permettant de demander à afficher un album selon le service ET son ID
router.get('/library/id/:service/:id', controllers.readLibrary);

/* 
 * RECHERCHE
 */

// route qui permet d'effectuer une recherche dans la bibliothèque complète, selon un nom
router.get('/library_search/:name', controllers.searchLibrary);

// route qui permet d'effectuer une recherche selon un type de service et un nom entré
router.get('/library_search/filter/:service/:name', controllers.searchLibrary);



/*
 * PUT
 */

/*
 * DELETE
 */



/*
 * EXPORT
 */

// autorisation de l'export du router
module.exports = router;
