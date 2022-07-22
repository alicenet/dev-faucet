const { startExpressServer } = require('./express_server');

require('dotenv').config();

main();

async function main() {
    startExpressServer();
} 