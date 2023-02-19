/*
 * IMPORTS
 */

const { Console } = require('console');
// pour manipuler des fichiers
const fs = require('fs');


/*
 * VARIABLES
 */

// chemin du jeu de données contenant les informations sur la musique de l'utilisateur
const document = './src/model/data.json';  
const errors = 
{   
    // erreur 404
    "404_id": "Aucun album trouvé avec cet id",
    "404_nom": "Aucun album trouvé avec ce nom",
    "404_vide": "Le filtre n'a donné aucun résultat",
    "404_tab": "La bibliothèque demandée est vide",
    // erreur 500
    "500_lecture": "Une erreur est survenue lors de la lecture des données",
    "500_ecriture": "Une erreur est survenue lors de l'écriture des données",
    "500": "Erreur interne",
    // codes 200
    "200_add": "Donnée ajoutée avec succès !",
    "200_upd": "Donnée mise à jour avec succès !",
    "200_del": "Donnée supprimée avec succès !",
    "200": "La requête est un succès",
    // erreurs 400
    "400_id": "L'ID demandé est déjà attribué",
};




/*
 * FONCTIONS
 */


/*
 * REPONSES DE REQUÊTES
 */

// fonction qui vérifie si une erreur système s'est produite et le cas échant, envoie une erreur + message et retourne VRAI;
// sinon ne fait rien et retourne FAUX
exports.caseError = (error_sys, resp, type) => {
    // le type d'erreur est soit une erreur d'écriture, soit de lecture ; si à l'avenir,
    // d'autres erreurs sont possibles, ça retournera par défaut 'erreur interne' = erreur 500
    const error_msg = errors[`500_${type}`];
    if (error_sys) {
        resp.status(parseInt(500)).send({
            message: error_msg,
            error: error_sys
        });
        return true;
    }
    return false;
} // FIN CAS ERREUR     



/*
 * FONCTIONS DU CRUD
 */

/* fonction qui lit un document entré en argument (doc),
 * et affiche les données demandées filtrées selon 0 ou plusieurs filtres
 * le service, la plateforme, un nom entré...
 * c'est donc une fonction de recherche et d'affichage
 */
exports.readFile = (resp, params) => {
    // lecture du document
    fs.readFile(document, (error, data) => {
        // si une erreur survient à la lecture
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            let nbItems = 0;

            // si on a demandé à afficher l'intégralité de la bibliothèque, sans filtre
            if (!params.platform & !params.service) {
                // on détermine si les bibliothèques sont vides
                for (i in existingData) {
                    nbItems += existingData[i].length;
                }
                // si la bibliothèque est vide
                if (!nbItems){
                    resp.status(404).send({message: errors["404_tab"]});
                    return;
                } 
                resp.status(200).send(existingData);
            } else if (params.service && !params.platform && !params.id){
                // si on n'a demandé à afficher que par service
                // on vérifie que le tableau n'est pas vide
                if (!existingData[params.service].length){
                    resp.status(404).send({message: errors["404_tab"]});
                    return;
                } else {
                    resp.status(200).send(existingData[params.service]);
                }
            } else if (params.service && params.platform && !params.id){
                // si on a demandé à afficher que par service ET plateform
                // on vérifie que le tableau n'est pas vide
                if (!existingData[params.service].length){
                    resp.status(404).send({message: errors["404_tab"]});
                    return;
                } else {
                    // on sélectionne tous les albums étant sur la plateforme demandée
                    const albums = existingData[params.service].filter(album => album["platform"] === params.platform);
                    // si le filtre n'a retourné aucun album
                    if (albums === undefined) {
                        resp.status(404).send({message: errors["404_vide"]});
                    } else {
                        resp.status(200).send(albums);
                    }
                }
            } else {
                // si on a demandé à afficher par service et id
                // on vérifie que le tableau n'est pas vide
                if (!existingData[params.service].length){

                    resp.status(404).send({message: errors["404_tab"]});
                    return;
                } 
                // et on vérifie que l'ID demandé est bien attribué
                const album = existingData[params.service].filter(album => album["id"] === parseInt(params.id));
                if (album === undefined) {
                    resp.status(404).send({message: errors["404_id"]});
                    return;
                }
                resp.status(200).send(album);
            }
        }
    }); // FIN FS READFILE
} // FIN READ FILE

/*
 * fonction qui réécrit un document (doc) avec des données (string : data) (les deux entrés en arguments)
 * affiche le résultat de la réécriture (erreur ou succès) en spécifiant dans un message l'action (string : action) qui a été effectuée 
 * action est par défaut une chaîne vide => affiche que la requête est un succès par défaut
 * et ne retourne rien
 */
exports.writeFile = (doc, data, resp, action) => {
    fs.writeFile(doc, data, (error) => {
        // si une erreur survient à la réécriture
        if (this.caseError(error, resp, 'ecriture')) {
            return;
        } else {
            // la réécriture a été effectuée et on envoie un message de succès
            resp.status(200).send({
                message: errors[`200_${action}`],
            });
        }
    })
    return;
} // FIN WRITE FILE

// fonction permettant d'ajouter un album à la BDD
exports.addAlbum = (resp, body, params, action) => {
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            let existingData = JSON.parse(data);
            // si le tableau est vide
            if (!existingData[params.service]) {
                let id = 0;
            } else {
                // si un id est spécifié
                let id = params.id;
                if (id) {
                    // on vérifie qu'il n'est pas déjà attribué
                    if(this.checkId(id, existingData[params.service], resp)) {
                        return;
                    }
                } else {
                     // sinon, on calcule un nouvel ID
                     id = this.defineId(existingData[params.service]);
                }
                // création de l'item
                const album = body;
                album["id"] = parseInt(id);
                // on l'ajoute à la BDD, dans le tableau attendu
                existingData[params.service].push(album);
                // réécriture des données
                this.writeFile(document, JSON.stringify(existingData), resp, action)
            }
        }
    });
} // FIN ADD ALBUM

// fonction permettant de màj un album
exports.updateAlbum = (resp, params, body, action) => {
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            // si le tableau est vide
            if (!existingData[params.service].length) {
                resp.status(200).send({message: errors["404_tab"]});
                return;
            } else {
                // sélection de l'item
                let album = existingData[params.service].find(e => e.id === parseInt(params.id));
                // màj de l'item
                for (let prop in body){
                    album[prop] = body[prop];
                }
            }
            // réécriture des données
            this.writeFile(document,JSON.stringify(existingData), resp, action);
        }
    return;
    });
} // FIN UPDATE ALBUM

// fonction permettant de supprimer un album
exports.deleteAlbum = (resp, params, action) => {
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            // si le tableau est vide
            if (!existingData[params.service].length) {
                resp.status(200).send({message: errors["404_tab"]});
                return;
            } else {
                // on détermine l'index de l'item dans le tableau
                const index = existingData[params.service].findIndex(e => e.id === parseInt(params.id));
                // si l'ID ne correspond à aucun élément
                if (index === -1) {
                    resp.status(200).send({message: errors["404_id"]});
                    return;
                }
                existingData[params.service].splice(index, 1);
                // réécriture des données
                this.writeFile(document, JSON.stringify(existingData), resp, action);
            }
        }
    });
    return;
}



/*
 * FONCTIONS RELATIVES A LA LOGIQUE METIER
 * fonctions de recherche et de traitement des IDs
 */

// fonction qui cherche une expression (regex) dans une str de caractères (str)
// retourne un booléen selon si la regex a été trouvé à l'intérieur ou non
exports.searchRegex = (name, regex) => {
    let foundRegex = false;// indique si les caractères sont bons dans l'évaluation en cours

    // standardisation des arguments
    name=name.toLowerCase(); regex=regex.toLowerCase();

    // on boucle dans la name tant que la regex peut être contenu (en longueur) dans la chaîne
    for (let i=0; i<= name.length-regex.length; i++) {
        // on boucle dans la regex afin d'évaluer les caractères de la chaîne et de la regex
        for (let j=0; j<regex.length; j++) {
            // si le caractère évalué n'est pas le même
            if (regex[j] !== name[i+j]) {
                foundRegex = false; // màj du booléen foundRegex
                if (j>0) { // si on a déjà trouvé des caractères identiques
                    name=name.substring(i+j, name.length); // on enlève tous les caractères de la name évalués jusque-là
                    return this.searchRegex(name, regex); // et on relance la fonction
                } else {
                    break; // sinon, on se contente de sortir de la boucle pour itérer sur le prochain caractère de la chaîne
                } // FIN SI
            } else if (j === regex.length-1) { // si on a évalué le dernier caractère de la regex (et qu'il est identique
                                            // à celui en cours de la chaîne)
                foundRegex = true;
                return foundRegex; // on peut quitter la fonction
            } else { // sinon, si le caractère évalué est le même
                foundRegex = true;
            }// FIN SI
        } // FIN POUR J
    } // FIN POUR I
    return foundRegex;
}   // FIN FONCTION SEARCH REGEX

// fonction permettant de chercher un album dans la BDD
exports.searchAlbum = (resp, params) => {
    // lecture du document
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            let filteredData = [];
            // selon qu'on a filtré par service ou non
            if (service) {
                filteredData = existingData[params.service].filter( 
                    album => this.searchRegex(album.name, params.name)
                );
            } else {
                const dataArrays = Object.getOwnPropertyNames(existingData);
                dataArrays.forEach( 
                    nameTab => existingData[nameTab].forEach( album => {
                        if (this.searchRegex(album.name, params.name)){
                            filteredData.push(album);
                        }
                    })
                );
            }
            resp.status(200).send(filteredData);
        }
    });
} // FIN SEARCH ALBUM


// fonction qui vérifie que l'id entré en argument n'est pas déjà pris par un objet du tableau passé en argument
// si c'est le cas : message d'erreur + retourne vrai ; sinon ne ne fait rien et retourne faux
exports.checkId = (id, array, resp) => {
    if(array.find(e => parseInt(e.id) === parseInt(id)) !== undefined){
        resp.status(400).send(errors["400_id"]);
        return true;
    }
    return false;
} // FIN CHECK ID

// fonction qui définit un id à partir de l'id le plus grand déjà attribué à l'item d'une liste d'objets
// retourne un entier (id)
exports.defineId = (objs) => {
    //la liste des IDs récupérés dans les objets
    let ids = [];
    objs.forEach( e => ids.push(parseInt(e.id)));
    // on retourne l'ID obtenu à partir de l'ID le plus grand déjà attribué +1
    return Math.max(...ids) + 1;
}