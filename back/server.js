const api = require("./app.js");
const port = 80;

// listen() va requêter le port entré en argument pour faire tourner API
api.listen(port, () => {
    console.log(`L'API tourne sur le port ${port}`);
});