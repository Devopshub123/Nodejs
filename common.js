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
const jwt = require('jsonwebtoken');

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
    getEmployeeInformation:getEmployeeInformation,
    editProfile:editProfile,
    forgetpassword:forgetpassword,
    resetpassword:resetpassword,
    changePassword: changePassword,
    errorLogs:errorLogs
};
/**generate JWT token  */
function generateJWTToken(info){
    return new Promise((res,rej)=>{
        try{
            res(jwt.sign({ id: info.id, email: info.email }, "HRMS", { expiresIn: "24h", }));
        }
        catch(e){
            rej(e);
        }
    });
    
}

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


/**
 * Login
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




async function login(req,res){
    try{

    var  dbName = await getDatebaseName(req.body.companyName);

     var email = req.body.email;
        var password = req.body.password;
        var companyName = req.body.companyName;
            var listOfConnections = {};
        if (dbName && dbName!=null) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query('CALL `authenticateuser` (?,?)', [email, password], async function (err, results, next) {
                var result = results ? results[0] ? results[0][0]? Object.values(JSON.parse(JSON.stringify(results[0][0]))):null:null:null;
                if (result && result[0] > 0) {
                    var info = {
                        id:result[0],
                        email:email
                        
                    }
                    var  token = await generateJWTToken(info)
                    listOfConnections[companyName].query('CALL `getemployeeinformation`(?)', [result[0]], function (err, results, next) {
                        try {
                            if (results && results.length > 0) {
                                var result = JSON.parse(results[0][0].result)
                                res.send({status: true, result,token:token})
                            }
                            else {
                                res.send({status: false})
                            }
                        }
                         
                        catch (e) {
                            console.log("employee_login", e)
                        }
                    })
                }
                else {
                    res.send({status: false, message: "Invalid userName or password"})
                }
            });
        }else {
            res.send({status: false, message: "dbnotthere"})
        }
     }
    catch (e){
        console.log("employee_login",e)
    }
}


/**
 * getMastertable is generic procedure
 * @param req(tName,page, size)
 * @param res
 * @returns {Promise<void>}
 */
async function getMastertable(req, res) {
    console.log("req.params",req.params)
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
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
    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('getMastertable :',e)

    }
}


/**Error messages
 * @errorCode
 * @page
 * @size
 * */
async function getErrorMessages(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
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


    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('geterrormessages :',e)

    }
}


/**
 * setErrorMessages is used to inserted error messages
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function setErrorMessages(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body[0].companyName);

        let companyName = req.body[0].companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
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


    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('seterrormessages :',e)
    }
}



async function getEmployeeInformation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getemployeemaster` (?)",[req.params.Id], function (err, result, fields) {
            if(result && result.length > 0){
                res.send({data: result[0], status: true});
            }else{
                res.send({status: false});
            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('getEmployeeInformation :',e)

    }

}



async function editProfile(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName);

        let companyName = req.body.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `edit_profile` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.firstName,req.body.middlename,req.body.lastName,req.body.email,req.body.contact,req.body.address,req.body.cityId,req.body.stateId,req.body.zipCode,req.body.countryId], function (err, result, fields) {
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true,leaveStatus:req.body.leaveStatus})
                }
            });


    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('editProfile :',e)
    }

}


/**verify email for forget password */
async function forgetpassword(req, res, next) {
    let email = req.params.email;
    try {
        let  dbName = await getDatebaseName(req.params.companyName);

        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query('CALL `getemployeestatus`(?)', [email], function (err, result) {
            let data = result[0][0]
            if (data === undefined) {
                res.send({ status: false,message:"notvalid" })
            }
            else if (data.status == 1) {
                let id = data.id;
                const message = email;
                var transporter = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com", // hostname
                    secureConnection: false, // TLS requires secureConnection to be false
                    port: 587, // port for secure SMTP
                    tls: {
                        ciphers: 'SSLv3'
                    },
                    auth: {
                        user: 'no-reply@spryple.com',
                pass: 'Sreeb@#321'
                    }
                });
                var token = (Buffer.from(JSON.stringify({companyName:req.params.companyName,id:id,email:req.params.email,date:new Date()}))).toString('base64')

                var url = 'http://localhost:4200/#/ResetPassword/'+token
                // var url = 'http://122.175.62.210:7575/#/ResetPassword/' + token
                var html = `<html>
                    <head>
                    <title>HRMS ResetPassword</title></head>
                    <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
                    <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
                    <p style="color:black">Hello!,</p>
                    <p style="color:black">You recently requested to reset the password to your HRMS account<b></b></p>
                    <p style="color:black"> To set a new password, click here.</p>
                    <p style="color:black"> <a href="${url}" >${url}</a></p>
                    <p style="color:black"> Didn’t request a password change? Ignore this email.</p>
                    <p style="color:black">Thank You!</p>
                    <p style="color:black">Human Resources Team.</p>
                    <hr style="border: 0; border-top: 3px double #8c8c8c"/>
                    </div></body>
                    </html> `;
                var mailOptions = {
                    from: 'no-reply@spryple.com',
                    to: email,
                    subject: 'Reset Password',
                    html: html
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send({ status: false, message: 'reset password successfully' })
                    } else {
                        res.send({ status: true, message: 'reset password successfully' })
                    }
                });
            }
        });
    }else {
            res.send({status: false,message:'datanotthere'})
    }
     }
    catch (e) {
        console.log("forgetpassword", e)
    }
}


/**reset password */
async function resetpassword(req, res, next) {
    let id = req.body.empid;
    let email = req.body.email;
    let password = req.body.newpassword;
    try {

        let  dbName = await getDatebaseName(req.body.companyName);
        let companyName = req.body.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query('CALL `setemployeelogin`(?,?,?,?,?)', [id, email, password, 'active', 'N'], function (err, result) {
           if (err) {
                console.log(err)
            }
            else {
                res.send({ status: true, message: 'reset password successfully' })


            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    }
     }
    catch (e) {
        console.log("resetpassword", e)
    }
}


/**Change Password */
async function changePassword(req,res){
    let oldpassword = req.body.oldPassword;
    let newpassword = req.body.newPassword;
    let id = req.body.empId;
    let login = req.body.email;
    try{
        let  dbName = await getDatebaseName(req.body.companyName);
        let companyName = req.body.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query('CALL `validatelastpasswordmatch` (?,?,?,?)',[id,login,oldpassword,newpassword],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if(result[0]==0){
                listOfConnections[companyName].query('CALL `setemployeelogin`(?,?,?,?,?)',[id,login,newpassword,'Active','N'],function(err,result){
                    if(err){
                        console.log(err)
                    }
                    else{
                        let results =[0]
                        res.send(results)
                    }
                })

            }
            else if(result[0]==-1){
                res.send(result)
            }
            else{
                res.send(result)

            }

        });
    }else {
            res.send({status: false,Message:'Database Name is missed'})
    }}
    catch(e){
        console.log("changepassword",e)
    }

}

/** error logs */
function errorLogs(errorLogArray) {
    console.log("dat==",JSON.stringify(errorLogArray[3]))
    return new Promise(async (res,rej)=>{
       try {
           let companyName =errorLogArray[6];
           let dbName = errorLogArray[7];
           listOfConnections= connection.checkExistingDBConnection(companyName)
           if(!listOfConnections.succes) {
               listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
           }
               listOfConnections[companyName].query(  "CALL `set_error_logs` (?,?,?,?,?,?)",
               [
                errorLogArray[0], errorLogArray[1], errorLogArray[2], JSON.stringify(errorLogArray[3]),errorLogArray[4], errorLogArray[5]
               ],
             function (err, result, fields) {
              if (result) {
                       res({ status: true });
                   } else {
                       res({ status: false })
                   }
               });
           }
         catch (e) {
           rej(e)
       }
   });

}
