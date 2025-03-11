const http = require('http'); // HTTP Formatting and Usage
const url = require('url'); // URL Parsing

/* Creates a local server at the specified port */
http.createServer((req, res) => {
    /* Gets information about any client requests made to server */
    const pathname = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;

    /* Parses the path name into constituent components */
    let pathHierarchy = pathname.split('/');
    let lengthsOfFields = pathHierarchy.map((field) => field.length);
    let maxLength = lengthsOfFields.reduce((previousValue, currentValue) =>
        Math.max(previousValue, currentValue), -Infinity);

    /* Do tasks regarding URI */

    /* Formats the response message body to be plain text */
    res.writeHead(200, {'Content-Type': 'text/plain'});

    /* Prints the URI information of the client request onto the body */
    res.write('URI: ' + pathname + '\n');
    res.write('Path Hierarchy: \n');
    for (const directory of pathHierarchy) {
        res.write(directory.padEnd(maxLength, ' ') + '/ \n');
    }
    res.write('Queries:\n');
    for (const [key, value] of Object.entries(query)) {
        res.write(`${key}: ${value}` + '\n');
    }

    /* Ends the response message body */
    res.end();
}).listen(8080);