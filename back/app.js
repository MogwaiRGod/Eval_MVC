/* 
 * IMPORTS ET MONTAGE 
 */

/* modules */
const express = require("express"); 
const bodyParser = require("body-parser");
/*
 * import du module cors (Cross-origin resource sharing) qui permet d'autoriser l'accès à des donnée d'une page-web à une application :
 * cela va nous permettre d'autoriser à notre API de traiter les requêtes envoyées par le dashboard
 */
const cors = require('cors');

/* router */
const router = require('./src/routes/generic_routes.js');



/*
 * VARIABLES 
 */

// instanciation de l'application (application express)
const api = express();
// montage des middlewaares sur l'application
api.use(bodyParser.json());
api.use(cors());



/*
 * SCRIPT 
 */

/*
 *  l'API consiste en traiter des requêtes ; elle a juste besoin d'effectuer ce qui est demandé via des routes,
 * donc elle ne fait qu'utiliser le router 
 */ 
api.use(router);




/*
 * EXPORT 
 */

// autorisation de l'export de l'API
module.exports = api;