/*
 * IMPORTS
 */

// import des fonctions du controller
const controllers = require('../controller/generic_controller');
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
// router.post('/library/:service/:id', controllers.addAlbum);


/*
 * GET
 */

// route permettant de demander à afficher l'intégralité de la bibliothèque de l'utilisateur
// router.get('/library', controllers.readLibrary);

// route permettant de demander à afficher 
router.get('/library/:service', controllers.readLibraryFilter);
router.get('/library/:service/:platform', controllers.readLibraryFilter);


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
