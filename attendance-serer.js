const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer')
const app = new express();
app.use(bodyParser.json());

var crypto = require("crypto");
var algorithm = "aes-256-cbc";
// generate 16 bytes of random data
var initVector = crypto.randomBytes(16);
var Securitykey = crypto.randomBytes(32);
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
var connection = require('./config/databaseConnection')

connection.switchDatabase('boon_client');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(fileUpload())
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

/**verify email for forget password */
app.get('/api/forgetpassword/:email',function(req,res,next){
    let email = req.params.email;
    console.log(email)
    try{
        var con  =connection.switchDatabase('boon_client')
            con.query('CALL `getemployeestatus`(?)',[email],function(err,result){
                let data = result[0][0]
                if(data === undefined){
                    res.send({status: false})
                }
                else if(data.status=='Active'){
                    let id = data.id;
                    // const crypto = require("crypto");
                    // const algorithm = "aes-256-cbc"; 
                    // // generate 16 bytes of random data
                    // const initVector = crypto.randomBytes(16);
                    // protected data
                    const message = email ;
                    // secret key generate 32 bytes of random data
                    // const Securitykey = crypto.randomBytes(32);
                    // the cipher function
                    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
                    // encrypt the message
                    // input encoding
                   // output encoding
                   let encryptedData = cipher.update(message, "utf-8", "hex");
                   encryptedData += cipher.final("hex");
                   console.log("Encrypted message: " + encryptedData);
                    var transporter = nodemailer.createTransport({
                        host: "smtp-mail.outlook.com", // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: 587, // port for secure SMTP
                        tls: {
                            ciphers:'SSLv3'
                        },
                        auth: {
                            user: 'smattupalli@sreebtech.com',
                            pass: 'Sree$sreebt'
                        }
                    });
                    // var url = 'http://localhost:6060/api/Resetpassword/'+id+'/'+encryptedData
                    var url = 'http://localhost:6060/api/Resetpassword/'+email+'/'+id
                    var html = `<html>
                    <head>
                    <title>HRMS ResetPassword</title></head>
                    <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
                    <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
                    <p style="color:black">hello!,</p>
                    <p style="color:black">You recently requested to reset the password to your HRMS account<b></b></p>
                    <p style="color:black"> To set a new password, click here.</p>
                    <p style="color:black"> <a href="${url}" >${url}</a></p>
                    <p style="color:black"> Didn’t request a password change? Ignore this email.</p>
                    <p style="color:black">Thank You!</p>
                    <p style="color:black">HRMS Team</p>
                    <hr style="border: 0; border-top: 3px double #8c8c8c"/>
                    </div></body>
                    </html> `;
                    var mailOptions = {
                        from: 'smattupalli@sreebtech.com',
                        to: "rthallapelly@sreebtech.com",
                        subject: 'Reset Password email',
                        html:html
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            res.send({status: false, message: 'reset password successfully'})
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.send({status: true, message: 'reset password successfully'})
                        }
                    });
                }
        });
    }
    catch(e){
        console.log("forgetpassword",e)
    }
})
/**password reset */
app.get('/api/resetpassword/:email/:id',function(req,res,next){
    let id = req.params.id;
    let email = req.params.email;
    console.log(id)
    console.log(email)
    
    //                 // protected data
    //                 const message = id ;
    //                 // secret key generate 32 bytes of random data
                    
    // encryptedData1 = id;
    // const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    // let decryptedData = decipher.update(encryptedData1, "hex", "utf-8");
    // console.log()
    // // decryptedData += decipher.final("utf8");
    // console.log("Decrypted message: " + decryptedData);
    res.redirect('http://localhost:4200/ResetPassword/'+email+'/'+id)


})
/**reset password */
app.post('/api/resetpassword',function(req,res,next){
    var con  =connection.switchDatabase('boon_client')
    console.log(req.body)
        const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(req.body.empid, "hex", "utf-8");
    console.log()
    decryptedData += decipher.final("utf8");
    console.log(decryptedData)
    let id = req.body.empid;
    let email = req.body.email;
    let password = req.body.newpassword;
    try{
        // con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,email,password,'active','N'],function(err,result){
        //     if(err){
        //         console.log(err)
        //     }
        //     else{
        //         res.send({status: true, message: 'reset password successfully'})


        //     }
        // });

    }
    catch(e){
        console.log("resetpassword",e)
    }
})
/**Change Password */
app.post('/changePassword',function(req,res){
    var con  =connection.switchDatabase('boon_client')
    console.log("hjhjh",req.body)

    let oldpassword = req.body.oldPassword;
    let newpassword = req.body.newPassword;
    let id = req.body.empId;
    let login = req.body.email;
    try{
        con.query('CALL `validatelastpasswordmatch` (?,?,?,?)',[id,login,oldpassword,newpassword],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            console.log("result",result[0])
            if(result[0]==0){
                con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,login,newpassword,'active','n'],function(err,result){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send({status: true, result})


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
        // con.end();

    }
    catch(e){
        console.log("changepassword",e)
    }

})


/**employee login */
app.post('/api/emp_login',function(req,res,next){
    var con  =connection.switchDatabase('boon_client')

    try{
        // let 
        var email = req.body.email;
        var password = req.body.password;
        // console.log(req.body.email)
        // console.log(password)
        con.query('CALL `authenticateuser` (?,?)',[email,password],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if (result[0] > 0) {
                con.query('CALL `getemployeeinformation`(?)',[email],function(err,results,next){
                    try{
                        if(results.length>0){
                            var result = JSON.parse(results[0][0].result)
                            console.log(result)
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
})

/** Get Shift Detaild By Employee Id 
 * @employee_id Parameter */
 app.get('/api/getemployeeshift/:employee_id',function(req,res){
    console.log(req.params.employee_id);
   try{
    var con=connection.switchDatabase('boon_client');
    con.query("CALL `get_employee_shift` (?)",[req.params.employee_id],function(err,result,fields){
        console.log(err)
        if(result){
            console.log(result)
            res.send({ data: result[0], status: true });
        }else{
            console.log(err)
            res.send({ status: false })

        }
        console.log(err)
    });
    con.end();
   }catch{
    console.log('get_employee_shift :')
   }
});

/**attendance Excel Data insert Method  set_employee_attendance

*/

app.post('/api/setEmployeeAttendance', function (req, res) {
    try {
        var con = connection.switchDatabase('boon_client')
        console.log("gg", typeof req.body)
        con.query("CALL `set_employee_attendance` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                console.log("DFF", err, result)
                if (err) {
                    res.send({ status: false, message: 'Unable to upload Data' });
                } else {
                    res.send({ status: true, message: 'Excel data upload successfully' })
                }
            });
        con.end()

    } catch (e) {
        console.log('setEmployeeAttendance :', e)
    }
});
/** setemployeeattendanceregularization
 * `id` int(11),
`empid` int(11),
`shiftid` int(11),
`fromdate` date,
`todate` date,
`logintime` datetime,
`logouttime` datetime,
`worktype` int(11),
`reason` varchar(255),
`raisedby` int(11),
`approvercomments` varchar(255),
`actionby` int(11),
`status` varchar(32)
 *  */
app.post('/api/setemployeeattendanceregularization', function (req, res) {
    try {
        var con = connection.switchDatabase('boon_client');
         con.query("CALL `set_employee_attendance_regularization` (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [null, req.body.empid, parseInt(req.body.shiftid), req.body.fromdate,req.body.todate,
                req.body.logintime, req.body.logouttime, req.body.worktype, req.body.reason, parseInt(req.body.raisedby),
                req.body.approvercomments, req.body.actionby, req.body.status], function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.send({ status: false, message: 'Unable to applied attendance request' });
                    } else {
                        res.send({ status: true, message: 'Attendance request applied successfully' })
                    }
                });
        con.end()
        
    } catch (e) {
        console.log('setemployeeattendanceregularization')
    }
})
/** setattendanceapprovalstatus
 `set_attendance_approval_status`(
`id` int(11),
`approver_comments` varchar(255),
`action_by` int(11),
`approval_status` varchar(32)
) */
app.post('/api/setattendanceapprovalstatus', function (req, res) {
    console.log(req.body);
    try {
        var con = connection.switchDatabase('boon_client');
        con.query("CALL `set_attendance_approval_status` (?,?,?,?)", 
        [req.body.id, req.body.approvercomments,req.body.actionby, req.body.approvelstatus],
         function (err, result, fields) {
                if (err) {
                    res.send({ status: false, message: 'Unable to applied approval request' });
                } else {
                    res.send({ status: true, message: 'Approval Request applied successfully' });
                }
                console.log(err);
            });
           
        con.end()
    }
    catch {
        console.log('setattendanceapprovalstatus');
     }

})
/**Get employee_attendance_regularization
 **@employee_id  parameters
 * **/

app.get('/api/getemployeeattendanceregularization/:employee_id', function (req, res) {
   
    try {
        var con = connection.switchDatabase('boon_client')

        con.query("CALL `get_employee_attendance_regularization` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                console.log(result)
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
        con.end();

    } catch (e) {
        console.log('getemployeeattendanceregularization :', e)

    }
});
/**get_pending_attendance_regularizations(23) for manager
**@employee_id  parameters
 */

app.get('/api/getpendingattendanceregularizations/:employee_id', function (req, res) {
    try {
        var con = connection.switchDatabase('boon_client')
        con.query("CALL `get_pending_attendance_regularizations` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
        console.log(result);
        con.end();

    } catch (e) {
        console.log('getpendingattendanceregularizations :', e)
    }
});
app.get('/api/getEmployeesByManagerId/:employee_id', function(req,res){
      try{
          var con=connection.switchDatabase('boon_client');
          con.query("CALL `get_employees_for_reporting_manager` (?)",[req.params.employee_id]),
          function(err,result,fields){
            if(result && result.length>0){
                res.send({status:true,data:result[0]})
            }else{
                res.send({status:false,data:[]});
            }
          }
      }catch(e){
        console.log('getEmployeesByManagerId');
      }
});
// app
// .listen(6060, '0.0.0.0', function (err) {
//     if (err)
//         console.log('Server Cant Start ...Erorr....');
//     else
//         console.log('Server Started at : http://localhost:6060');
// })
module.exports = app;