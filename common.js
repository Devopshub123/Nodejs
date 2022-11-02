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
    getDatebaseName:getDatebaseName,
    getMastertable:getMastertable,
    getErrorMessages:getErrorMessages,
    setErrorMessages:setErrorMessages,

};


 function getDatebaseName(companyName){

    return new Promise((res,rej)=>{
        try {

            con.query('CALL `get_company_db_name` (?)', [companyName], function (err, results, next) {
                if (results && results[0] && results[0].length != 0) {
                    res(results[0][0].db_name);

                } else {
                    res(null)

                }
            })
        }
        catch (e) {
            rej(e)
        }
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
        listOfConnections= connection.checkExistingDBConnection(0,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query('CALL `authenticateuser` (?,?)',[email,password],function(err,results,next){
        //  console.log("firstone",results)
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if (result[0] > 0) {
                listOfConnections[companyName].query('CALL `getemployeeinformation`(?)',[result[0]],function(err,results,next){
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


// /*Get Master table*/
async function getMastertable(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(1,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        var tName = req.params.tableName;
        if(req.params.status=="null"){
            listOfConnections[companyName].query("CALL `getmastertable` (?,?,?,?)",[tName,null,req.params.page,req.params.size], function (err, result, fields) {

                if (result && result.length > 0) {
                    if(tName == 'holidaysmaster'){
                        for (let i=0; i<result[0].length;i++){
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                        }
                        res.send({data: result[0], status: true});


                    }else {
                        res.send({data: result[0], status: true});
                    }
                } else {
                    res.send({status: false})
                }
            });

        }
        else{
            listOfConnections[companyName].query("CALL `getmastertable` (?,?,?,?)",[tName,req.params.status,req.params.page,req.params.size], function (err, result, fields) {
                if (result && result.length > 0) {
                    if(tName == 'holidaysmaster'){
                        for (let i=0; i<result[0].length;i++){
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                        }
                        res.send({data: result[0], status: true});


                    }else {
                        res.send({data: result[0], status: true});
                    }
                } else {
                    res.send({status: false})
                }
            });



        }
    }catch (e) {
        console.log('getMastertable :',e)

    }
}


/*Get Leave Rules*/
async function getErrorMessages(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(2,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        let errorCode;
        if(req.params.errorCode == 'null')
        {
            errorCode = '';
        }
        else {
            errorCode = req.params.errorCode
        }
        listOfConnections[companyName].query("CALL `geterrormessages` (?,?,?)", [errorCode,req.params.page,req.params.size],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('geterrormessages :',e)

    }
}


/*setErrorMessages */
async function setErrorMessages(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body[0].companyName);

        let companyName = req.body[0].companyName;
        let listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(2,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `seterrormessages` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update leave error messages'});
                } else {
                    res.send({status: true, message: 'Messages updated successfully'})
                }
            });


    }catch (e) {
        console.log('seterrormessages :',e)
    }
}