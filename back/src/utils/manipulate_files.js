/*
 * IMPORTS
 */

const { Console } = require('console');
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
    // d'autres error sont possibles, ça retournera par défaut 'erreur interne' = erreur 500
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
 * DOCUMENT
 * fonctions relative au fichier de donnée (lecture/écriture)
 */

/* fonction qui lit un document entré en argument (doc),
 * et affiche les données demandées filtrées selon 0 ou plusieurs filtres
 * le service, la plateforme, un nom entré...
 * c'est donc une fonction de recherche et d'affichage
 */
exports.readFile = (resp, service, platform, id) => {
    // lecture du document
    fs.readFile(document, (error, data) => {
        // si une erreur survient à la lecture
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            // si on a demandé à afficher l'intégralité de la bibliothèque, sans filtre
            if (!platform & !service) {
                resp.status(200).send(existingData);
            } else if (service && !platform && !id){
                // si on n'a demandé à afficher que par service
                resp.status(200).send(existingData[service]);
            } else if (service && platform && !id){
                // si on a demandé à afficher que par service ET plateform
                resp.status(200).send(existingData[service].filter(album => album.platform.toLowerCase() === platform.toLowerCase()));
            } else {
                // si on a demandé à afficher par service et id
                resp.status(200).send(existingData[service].filter(album => album.id === parseInt(id)));
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


exports.searchAlbum = (resp, name, service) => {
    // lecture du document
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            const existingData = JSON.parse(data);
            let filteredData = [];
            // selon qu'on a filtré par service ou non
            if (service) {
                filteredData = existingData[service].filter( 
                    album => this.searchRegex(album.name, name)
                );
            } else {
                const dataArrays = Object.getOwnPropertyNames(existingData);
                dataArrays.forEach( 
                    nameTab => existingData[nameTab].forEach( album => {
                        if (this.searchRegex(album.name, name)){
                            filteredData.push(album);
                        }
                    })
                );
            }
            resp.status(200).send(filteredData);
        }
    });
} // FIN SEARCH ALBUM

exports.addAlbum = (resp, name, artist, platform, service, action, id) => {
    fs.readFile(document, (error, data) => {
        if (this.caseError(error, resp, 'lecture')) {
            return;
        } else {
            let existingData = JSON.parse(data);
            // si le tableau est vide
            if (!existingData[service]) {
                id = 0;
            } else {
                // si un id est spécifié
                if (id) {
                    // on vérifie qu'il n'est pas déjà attribué
                    if(this.checkId(id, existingData[service], resp)) {
                        return;
                    }
                } else {
                     // sinon, on calcule un nouvel ID
                     id = this.defineId(existingData[service]);
                }
                
                // création de l'item
                const album = this.createAlbum(id, name, artist, platform);
                // console.log(existingData[service]);
                // on l'ajoute à la BDD, dans le tableau attendu
                existingData[service].push(album);
                // réécriture des données
                this.writeFile(document, JSON.stringify(existingData), resp, action)
            }
        }
    });
} // FIN ADD ALBUM


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

exports.createAlbum = (id, name, artist, platform) => {
    let album = {"id": parseInt(id), "name": name, "artist": artist};
    // si une plateforme est spécifiée
    if (platform) {
        album["platform"] = platform;
    }
    return album;
}
