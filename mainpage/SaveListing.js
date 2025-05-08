const saveListing = function (request, response) {
    const requestMessage = {};
    const dBConnection = initiateDBConnection(host, user, password, database);
    const sqlInsert = 'INSERT INTO savedroommatelistings (userid, postid) VALUES (?, ?)';

    let body = '';

    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', () => {
        try {
            const data = JSON.parse(body);
            const { userid, listingid } = data;

            if (!userid || !listingid) {
                requestMessage.message = 'Missing userid or listingid';
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(requestMessage));
                return;
            }

            dBConnection.connect(error => {
                if (error) throw error;

                dBConnection.query(sqlInsert, [userid, listingid], (err, result) => {
                    if (err) {
                        requestMessage.message = 'Insert failed';
                        requestMessage.sql_error = err.sqlMessage;
                        response.statusCode = 500;
                    } else {
                        requestMessage.message = 'Saved successfully';
                        response.statusCode = 200;
                    }

                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(requestMessage));
                    dBConnection.end();
                });
            });
        } catch (e) {
            response.statusCode = 400;
            response.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};