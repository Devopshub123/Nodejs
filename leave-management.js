
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
    getLeavesForApprovals:getLeavesForApprovals,
    leaveSattus:leaveSattus,
    getCompoffsForApproval:getCompoffsForApproval,
    getHandledLeaves:getHandledLeaves,
    setCompoffForApproveOrReject:setCompoffForApproveOrReject,
    getCompoffs:getCompoffs,
    getEmployeeLeaveDetailedReportForManager:getEmployeeLeaveDetailedReportForManager,
    getMastertables:getMastertables,
    getEmployeesForReportingManager:getEmployeesForReportingManager,
    getSummaryReportForManager:getSummaryReportForManager,
    getYearsForReport:getYearsForReport
};



function getLeavesForApprovals(req,res) {
    try {
        con.query("CALL `get_leaves_for_approval` (?)",[req.params.id],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeavesForApprovals :',e)

    }
}

function leaveSattus(req,res){
    try {
        con.query("CALL `set_approve_leave` (?,?,?,?,?,?)",
            [req.body.id,req.body.leaveId,req.body.empId,req.body.approverId,req.body.leaveStatus,req.body.reason], function (err, result, fields) {
            if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true,leaveStatus:req.body.leaveStatus})
                }
            });


    }catch (e) {
        console.log('setDeleteLeaveRequest :',e)
    }

}
function getCompoffsForApproval(req,res){
    try {
        con.query("CALL `get_compoffs_for_approval` (?)",[req.params.id],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getCompoffsForApproval :',e)

    }
}
function getHandledLeaves(req,res){
    try {
        con.query("CALL `get_handled_leaves` (?)",[req.params.id],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getHandledLeaves :',e)

    }
}



function setCompoffForApproveOrReject(req,res){
    try {
        console.log(req.body,'vggggg')
        con.query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.empid,req.body.comp_off_date,parseInt(req.body.worked_hours),parseInt(req.body.worked_minutes),req.body.reason,req.body.rmid,req.body.status,req.body.remarks], function (err, result, fields) {
                if(err){
                    res.send({status: false, message: 'Unable to applied comp-off'});
                }else {
                    res.send({status: true,compoffStatus:req.body.status})
                }
            });

    }catch (e) {
        console.log('getHandledLeaves :', e)

    }
}


function getCompoffs(req,res){
    try {
        con.query("CALL `get_compoffs` (?,?)",[req.body.empId,req.body.rmId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getCompoffsForApproval :',e)

    }
}

function getEmployeeLeaveDetailedReportForManager(req,res){
    try {
        con.query("CALL `get_employee_leave_detailed_report_for_manager` (?,?,?,?,?,?,?,?,?)",[req.body.employeeId,req.body.managerId,req.body.leaveType,req.body.leaveStatus,req.body.designation,req.body.fromDate,req.body.toDate,req.body.pageNumber,req.body.pageSize],function (err, result, fields) {
            console.log('err',err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getEmployeeLeaveDetailedReportForManager :',e)

    }
}

function getEmployeesForReportingManager(req,res) {
    try {
        con.query("CALL `get_employees_for_reporting_manager` (?,?)",[req.body.managerId,req.body.departmentId], function (err, result, fields) {
            console.log("huskjfkjdsk",req.body,err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeavesForApprovals :',e)

    }
}

function getMastertables(req,res) {
    try {
        con.query("CALL `getmastertable` (?,?,?,?)",[req.body.tableName,req.body.status,req.body.pageNumber,req.body.pageSize,req.body.databaseName], function (err, result, fields) {
            console.log("huskjfkjdsk",req.body,err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeavesForApprovals :',e)

    }
}
function getSummaryReportForManager(req,res) {
    try {
        con.query("CALL `get_summary_report_for_manager` (?,?,?,?,?)",[req.body.managerId,req.body.employeeId,req.body.designationId,req.body.departmentId,req.body.calenderYear],function (err, result, fields) {
            console.log('err',err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getSummaryReportForManager :',e)

    }


}

function getYearsForReport(req,res) {
    try {
        con.query("CALL `get_years_for_report` ()",function (err, result, fields) {
            console.log('err',err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getYearsForReport :',e)

    }


}

