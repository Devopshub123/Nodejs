var bodyParser = require('body-parser');
var express = require('express');
var app = new express();
var fs = require('fs');
var path = require('path');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer')
var crypto = require("crypto");
var algorithm = "aes-256-cbc";
// generate 16 bytes of random data
var initVector = crypto.randomBytes(16);
var Securitykey = crypto.randomBytes(32);
var attendance= require('./attendance-server');
var leaveManagement = require('./leave-management')
var file
var url = require('url');

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
var connection = require('./config/databaseConnection')

var con = connection.switchDatabase();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(fileUpload())
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});


module.exports = {
login:login,
getDatebaseName:getDatebaseName

};


function getDatebaseName(companyName){

    return new Promise((res,rej)=>{

        con.query('CALL `get_company_db_name` (?)',[companyName],function(err,results,next){
            // console.log("res",results)
            if(results && results[0]&&results[0].length !=0){
                res(results[0][0].db_name) ;
        
            }else {
                res(null)
        
            }                    
        })
    });
   
}






async function login(req,res){
    try{
    
    var  dbName = await getDatebaseName(req.body.companyName)
     var email = req.body.email;
        var password = req.body.password;
        var companyName = req.body.companyName;
        // console.log("single",req.body)

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query('CALL `authenticateuser` (?,?)',[email,password],function(err,results,next){
        //  console.log("firstone",results)
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if (result[0] > 0) {
                listOfConnections[companyName].query('CALL `getemployeeinformation`(?)',[email],function(err,results,next){
                    // console.log("firstTwo",results)
                    try{
                        if(results.length>0){
                            var result = JSON.parse(results[0][0].result)
                            res.send({status: true,result})

                        }
                        else{
                            res.send({status: false,result})
                        }
                    }
                    catch (e){
                        console.log("employee_login",e)
                    }
                })
            }
            else{
                res.send({status: false,message:"Invalid userName or password"})
            }
        });
    }
    catch (e){
        console.log("employee_login",e)
    }
}


