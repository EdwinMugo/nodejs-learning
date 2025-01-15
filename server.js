
const http = require('http'); //import global module htp
const fs = require('fs'); //import global module


// http.createServer(function(req, res){

// });

// creating the server
const server = http.createServer((req, res)=>{
   const url = req.url; //retrieve he url of the request
   const method = req.method; //retrieve HTTP method of the request

// handling Root route if the url='/' it serves the form
   if (url === '/') {
   res.write('<html> ');
   res.write('<head> <title> Enter Message </title> </head>');
   res.write('<body> <form action="/message" method="POST"> <input type="text" name="message"> <button type="submit"> Send </button> </input> </form> </body> </html>');
   return res.end();
   }

//    handling the '/message' route
   if(url === '/message' && method === 'POST') {
    const body = []; //empty array to store the chunks of data
    req.on('data', (chunk) => { // event listener for the data event
        console.log(chunk);
      body.push(chunk); //push chunks of data to the body array
    }); // on allows us to listen to events
    req.on('end', () => { //listen to the end event when all data has been received
        const parsedBody = Buffer.concat(body).toString(); //combine the chunks into a single buffer and converts to string
        const message = parsedBody.split('=')[1].replace(/\+/g, ' ');
        fs.writeFileSync("message.txt", message);
    })
      fs.writeFileSync("message.txt", "Dummy Message");
      res.writeHead(302, {'Location': '/'});
      return res.end();

   }
   res.setHeader('Content-Type', 'text/html');
   res.write("<html> ");
   res.write('<head> <title> My first Page </title> </head>');
   res.write("<body> <h1>Hello World! from Sever!!!</h1> </body> </html>");
   res.end();
});

server.listen(3000); 