const http = require('http'); // Import the built-in HTTP module for creating servers.
const fs = require('fs'); // Import the built-in File System (FS) module for file operations.

// creating the server instance
const server = http.createServer((req, res) => {
    const url = req.url; //intended url
    const method = req.method; //intended method

    if (url === '/') {
        res.write('<html> ');
        res.write('<head> <title> Enter To-Do </title> </head>');
        res.write('<body>');
        res.write('<h1>To-Do List</h1>');
        res.write('<form action="/add-todo" method="POST"> <input type="text" name="todo"> <button type="submit"> Add </button> </form>');

        // Read and display the to-do items
        let todos = [];
        if (fs.existsSync('todos.txt')) { //check if the todos.txt file exists
            todos = fs.readFileSync('todos.txt', 'utf-8').split('\n').filter(Boolean); // filter boolean ensures that only non-empty items are kept in the array
        }
        res.write('<ul>');
        todos.forEach(todo => {
            res.write('<li>' + todo + '</li>');
        });
        res.write('</ul>');

        res.write('</body> </html>');
        return res.end();
    }

    if (url === '/add-todo' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const todo = parsedBody.split('=')[1].replace(/\+/g, ' ');
            fs.appendFileSync('todos.txt', todo + '\n'); // Append the to-do item to the file
        });

        res.writeHead(302, { 'Location': '/' });
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html');
    res.write("<html> ");
    res.write('<head> <title> My first Page </title> </head>');
    res.write("<body> <h1>Hello World! from Server!!!</h1> </body> </html>");
    res.end();
});

server.listen(3000);
