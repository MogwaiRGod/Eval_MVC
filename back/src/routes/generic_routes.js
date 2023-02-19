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
// e.g http://localhost:3000/
router.post('/', controllers.testRoute);
router.get('/', controllers.testRoute);
router.put('/', controllers.testRoute);
router.delete('/', controllers.testRoute);


/*
 * POST
 */

// route permettant de demander à ajouter un album selon le service (abonnement, fichier local...)
// e.g http://localhost:3000/library/purchases
router.post('/library/:service', controllers.addAlbum);

// route permettant de demander à ajouter un album selon le service (abonnement, fichier local...) et un ID
// e.g http://localhost:3000/library/purchases/30
router.post('/library/:service/:id', controllers.addAlbum);


/*
 * GET
 */

/* 
 * AFFICHAGE
 */

// route permettant de demander à afficher l'intégralité de la bibliothèque de l'utilisateur
// e.g http://localhost:3000/library
router.get('/library', controllers.readLibrary);

// // route permettant de demander à afficher une bibliothèque selon le service (abonnement, fichier local)
// e.g http://localhost:3000/library/membership
router.get('/library/:service', controllers.readLibrary);

// // route permettant de demander à afficher une bibliothèque selon le servic (abonnement, achat...) ET la plateforme (Spotify, iTunes...)
// e.g http://localhost:3000/library/membership/spotify
router.get('/library/:service/:platform', controllers.readLibrary);

// // route permettant de demander à afficher un album selon le service ET son ID
// e.g http://localhost:3000/library/membership/1
router.get('/library_id/:service/:id', controllers.readLibrary);

/* 
 * RECHERCHE
 */

// route qui permet d'effectuer une recherche dans la bibliothèque complète, selon un nom
// e.g http://localhost:3000/library_search/tank
router.get('/library_search/:name', controllers.searchLibrary);

// route qui permet d'effectuer une recherche selon un type de service et un nom entré
// e.g http://localhost:3000/library_search/purchases/tank
router.get('/library_search/filter/:service/:name', controllers.searchLibrary);



/*
 * PUT
 */

// route permettant de mettre à jour un album sélectionné par son id et le service qui le propose
// e.g http://localhost:3000/library/local/1
router.put('/library/:service/:id', controllers.updateAlbum);

/*
 * DELETE
 */

// route permettant de mettre à jour un album sélectionné par son id et le service qui le propose
// e.g http://localhost:3000/library/local/2
router.delete('/library/:service/:id', controllers.deleteAlbum);



/*
 * EXPORT
 */

// autorisation de l'export du router
module.exports = router;
