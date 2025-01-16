
const http = require('http'); //import global module htp


const routes = require('./routes');


// creating the server
const server = http.createServer(routes);

server.listen(3000); 