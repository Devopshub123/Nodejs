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
var connection = require('./config/databaseConnection');
var common = require('./common');


var con = connection.switchDatabase();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(fileUpload())
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

module.exports={
    getEmployeeAttendanceNotifications:getEmployeeAttendanceNotifications,
    getrolescreenfunctionalities:getrolescreenfunctionalities,
    getallemployeeslist:getallemployeeslist,
    getEmployeeCurrentShifts:getEmployeeCurrentShifts,
    getemployeeattendancedashboard:getemployeeattendancedashboard,
    getEmployeeShiftByDates:getEmployeeShiftByDates,
    getEmployeeWeekoffsHolidaysForAttendance:getEmployeeWeekoffsHolidaysForAttendance,
    getemployeeattendanceregularization:getemployeeattendanceregularization,
    setemployeeattendanceregularization:setemployeeattendanceregularization,
    deleteAttendanceRequestById:deleteAttendanceRequestById,
    getAttendanceMonthlyReport:getAttendanceMonthlyReport,
    getpendingattendanceregularizations:getpendingattendanceregularizations,
    getEmployeesByManagerId:getEmployeesByManagerId,
    getemployeeshift:getemployeeshift,
    getAttendanceRegularizationByManagerId:getAttendanceRegularizationByManagerId,
    setattendanceapprovalstatus:setattendanceapprovalstatus,
    getallemployeeslistByManagerId:getallemployeeslistByManagerId,
    getAttendanceSummaryReport:getAttendanceSummaryReport,
    getAttendanceDetailsByAttendanceId:getAttendanceDetailsByAttendanceId,
    getEmployeeConfigureShifts:getEmployeeConfigureShifts,
    setEmployeeConfigureShift:setEmployeeConfigureShift,
    getEmployeeLateAttendanceReport:getEmployeeLateAttendanceReport,
    getAttendanceRegularizationsHistoryForManager:getAttendanceRegularizationsHistoryForManager,
    setEmployeeAttendance:setEmployeeAttendance,
    getrolescreenfunctionalitiesforrole:getrolescreenfunctionalitiesforrole,

}


async function getEmployeeAttendanceNotifications(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }

            listOfConnections[companyName].query("CALL `get_employee_attendance_notifications` (?,?,?)", [req.body.manager_id, req.body.employee_id, req.body.date],

            function (err, result, fields) {

                if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
            console.log('getemployeeattendancedashboard');
        }
}


/*Get Role Screen Functionalities*/
async function getrolescreenfunctionalities(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getrolescreenfunctionalities` (?,?)", [req.body.empid, req.body.moduleid], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });

        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        } 
    } 
    catch (e) {
            console.log('getscreenfunctionalitiesmaster :', e)
        }
};

/**Get All Employees List
 *
 */

async function getallemployeeslist(req, res) {

    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_all_employees_list`()", function (err, result, fields) {
                if (result && result.length > 0) {

                    res.send({ status: true, data: result[0] })

                } else {

                    res.send({ status: false, data: [] });

                }

            })

        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {

            console.log('getAllEmployees');

        }

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

/**@param employee_id */
async function getEmployeeCurrentShifts(req,res){
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_current_shifts`(?)",[req.body.employee_id],
                function(err,result){
                    console.log(result);
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        console.log("get_employee_current_shifts")
    }
}

/**
 *@param manager_id *@param employee_id *@param date */

async function getemployeeattendancedashboard(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_attendance_dashboard` (?,?,?)", [req.body.manager_id, req.body.employee_id, req.body.date],
                function (err, result, fields) {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
            console.log('get_employee_attendance_dashboard');
        }
}

/**@param employee_id in, `fromd_date` date,in `to_date` date)*/
async function getEmployeeShiftByDates(req,res){
    try{

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_shift_by_dates`(?,?,?)",[req.body.employee_id,req.body.fromd_date,req.body.to_date],
                function(err,result){
                    console.log(result);
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
            console.log(get_employee_shift_by_dates)
        }
}

/**@param employee_id */
async function getEmployeeWeekoffsHolidaysForAttendance(req,res){
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_weekoffs_holidays_for_attendance`(?)",[req.body.employee_id],
                function(err,result){
                    console.log(result);
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }catch(e){
            console.log("get_employee_weekoffs_holidays_for_attendance")
        }
}

/**Get employee_attendance_regularization
 **@employee_id  parameters
 * **/

async function getemployeeattendanceregularization(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_attendance_regularization` (?)", [req.params.employee_id], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
            console.log('getemployeeattendanceregularization :', e)

        }
}

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
async function setemployeeattendanceregularization(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_attendance_regularization` (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [req.body.id, req.body.empid, parseInt(req.body.shiftid), req.body.fromdate, req.body.todate,
                    req.body.logintime, req.body.logouttime, req.body.worktype, req.body.reason, parseInt(req.body.raisedby),
                    req.body.approvercomments, req.body.actionby, req.body.status], function (err, result, fields) {

                    if (err) {
                        res.send({ status: false, message: "notSave" });
                    } else {
                        if (result[0][0].validity_status == 0) {
                            res.send({ status: true, message: "duplicate" })
                        } else {
                            res.send({ status: true, message: "save" })
                        }
                    }
                });

        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
            console.log('setemployeeattendanceregularization')
        }
    }


//**delete_employee_attendance_regularization */
async function deleteAttendanceRequestById(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `delete_employee_attendance_regularization` (?)", [req.body.id],
                function (err, result, fields) {
                    console.log(result[0]);
                    console.log(result[0][0]);
                    if (result[0][0].successState == 0) {
                        res.send({ status: true, message: 'Attendance request deleted successfully.' })

                    } else {
                        res.send({ status: true, message: 'Unable to attendance request deleted.' })
                    }

                })
        }
         else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
            console.log('delete_employee_attendance_regularization');
     }
}


/**
 *
 `get_attendance_monthly_report`(
 `manager_employee_id` int(11),
 `employee_id` int(11),
 `calendar_date` datetime
 )
 *@param manager_employee_id *@param employee_id *@param date */

async function getAttendanceMonthlyReport(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }

            listOfConnections[companyName].query("CALL `get_attendance_monthly_report` (?,?,?)", [req.body.manager_employee_id, req.body.employee_id, req.body.calendar_date],
                function (err, result, fields) {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('getemployeeattendancedashboard');
    }
}

/**get_pending_attendance_regularizations(23) for manager
 **@employee_id  parameters
 */

async function getpendingattendanceregularizations(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_pending_attendance_regularizations` (?)", [req.params.employee_id], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('getpendingattendanceregularizations :', e)
    }
}


/**get_employees_for_reporting_manager for manager
 **@employee_id  parameters
 *@designation_id  parameters
 */
async function getEmployeesByManagerId(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_for_reporting_manager` (?,?)", [req.params.employee_id,'All'],
                function (err, result, fields) {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
     catch (e) {
        console.log('getEmployeesByManagerId');
    }
}

/** Get Shift Detaild By Employee Id
 * @employee_id Parameter */
async function getemployeeshift(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_shift` (?)", [req.params.employee_id], function (err, result, fields) {
                if (result) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })

                }
            });
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch {
        console.log('get_employee_shift :')
    }
}


async function getAttendanceRegularizationByManagerId(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_manager_on_behalf_of_employee_attendance_regularizations` (?)", [req.params.manager_employee_id],
                function (err, result, fields) {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
     } 
     catch (e) {
        console.log('getAttendanceRegularizationByManagerId');
    }
}


/** setattendanceapprovalstatus
 `set_attendance_approval_status`(
 `id` int(11),
 `approver_comments` varchar(255),
 `action_by` int(11),
 `approval_status` varchar(32)
 ) */
async function setattendanceapprovalstatus(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_attendance_approval_status` (?,?,?,?)",
                [req.body.id, req.body.approvercomments, req.body.actionby, req.body.approvelstatus],
                function (err, result, fields) {
                    if (err) {
                        res.send({ status: false, message: "UnableToApprove" });
                    } else {
                        res.send({ status: true, message: "ApprovalRequest" });
                        if (req.body.emailData.emp_email !='' || req.body.emailData.emp_email !=null) {
                            console.log("va-0")
                            if (req.body.approvelstatus == 'Approved') {
                                console.log("va-1")
                                approveAttendanceRequestEmail(emailData);
                            } else if (req.body.approvelstatus == 'Rejected') {
                                console.log("va-2")
                                this.rejectedAttendanceRequestEmail(emailData);
                            }
                        }

                    }

                });
 
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e) {
        console.log('setattendanceapprovalstatus');
    }

}


/**Get All Employees List
 * @param rm_id
 */

async function getallemployeeslistByManagerId(req, res) {

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_of_manager` (?)",[req.body.rm_id], function (err, result, fields) {
                if (result && result.length > 0) {

                    res.send({ status: true, data: result[0] })

                } else {

                    res.send({ status: false, data: [] });

                }

            })

        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {

        console.log('get_employees_of_manager');

    }

}

/**
 *@param manager_empid *@param employee *@param fromdate *@param todate */

async function getAttendanceSummaryReport(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_attendance_summary_report` (?,?,?,?)", [req.body.manager_empid,req.body.employee, req.body.fromdate, req.body.todate],
                function (err, result, fields) {
                    if (err) {

                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        } 
    } 
    catch (e) {
        console.log('get_attendance_summary_report');
    }
}


/**
 *@param attendanceid  */

async function getAttendanceDetailsByAttendanceId(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_attendance_details_report` (?)", [req.body.attendanceid],
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
        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        } 
    } 
    catch (e) {
        console.log('getAttendanceDetailsByAttendanceId');
    }
}

/** `get_employee_shifts_for_manager_or_department`(
 `manager_empid` int(11),
 `department_id` int(11)
 ) */
async function getEmployeeConfigureShifts(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_shifts_for_manager_or_department` (?,?)", [req.body.manager_empid, req.body.department_id],
                function (err, result, fields) {

                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('get_employee_shifts_for_manager_or_department');
    }
}

/** `set_employee_shifts`(
 `shift_id` int(11),
 `from_date` datetime,
 `to_date` datetime,
 `weekoffs` JSON, -- format: [1,2] 1- Sunday, 2 - Monday etc.
 `empids` JSON -- format: [1,2,3,4]
 ) */
async function setEmployeeConfigureShift(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_shifts` (?,?,?,?,?)", [req.body.shift_id,req.body.from_date,
                    req.body.to_date, req.body.weekoffs, req.body.empids],
                function (err, result, fields) {
                    console.log(result[0][0].successstate);
                    if (result[0][0].successstate == 1) {
                        res.send({ status: true, message: "dataSaved" })

                    } else {
                        res.send({ status: true, message: "UnableToSave" })
                    }

                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('set_employee_shifts');
    }
}

/**
 `get_employee_late_attendance_report`(
 'manager_empid'
     `employee_id` int(11),
     `shift_id` int(11),
     `from_date` date,
     `to_date` date
 )
 */
async function getEmployeeLateAttendanceReport(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_late_attendance_report` (?,?,?,?,?)", [req.body.manager_empid,req.body.employee_id,
                    req.body.shift_id,req.body.from_date, req.body.to_date],
                function (err, result, fields) {

                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('get_employee_late_attendance_report');
    }
}


async function getAttendanceRegularizationsHistoryForManager(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_attendance_regularizations_history_for_manager` (?)", [req.params.employee_id], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('get_attendance_regularizations_history_for_manager :', e)
    }
}
/**attendance Excel Data insert Method  set_employee_attendance

 */

async function setEmployeeAttendance(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_attendance` (?)",
                [JSON.stringify(req.body)], function (err, result, fields) {
                    console.log(result);
                    if (err) {
                        res.send({ status: false, message: "unableToUpload" });
                    } else {
                        res.send({ status: true, message: "excelUploadSave" })
                    }
                });

        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
     } 
     catch (e) {
        console.log('setEmployeeAttendance :', e)
    }
}

/*Get Role Screen Functionalities Based On Role*/
async function getrolescreenfunctionalitiesforrole(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getrolescreenfunctionalities_for_role` (?,?)", [req.body.roleid, req.body.moduleid], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });


        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        console.log('getrolescreenfunctionalities_for_role :', e)
    }
}











function editedAttendanceRequestEmail(mailData){
    try {
        let email = mailData
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'no-reply@sreebtech.com',
                pass: 'Sreeb@#123'
            }
        });
        var html = `<html>
      <head>
      <title>edited Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData[0].rm_name},</p>
  
      <p style="color:black">An attendance request edited by ${mailData[0].emp_name} is awaiting your approval</p>
      
       <p style="color:black">Shift:</p>
       <p style="color:black">Work Type:</p>
       <p style="color:black">From Date:</p>
       <p style="color:black">To Date:</p>
       <p style="color:black">Reason:</p>
       <p style="color:black">Best regards,</p>
  
      <p style="color:black">${mailData[0].emp_name}</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@sreebtech.com',
            to: email,
            subject: 'Edited Attendance request by {employee}',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });

    }
    catch (e) {
        console.log('editedAttendanceRequestEmail :', e)

    }

}

function deleteAttendanceRequestEmail(mailData){
    try {
        let email = mailData
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'no-reply@sreebtech.com',
                pass: 'Sreeb@#123'
            }
        });
        var html = `<html>
      <head>
      <title>Delete Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData[0].emp_name},</p>
  
      <p style="color:black">An attendance request deleted by {employee}.</p>
      
       <p style="color:black">Shift:</p>
       <p style="color:black">Work Type:</p>
       <p style="color:black">From Date:</p>
       <p style="color:black">To Date:</p>
       <p style="color:black">Reason:</p>
       <p style="color:black">Best regards,</p>
  
      <p style="color:black">${mailData[0].emp_name}</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@sreebtech.com',
            to: email,
            subject: 'Deleted Attendance request by {employee}',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });

    }
    catch (e) {
        console.log('deleteAttendanceRequestEmail :', e)

    }

}