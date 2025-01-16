const http = require('http');
const fs = require('fs');

// create the server
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // root route
    if(url === '/') {
        // read blogposts.json to get the blog posts
        fs.readFile('./blogposts.json', 'utf8', (err, data) => {
            if(err){
                if(err.code === 'ENOENT'){ // error no entry found
                    console.error('File not found!!', err.path);
                    res.statusCode = 404;
                    res.write('file not found');
                } else {
                    console.error('Error reading file:', err);
                    res.statusCode = 500;
                    res.write('internal server error');
                }
                return res.end();
            }
            // parse the JSON data
            const blogPosts = JSON.parse(data); // transform json data into usable objects
            
            // start the HTML responses
            res.setHeader('Content-Type', 'text/html'); // inform the browser the type of content about to receive
            res.write('<html>');
            res.write('<head> <title> Blogger-App  </title> </head>');
            res.write(' <body> <h1> Blog Posts </h1>');

            // add a link to create a new post
            res.write('<a href="/create-post">Create a new post</a>');
            res.write('<ul>');

            // iterate over the blog posts and show them to the client
            blogPosts.forEach(post => {
                res.write(`<li> <h2>${post.title}</h2> <p>${post.content}</p>`);
                res.write(`<a href="/edit-post/${post.id}">Edit</a> | <a href="/delete-post/${post.id}">Delete</a>`);
                res.write('</li>');
            });
            
            res.write('</ul>');
            res.write('</body> </html>');
            res.end();
        });
    }

    // create post route
    else if(url === '/create-post'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head> <title> Create a new post </title> </head>');
        res.write('<body>');
        res.write('<h1> Create a new post </h1>');
        res.write('<form action="/save-post" method="POST"> <label for="title"> Title: </label><input type="text" id="title" name="title" placeholder="Enter title" required> <br>');
        res.write(' <label for="content" name="content"> Content: </label> <textarea rows="4" cols="50" id="content" name="content" placeholder="Enter content"></textarea> <br> <button type="submit"> Create Post </button> </form>');
        res.write('</body> </html>');
        return res.end();
    }

    // save post route for submission of new posts
    else if(url === '/save-post' && method === 'POST'){
        let body = []; // empty array to store chunks of data
        req.on('data', (chunk) => { // event listener for data event
            body.push(chunk); // push chunks of data into the body array
        });

        req.on('end', () => { // event listener for the end event when all data has been executed
            const parsedBody = Buffer.concat(body).toString(); // combine the chunks of data into a buffer and convert to string
            const parsedData = new URLSearchParams(parsedBody); // URLSearchParams is the built-in interface providing utility methods to work with URL query strings

            const title = parsedData.get('title'); // extract the title from the parsed data
            const content = parsedData.get('content'); // extract the content from the parsed data

            // generate unique ID for each post
            const newPost = {
                id: Date.now().toString(), // generate unique id
                title: title,
                content: content
            };

            // Read the existing blog posts from blogPosts.json 
            fs.readFile('./blogposts.json', 'utf8', (err, data) => { 
                if (err) { 
                    if (err.code === 'ENOENT') { 
                        console.error('File not found!!', err.path); 
                        res.statusCode = 404;
                        res.write('file not found'); 
                    } else {
                        console.error('Error reading file:', err); 
                        res.statusCode = 500;
                        res.write('internal server error'); 
                    } 
                    return res.end(); 
                }
                const blogPosts = JSON.parse(data);
                blogPosts.push(newPost); // add new posts to the array of posts

                // update posts Array with new posts
                fs.writeFile('./blogPosts.json', JSON.stringify(blogPosts, null, 2), (err) => {
                    if(err) {
                        console.error('Error writing file:', err);
                        res.statusCode = 500;
                        res.write('internal server error');
                        return res.end();
                    }
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                });
            });
        });
    }

    //delete post routes
    else if(url.startsWith('/delete-post') && method === 'GET') {
        const parsedUrl = new URL(url, `http://${req.headers.host}`);
        const postId = parsedUrl.searchParams.get('id');

        //read the existing posts from blogPosts.json
        fs.readFile('blogPosts.json', 'utf8', (err, data) => {
            if(err){
                if(err.code === 'ENOENT'){
                    console.error('File not found!!', err.path);
                    res.statusCode = 404;
                    res.write('file not found');
                    return res.end();
                } else {
                    console.error('Error reading file:', err);
                    res.statusCode = 500;
                    res.write('internal server error');
                }
                return res.end();  
            }
            let posts = JSON.parse(data);
            posts = posts.filter(post => post.id !== postId);

            // Write the updated posts array back to posts.json 
            fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => { 
                if (err) { 
                    console.error('Error writing file:', err); 
                    res.statusCode = 500;
                    res.write('Internal Server Error');
                    return res.end(); 
                } 
                
                // Redirect to the root route to display the updated list of posts 
                res.statusCode = 302; 
                res.setHeader('Location', '/'); 
                return res.end();
            });
        });
    }

    // default response for unknown routes
    else {
        res.statusCode = 404;
        res.write('Page not found');
        res.end();
    }
}); // Correctly closing the createServer callback

server.listen(3000); // Start the server

// res.write('<html>');
// res.write('<head>  <title> </title> </head>');
// res.write('<body> <form action="/create-post" method="POST"> <textarea rows="4" cols="50" name="message"> <button type="submit"> Send </button> </textarea> </form>');
