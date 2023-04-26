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
    getSideNavigation:getSideNavigation
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

                async function (err, result, fields) {
  
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getEmployeeAttendanceNotifications");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false});           
                }
                else{
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
            // console.log('getemployeeattendancedashboard');
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("ATTENDANCEAPI");
            errorLogArray.push("getEmployeeAttendanceNotifications");
            errorLogArray.push("GET");
            errorLogArray.push("");
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
            errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `getrolescreenfunctionalities` (?,?)", [req.body.empid, req.body.moduleid], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getrolescreenfunctionalities");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false});           
                }
                else{
                    if (result && result.length > 0) {
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getrolescreenfunctionalities");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_all_employees_list`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getallemployeeslist");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false});           
                }
                else{
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getrolescreenfunctionalities");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

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
                async function(err,result){
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeeCurrentShifts");
                        errorLogArray.push("GET");
                        errorLogArray.push("");
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({status:false});           
                    }
                    else{
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
    catch(e){
        // console.log("get_employee_current_shifts");
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getEmployeeCurrentShifts");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getemployeeattendancedashboard");
                        errorLogArray.push("GET");
                        errorLogArray.push("");
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({status:false});           
                    }
                    else{
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
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getemployeeattendancedashboard");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function(err,result){
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeeShiftByDates");
                        errorLogArray.push("GET");
                        errorLogArray.push("");
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({status:false});           
                    }
                    else{
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
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getEmployeeShiftByDates");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function(err,result){
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeeWeekoffsHolidaysForAttendance");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.body.employee_id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({status:false});           
                    }
                    else{
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
    }catch(e){
            // console.log("get_employee_weekoffs_holidays_for_attendance")
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("ATTENDANCEAPI");
            errorLogArray.push("getEmployeeWeekoffsHolidaysForAttendance");
            errorLogArray.push("GET");
            errorLogArray.push("");
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
            errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_employee_attendance_regularization` (?)", [req.params.employee_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getemployeeattendanceregularization");
                    errorLogArray.push("GET");
                    errorLogArray.push(req.body.employee_id);
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false});           
                }
                else{
                    if (result && result.length > 0) {
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getemployeeattendanceregularization");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

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
    let emailData = req.body;
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
                    req.body.approvercomments, req.body.actionby, req.body.status], async function (err, result, fields) {
                     if (err) {
                            let errorLogArray = [];
                            errorLogArray.push("ATTENDANCEAPI");
                            errorLogArray.push("setemployeeattendanceregularization");
                            errorLogArray.push("POST");
                            errorLogArray.push(JSON.stringify(req.body));
                            errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                            errorLogArray.push(null);
                            errorLogArray.push(companyName);
                            errorLogArray.push(dbName);
                            errorLogs(errorLogArray);  
                            res.send({ status: false, message: "notSave" });          
                        }
                     else {
                        if (result[0][0].validity_status == 0) {
                            res.send({ status: true, message: "duplicate" })
                        }else if (result[0][0].validity_status == 2) {
                            res.send({ status: true, message: "update" })
                            if (emailData.emails.rm_email != null || '' ) {
                                editedAttendanceRequestEmail(emailData,companyName) 
                            }
                         }
                        else {
                            res.send({ status: true, message: "save" })
                            if (emailData.emails.rm_email != null || '' ) {
                                attendanceRequestEmail(emailData,companyName);
                            }
                         }
                    }
                });

        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("setemployeeattendanceregularization");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
        }
    }


//**delete_employee_attendance_regularization */
async function deleteAttendanceRequestById(req, res) {
    let emailData = req.body;
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("deleteAttendanceRequestById");
                        errorLogArray.push("DELETE");
                        errorLogArray.push(req.body.id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false});          
                    }
                    else{
                        if (result[0][0].successState == 0) {
                            res.send({ status: true, message: 'Attendance request deleted successfully.' })
                            if (emailData.emails.rm_email != null || '' ) {
                                deleteAttendanceRequestEmail(emailData);
                            }
                        } else {
                            res.send({ status: true, message: 'Unable to attendance request deleted.' })
                        }

                    }
                    

                })
        }
         else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
            // console.log('deleteEmployeeAttendanceRegularization');
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("deleteEmployeeAttendanceRegularization");
        errorLogArray.push("DELETE");
        errorLogArray.push(req.body.id);
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getAttendanceMonthlyReport");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body.id));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false});          
                    }
                    else{
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getAttendanceMonthlyReport");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_pending_attendance_regularizations` (?)", [req.params.employee_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getpendingattendanceregularizations");
                    errorLogArray.push("GET");
                    errorLogArray.push(req.params.employee_id);
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false});          
                }
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getpendingattendanceregularizations");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
    
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeesByManagerId");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.params.employee_id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false});          
                    }
                    else{
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getEmployeesByManagerId");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_employee_shift` (?)", [req.params.employee_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getemployeeshift");
                    errorLogArray.push("GET");
                    errorLogArray.push(req.params.employee_id);
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false});          
                }
                else{
                    if (result) {
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
    catch {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getemployeeshift");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getAttendanceRegularizationByManagerId");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.params.manager_employee_id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false});          
                    }
                    else{
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getAttendanceRegularizationByManagerId");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
        let emailData = req.body;
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getAttendanceRegularizationByManagerId");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.params.manager_employee_id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false, message: "UnableToApprove" });       
                    }
                     else {
                        res.send({ status: true, message: "ApprovalRequest" });
                        if (req.body.emailData.emp_email !='' || req.body.emailData.emp_email !=null) {
                            if (req.body.approvelstatus == 'Approved') {
                                approveAttendanceRequestEmail(emailData,companyName);
                            } else if (req.body.approvelstatus == 'Rejected') {
                                rejectedAttendanceRequestEmail(emailData,companyName);
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("setattendanceapprovalstatus");
        errorLogArray.push("POSt");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_employees_of_manager` (?)",[req.body.rm_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getallemployeeslistByManagerId");
                    errorLogArray.push("GET");
                    errorLogArray.push(req.params.manager_employee_id);
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false, message: "UnableToApprove" });       
                }
                else{
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getallemployeeslistByManagerId");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);


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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getAttendanceSummaryReport");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.params.manager_employee_id);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false, message: "UnableToApprove" });       
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getAttendanceSummaryReport");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getAttendanceDetailsByAttendanceId");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.body.attendanceid);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false, message: "UnableToApprove" });       
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getAttendanceDetailsByAttendanceId");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeeConfigureShifts");
                        errorLogArray.push("GET");
                        errorLogArray.push(req.body.attendanceid);
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false });       
                    }
                    else{
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getEmployeeConfigureShifts");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("setEmployeeConfigureShift");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false });       
                    }
                    else{
                        if (result[0][0].successstate == 1) {
                            res.send({ status: true, message: "dataSaved" })
    
                        } else {
                            res.send({ status: true, message: "UnableToSave" })
                        }

                    }
                    

                })
        } 
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
    } 
    catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("setEmployeeConfigureShift");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("getEmployeeLateAttendanceReport");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false });       
                    }
                    else{
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getEmployeeLateAttendanceReport");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `get_attendance_regularizations_history_for_manager` (?)", [req.params.employee_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getAttendanceRegularizationsHistoryForManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false });       
                }
                else{
                    if (result && result.length > 0) {
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
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getAttendanceRegularizationsHistoryForManager");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
                [JSON.stringify(req.body)], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("setEmployeeAttendance");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false, message: "unableToUpload" });      
                    }
                    else {
                        res.send({ status: true, message: "excelUploadSave" })
                    }
                });

        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
     } 
     catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("setEmployeeAttendance");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
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
            listOfConnections[companyName].query("CALL `getrolescreenfunctionalities_for_role` (?,?)", [req.body.roleid, req.body.moduleid], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getrolescreenfunctionalitiesforrole");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false, message: "unableToUpload" });      
                }
                else{
                    if (result && result.length > 0) {
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getrolescreenfunctionalitiesforrole");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
    }
}

async function getSideNavigation(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `SidenaveOne` (?)", [req.body.empid], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("ATTENDANCEAPI");
                    errorLogArray.push("getSideNavigation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({ status: false, message: "unableToUpload" });      
                }
                else{
                    if (result && result.length > 0) {
                        for(let i=0;i<result[0].length;i++){
                            if(!result[0][i].children){
                                result[0][i].children =JSON.stringify(result[0][i].children)
                            }                   
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("ATTENDANCEAPI");
        errorLogArray.push("getSideNavigation");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
        }
};

/**new  attendance request mail to manager */
function attendanceRequestEmail(mailData, companyName) {

    let fdate =(new Date(mailData.fromdate).getDate()<10?"0"+new Date(mailData.fromdate).getDate():new Date(mailData.fromdate).getDate())+'-'+((new Date(mailData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.fromdate).getMonth()+1):(new Date(mailData.fromdate).getMonth()+1) )+'-'+new Date(mailData.fromdate).getFullYear();
    let tdate =(new Date(mailData.todate).getDate()<10?"0"+new Date(mailData.todate).getDate():new Date(mailData.todate).getDate())+'-'+((new Date(mailData.todate).getMonth()+1)<10?"0"+(new Date(mailData.todate).getMonth()+1):(new Date(mailData.todate).getMonth()+1)) +'-'+new Date(mailData.todate).getFullYear();
     var companyName = companyName;
    try {
         let email = mailData.emails.rm_email
         let reportingemail = mailData.emails.rm_reporting_email
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
        //  var url = 'http://localhost:4200/#/Login';

        var url = 'http://122.175.62.210:7575/#/Login';
        
         /**AWS */
        //  var url = 'https://sreeb.spryple.com/#/Login';
        
       var html = `<html>
       <head>
       <title>Attendance Request</title></head>
       <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
       <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
     
       <p style="color:black">Hi ${mailData.emails.rm_name},</p>
   
       <p style="color:black">A new attendance request by ${mailData.emails.emp_name}, is awaiting your approval. </p>
       
       <table border="1" style='border-collapse:collapse;color:black'>
       <tbody>
       <tr>
       <td width="30%"><b>Shift</b></td>
       <td>${mailData.shiftname}</td>
        </tr>
 
        <tr>
        <td width="30%"><b>Work Type</b></td>
        <td>${mailData.worktypename}</td>
         </tr>
 
         <tr>
         <td width="30%"><b>From Date</b></td>
         <td>${fdate}</td>
          </tr>
 
          <tr>
          <td width="30%"><b>To Date</b></td>
          <td>${tdate}</td>
           </tr>
 
           <tr>
          <td width="30%"><b>Reason</b></td>
          <td>${mailData.reason}</td>
           </tr>
 
       </tbody>
       </table>
 
        <p style="color:black">Best regards,</p>
        <p style="color:black">${mailData.emails.emp_name}</p>
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       <p style="color:black">Click here to perform a quick action on this request: <a href="${url}" >${url} </a></p>  
       </div></body>
       </html> `;
   
       var mailOptions = {
           from: 'no-reply@spryple.com',
           to: email,
           cc:reportingemail!=null?reportingemail:'',
           subject: 'Attendance Request by'+' '+mailData.emails.emp_name,
           html: html
       };
       transporter.sendMail(mailOptions, async function (error, info) {
           if (error) {
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("ATTENDANCEAPI");
            errorLogArray.push("attendanceRequestEmail");
            errorLogArray.push("SEND");
            errorLogArray.push("");
            errorLogArray.push( error);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
            console.log("Failed To Sent  Mail",error)
           } else {
               console.log("Mail Sent Successfully")
           }
   
       });
   
   }
   catch (e) {
       console.log('attendanceRequestEmail :', e)
     }
   
   }

/** approve attendance mail to employee */
function approveAttendanceRequestEmail(mailData,companyName) {
    try {
        var companyName = companyName;
        let fdate =(new Date(mailData.empData.fromdate).getDate()<10?"0"+new Date(mailData.empData.fromdate).getDate():new Date(mailData.empData.fromdate).getDate())+'-'+((new Date(mailData.empData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.empData.fromdate).getMonth()+1):(new Date(mailData.empData.fromdate).getMonth()+1) )+'-'+new Date(mailData.empData.fromdate).getFullYear();
        let tdate =(new Date(mailData.empData.todate).getDate()<10?"0"+new Date(mailData.empData.todate).getDate():new Date(mailData.empData.todate).getDate())+'-'+((new Date(mailData.empData.todate).getMonth()+1)<10?"0"+(new Date(mailData.empData.todate).getMonth()+1):(new Date(mailData.empData.todate).getMonth()+1)) +'-'+new Date(mailData.empData.todate).getFullYear();
        // let fdate =new Date(mailData.empData.fromdate).getDate()+'-'+(new Date(mailData.empData.fromdate).getMonth()+1) +'-'+new Date(mailData.empData.fromdate).getFullYear()
        // let tdate =new Date(mailData.empData.todate).getDate()+'-'+(new Date(mailData.empData.todate).getMonth()+1) +'-'+new Date(mailData.empData.todate).getFullYear()
        let approvereason = mailData.approvercomments !=undefined || null ? mailData.approvercomments:''
       let email = mailData.emailData.emp_email     
       let reportingemail = mailData.emailData.rm_reporting_email


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
      var html = `<html>
      <head>
      <title>Approve Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emailData.emp_name},</p>
  
      <p style="color:black">An attendance request by you has been approved by ${mailData.emailData.rm_name}.</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Shift</b></td>
      <td>${mailData.empData.shift}</td>
       </tr>

       <tr>
       <td width="30%"><b>Work Type</b></td>
       <td>${mailData.empData.worktype}</td>
        </tr>

        <tr>
        <td width="30%"><b>From Date</b></td>
        <td>${fdate}</td>
         </tr>

         <tr>
         <td width="30%"><b>To Date</b></td>
         <td>${tdate}</td>
          </tr>

          <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${approvereason}</td>
          </tr>

      </tbody>
      </table>
  <p style="color:black">Best regards,</p>
  
      <p style="color:black"><b>Spryple Mailer Team</b></p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          cc:reportingemail!=null?reportingemail:'',
          subject: 'Attendance Request Approved by'+' '+mailData.emailData.rm_name,
          html: html
      };
      transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("ATTENDANCEAPI");
            errorLogArray.push("approveAttendanceRequestEmail");
            errorLogArray.push("SEND");
            errorLogArray.push("");
            errorLogArray.push( error);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
              console.log("Failed To Sent  Mail",error)
          } else {
              console.log("Mail Sent Successfully")
          }
  
      });
  
  }
  catch (e) {
      console.log('approveAttendanceRequestEmail :', e)
  
  }
  
  }
  
  function rejectedAttendanceRequestEmail(mailData,companyName){
      try {
        var companyName =companyName;
        let fdate =(new Date(mailData.empData.fromdate).getDate()<10?"0"+new Date(mailData.empData.fromdate).getDate():new Date(mailData.empData.fromdate).getDate())+'-'+((new Date(mailData.empData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.empData.fromdate).getMonth()+1):(new Date(mailData.empData.fromdate).getMonth()+1) )+'-'+new Date(mailData.empData.fromdate).getFullYear();
        let tdate =(new Date(mailData.empData.todate).getDate()<10?"0"+new Date(mailData.empData.todate).getDate():new Date(mailData.empData.todate).getDate())+'-'+((new Date(mailData.empData.todate).getMonth()+1)<10?"0"+(new Date(mailData.empData.todate).getMonth()+1):(new Date(mailData.empData.todate).getMonth()+1)) +'-'+new Date(mailData.empData.todate).getFullYear();
        // let fdate =new Date(mailData.empData.fromdate).getDate()+'-'+(new Date(mailData.empData.fromdate).getMonth()+1) +'-'+new Date(mailData.empData.fromdate).getFullYear()
        // let tdate =new Date(mailData.empData.todate).getDate()+'-'+(new Date(mailData.empData.todate).getMonth()+1) +'-'+new Date(mailData.empData.todate).getFullYear()
       
        let email = mailData.emailData.emp_email;
        let reportingemail = mailData.emailData.rm_reporting_email;
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
      var html = `<html>
      <head>
      <title>Rejected Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emailData.emp_name},</p>
  
      <p style="color:black">An attendance request by you has been Rejected  by ${mailData.emailData.rm_name}.</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Shift</b></td>
      <td>${mailData.empData.shift}</td>
       </tr>

       <tr>
       <td width="30%"><b>Work Type</b></td>
       <td>${mailData.empData.worktype}</td>
        </tr>

        <tr>
        <td width="30%"><b>From Date</b></td>
        <td>${fdate}</td>
         </tr>

         <tr>
         <td width="30%"><b>To Date</b></td>
         <td>${tdate}</td>
          </tr>

          <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${mailData.approvercomments}</td>
          </tr>

      </tbody>
      </table>

      <p style="color:black">${mailData.emailData.rm_name}</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          cc:reportingemail!=null?reportingemail:'',
          subject: 'Attendance Request Rejected  by '+''+ mailData.emailData.rm_name,
          html: html
      };
      transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("ATTENDANCEAPI");
            errorLogArray.push("rejectedAttendanceRequestEmail");
            errorLogArray.push("SEND");
            errorLogArray.push("");
            errorLogArray.push( error);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
            errorLogs(errorLogArray);
              console.log("Failed To Sent  Mail",error)
          } else {
              console.log("Mail Sent Successfully")
          }
  
      });
  
  }
  catch (e) {
      console.log('rejectedAttendanceRequestEmail :', e)
  
  }
  
}
  
function editedAttendanceRequestEmail(mailData, companyName) {
    let fdate =(new Date(mailData.fromdate).getDate()<10?"0"+new Date(mailData.fromdate).getDate():new Date(mailData.fromdate).getDate())+'-'+((new Date(mailData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.fromdate).getMonth()+1):(new Date(mailData.fromdate).getMonth()+1) )+'-'+new Date(mailData.fromdate).getFullYear();
    let tdate =(new Date(mailData.todate).getDate()<10?"0"+new Date(mailData.todate).getDate():new Date(mailData.todate).getDate())+'-'+((new Date(mailData.todate).getMonth()+1)<10?"0"+(new Date(mailData.todate).getMonth()+1):(new Date(mailData.todate).getMonth()+1)) +'-'+new Date(mailData.todate).getFullYear();
    // let fdate =new Date(mailData.fromdate).getDate()+'-'+(new Date(mailData.fromdate).getMonth()+1) +'-'+new Date(mailData.fromdate).getFullYear()
    // let tdate =new Date(mailData.todate).getDate()+'-'+(new Date(mailData.todate).getMonth()+1) +'-'+new Date(mailData.todate).getFullYear()
     var companyName = companyName;
    try {
        let email = mailData.emails.rm_email
        let reportingemail = mailData.emails.rm_reporting_email
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
        var url = 'http://122.175.62.210:7575/#/Login';
        var html = `<html>
      <head>
      <title>edited Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emails.rm_name},</p>
  
      <p style="color:black">An attendance request edited by ${mailData.emails.emp_name} is awaiting your approval</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Shift</b></td>
      <td>${mailData.shiftname}</td>
       </tr>

       <tr>
       <td width="30%"><b>Work Type</b></td>
       <td>${mailData.worktypename}</td>
        </tr>

        <tr>
        <td width="30%"><b>From Date</b></td>
        <td>${fdate}</td>
         </tr>

         <tr>
         <td width="30%"><b>To Date</b></td>
         <td>${tdate}</td>
          </tr>

          <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${mailData.reason}</td>
          </tr>

      </tbody>
      </table>

       <p style="color:black">Best regards,</p>
  
      <p style="color:black">${mailData.emails.emp_name}</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       <p style="color:black">Click here to perform a quick action on this request: <a href="${url}" >${url} </a></p>  
     
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            cc:reportingemail!=null?reportingemail:'',
            subject: 'Edited Attendance request by '+' '+mailData.emails.emp_name,
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

function deleteAttendanceRequestEmail(mailData) {
    let fdate =(new Date(mailData.fromdate).getDate()<10?"0"+new Date(mailData.fromdate).getDate():new Date(mailData.fromdate).getDate())+'-'+((new Date(mailData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.fromdate).getMonth()+1):(new Date(mailData.fromdate).getMonth()+1) )+'-'+new Date(mailData.fromdate).getFullYear();
    let tdate =(new Date(mailData.todate).getDate()<10?"0"+new Date(mailData.todate).getDate():new Date(mailData.todate).getDate())+'-'+((new Date(mailData.todate).getMonth()+1)<10?"0"+(new Date(mailData.todate).getMonth()+1):(new Date(mailData.todate).getMonth()+1)) +'-'+new Date(mailData.todate).getFullYear();
    // let fdate =new Date(mailData.fromdate).getDate()+'-'+(new Date(mailData.fromdate).getMonth()+1) +'-'+new Date(mailData.fromdate).getFullYear()
    // let tdate =new Date(mailData.todate).getDate()+'-'+(new Date(mailData.todate).getMonth()+1) +'-'+new Date(mailData.todate).getFullYear()
    try {
        let email = mailData.emails.rm_email
        let reportingemail = mailData.emails.rm_reporting_email
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
        var html = `<html>
      <head>
      <title>Delete Attendance Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emails.rm_name},</p>
  
      <p style="color:black">An attendance request deleted by ${mailData.emails.emp_name}.</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Shift</b></td>
      <td>${mailData.shiftname}</td>
       </tr>

       <tr>
       <td width="30%"><b>Work Type</b></td>
       <td>${mailData.worktypename}</td>
        </tr>

        <tr>
        <td width="30%"><b>From Date</b></td>
        <td>${fdate}</td>
         </tr>

         <tr>
         <td width="30%"><b>To Date</b></td>
         <td>${tdate}</td>
          </tr>
      </tbody>
      </table>

       <p style="color:black">Best regards,</p>
  
      <p style="color:black">${mailData.emails.emp_name}</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            cc:reportingemail!=null?reportingemail:'',
            subject: 'Deleted Attendance request by '+' '+mailData.emails.emp_name,
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