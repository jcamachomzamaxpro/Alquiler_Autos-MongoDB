require('dotenv').config();
const Server = require('./app');

const server = new Server();

server.listen();


