const http = require('http');
const url = require('url');

http.createServer((req, res) => {
    const pathname = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('URI: ' + pathname + '\n');

    res.write('Queries:\n');
    for (const [key, value] of Object.entries(query)) {
        res.write(`${key}: ${value}` + '\n');
    }

    res.end();
}).listen(8080);