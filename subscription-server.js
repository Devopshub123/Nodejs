
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
    getDatebaseName: getDatebaseName,
    getNewExitEmployeeCountByMonth: getNewExitEmployeeCountByMonth,
    getDepartmentWiseEmployeeCountByLocation: getDepartmentWiseEmployeeCountByLocation,
    getLocationWiseEmployeeCount: getLocationWiseEmployeeCount,
    getAttendanceEmployeesCountByDate: getAttendanceEmployeesCountByDate,
    getLeavesTypesCountByMonth: getLeavesTypesCountByMonth,
    getDepartmentWiseEmployeeCountByShift:getDepartmentWiseEmployeeCountByShift
};

function getDatebaseName(companyName){

    return new Promise((res,rej)=>{
        try {
           console.log("companyName",companyName)
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

/**getNewExitEmployeeCountByMonth */
async function getNewExitEmployeeCountByMonth(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_new_exit_employee_count_by_month` (?)", [req.params.date],
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
        console.log('getNewExitEmployeeCountByMonth :',e)

    }

}

/**get Department Wise Employee Count By Location */
async function getDepartmentWiseEmployeeCountByLocation(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_department_wise_employee_count_by_location` (?)", [req.params.deptId],
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
        console.log('getDepartmentWiseEmployeeCountByLocation :',e)

    }

}

/**get Location Wise Employee Count */
async function getLocationWiseEmployeeCount(req,res) {
    let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
    try {
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_location_wise_employee_count` ()", [],
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
        console.log('getClientSubscriptionDetails :',e)

    }

}

/**get Attendance Employees Count By Date */
async function getAttendanceEmployeesCountByDate(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_attendance_employees_count_by_date` (?)", [req.params.date],
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
        console.log('getAttendanceEmployeesCountByDate :',e)

    }

}

/**get Leaves Types Count By Month */
async function getLeavesTypesCountByMonth(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_leaves_types_count_by_month` (?)", [req.params.date],
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
        console.log('getLeavesTypesCountByMonth :',e)

    }

}

/**get Department Wise Employee Count By Shift */
async function getDepartmentWiseEmployeeCountByShift(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;
        let listOfConnections = {};
        if(dbName) {
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
            listOfConnections[companyName].query("CALL `get_department_wise_employee_count_by_shift` (?)", [req.params.shiftId],
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
        console.log('getDepartmentWiseEmployeeCountByShift :',e)

    }

}