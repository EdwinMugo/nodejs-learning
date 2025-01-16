const fs = require('fs'); //import global module


const requestHandler = (req, res) => {

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

         fs.writeFile("message.txt", message, err => {
            if(err){
                console.error(err);
                res.statusCode = 500;
                res.write('internal Server Error');
                return res.end();
            }
        if(!res.headersSent){
         res.statusCode = 302;
         res.setHeader('Location', '/');
         return res.end();
        }
         });
     });
       
    
    } else{
        res.setHeader('Content-Type', 'text/html');
        res.write("<html> ");
        res.write('<head> <title> My first Page </title> </head>');
        res.write("<body> <h1>Hello World! from Sever!!!</h1> </body> </html>");
        res.end();
    }
   

};

module.exports = requestHandler; //export the request handler function for use in server.js
