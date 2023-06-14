var mysql = require('mysql');
var listOfExistedConnections = [];
// /*Switching database connection*/
function switchDatabase() {
  return mysql.createConnection({
    /** Local */
          /** online build */
          // host: "192.168.1.10",
          host: "122.175.62.210",
          user: "spryple_client_user",
          password: "Client&*123",
          database: 'spryple_product_dev',
    
          /** offline build */
          //  host: "localhost",
          //  user: "client_user",
          //  password: "fN3VlQ@pjQj}*P0o*Z|{",
          //  database: 'spryple_hrms',
           
            port: 3306,
            dateStrings: true,
            multipleStatements: true

     /** AWS */
    //  host: "65.0.224.72",
    //  user: "root",
    //   port: 3306,
    //   password: "Sreebaw$1103",
    //   database: 'spryple_sreeb',
    //   dateStrings: true,
    //  multipleStatements: true
     
 });
    
}

async function getNewDBConnection(companyName,dbName)
{

  return new Promise((res,rej)=>{
    var connectionParams = {
      /**online build */
      
      // host: "192.168.1.10",
      host: "122.175.62.210",
      user: "spryple_client_user",
      password: "Client&*123",
      
       /**offline build */
      // host: "localhost",
      // user: "client_user",
      // password: "fN3VlQ@pjQj}*P0o*Z|{",

      port: 3306,
      database: dbName,
      dateStrings: true,
      multipleStatements: true

      /** AWS */
      // host: "65.0.224.72",
      // user: "root",
      //  port: 3306,
      //  password: "Sreebaw$1103",
      //  database: dbName,
      //  dateStrings: true,
      //  multipleStatements: true
  };
    var con;
    con = mysql.createConnection(connectionParams);
    let one = {};
    one[companyName]=con;
     listOfExistedConnections.push(one); 
     res(con)
   
  })
    //  con.connect(function(err) {
    //      if (err) throw err;
    //     //  console.log("Con?nect",con);
    //  });   
}

function checkExistingDBConnection(companyName) {
  var result = {};
  result.succes=false;
    if(listOfExistedConnections.length == 0)
    {
      result.succes = false
    }
    else {
    listOfExistedConnections.forEach(function(element,key) {
        for(var keyVal in element){
          if(keyVal === companyName){
            result[keyVal]=element[keyVal];
            result.succes=true
            break;
        }
        }
      
    });
    }
    return result;
}


function getConnections()
{
  console.log("ExistConnections",listOfExistedConnections)
  return listOfExistedConnections
}

module.exports = {switchDatabase,getNewDBConnection,checkExistingDBConnection,getConnections};