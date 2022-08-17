const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
module.exports.startExpressServer = async () => {

    const app = express();
    app.use(cors()); // Allows all calls *
    app.use(express.json())

    // Create endpoints
    const endpointNames = await fs.readdir(__dirname + "/endpoints");
    // Parse endpoints
    console.log("\nAPI Endpoints Below\n")
    endpointNames.forEach(endpointName => { 
        let endpointParsed = endpointName.replaceAll("-", "/")
        let slashFragments = endpointParsed.split("/");
        let endpointType = slashFragments[0];
        slashFragments.shift(); // Remove type
        let endpoint = "/" + slashFragments.join("/").replace(".js", "");
        app[endpointType](endpoint, require(__dirname + "/endpoints/" + endpointName));
        console.log(`${endpointType} ➞ ${endpoint}`);
    })

    app.listen(process.env.API_PORT_NUMBER, () => {
        console.log(`\nFaucet API listening on port ${process.env.API_PORT_NUMBER}`)
    })

}