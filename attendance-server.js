const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer')
const app = new express();
app.use(bodyParser.json());
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

// /*Get Master table*/
app.get('/api/getMastertable/:tableName/:status/:page/:size/:companyShortName', function (req, res) {
    try {
        var tName = req.params.tableName;
        if (req.params.status == "null") {
            con.query("CALL `getmastertable` (?,?,?,?)", [tName, null, req.params.page, req.params.size], function (err, result, fields) {
                if (result && result.length > 0) {
                    if (tName == 'holidaysmaster') {
                        for (let i = 0; i < result[0].length; i++) {
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0' + (hDate.getMonth() + 1)).slice(-2) + "-" + ('0' + (hDate.getDate())).slice(-2);
                        }
                        res.send({ data: result[0], status: true });


                    } else {
                        res.send({ data: result[0], status: true });
                    }
                } else {
                    res.send({ status: false })
                }
            });

        }
        else {
            con.query("CALL `getmastertable` (?,?,?,?)", [tName, req.params.status, req.params.page, req.params.size], function (err, result, fields) {
                if (result && result.length > 0) {
                    if (tName == 'holidaysmaster') {
                        for (let i = 0; i < result[0].length; i++) {
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0' + (hDate.getMonth() + 1)).slice(-2) + "-" + ('0' + (hDate.getDate())).slice(-2);
                        }
                        res.send({ data: result[0], status: true });


                    } else {
                        res.send({ data: result[0], status: true });
                    }
                } else {
                    res.send({ status: false })
                }
            });
        }
    } catch (e) {
        console.log('getMastertable :', e)

    }
});
/*set Designation*/
app.post('/api/setDesignation', function (req, res) {
    try {
        let infoDesignationMaster = {}
        infoDesignationMaster.designation = req.body.designationName;
        infoDesignationMaster.status = 'Active';
        con.query("CALL `setmastertable` (?,?,?)", ['designationsmaster', 'nandyala_hospitals', JSON.stringify(infoDesignationMaster)], function (err, result, fields) {
            if (err) {
                res.send({ status: false, message: 'Unable to insert designation' });
            } else {
                res.send({ status: true, message: 'Designation added successfully' })
            }
        });


    } catch (e) {
        console.log('setDesignation :', e)

    }
});
/**Get All Employees List */

app.get('/api/getallemployeeslist', function (req, res) {

    try {
        con.query("CALL `get_all_employees_list`", function (err, result, fields) {
                if (result && result.length > 0) {

                    res.send({ status: true, data: result[0] })

                } else {

                    res.send({ status: false, data: [] });

                }

            })

    } catch (e) {

        console.log('getAllEmployees');

    }

});
/*Set Employee Master*/
app.post('/api/setEmployeeMaster', function (req, res) {
    try {
        con.query("CALL `setemployeemaster` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        var val
                        val = err.sqlMessage.split('entry')[1];

                        res.send({ status: false, message: val.split('for')[0] + ' is already exist in database' });
                    } else {
                        res.send({ status: false, message: 'Unable to add employee' });
                    }
                } else {
                    res.send({ status: true, message: 'Employee added successfully' })
                }
            });
    } catch (e) {
        console.log('setEmployeeMaster :', e)
    }
});
/*set Designation*/
app.put('/api/putDesignation', function (req, res) {
    try {


        let infoDesignationMaster = {}
        infoDesignationMaster.designation = req.body.name;
        infoDesignationMaster.status = req.body.status;

        con.query("CALL `updatemastertable` (?,?,?,?)", ['designationsmaster', 'id', req.body.id, JSON.stringify(infoDesignationMaster)], function (err, result, fields) {

            if (err) {
                res.send({ status: false, message: 'Unable to update designation' });
            } else {
                res.send({ status: true, message: 'Designation updated successfully' })
            }
        });


    } catch (e) {
        console.log('setDesignation :', e)

    }
});

/**verify email for forget password */
app.get('/api/forgetpassword/:email', function (req, res, next) {
    let email = req.params.email;
    try {

        con.query('CALL `getemployeestatus`(?)', [email], function (err, result) {
            let data = result[0][0]
            if (data === undefined) {
                res.send({ status: false })
            }
            else if (data.status == 'Active') {
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
                        user: 'smattupalli@sreebtech.com',
                        pass: 'Sree$sreebt'
                    }
                });
                var url = 'http://localhost:6060/api/Resetpassword/' + email + '/' + id
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
    }
    catch (e) {
        console.log("forgetpassword", e)
    }
})
/**password reset */
app.get('/api/resetpassword/:email/:id', function (req, res, next) {
    let id = req.params.id;
    let email = req.params.email;
    res.redirect('http://localhost:4200/ResetPassword/' + email + '/' + id)


})
/**reset password */
app.post('/api/resetpassword', function (req, res, next) {
    let id = req.body.empid;
    let email = req.body.email;
    let password = req.body.newpassword;
    try {
        con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,email,password,'active','N'],function(err,result){
            if(err){
                console.log(err)
            }
            else{
                res.send({status: true, message: 'reset password successfully'})


            }
        });

    }
    catch (e) {
        console.log("resetpassword", e)
    }
})
/**Change Password */
app.post('/changePassword', function (req, res) {
    let oldpassword = req.body.oldPassword;
    let newpassword = req.body.newPassword;
    let id = req.body.empId;
    let login = req.body.email;
    try {
        con.query('CALL `validatelastpasswordmatch` (?,?,?,?)', [id, login, oldpassword, newpassword], function (err, results, next) {
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            console.log("result", result[0])
            if (result[0] == 0) {
                con.query('CALL `setemployeelogin`(?,?,?,?,?)', [id, login, newpassword, 'active', 'n'], function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        let results =[0]
                        res.send(results)

                    }
                })

            }
            else if (result[0] == -1) {
                res.send(result)
            }
            else {
                res.send(result)

            }

        });

    }
    catch (e) {
        console.log("changepassword", e)
    }

})


/**employee login */
app.post('/api/emp_login', function (req, res, next) {
    try {
        var email = req.body.email;
        var password = req.body.password;    
        con.query('CALL `authenticateuser` (?,?)', [email, password], function (err, results, next) {
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if (result[0] > 0) {
                con.query('CALL `getemployeeinformation`(?)', [email], function (err, results, next) {
                    try {
                        if (results.length > 0) {
                            var result = JSON.parse(results[0][0].result)
                            res.send({ status: true, result })

                        }
                        else {
                            res.send({ status: false, result })
                        }
                    }
                    catch (e) {
                        console.log("employee_login", e)
                    }

                })

            }
            else {
                res.send({ status: false, message: "Invalid userName or password" })
            }

        });

    }
    catch (e) {
        console.log("employee_login", e)
    }
})

/** Get Shift Detaild By Employee Id 
 * @employee_id Parameter */
app.get('/api/getemployeeshift/:employee_id', function (req, res) {
    console.log(req.params.employee_id);
    try {
        ;
        con.query("CALL `get_employee_shift` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })

            }
        });

    } catch {
        console.log('get_employee_shift :')
    }
});

/**attendance Excel Data insert Method  set_employee_attendance

*/

app.post('/api/setEmployeeAttendance', function (req, res) {
    try {
        con.query("CALL `set_employee_attendance` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    res.send({ status: false, message: 'Unable to upload Data' });
                } else {
                    res.send({ status: true, message: 'Excel data upload successfully' })
                }
            });

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
        ;
        con.query("CALL `set_employee_attendance_regularization` (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [null, req.body.empid, parseInt(req.body.shiftid), req.body.fromdate, req.body.todate,
                req.body.logintime, req.body.logouttime, req.body.worktype, req.body.reason, parseInt(req.body.raisedby),
                req.body.approvercomments, req.body.actionby, req.body.status], function (err, result, fields) {
                    if (err) {
                        res.send({ status: false, message: 'Unable to applied attendance request' });
                    } else {
                        res.send({ status: true, message: 'Attendance request applied successfully' })
                    }
                });

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
        ;
        con.query("CALL `set_attendance_approval_status` (?,?,?,?)",
            [req.body.id, req.body.approvercomments, req.body.actionby, req.body.approvelstatus],
            function (err, result, fields) {
                if (err) {
                    res.send({ status: false, message: 'Unable to applied approval request' });
                } else {
                    res.send({ status: true, message: 'Approval Request applied successfully' });
                }
                console.log(err);
            });

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


        con.query("CALL `get_employee_attendance_regularization` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                console.log(result)
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getemployeeattendanceregularization :', e)

    }
});
/**get_pending_attendance_regularizations(23) for manager
**@employee_id  parameters
 */

app.get('/api/getpendingattendanceregularizations/:employee_id', function (req, res) {
    try {

        con.query("CALL `get_pending_attendance_regularizations` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getpendingattendanceregularizations :', e)
    }
});
app.get('/api/getEmployeesByManagerId/:employee_id', function (req, res) {
    try {
        ;
        con.query("CALL `get_employees_for_reporting_manager` (?)", [req.params.employee_id],
            function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ status: true, data: result[0] })
                } else {
                    res.send({ status: false, data: [] });
                }
            })
    } catch (e) {
        console.log('getEmployeesByManagerId');
    }
});
app.get('/api/getAttendanceRegularizationByManagerId/:manager_employee_id', function (req, res) {
    try {
        ;
        con.query("CALL `get_manager_on_behalf_of_employee_attendance_regularizations` (?)", [req.params.manager_employee_id],
            function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ status: true, data: result[0] })
                } else {
                    res.send({ status: false, data: [] });
                }
            })
    } catch (e) {
        console.log('getEmployeesByManagerId');
    }
});

/*Get Role Screen Functionalities*/
app.post('/api/getrolescreenfunctionalities', function (req, res) {
    try {
        con.query("CALL `getrolescreenfunctionalities` (?,?)", [req.body.empid, req.body.moduleid], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('getscreenfunctionalitiesmaster :', e)
    }
});



/*Set Employee Master*/
app.post('/api/setEmployeeMaster', function (req, res) {
    try {
        con.query("CALL `setEmployeeMaster` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        var val
                        val = err.sqlMessage.split('entry')[1];

                        res.send({ status: false, message: val.split('for')[0] + ' is already exist in database' });
                    } else {
                        res.send({ status: false, message: 'Unable to add employee' });
                    }
                } else {
                    res.send({ status: true, message: 'Employee added successfully' })
                }
            });


    } catch (e) {
        console.log('setEmployeeMaster :', e)
    }
});
/**
 *@param manager_employee_id *@param employee_id *@param date */

app.post('/api/getemployeeattendancedashboard', function (req, res) {
    try {
        ;
        con.query("CALL `get_employee_attendance_dashboard` (?,?,?)", [req.body.manager_id, req.body.employee_id, req.body.date],
            function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ status: true, data: result[0] })
                } else {
                    res.send({ status: false, data: [] });
                }
            })
    } catch (e) {
        console.log('getemployeeattendancedashboard');
    }
});

/**
 *@param employee *@param fromdate *@param todate */

app.post('/api/getAttendanceSummaryReport', function (req, res) {
    try {
        ;
        con.query("CALL `get_attendance_summary_report` (?,?,?)", [req.body.employee, req.body.fromdate, req.body.todate],
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                } else {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                }
            })
    } catch (e) {
        console.log('getemployeeattendancedashboard');
    }
});
/**
 *@param attendanceid  */
  
 app.post('/api/getAttendanceDetailsByAttendanceId', function (req, res) {
    try {
        con.query("CALL `get_attendance_details_report` (?)", [req.body.attendanceid],
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                } else {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                }
            })
    } catch (e) {
        console.log('getDetails Report date for popup');
    }
});

/*Get Role Screen Functionalities Based On Role*/
app.post('/api/getrolescreenfunctionalitiesforrole', function (req, res) {
    try {
        con.query("CALL `getrolescreenfunctionalities_for_role` (?,?)", [req.body.roleid, req.body.moduleid], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getrolescreenfunctionalities_for_role :', e)
    }
});

module.exports = app;