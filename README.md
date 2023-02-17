Totify
===
Plateforme centrale de gestion et d'écoute de musique
---

> Application centralisant toute la musique de l'utilisateur en provenance d'autres plateformes, ainsi que la musique importée localement.

### Auteur
Diane (Mogw4i)

<br>

# Table des matières
1. [Description](#description)
    1. [Technologies](#technologies)
        1. [Langages](#langages)
        2. [Modules](#modules)
    2. [Fonctionnement](#fonctionnement)
        1. [Projet](#projet)
        2. [Installation](#installation)
2. [Contenu](#contenu)
    1. [Organigramme](#organigramme-du-projet)
    1. [Contenu détaillé](#contenu-détaillé)

<br>
<hr>
<br>

# Description

## Technologies
### **Langages**
|Langage|Bibliothèque(s)|Plateforme logicielle|
|:---|:----|:----|
| JavaScript | jQuery | Node.js |
| HTML |
| CSS |

### **Modules**

| Module | Version | Utilisation |
|----|----|----|
| express | 4.18.2 | Module contenant des fonctionnalités pour les reqûetes HTTP => contient des fonctions telles que get(), use()... |
| fs | 0.0.1-security | Module permettant de manipuler des fichiers |
| body-parser | 1.20.1 | Middleware utile à express ; il lui permet de créer/lire/manipuler des données HTTP POST |
| cors | 2.8.5 | Module permettant d'autoriser une API REST de récupérer les requêtes d'une page web |
| nodemon | 2.0.20 | Module rechargeant automatiquement l'application à chaque changement (sauvegarde) d'un des fichiers qui la composent |


## Fonctionnement

### **Projet**
> **Totify** est une application permettant de gérer et d'écouter ses albums provenant de diverses plateformes (de streaming, d'e-commerce), sur une seule application les centralisant toutes. <br>
> Application **client-serveur**, c'est-à-dire consistant en une partie front et une partie back distinctes. <br>
* La partie **front** est l'interface client permettant de gérer ses albums de musique, en les modifiant, les supprimant, en en ajoutant...
* La partie **back** consiste en une API type traitant des requêtes envoyées par la partie client. L'API va traiter les requêtes en appliquant des actions de type CRUD à la base de données.

### **Installation**
1. Ouvrir un terminal et se positionner dans le dossier ``back`` 
2. Vérifier que **Node.js** est installé en entrant la commande suivante dans un terminal (situé dans le dossier) <br>
```
node -v
```
3. Lancer **l'API** back-end
```
npm start
```
- ``rs`` pour redémarrer
- ``CTRL+C`` pour quitter
3. Aller dans le dossier view et ouvrir le dashboard : **index.html**

<br>

# Contenu

## Organigramme du projet

<br>

```mermaid
graph TD
    AA --> B[src]
    B --> K[controller]
    B --> L[model]
    B --> M[routes]
    B --> N[utils]
    K --> O(generic_controller.js)
    L --> P(data.json)
    M --> Q(generic_routes.js)
    N --> R(manipulate_files.js)
    AA --> T(package.json)
    AA --> U(package-lock.json)
    AA --> D(app.js)
    AA --> E(server.js)
    C[view] --> F[scripts]
    A[racine] -->  AA[back]
    A --> BB[front]
        A --> S(README.md)
    BB --> C[view]
    C[view] --> G[style]
    C[view] --> V[imgs]
    C[view] --> W[html]
    W --> X(index.html)
    W --> Y(maintenance.html)
    W --> Z(search.html)
    W --> WW(manage_albums.html)
    W --> WX(library.html)
    G[style] --> H(root.css)
    G[style] --> I(style.css)
    F[scripts] --> J(main.js)
    
    
```

<br>

## Contenu détaillé

### /
| Fichier | Description |
|---|---|
|**app.js**|Point d'entrée de l'application|
|**server.js**|Support de lancement de l'application|
|package.json|Description technique de l'application

### /src
| Dossier | Fichier | Description |
|---|---------|---|
| /controller | **generic_controller.js** | Fonctions du **CRUD** (Create, Read, Update) pour les requêtes |
| /model | **data.json** | Jeu de données de l'application : le JSON contient 3 tableaux : un pour les albums accessibles via des plateformes nécessitant un abonnement (**membership**), un pour la musique importée par l'utilisateur (**local**), un pour les albums achetés sur des plateformes spécifies. |
| /routes | **generic_routes** | Routes **dynamiques** pour les requêtes. Verbes utilisés : **Post**, **Get**, **Put** et **Delete**
| /utils | **manipulate_files.js** | Fichier contenant toutes les **fonctions** réutilisables du controller

### /view
| Dossier | Fichier | Description |
|---|--------------|---|
| /html | - **index.html** <br> - **maintenance.html** <br> - **search.html** <br> - **library.html** <br> - **manage_albums.html** | __index.html__ : accueil de l'**interface** client <br> __maintenance.html__ : page par défaut quand **404 not found** <br> __search.html__ : page de **résultats de la recherche** dans la barre de recherche <br> __library.html__ : page qui affiche toute la bibliothèque de l'utilisateur <br> __manage_albums.html__ : page de gestion des albums |
| /scripts |**main.js**| Fichier contenant toutes les **fonctions** de traitement des requêtes côté client <=> lien avec l'API back-end |
| /style | - **root.css** <br> - **style.css** | **Feuilles de style** de l'interface client <br> __root.css__ contient toute la base du design (couleurs...) et le design des objets réutilisables (boutons, menus...) ainsi que des parties du site récurrentes (footer, nav...) <br> __style.css__ contient la mise en page globale |

Le dossier **/imgs** contient les images affichées sur le site.
