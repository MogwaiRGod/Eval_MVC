const api = require("./app.js");
const port = 3000;

// listen() va requêter le port entré en argument pour faire tourner API
api.listen(port, () => {
    console.log(`L'api tourne sur le port ${port}`);
});