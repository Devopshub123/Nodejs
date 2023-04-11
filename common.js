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
    errorLogs:errorLogs,
    getCommonSideNavigation:getCommonSideNavigation,
    setSpryplePlan:setSpryplePlan,
    getMinUserForPlan:getMinUserForPlan,
    getAllModules:getAllModules,
    Validateemail:Validateemail,
    setSprypleClient:setSprypleClient,
    setPlanDetails:setPlanDetails,
    getSpryplePlans:getSpryplePlans,
    getSpryplePlanCostDetails: getSpryplePlanCostDetails,
    contactUsFormMail: contactUsFormMail,
    getPayments: getPayments,
    getSprypleClients: getSprypleClients,
    addUsers: addUsers,
    getRenewalDetails: getRenewalDetails,
    getClientPlanDetails:getClientPlanDetails,
    getUsers:getUsers,
    enableRenewButton:enableRenewButton,
    renewUsers:renewUsers,
    addUsersDisplayInfo:addUsersDisplayInfo,
    renewUsersDisplayInformation:renewUsersDisplayInformation,
    getClientPaymentDetails:getClientPaymentDetails,
    changeClientPlan:changeClientPlan,
    getClientDetails: getClientDetails,
    agreement:agreement,
    getUnverifiedSprypleClient: getUnverifiedSprypleClient,
    getSpryplePlanDetailsById: getSpryplePlanDetailsById,
    getSprypleClientDetailsByClientId: getSprypleClientDetailsByClientId,
    getPaymentsDetailsByClientId: getPaymentsDetailsByClientId,
    getPaymentInvoiceDataByPaymentid: getPaymentInvoiceDataByPaymentid,
    getAllSprypleClientDetails:getAllSprypleClientDetails
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
                console.log(results)
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




async function login(req, res) {
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
                var result = results ? results[0] ? results[0][0] ? Object.values(JSON.parse(JSON.stringify(results[0][0]))) : null : null : null;
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
                let login = data.login;
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
                var token = (Buffer.from(JSON.stringify({companyName:req.params.companyName,id:id,email:login,date:new Date()}))).toString('base64')

                // var url = 'http://localhost:4200/#/ResetPassword/'+token
                
                var url = 'http://122.175.62.210:7575/#/ResetPassword/' + token

                 /**AWS */
                //  var url = 'https://sreeb.spryple.com/#/ResetPassword/' + token;

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
        listOfConnections[companyName].query('CALL `validatelastpasswordmatch` (?,?,?,?)',[id,email,null,password],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if(result[0]==0){
                listOfConnections[companyName].query('CALL `setemployeelogin`(?,?,?,?,?)',[id, email, password,'Active','N'],function(err,result){
                    if(err){
                        console.log(err)
                    }
                    else{
                        let results =[0]
                        res.send({ status: true, message: 'reset password successfully' })
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
        // listOfConnections[companyName].query('CALL `setemployeelogin`(?,?,?,?,?)', [id, email, password, 'active', 'N'], function (err, result) {
        //     console.log("err",err)
        //     console.log("ress",result)
        //     if (err) {
        //         console.log(err)
        //     }
        //     else {
        //         res.send({ status: true, message: 'reset password successfully' })


        //     }
        // });

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

async function getCommonSideNavigation(req, res) {
    let companyName = req.body.companyName||'';
    try {
        let dbName = await getDatebaseName(req.body.companyName)
        let self = 'Employee';
        // For errorlog
        let errorLogArray = [];
            errorLogArray.push("COMMONAPI");
            errorLogArray.push("getCommonSideNavigation");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.body));

       var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_screens_for_employee` (?)", [req.body.empid], async function (err, result, fields) {
                if (err) {
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs = await errorLogs(errorLogArray);  
                    res.send({ status: false, message: "unableToGetData" });      
                }
                else{
                    if (result && result.length > 0) {
                        for(let i=0;i<result[0].length;i++){ 
                            result[0][i].displayStatus = false;
                            result[0][i].parentRoles = [];
                            result[0][i].children = [];
                            if(result[0][i].menu_items){
                                result[0][i].menu_items =JSON.parse(result[0][i].menu_items);
                                result[0][i].parentRoles = result[0][i].menu_items.map(v => v.role_name).filter((value, index, self) => self.indexOf(value) === index);
                                
                                for(let pr=0;pr<result[0][i].parentRoles.length;pr++){
                                    result[0][i].children[pr] = {displayName:result[0][i].parentRoles[pr], isOpen:!!(result[0][i].parentRoles[pr]===self) ,subChildren:[]};
                                    for(let j=0;j<result[0][i].menu_items.length;j++){
                                        if(result[0][i].parentRoles[pr] === result[0][i].menu_items[j].role_name){
                                            result[0][i].menu_items[j].functionalities = result[0][i].menu_items[j].functionalities? JSON.parse(result[0][i].menu_items[j].functionalities):{};
                                            result[0][i].children[pr].subChildren.push(result[0][i].menu_items[j]);
                                        }
                                    }
                                }

                            } else  result[0][i].menu_items ={};    
                            
                        }

                         res.send({ data: result[0], status: true });
         
                     } else {
                         res.send({ status: false })
                     }
                }
            });
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        } 
    } 
    catch (e) {
        let dbName = await getDatebaseName(req.body.companyName)
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName||'');
        errorLogArray.push(dbName||"");
        errorLogs = await errorLogs(errorLogArray);
        }
};




/*setSpryplePlan for master screen*/
async function getAllModules(req, res) {
    try{
        // var  dbName = 'spryple_hrms';
        // var companyName = 'spryple_hrms';
        var  dbName = 'spryple_qa';
        var companyName = 'spryple_qa';
        console.log('spryple_qa',req.body)
        var listOfConnections = {};
        if (dbName && dbName!=null) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query('CALL `getmastertable` (?,?,?,?)', ['modulesmaster', null,0,0], async function (err, result, next) {
                if (result && result.length > 0) {
                    res.send({data: result[0], status: true});
                } 
                else {
                    res.send({status: false})
                }
               
            });
        }else {
            res.send({status: false, message:'Database Name is missed'})
        }
     }
    catch (e){
        console.log("setSpryplePlan",e)
    }
}
/**getMinUserForPlan for plan details */
async function getMinUserForPlan(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        console.log("planmnmdnbdc",req.params.planid,dbName)
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_min_user_for_plan` (?)",[req.params.planid], function (err, result, fields) {
            console.log("result",result,err)
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
// getAllModules
async function setSpryplePlan(req,res) {
    try {
        // let  dbName = await getDatebaseName(req.body.companyName);
        // let companyName = req.body.companyName;
        // var  dbName = 'spryple_hrms';
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        // let companyName = req.body.companyName;
        let listOfConnections = {};
        console.log("datya",req.body)
        console.log("datya",JSON.stringify(req.body.modules))
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_spryple_plan` (?,?,?,?)",[req.body.plan,JSON.stringify(req.body.modules),req.body.created_by,req.body.id], function (err, result, fields) {
            if(err){
            res.send({status:false,message:"Unable to add "})

           }
           else if (result[0][0] == 1){
            res.send({status:true,message:"Record already inserted."});
           }
           
           else{
            console.log(result[0][0])
            res.send({status:false,message:"Record already existed."});
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('getEmployeeInformation :',e)

    }

}
async function Validateemail(req, res) {
    let companyCode = req.body.company_code_value;
    let email = req.body.company_email_value;
    let companyName = 'spryple_hrms';
    let  dbName = await getDatebaseName('spryple_hrms');
    let validatecompanycode = await validateCompanyCode(companyCode,email);
    if(validatecompanycode){
        try{
        if(dbName) {
            listOfConnections= await connection.checkExistingDBConnection(companyName);
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `set_unverified_spryple_client` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    req.body.company_name_value,
                    req.body.company_code_value,
                    req.body.company_size_value,
                    req.body.number_of_users_value,
                    req.body.plan_id_value,
                    req.body.industry_type_pm,
                    req.body.industry_type_value_pm,
                    req.body.mobile_number_value,
                    req.body.company_email_value,
                    req.body.contact_name_value,
                    req.body.company_address1_value,
                    req.body.company_address2_value,
                    req.body.country_id_value,
                    req.body.state_id_value,
                    req.body.city_id_value,
                    req.body.pincode_value,
                    req.body.gst_number_value,
                    req.body.agree_to_terms_and_conditions_value,
                    req.body.steps_completed_value,
                    req.body.id_value,
                    req.body.created_by_value
            ]
        , function (err, result, fields) {
           if(err){
            res.send({status:false,message:"Unable to add "})
           }
           else{
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
            var token = (Buffer.from(JSON.stringify({ companycode:companyCode, email: email,Planid:1,PlanName:'Basic',Date:new Date()}))).toString('base64')
            /**Local */
            var url = 'http://localhost:4200/#/sign-up/' + token;
            /**QA */
            //    var url = 'http://122.175.62.210:7575/#/pre-onboarding/'+token;
            /**AWS */
        //    var url = 'http://sreeb.spryple.com/#/pre-onboarding/' + token;  // <p style="color:black">Human Resources Team.</p>
        //         <p style="color:black"> Please make it a note that, the below link can be deactivated in 24 Hours.</p>

            var html = `<html>
        <head>
        <title>Candidate Form</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
        <p style="color:black">Dear Customer,</p>
        <p style="color:black">We are excited to have you sign up with Spryple and are looking forward to work with you. Click on the link below to complete your registration process.Please fill your details and submit the form.<b></b></p>
        <p style="color:black"> <a href="${url}" >${url} </a></p>   
        <p style="color:black"> If you experience any issues when accessing the above link, please reach out to <b>hr@sreebtech.com</b>  </p>  
        <p style="color:black">Thank you!</p>
      
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;
            var mailOptions = {
                from: 'no-reply@spryple.com',
                to: email,
                subject: 'Welcome to Spryple',
                html: html
            };
           transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send({ status: false ,message:"Please enter a valid Email."});
                } 
                else {
                    res.send({ status: true,message: "Verified your email.Please check your mail." });
                }
            });
           }
        });

    }
            
        }
     
    catch (e){
        console.log("employee_login",e)
    }
    }
    else{
        res.send({status:false,message:'company code already existed.'})
    }
   
}
/** client signup  */
async function setSprypleClient(req, res) {
    try {
        let companyCode = req.body.company_code_value;
        let toEmail = req.body.company_email_value;
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
       if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `set_unverified_spryple_client` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    req.body.company_name_value,
                    req.body.company_code_value,
                    req.body.company_size_value,
                    req.body.number_of_users_value,
                    req.body.plan_id_value,
                    req.body.industry_type_pm,
                    req.body.industry_type_value_pm,
                    req.body.mobile_number_value,
                    req.body.company_email_value,
                    req.body.contact_name_value,
                    req.body.company_address1_value,
                    req.body.company_address2_value,
                    req.body.country_id_value,
                    req.body.state_id_value,
                    req.body.city_id_value,
                    req.body.pincode_value,
                    req.body.gst_number_value,
                    req.body.agree_to_terms_and_conditions_value,
                    req.body.steps_completed_value,
                    req.body.id_value,
                    req.body.created_by_value
                 ],
                function (err, result, fields) {
           if(err){
            res.send({status:false})
           }
           else {
               
               res.send({ status: true }) 
               
        //     var transporter = nodemailer.createTransport({
        //         host: "smtp-mail.outlook.com", // hostname
        //         secureConnection: false, // TLS requires secureConnection to be false
        //         port: 587, // port for secure SMTP
        //         tls: {
        //             ciphers: 'SSLv3'
        //         },
        //         auth: {
        //             user: 'no-reply@spryple.com',
        //             pass: 'Sreeb@#321'
        //         }
        //     });
        //     var token = (Buffer.from(JSON.stringify({ companycode:companyCode, email: toEmail}))).toString('base64')
        //     /**Local */
        //     var url = 'http://localhost:4200/#/Admin/upgrade-plan/' + token;
        //     /**QA */
        //     //    var url = 'http://122.175.62.210:7575/#/pre-onboarding/'+token;
        //     /**AWS */
        //     // var url = 'http://sreeb.spryple.com/#/pre-onboarding/' + token;
        //       var html = `<html>
        // <head>
        // <title>Candidate Form</title></head>
        // <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        // <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
        // <p style="color:black">Dear Customer,</p>
        // <p style="color:black">"We are excited to have you sign up with Spryple and are looking forward to work with you.Click on the link below,choose your plan and take subscription."<b></b></p>
        // <p style="color:black"> <a href="${url}" >${url} </a></p>   
        // <p style="color:black"> If you experience any issues when accessing the above link, please reach out <b>hr@sreebtech.com</b>  </p>  
        // <p style="color:black">Thank you!</p>
        // <p style="color:black">Spryple Team.</p>
        // <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        // </div></body>
        // </html> `;
        //     var mailOptions = {
        //         from: 'no-reply@spryple.com',
        //         to: toEmail,
        //         subject: 'Subscription plan options',
        //         html: html
        //     };
        //    transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             res.send({ status: false ,message:"Please enter a valid Email."});
        //         } 
        //         else {
        //             res.send({ status: true,message: "Verified your email.Please check your mail." });
        //         }
        //    });
               
               
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('setSprypleClient :',e)

    }

}
/**setPlanDetails */
async function setPlanDetails(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_plan_details` (?,?,?,?,?,?,?)",[req.body.plan_id_value,req.body.lower_range_value,req.body.upper_range_value,req.body.cost_per_user_monthly,req.body.cost_per_user_yearly,req.body.created_by_value,req.body.id_value], function (err, result, fields) {
            if(err){
            res.send({status:false,message:"Unable to add "})

           }
           else{
            console.log(result)
            res.send({status:true,message:"inserted"})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('setPlanDetails',e)

    }

}

async function getSpryplePlans(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');

        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_spryple_plans` ()",function (err, result, fields) {
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

async function getSpryplePlanCostDetails(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');

        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_spryple_plan_cost_details` ()",function (err, result, fields) {
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

// validate_company_code 
function validateCompanyCode(companycode,email){

    return new Promise((res,rej)=>{
        try {
            con.query('CALL `validate_company_code` (?)', [companycode], function (err, results, next) {
                if(err){
                    res(false)
                }
                else if(results[0][0].validity == 1){
                    res(true)
                }
                else{
                    res(false)
                }
                
            })
        }
         
    catch (e) {
            rej(e)
        }
    });

}

function contactUsFormMail(mailData) {
    let value = mailData.body;
    try {
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: "SSLv3",
            },
            auth: {
                user: 'no-reply@spryple.com',
                pass: 'Sreeb@#321'
            },
        });
        var html = `<html>
        <head>
        <title>Contact Form</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">${value.name},</p>
        <p style="color:black">${value.phone},</p>
        <p style="color:black">${value.email},</p>
        <p style="color:black">${value.message},</p>
  
        <p style="color:black">Thanks,</p>
        <p style="color:black">Spryple Mailer Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div>
        </body>
        </html> `;

        var mailOptions = {
            from: "no-reply@spryple.com",
            to: "contact@spryple.com",
            subject: "Contact us form details",
            html: html,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    } catch (e) {
        console.log("contactUsFormMail :", e);
    }
}

/** get subscription payment methods */
async function getPayments(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_payments` ()",function (err, result, fields) {
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
        console.log('getPayments :',e)

    }

}

/** get subscriptioned spryple clients */
async function getSprypleClients(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_spryple_clients` ()",function (err, result, fields) {
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
        console.log('getSprypleClients :',e)

    }

}

/** post additional users */
async function addUsers(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `add_users` (?,?,?,?,?,?,?)",
                [   req.body.client_renewal_detail_id_value,
                    req.body.valid_to_value,
                    req.body.user_count_value,
                    req.body.created_by_value,
                    req.body.payment_reference_number_value,
                    req.body.payment_date_value,
                    req.body.payment_status_value 
                  ], function (err, result, fields) {
                    console.log("err",err)
            if(err){
            res.send({status:false,message:"Unable to add "})

           }
           else{
            console.log(result)
            res.send({status:true,message:"inserted"})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('addUsers',e)

    }

}

/**get renewal details */
async function getRenewalDetails(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_renewal_details` (?)",[req.params.client_id_value], function (err, result, fields) {
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
        console.log('getRenewalDetails :',e)

    }

}

/**get client plan details */
async function getClientPlanDetails(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_client_plan_details` (?)",[req.body.client_id_value], function (err, result, fields) {
            console.log("getClientPlanDetails",result[0])
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
        console.log('getClientPlanDetails :',e)

    }

}

async function getUsers(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_users` (?)",[req.params.id], function (err, result, fields) {
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
        console.log('getUsers :',e)

    }

}

async function enableRenewButton(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        console.log()
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        console.log("data",req.body)
        listOfConnections[companyName].query("CALL `enable_renew_button` (?)",[req.body.date], function (err, result, fields) {
           console.log("err",err);
           console.log("result",result[0].length)
            if(err){
                res.send({status:false,data:[]})

            }else if(result[0].length>0){
                res.send({status:true,data:result[0]})
            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('setPlanDetails',e)

    }

}

/**renewUsers for after renewal payment done. */
async function renewUsers(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        console.log("renewUsers",req.body)
            listOfConnections[companyName].query("CALL `renew_users` (?,?,?,?,?,?,?,?)",
                [   req.body.client_plan_detail_id_value,
                    req.body.user_count_value,
                    req.body.valid_to_value,
                    req.body.renew_type,
                    req.body.created_by_value,
                    req.body.payment_reference_number_value,
                    req.body.payment_date_value,
                    req.body.payment_status_value 
                  ], function (err, result, fields) {
                    console.log("renewUserserr",err);
                    console.log("renewUsersresult",result)
            if(err){
            res.send({status:false,message:"Unable to add "})

           }
           else{
            console.log(result)
            res.send({status:true,message:"inserted"})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('addUsers',e)

    }

}
/**This API integrated for client add employees middile of subscription time amount details*/
async function addUsersDisplayInfo(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `add_users_display_info` (?,?,?)",
                [   req.body.client_plan_detail_id_value,
                    req.body.valid_to_value,
                    req.body.user_count_value,
                  ], function (err, result, fields) {
            if(err){
            res.send({status:false,data:[]})

           }
           else{
            console.log(result)
            res.send({status:true,data:result[0]})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('addUsersDisplayInfo',e)

    }

}
/**This API integrated for client renewing time amount and validate display*/
async function renewUsersDisplayInformation(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `renew_users_display_information` (?,?,?)",
                [   req.body.client_plan_detail_id_value,
                    req.body.user_count_value,
                    req.body.valid_to_value,
                    
                  ], function (err, result, fields) {
            if(err){
            res.send({status:false,data:[]})

           }
           else{
            console.log(result)
            res.send({status:true,data:result[0]})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('addUsersDisplayInfo',e)

    }

}
/**This API integrated for client side payment details */
async function getClientPaymentDetails(req,res) {
    try {
        // let  dbName = await getDatebaseName(req.params.companyName);
        // let companyName = req.params.companyName;
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_payment_details` (?)",[req.params.clientid], function (err, result, fields) {
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
        console.log('getClientPaymentDetails :',e)

    }

}
/**This API integrated for client add employees middile of subscription time amount details*/
async function changeClientPlan(req,res) {
    try {
        var companyName = 'spryple_hrms';
        let  dbName = await getDatebaseName('spryple_hrms');
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `change_client_plan` (?,?,?)",
                [   req.body.client_id_value ,
                    req.body.plan_id_value ,
                    req.body.created_by_value ,
                  ], function (err, result, fields) {
            if(err){
            res.send({status:false})

           }
           else{
            res.send({status:true})
           }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } 
}
    catch (e) {
        console.log('changeClientPlan',e)

    }

}
/**This API integrated for client side payment details */
async function getClientDetails(req,res) {
    try {
        // let  dbName = await getDatebaseName(req.params.companyName);
        // let companyName = req.params.companyName;
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_client_details` (?)",[req.params.clientid], function (err, result, fields) {
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
        console.log('getClientDetails :',e)

    }

}
async function agreement(req, res) {
    /**  ------- For AWS Document Upload -----*/
   
    // try {
    //     folderName = req.body.filepath;
    //     let data = JSON.parse(JSON.stringify(folderName));
    //     var imageData = {};
    //     var flag = false;
    //     const params = {
    //       Bucket: data, // pass your bucket name
    //       Key: req.body.filename 
    //   };

    //     s3.getObject(params, function (err, data) {
    //         if (err) {
    //           flag = false;
    //         }
    //         else {
    //           flag = true;
    //           imageData.image = data.Body;
    //         }
    //             imageData.success = flag;
    //             res.send(imageData);
    //     });
    // }
    // catch(e){
    //     console.log('getProfileImage',e)
    // }

        /**For Local Document Upload */
  
    try{
        var folderName = 'D:/Spryple/Spryple/AGREEMENT/SaaS-Agreement.pdf'
        var fileName = 'SaaS-Agreement.pdf'
        var imageData={}
        var flag=false;
        fs.readFile(folderName , async function (err, result) {
            if(err){
                flag=false;
            }else{
                flag=true
                imageData.image=result;
            }
            imageData.success=flag;
            res.send(imageData)
        })
    

    }
    catch(e){
        let companyName =req.params.companyName;
                let  dbName = await getDatebaseName(companyName)
                let errorLogArray = [];
                errorLogArray.push("LMSAPI");
                errorLogArray.push("getProfileImage");
                errorLogArray.push("get");
                errorLogArray.push('');
                errorLogArray.push(err );
                errorLogArray.push(null);
                errorLogArray.push(companyName);
                errorLogArray.push(dbName);
                errorLogs(errorLogArray)
    }

}

// getUnverifiedSprypleClient
async function getUnverifiedSprypleClient(req,res) {

    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_unverified_spryple_client` (?)", [req.body.companycode],
            function (err, result, fields) {
           if(result){
                res.send({data: result[0], status: true});
            }else{
                res.send({status: false});
            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('get_unverified_spryple_client :',e)

    }

}

/**GET Plan Details by plan Id and client Id*/
async function getSpryplePlanDetailsById(req, res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_spryple_plan_details_byId` (?,?)",
            [req.body.plan_id_value,req.body.client_id_value],
                function (err, result, fields) {
             if(result && result[0].length > 0){
                res.send({data: result[0], status: true});
            }else{
                res.send({status: false});
            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('getSpryplePlanDetailsById :',e)

    }

}   

/**Get Client Details By ClientId*/
async function getSprypleClientDetailsByClientId(req, res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_spryple_client_details_client_id` (?)",
            [req.params.clientId],
             function (err, result, fields) {
             if(result && result[0].length > 0){
                res.send({data: result[0], status: true});
            }else{
                res.send({status: false});
            }
        });

    }else {
            res.send({status: false,Message:'Database Name is missed'})
    } }
    catch (e) {
        console.log('getSprypleClientDetailsByClientId :',e)

    }

}   

/**get client payments details by Id */
async function getPaymentsDetailsByClientId(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_payments_details_client_id` (?)", [req.params.clientid],
            function (err, result, fields) {
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
        console.log('getPaymentsDetailsByClientId :',e)

    }

}

/**get client invoice history by payment Id */
async function getPaymentInvoiceDataByPaymentid(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_payment_invoice_paymentid` (?)", [req.params.clientid],
            function (err, result, fields) {
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
        console.log('getPaymentInvoiceDataByPaymentid :',e)

    }

}

/**get all clients details */
async function getAllSprypleClientDetails(req,res) {
    try {
        let  dbName = await getDatebaseName('spryple_hrms');
        let companyName = 'spryple_hrms';
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_spryple_client_details` ()",
            function (err, result, fields) {
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
        console.log('getAllSprypleClientDetails :',e)

    }

}