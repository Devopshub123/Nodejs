var mysql = require('mysql');
// /*Switching database connection*/
function switchDatabase(domain) {
    if (domain) {
        return mysql.createConnection({
            host: "192.168.1.78",
            user: "boon_client_user",
            port: 3306,
            password: "Client&*123",
            database: domain,
            dateStrings: true,
            multipleStatements: true

        });

    } else {
        return mysql.createConnection({
            host: "192.168.1.78",
            user: "boon_client_user",
            port: 3306,
            password: "Client&*123",
            database: "boon_client",
            dateStrings: true,
            multipleStatements: true
        });

    }
}

// every five hours database will be hit.this is for continous connection
// setInterval(function () {
//     con.query('SELECT 1')
// }, 18000000);

module.exports = {switchDatabase};