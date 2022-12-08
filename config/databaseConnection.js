var mysql = require('mysql');
var listOfExistedConnections = [];
// /*Switching database connection*/
function switchDatabase() {
        return mysql.createConnection({
            host: "192.168.1.183",
            user: "spryple_client_user",
            port: 3306,
            password: "Client&*123",
            database: 'spryple_client',
            dateStrings: true,
            multipleStatements: true
        });
    
}

async function getNewDBConnection(companyName,dbName)
{

  return new Promise((res,rej)=>{
    var connectionParams = {
      host: "192.168.1.183",
      user: "spryple_client_user",
      port: 3306,
      password: "Client&*123",
      database: dbName,
      dateStrings: true,
      multipleStatements: true
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
  return listOfExistedConnections
}

module.exports = {switchDatabase,getNewDBConnection,checkExistingDBConnection,getConnections};