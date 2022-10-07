var mysql = require('mysql');
// /*Switching database connection*/
function switchDatabase() {
        return mysql.createConnection({
          // host: "192.168.1.28",
            // host: "122.175.62.210",
            // user: "boon_client_user",
            // port: 3306,
            // password: "Client&*123",
            // database: 'ems',
            //database:'boon_client',

            host:'ec2-13-126-146-217.ap-south-1.compute.amazonaws.com',
            user:'spryple_client_user',
            port: 3306,
            password:'Client&*123',
            database: 'ems',
            dateStrings: true,
            multipleStatements: true
        });
    
}

// every five hours database will be hit.this is for continous connection
// setInterval(function () {
//     con.query('SELECT 1')
// }, 18000000);

module.exports = {switchDatabase};