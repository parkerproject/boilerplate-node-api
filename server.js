require('dotenv').config();

const Hapi = require('hapi');
const routes = require('./controllers');


const envset = {
  production: process.env.NODE_ENV === 'production',
};

const host = envset.production ? process.env.HOSTNAME : 'localhost';
const port = envset.production ? process.env.PORT : 3000;
const server = new Hapi.Server();

server.connection({ host, port });

// Start the server
server.route(routes);
server.start(() => console.log(`Server started at: ${server.info.uri}`));
