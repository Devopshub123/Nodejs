
var bodyParser = require('body-parser');
var express = require('express');
var app = new express();
var fs = require('fs');
var path = require('path');
/**AWS */
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'AKIASAAZ23LF4AA5IPDN',
    secretAccessKey: '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',
});
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
var connection = require('./config/databaseConnection');

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
    getYearsForReport:getYearsForReport,
    // getStates:getStates,
    // getCities:getCities,
    removeProfileImage:removeProfileImage,
    setFilesMaster:setFilesMaster,
    deleteFilesMaster:deleteFilesMaster,
    setNewLeaveType:setNewLeaveType,
    getemployeeleaves:getemployeeleaves,
    getLeaveBalance:getLeaveBalance,
    getHolidaysList:getHolidaysList,
    getleavecalender:getleavecalender,
    getdurationforbackdatedleave:getdurationforbackdatedleave,
    getleavecyclelastmonth:getleavecyclelastmonth,
    getLeavesTypeInfo:getLeavesTypeInfo,
    getApprovedCompoffs:getApprovedCompoffs,
    getEmployeeRelationsForBereavementLeave:getEmployeeRelationsForBereavementLeave,
    getdaystobedisabletodate:getdaystobedisabletodate,
    getdaystobedisabledfromdate:getdaystobedisabledfromdate,
    getMaxCountPerTermValue:getMaxCountPerTermValue,
    validateleave:validateleave,
    getNextLeaveDate:getNextLeaveDate,
    setemployeeleave:setemployeeleave,
    getFilesMaster:getFilesMaster,
    setProfileImage:setProfileImage,
    removeImage:removeImage,
    getProfileImage:getProfileImage,
    getCompOffMinWorkingHours:getCompOffMinWorkingHours,
    getCompOff:getCompOff,
    getCompoffCalender:getCompoffCalender,
    getDurationforBackdatedCompoffLeave:getDurationforBackdatedCompoffLeave,
    setCompOff:setCompOff,
    getHandledLeaves:getHandledLeaves,
    getCompoffLeaveStatus:getCompoffLeaveStatus,
    getLeavesForApprovals:getLeavesForApprovals,
    getCompoffs:getCompoffs,
    leaveSattus:leaveSattus,
    getCompoffsForApproval:getCompoffsForApproval,
    getHandledLeaves:getHandledLeaves,
    getApprovedLeaves:getApprovedLeaves,
    setCompoffForApproveOrReject:setCompoffForApproveOrReject,
    getLeavesForCancellation:getLeavesForCancellation,
    getLeaveCalendarForManager:getLeaveCalendarForManager,
    getMastertables:getMastertables,
    getEmployeesForReportingManager:getEmployeesForReportingManager,
    getEmployeeLeaveDetailedReportForManager:getEmployeeLeaveDetailedReportForManager,
    getSummaryReportForManager:getSummaryReportForManager,
    getReportForPayrollProcessing:getReportForPayrollProcessing,
    cancelLeaveRequest:cancelLeaveRequest,
    getCarryforwardedLeaveMaxCount:getCarryforwardedLeaveMaxCount,
    getFilepathsMaster:getFilepathsMaster,
    leaveRequestEmail:leaveRequestEmail,
    compOffRequestEmail: compOffRequestEmail,
    cancelLeaveRequestEmail: cancelLeaveRequestEmail,
    approveCancelLeaveRequestEmail: approveCancelLeaveRequestEmail,
    rejectCancelLeaveRequestEmail: rejectCancelLeaveRequestEmail,
    deleteLeaveRequestEmail: deleteLeaveRequestEmail,
    editLeaveRequestEmail:editLeaveRequestEmail,
    getDaysToBeDisabledForFromDateCompOff:getDaysToBeDisabledForFromDateCompOff,
    deleteLeaveRequest: deleteLeaveRequest,
    getLeaveTypesToAdd:getLeaveTypesToAdd,
    errorLogs:errorLogs

};



async function getApprovedLeaves(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_approved_leaves_above_currentdate` (?)",[req.params.id],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getApprovedLeaves");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
        });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getApprovedLeaves");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}


async function getYearsForReport(req,res) {
    try {
            var  dbName = await getDatebaseName(req.params.companyName)
            let companyName = req.params.companyName;
            var listOfConnections = {};
            if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
                if(!listOfConnections.succes) {
                    listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
                }
                listOfConnections[companyName].query("CALL `get_years_for_report` ()",async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("getYearsForReport");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray)
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false })
                        }
                    }
        });
            } else {
                res.send({status: false,Message:'Database Name is missed'})
            }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getYearsForReport");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }


}

function setProfileImage(req, res) {
        /**  ------- For AWS Document Upload ---------*/
    // try{
    //     file=req.files.file;
    //     var localPath = JSON.parse(req.body.info);
    //     const folderName = JSON.parse(JSON.stringify(localPath.filepath));
    //     const params = {
    //         Bucket: folderName, //format:spryple/core
    //         Key: localPath.filename, // file will be saved as testBucket/contacts.csv
    //         Body: file.data
    //     };
    //     s3.upload(params, function(error, data) {
    //         console.log(error)
    //         if(error){
    //             console.log(error);
    //             res.send({status:false})
    //         }else{
    //             res.send({status:true,message:'Image Uploaded Succesfully'})
    //         }
    //     });  
    // }catch (e) {
    //     res.send({status:false})
    // }


    /**  --------- For Local  ---------*/
    try {
       file=req.files.file;
        var localPath = JSON.parse(req.body.info);
        var folderName = localPath.filepath;
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)

            }else {
                try {
                    file.mv(path.resolve(__dirname,folderName,localPath.filename),function(error){
                    if(error){
                       res.send({status:false})
                    } else {
                        res.send({status:true,message:'Image Uploaded Succesfully'})
                    }
                })
            }
            catch(err){
                res.send({status:false})
            }
            }
        }
        catch (err) {
            res.send({status:false})
            console.error(err)
        }
    }catch (e) {
        res.send({status:false})
    }
}


function removeProfileImage(req,res) {
    try {
              /**--------   For AWS Document Upload  -----------*/
        // var params = {  Bucket: 'your bucket', Key: 'your object' };
        // s3.deleteObject(params, function(err, data) {
        //     if (err) console.log(err, err.stack);  // error
        //     else     console.log();                 // deleted
        //   });

        /**------- For Local ------------*/
            let foldername = './Files/google/employee/'
            fs.unlink(foldername+req.params.Id+'.png',function(err,result){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Image Deleted successfully")
                }
            })
        }
        catch(e){
            console.log("removeImage",e)
        }

}


/**
 * get all leaves related to employee
 * @empId
 * @page
 * @size
 * @company
 * */

async function getemployeeleaves(req,res){
    try{  
        var  dbName = await getDatebaseName(req.params.companyName)
        let id = req.params.empid;
        let page = req.params.page;
        let size = req.params.size;
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_leaves`(?,?,?)",[id,page,size],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getemployeeleaves");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
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
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getemployeeleaves");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}

/**
 * get leaves balance related to employee
 * @empId
 * @company
 * */

async function getLeaveBalance(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let id = Number(req.params.empid);
             listOfConnections[companyName].query("CALL `get_employee_leave_balance` (?)", [id],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeaveBalance");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
             res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeaveBalance");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}

async function getHolidaysList(req,res){
    try { 
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }       
             listOfConnections[companyName].query("CALL `getemployeeholidays` (?)", [req.params.empId],
                 async function (err, result, fields) {
                     if (err) {
                         let errorLogArray = [];
                         errorLogArray.push("LMSAPI");
                         errorLogArray.push("getHolidaysList");
                         errorLogArray.push("GET");
                         errorLogArray.push(JSON.stringify(req.params));
                         errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                         errorLogArray.push(null);
                         errorLogArray.push(companyName);
                         errorLogArray.push(dbName);
                         errorLogs(errorLogArray)
                     } else {
                         if (result && result.length > 0) {
                             res.send({ data: result, status: true });
                         }
                     }
            });
        }
        else {
             res.send({status: false,Message:'Database Name is missed'})
        }

    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getHolidaysList");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function getleavecalender(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `getleavecalendar` (?)",[req.params.id],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getleavecalender");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
                    if (result && result[0].length > 0) {
                        for (var i = 0; i < result[0].length; i++) {
                            if (result[0][i].ltype == 'weekoff') {
                                result[0][i].color = '#2e0cf3'
                            } else if (result[0][i].ltype != 'weekoff' && !result[0][i].color) {
                                result[0][i].color = '#800000'
                            }
                            if (i === result[0].length - 1) {
                                res.send({ data: result[0], status: true });
                            }

                        }
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
             res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getleavecalender");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}


async function getdurationforbackdatedleave(req, res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            
            listOfConnections[companyName].query("CALL `getdurationforbackdatedleave` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getdurationforbackdatedleave");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getdurationforbackdatedleave");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function getleavecyclelastmonth(req,res){
    try{
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_leave_cycle_last_month`()",async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getleavecyclelastmonth");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
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
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getleavecyclelastmonth");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function getLeavesTypeInfo(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
   var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_leavetypes_data` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeavesTypeInfo");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
            
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
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeavesTypeInfo");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}

async function getApprovedCompoffs(req,res){
    
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_approved_compoffs` (?,?)",[req.body.id,req.body.leaveId],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getApprovedCompoffs");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
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

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getApprovedCompoffs");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}
/**completed */
async function getEmployeeRelationsForBereavementLeave(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_employee_relations_for_bereavement_leave` (?,?)",[req.body.id,req.body.leaveId],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getEmployeeRelationsForBereavementLeave");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false, Message: 'Database Name is missed' })
                    }
                }
            });
        }
        else {
            res.send({ status: false })
        } 

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getEmployeeRelationsForBereavementLeave");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}

async function getdaystobedisabletodate(req,res){
    try{
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            
            listOfConnections[companyName].query("CALL `getdays_to_be_disabled_for_to_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],async function(err,result,fields){
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getdaystobedisabletodate");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            })
            
        }
        else {
             res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getdaystobedisabletodate");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function getdaystobedisabledfromdate(req,res){
    try{
        
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(10,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            
             listOfConnections[companyName].query("CALL `getdays_to_be_disabled_for_from_date` (?,?)", [req.params.id, req.params.leaveId == 'null' ? null : req.params.leaveId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getdaystobedisabledfromdate");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
            
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            })
        }
        else {
             res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getdaystobedisabledfromdate");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function getMaxCountPerTermValue(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            
             listOfConnections[companyName].query("CALL `get_max_count_per_term_value` (?)", [req.params.id],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getMaxCountPerTermValue");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                   errorLogs(errorLogArray)
                } else {
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getMaxCountPerTermValue");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function validateleave(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 

            let id = req.body.empid;
            let fromdate = req.body.fromDate;
            let todate = req.body.toDate;
            let leavetype = req.body.leaveTypeId;
            // var fromDate = new Date(fromdate);
            // var toDate = new Date(todate);
            // var myDateString1,myDateString2;
            // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
            // // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
            // let fdate = myDateString1;
            // let tdate = myDateString2;
            var fromhalfday = req.body.fromDateHalf ? 1:0;
            var tohalfday =req.body.toDateHalf ? 1 : 0;
            var document = req.body.document ? 1 : 0;
            var leaveId = req.body.leaveId?req.body.leaveId:null

            /*Sample Format: call validateleave(23,2,'2022-04-20','2022-04-29',0,0)*/
             listOfConnections[companyName].query("CALL `validateleave` (?,?,?,?,?,?,?,?)", [id, leavetype, fromdate, todate, fromhalfday, tohalfday, document, leaveId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("validateleave");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("validateleave");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
       errorLogs(errorLogArray)
    }
}

async function getNextLeaveDate(req,res){
    try {
        var input = JSON.parse(req.params.input)
        var  dbName = await getDatebaseName(input.companyName)
        let companyName = input.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_next_leave_date` (?,?)", [input.id, input.date],
                 async function (err, result, fields) {
                 if (err) {
                     let errorLogArray = [];
                     errorLogArray.push("LMSAPI");
                     errorLogArray.push("getNextLeaveDate");
                     errorLogArray.push("GET");
                     errorLogArray.push(JSON.stringify(req.params));
                     errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                     errorLogArray.push(null);
                     errorLogArray.push(companyName);
                     errorLogArray.push(dbName);
                     errorLogs(errorLogArray)
                 } else {
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getNextLeaveDate");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}

async function setemployeeleave(req, res) {
    let emailData = req.body;
    try{

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 

            var id = req.body.id ? req.body.id : null;
            let empid = req.body.empid;
            let leavetype = req.body.leaveTypeId;
            let fromdate = req.body.fromDate;
            let todate = req.body.toDate;
            let leavecount = req.body.leaveCount
            let leavereason = req.body.reason;
            let leavestatus = "Submitted";
            let contactnumber = req.body.contact;
            let email = req.body.emergencyEmail;
            let address = 'test';
            var fromhalfdayleave=req.body.fromDateHalf?1:0;
            var tohalfdayleave =req.body.toDateHalf?1:0;
            var details = req.body.relation?req.body.relation:req.body.compOffWorkedDate?req.body.compOffWorkedDate:null;
             listOfConnections[companyName].query("CALL `set_employee_leave`(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, empid, leavetype, fromdate, todate, fromhalfdayleave, tohalfdayleave, leavecount, leavereason, leavestatus, contactnumber, email, address, null, details],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("setemployeeleave");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({status:false})
                }
                else{
                    res.send({status:true,isLeaveUpdated:id?1:0,data:result[0]})
                    if (emailData.emailData.rm_email != '' || emailData.emailData.rm_email != null) {
                       leaveRequestEmail(emailData);
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
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setemployeeleave");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

async function setFilesMaster(req, res) {
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_files_master` (?,?,?,?,?,?,?,?,?,?)",
                [req.body.id, req.body.employeeId, null, req.body.filecategory, req.body.moduleId, req.body.documentnumber, req.body.fileName, req.body.modulecode, req.body.requestId, req.body.status],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("setFilesMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray)
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })

                        } else {
                            res.send({ status: false });

                        }
                    }
                });

        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setFilesMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}

async function deleteFilesMaster(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 

            listOfConnections[companyName].query("CALL `delete_files_master` (?)",
                [req.params.id],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("deleteFilesMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray)
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });

        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("deleteFilesMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}

async function getFilesMaster(req, res) {
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_files_master` (?,?,?,?,?,?)",
                 [req.body.employeeId, req.body.candidateId, req.body.moduleId, req.body.filecategory, req.body.requestId, req.body.status],
                 async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("getFilesMaster");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = await errorLogs(errorLogArray)
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getFilesMaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
       errorLogs(errorLogArray)
    }

}



async function removeImage(req,res){
    try{
        var localPath = JSON.parse(decodeURI(req.params.path))
        let foldername = localPath.filepath;
        fs.unlink(foldername+localPath.filename,async function(err,result){
            if(err){
                let companyName =req.params.companyName;
                let  dbName = await getDatebaseName(companyName)
                let errorLogArray = [];
                errorLogArray.push("LMSAPI");
                errorLogArray.push("removeImage");
                errorLogArray.push("remove");
                errorLogArray.push("");
                errorLogArray.push( e.message);
                errorLogArray.push(null);
                errorLogArray.push(companyName);
                errorLogArray.push(dbName);
                errorLogs(errorLogArray)
                console.log(err);
            }
            else{
                res.send({status: true});
                console.log("Image Deleted successfully")
            }
        })
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("removeImage");
        errorLogArray.push("remove");
        errorLogArray.push("");
        errorLogArray.push( e.Message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
        
    }
}
async function getFilepathsMaster(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_filepaths_master` (?)",
                [req.params.moduleId], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("getFilepathsMaster");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray)
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })

                        } else {
                            res.send({ status: false });

                        }
                    }
                });

        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getFilepathsMaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}

/**Get comp-off min working hours
 * @ no parameters
 *
 * */

async function getCompOffMinWorkingHours(req,res) {

    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_compoff_min_working_hours` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getCompOffMinWorkingHours");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
        } catch (e) {
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("LMSAPI");
            errorLogArray.push("getCompOffMinWorkingHours");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.params));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)  }
}

/**Get compOff details*/
async function getCompOff(req,res) {
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_compoffs` (?,?)", [req.params.employeeId, null],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getCompOff");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCompOff");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}




async  function getCompoffCalender(req,res) {
    try {
        var calender = JSON.parse(req.params.calender);
        let  dbName = await getDatebaseName(calender.companyName)
        let companyName = calender.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `getcompoff_calendar` (?)", [calender.employeeId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getCompoffCalender");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params.calender));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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


    }catch (e) {
        let companyName =req.params.calender.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCompoffCalender");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params.calender));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}




/** Get duration for backdated comp-off leave
 * @no parameters
 * */

async function getDurationforBackdatedCompoffLeave(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_duration_for_backdated_compoff_leave` ()",
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getDurationforBackdatedCompoffLeave");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getDurationforBackdatedCompoffLeave");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}


/**Set compOff*/

async function setCompOff(req,res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
                [req.body.id, req.body.empId, req.body.workDate, parseInt(req.body.workedHours), parseInt(req.body.workedMinutes), req.body.reason, req.body.rmId, req.body.status, req.body.remarks],
                async function (err, result, fields) {
                    if(err){
                        res.send({ status: false, message: 'Unable to applied comp-off' });
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("setCompOff");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                    }else {
                        res.send({status: true, message: 'Comp-off applied successfully'})
                        if (req.body.emaildata.rm_email != '' || req.body.emaildata.rm_email != null) {
                            compOffRequestEmail(req.body);
                        }

                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }


    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setCompOff");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
};

async function getProfileImage(req, res) {
    /**  ------- For AWS Document Upload -----*/
    // try{
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
        folderName = req.body.filepath;
        var imageData={}
        var flag=false;
        fs.readFile(folderName + req.body.filename, async function (err, result) {
            if(err){
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
                await errorLogs(errorLogArray)

                flag=false;
            }else{
                flag=true
                imageData.image=result;
            }
            imageData.success=flag;
            // imageData.companyShortName=Buffer.from(req.params.companyShortName,'base64').toString('ascii');
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

async function getHandledLeaves(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_handled_leaves` (?)", [req.params.id],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getHandledLeaves");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
            
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getHandledLeaves");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}

async function getCompoffLeaveStatus(req,res) {
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_compoff_leave_status`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");   
                    errorLogArray.push("getCompoffLeaveStatus");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result.length > 0) {
                      
                        res.send({ data: result[0][0], status: true });
                    }
                    else {
                        res.send({ status: false })
                    }

                }
            })
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCompoffLeaveStatus");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}


async function getCompoffs(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_compoffs` (?,?)", [req.body.empId, req.body.rmId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getCompoffs");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCompoffs");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}



async function getLeavesForApprovals(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_leaves_for_approval` (?)", [req.params.id],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeavesForApprovals");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeavesForApprovals");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}



async function leaveSattus(req, res) {
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
            listOfConnections[companyName].query("CALL `set_approve_leave` (?,?,?,?,?,?,?)",
                [req.body.id, req.body.leaveId, req.body.empId, req.body.approverId, req.body.leaveStatus, req.body.reason, req.body.detail],
                async function (err, result, fields) {
                    if (err) {
                        res.send({ status: false });
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("leaveSattus");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = await errorLogs(errorLogArray);
                        res.send({status:false})
                    } else {
                        res.send({status: true,leaveStatus:req.body.leaveStatus})
                        if (req.body.emaildata.emp_email != '' || req.body.emaildata.emp_email != null) {
                            console.log("st--",req.body.leaveStatus)
                            if (req.body.leaveStatus == 'Approved') {
                                approveLeaveRequestEmail(emailData);

                            } else if(req.body.leaveStatus == 'Rejected'){
                                rejectedLeaveRequestEmail(emailData)

                            } else if (req.body.leaveStatus == 'Cancel Approved') {
                                approveCancelLeaveRequestEmail(emailData)
                                
                            } else if (req.body.leaveStatus == 'Cancel Rejected') {
                                rejectCancelLeaveRequestEmail(emailData)
                            } 
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("leaveSattus");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}


async function getCompoffsForApproval(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_compoffs_for_approval` (?)", [req.params.id],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getCompoffsForApproval");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCompoffsForApproval");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}

/**completed */
async  function setCompoffForApproveOrReject(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
                [req.body.id,req.body.empid,req.body.comp_off_date,parseInt(req.body.worked_hours),parseInt(req.body.worked_minutes),req.body.reason,req.body.rmid,req.body.status,req.body.remarks], async function (err, result, fields) {
                    if(err){
                        res.send({ status: false, message: 'Unable to applied comp-off' });
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("setCompoffForApproveOrReject");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                    }else {
                        res.send({status: true,compoffStatus:req.body.status})
                        if (req.body.emaildata.emp_email !='' || req.body.emaildata.emp_email !=null) {
                            if (req.body.status == 'Approved') {
                                console.log("t-1")
                                compOffApprovalRequestEmail(req.body);
                            } else{
                                compOffRejectRequestEmail(req.body)
                            }
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setCompoffForApproveOrReject");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}


async function getLeavesForCancellation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_leaves_for_cancellation` (?)",[req.params.Id],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeavesForCancellation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeavesForCancellation");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }

}


async function getLeaveCalendarForManager(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_leave_calendar_for_manager` (?)", [req.params.managerId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeaveCalendarForManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeaveCalendarForManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}

async function getMastertables(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `getmastertable` (?,?,?,?)", [req.body.tableName, req.body.status, req.body.pageNumber, req.body.pageSize, dbName],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getMastertables");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getMastertables");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}


async function getEmployeesForReportingManager(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_employees_for_reporting_manager` (?,?)", [req.body.managerId, req.body.departmentId],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getEmployeesForReportingManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getEmployeesForReportingManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}

async function getEmployeeLeaveDetailedReportForManager(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_employee_leave_detailed_report_for_manager` (?,?,?,?,?,?,?,?,?)", [req.body.employeeId, req.body.managerId, req.body.leaveType, req.body.leaveStatus, req.body.designation, req.body.fromDate, req.body.toDate, req.body.pageNumber, req.body.pageSize],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getEmployeeLeaveDetailedReportForManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getEmployeeLeaveDetailedReportForManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}



async function getSummaryReportForManager(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
             listOfConnections[companyName].query("CALL `get_summary_report_for_manager` (?,?,?,?,?)", [req.body.managerId, req.body.employeeId, req.body.designationId, req.body.departmentId, req.body.calenderYear],
                 async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getSummaryReportForManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
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
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getSummaryReportForManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray) }
}



/***
 *
 * get_report_for_payroll_processing
 * ***/
async function getReportForPayrollProcessing(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_report_for_payroll_processing` (?,?)",[req.body.empid,req.body.date], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getReportForPayrollProcessing");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result[0] && result[0].length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false });
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getReportForPayrollProcessing");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}


async function cancelLeaveRequest(req, res) {
    let emailData = req.body;
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
            let id = req.body.id;
            let empid = req.body.empid;
            let leavetype = req.body.leavetypeid;
            let fromDate = req.body.fromdate;
            let toDate = req.body.todate;
            // var myDateString1,myDateString2;
            // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
            // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
            // let fdate = myDateString1;
            // let tdate = myDateString2;
            let fromhalfday = req.body.fromhalfdayleave;
            let tohalfday =  req.body.tohalfdayleave;
            let leavecount = req.body.leavecount;
            let leavereason = req.body.leavereason;
            let contactnumber = req.body.contactnumber;
            let email = req.body.contactemail;
            let address = '';
            let leavestatus = "Cancelled"
            let actionreason = req.body.actionreason;

            listOfConnections[companyName].query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [id,empid,leavetype,fromDate,toDate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,null], async function (err, result, fields) {
                 if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("cancelLeaveRequest");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                     res.send({ status: true });
                     if (req.body.emailData.rm_email != '' || req.body.emailData.rm_email != null) {
                        cancelLeaveRequestEmail(emailData,companyName);
                    }
                     }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("cancelLeaveRequest");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    
    }
}


async function getCarryforwardedLeaveMaxCount(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_carryforwarded_leave_max_count` ()",
                [],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("LMSAPI");
                        errorLogArray.push("getCarryforwardedLeaveMaxCount");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })

                        } else {
                            res.send({ status: false });

                        }
                    }
                });

        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getCarryforwardedLeaveMaxCount");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }

}

/** getLeaveTypesToAdd */
async function getLeaveTypesToAdd(req,res){
    let  dbName = await getDatebaseName(req.params.companyName)
    let companyName = req.params.companyName;
    try {
         var listOfConnections = {};
         if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            } 
            listOfConnections[companyName].query("CALL `get_leave_types_to_add` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getLeaveTypesToAdd");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)
                }
                else if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } 
                else {
                    res.send({ status: false });
                }
                
            });
        }
        else {
             res.send({status: false,Message:'Database Name is missed'});
        }
    }
    catch (e) {
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getLeavesTypeInfo");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)  }
}
/** new leave request */
function leaveRequestEmail(mailData) {
    let fdate =(new Date(mailData.fromDate).getDate()<10?"0"+new Date(mailData.fromDate).getDate():new Date(mailData.fromDate).getDate())+'-'+((new Date(mailData.fromDate).getMonth()+1)<10?"0"+(new Date(mailData.fromDate).getMonth()+1):(new Date(mailData.fromDate).getMonth()+1) )+'-'+new Date(mailData.fromDate).getFullYear();
    let tdate =(new Date(mailData.toDate).getDate()<10?"0"+new Date(mailData.toDate).getDate():new Date(mailData.toDate).getDate())+'-'+((new Date(mailData.toDate).getMonth()+1)<10?"0"+(new Date(mailData.toDate).getMonth()+1):(new Date(mailData.toDate).getMonth()+1)) +'-'+new Date(mailData.toDate).getFullYear();
    // let fdate =new Date(mailData.fromDate).getDate()+'-'+(new Date(mailData.fromDate).getMonth()+1) +'-'+new Date(mailData.fromDate).getFullYear()
    // let tdate =new Date(mailData.toDate).getDate()+'-'+(new Date(mailData.toDate).getMonth()+1) +'-'+new Date(mailData.toDate).getFullYear()
    try {
        let email = mailData.emailData.rm_email
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
    //   var url = 'http://localhost:4200/Login';
        /**QA */
        var url = 'http://122.175.62.210:7575/#/Login';
       
         /**AWS */
    //   var url = 'http://sreeb.spryple.com/#/Login';

      var html = `<html>
      <head>
      <title>Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emailData.rm_name},</p>
  
      <p style="color:black">A new leave request by  ${mailData.emailData.emp_name} is awaiting your approval.</p>
      <table border="1" style='border-collapse:collapse;color:black'>
       <tbody>
       <tr>
       <td width="30%"><b>Leave Type</b></td>
       <td>${mailData.leavetypename}</td>
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
          <td width="30%"><b>Leave Count</b></td>
          <td>${mailData.leaveCount}</td>
           </tr>
           <tr>
           <td width="30%"><b>Reason</b></td>
           <td>${mailData.reason}</td>
            </tr>
 
       </tbody>
       </table>
       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emailData.emp_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       <p style="color:black">Click here to perform a quick action on this request: <a href="${url}" >${url} </a></p>  
     
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Leave Request by'+' '+mailData.emailData.emp_name,
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
      console.log('leaveRequestEmail :', e)
  
  }
  
}
/** approved leave request mail to employee */
function approveLeaveRequestEmail(mailData) {
    let fdate =(new Date(mailData.leavedata.fromdate).getDate()<10?"0"+new Date(mailData.leavedata.fromdate).getDate():new Date(mailData.leavedata.fromdate).getDate())+'-'+((new Date(mailData.leavedata.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.fromdate).getMonth()+1):(new Date(mailData.leavedata.fromdate).getMonth()+1) )+'-'+new Date(mailData.leavedata.fromdate).getFullYear();
    let tdate =(new Date(mailData.leavedata.todate).getDate()<10?"0"+new Date(mailData.leavedata.todate).getDate():new Date(mailData.leavedata.todate).getDate())+'-'+((new Date(mailData.leavedata.todate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.todate).getMonth()+1):(new Date(mailData.leavedata.todate).getMonth()+1)) +'-'+new Date(mailData.leavedata.todate).getFullYear();
    // let fdate =new Date(mailData.leavedata.fromdate).getDate()+'-'+(new Date(mailData.leavedata.fromdate).getMonth()+1) +'-'+new Date(mailData.leavedata.fromdate).getFullYear()
    // let tdate =new Date(mailData.leavedata.todate).getDate()+'-'+(new Date(mailData.leavedata.todate).getMonth()+1) +'-'+new Date(mailData.leavedata.todate).getFullYear()
   
    try {
        let email = mailData.emaildata.emp_email
       let approvereason = mailData.reason !=undefined || null ? mailData.reason:''
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
      <title>Approved Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A leave request by you has been Approved by ${mailData.emaildata.rm_name}.</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Leave Type</b></td>
      <td>${mailData.leavedata.display_name}</td>
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
         <td width="30%"><b>Leave Count</b></td>
         <td>${mailData.leavedata.leavecount}</td>
          </tr>
          <tr>
          <td width="30%"><b>Reason</b></td>
          <td>${mailData.leavedata.leavereason}</td>
           </tr>
           <tr>
           <td width="30%"><b>Approve Reason</b></td>
           <td>${approvereason}</td>
            </tr>
      
      </tbody>
      </table>
       <p style="color:black">Best regards,</p>
       <p style="color:black">Spryple Mailer Team</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Leave Request Approved by'+' '+ mailData.emaildata.rm_name,
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
      console.log('approveLeaveRequestEmail :', e)
  }
  }
  
function rejectedLeaveRequestEmail(mailData) {
    let fdate =(new Date(mailData.leavedata.fromdate).getDate()<10?"0"+new Date(mailData.leavedata.fromdate).getDate():new Date(mailData.leavedata.fromdate).getDate())+'-'+((new Date(mailData.leavedata.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.fromdate).getMonth()+1):(new Date(mailData.leavedata.fromdate).getMonth()+1) )+'-'+new Date(mailData.leavedata.fromdate).getFullYear();
    let tdate =(new Date(mailData.leavedata.todate).getDate()<10?"0"+new Date(mailData.leavedata.todate).getDate():new Date(mailData.leavedata.todate).getDate())+'-'+((new Date(mailData.leavedata.todate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.todate).getMonth()+1):(new Date(mailData.leavedata.todate).getMonth()+1)) +'-'+new Date(mailData.leavedata.todate).getFullYear();
    // let fdate =new Date(mailData.leavedata.fromdate).getDate()+'-'+(new Date(mailData.leavedata.fromdate).getMonth()+1) +'-'+new Date(mailData.leavedata.fromdate).getFullYear()
    // let tdate =new Date(mailData.leavedata.todate).getDate()+'-'+(new Date(mailData.leavedata.todate).getMonth()+1) +'-'+new Date(mailData.leavedata.todate).getFullYear()
   
     try {
        let email = mailData.emaildata.emp_email
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
      <title>Rejected Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A leave request by you has been Rejected by ${mailData.emaildata.rm_name}</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Leave Type</b></td>
      <td>${mailData.leavedata.display_name}</td>
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
         <td width="30%"><b>Leave Count</b></td>
         <td>${mailData.leavedata.leavecount}</td>
          </tr>
          <tr>
          <td width="30%"><b>Reason</b></td>
          <td>${mailData.leavedata.leavereason}</td>
           </tr>
           <tr>
           <td width="30%"><b>Rejected Reason</b></td>
           <td>${mailData.reason}</td>
            </tr>
      
      </tbody>
      </table>
  <p style="color:black">Best regards,</p>
  <p style="color:black">${mailData.emaildata.rm_name}.</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Leave Request Rejected by'+' '+ mailData.emaildata.rm_name,
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
      console.log('rejectedLeaveRequestEmail :', e)
  }
}


function compOffRequestEmail(mailData){
    try {
        let wdate =(new Date(mailData.workDate).getDate()<10?"0"+new Date(mailData.workDate).getDate():new Date(mailData.workDate).getDate())+'-'+((new Date(mailData.workDate).getMonth()+1)<10?"0"+(new Date(mailData.workDate).getMonth()+1):(new Date(mailData.workDate).getMonth()+1)) +'-'+new Date(mailData.workDate).getFullYear()
        // let wdate =new Date(mailData.workDate).getDate()+'-'+(new Date(mailData.workDate).getMonth()+1) +'-'+new Date(mailData.workDate).getFullYear()
     
        let email = mailData.emaildata.rm_email
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
    //  var url = 'http://localhost:4200/Login';
        /**QA */
        var url = 'http://122.175.62.210:7575/#/Login';
        
         /**AWS */
    //   var url = 'http://sreeb.spryple.com/#/Login';
      var html = `<html>
      <head>
      <title>Comp-off request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.rm_name},</p>
  
      <p style="color:black">A new comp-off request by ${mailData.emaildata.emp_name} is awaiting your approval</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Worked Date</b></td>
      <td>${wdate}</td>
       </tr>
        <tr>
        <td width="30%"><b>Worked Hours</b></td>
        <td>${mailData.workedHours}</td>
         </tr>
      
         <tr>
         <td width="30%"><b>Minutes</b></td>
         <td>${mailData.workedMinutes}</td>
          </tr>
      
          <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${mailData.reason}</td>
          </tr>
       </tbody>
      </table>
       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emaildata.emp_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       <p style="color:black">Click here to perform a quick action on this request: <a href="${url}" >${url} </a></p>  
     
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Comp-Off Request by' +' '+ mailData.emaildata.emp_name,
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
      console.log('compOffRequestEmail :', e)
  }
}
  
function compOffApprovalRequestEmail(mailData) {
    try {
        let email = mailData.emaildata.emp_email;
        let wdate =(new Date(mailData.comp_off_date).getDate()<10?"0"+new Date(mailData.comp_off_date).getDate():new Date(mailData.comp_off_date).getDate())+'-'+((new Date(mailData.comp_off_date).getMonth()+1)<10?"0"+(new Date(mailData.comp_off_date).getMonth()+1):(new Date(mailData.comp_off_date).getMonth()+1)) +'-'+new Date(mailData.comp_off_date).getFullYear()
        // let wdate =new Date(mailData.comp_off_date).getDate()+'-'+(new Date(mailData.comp_off_date).getMonth()+1) +'-'+new Date(mailData.comp_off_date).getFullYear()
     
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
      <title>Comp-off request approve</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A comp-off request by you has been Approved by ${mailData.emaildata.rm_name}</p>
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Worked Date</b></td>
      <td>${wdate}</td>
       </tr>
        <tr>
        <td width="30%"><b>Worked Hours</b></td>
        <td>${mailData.worked_hours}</td>
         </tr>
      
         <tr>
         <td width="30%"><b>Minutes</b></td>
         <td>${mailData.worked_minutes}</td>
          </tr>
      
          <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${mailData.reason}</td>
          </tr>
       </tbody>
      </table> <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emaildata.rm_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Comp-Off Request Approved by'+' '+mailData.emaildata.rm_name,
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
      console.log('compOffApprovalRequestEmail:', e)
  }
  }
  
  
  function compOffRejectRequestEmail(mailData){
    try {
        let email = mailData.emaildata.emp_email;
        // let fdate =(new Date(mailData.leavedata.fromdate).getDate()<10?"0"+new Date(mailData.leavedata.fromdate).getDate():new Date(mailData.leavedata.fromdate).getDate())+'-'+((new Date(mailData.leavedata.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.fromdate).getMonth()+1):(new Date(mailData.leavedata.fromdate).getMonth()+1) )+'-'+new Date(mailData.leavedata.fromdate).getFullYear();

        let wdate =(new Date(mailData.comp_off_date).getDate()<10?"0"+new Date(mailData.comp_off_date).getDate():new Date(mailData.comp_off_date).getDate())+'-'+((new Date(mailData.comp_off_date).getMonth()+1)<10?"0"+(new Date(mailData.comp_off_date).getMonth()+1):(new Date(mailData.comp_off_date).getMonth()+1) )+'-'+new Date(mailData.comp_off_date).getFullYear()
     
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
      <title>Comp-off reject</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A comp-off request by you has been Rejected by ${mailData.emaildata.rm_name}</p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Worked Date</b></td>
      <td>${wdate}</td>
       </tr>

       <tr>
       <td width="30%"><b>Worked Hours</b></td>
       <td>${mailData.worked_hours}</td>
        </tr>

        <tr>
        <td width="30%"><b>Minutes</b></td>
        <td>${mailData.worked_minutes}</td>
         </tr>

         <tr>
         <td width="30%"><b>Reason</b></td>
         <td>${mailData.reason}</td>
          </tr>

          <tr>
         <td width="30%"><b>Reject Reason</b></td>
         <td>${mailData.remarks}</td>
          </tr>
      </tbody>
      </table>

       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emaildata.rm_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;
  
      var mailOptions = {
          from: 'no-reply@spryple.com',
          to: email,
          subject: 'Comp-Off Request Rejected by'+' '+ mailData.emaildata.rm_name,
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
      console.log('compOffRejectRequestEmail:', e)
  }
}

function cancelLeaveRequestEmail(mailData, companyName) {
    let fdate =(new Date(mailData.fromdate).getDate()<10?"0"+new Date(mailData.fromdate).getDate():new Date(mailData.fromdate).getDate())+'-'+((new Date(mailData.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.fromdate).getMonth()+1):(new Date(mailData.fromdate).getMonth()+1) )+'-'+new Date(mailData.fromdate).getFullYear();
    let tdate =(new Date(mailData.todate).getDate()<10?"0"+new Date(mailData.todate).getDate():new Date(mailData.todate).getDate())+'-'+((new Date(mailData.todate).getMonth()+1)<10?"0"+(new Date(mailData.todate).getMonth()+1):(new Date(mailData.todate).getMonth()+1)) +'-'+new Date(mailData.todate).getFullYear();
    // let fdate = new Date(mailData.fromdate).getDate() + '-' + (new Date(mailData.fromdate).getMonth() + 1) + '-' + new Date(mailData.fromdate).getFullYear();
    // let tdate = new Date(mailData.todate).getDate() + '-' + (new Date(mailData.todate).getMonth() + 1) + '-' + new Date(mailData.todate).getFullYear();
    let aprdate = (new Date(mailData.approvedon).getDate()<10?"0"+new Date(mailData.approvedon).getDate():new Date(mailData.approvedon).getDate()) + '-' +( (new Date(mailData.approvedon).getMonth() + 1)<10?"0"+(new Date(mailData.approvedon).getMonth() + 1):(new Date(mailData.approvedon).getMonth() + 1) )+ '-' + new Date(mailData.approvedon).getFullYear();
   
    try {
        let email = mailData.emailData.rm_email;
        var companyName = companyName;
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
      <title>Cancel Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emailData.rm_name},</p>
  
      <p style="color:black">A new leave request cancelled by ${mailData.emailData.emp_name} is awaiting your approval</p>
     
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Leave Type</b></td>
      <td>${mailData.leavetype}</td>
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
         <td width="30%"><b>Leave Count</b></td>
         <td>${mailData.leavecount}</td>
          </tr>
          <tr>
          <td width="30%"><b>Cancel Reason</b></td>
          <td>${mailData.actionreason}</td>
           </tr>

           <tr>
           <td width="30%"><b>Approved Date</b></td>
           <td>${aprdate}</td>
            </tr>
      </tbody>
      </table>

       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emailData.emp_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            subject: 'Leave request cancelled by '+' '+mailData.emailData.emp_name,
            html: html
        };
        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
             let  dbName = await getDatebaseName(companyName)
             let errorLogArray = [];
             errorLogArray.push("LeaveAPI");
             errorLogArray.push("cancelLeaveRequest");
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
        console.log('cancelLeaveRequestEmail :', e)
    }
}

function approveCancelLeaveRequestEmail(mailData) {
    let fdate =(new Date(mailData.leavedata.fromdate).getDate()<10?"0"+new Date(mailData.leavedata.fromdate).getDate():new Date(mailData.leavedata.fromdate).getDate())+'-'+((new Date(mailData.leavedata.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.fromdate).getMonth()+1):(new Date(mailData.leavedata.fromdate).getMonth()+1) )+'-'+new Date(mailData.leavedata.fromdate).getFullYear();
    let tdate =(new Date(mailData.leavedata.todate).getDate()<10?"0"+new Date(mailData.leavedata.todate).getDate():new Date(mailData.leavedata.todate).getDate())+'-'+((new Date(mailData.leavedata.todate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.todate).getMonth()+1):(new Date(mailData.leavedata.todate).getMonth()+1)) +'-'+new Date(mailData.leavedata.todate).getFullYear();
    // let fdate =new Date(mailData.leavedata.fromdate).getDate()+'-'+(new Date(mailData.leavedata.fromdate).getMonth()+1) +'-'+new Date(mailData.leavedata.fromdate).getFullYear()
    // let tdate =new Date(mailData.leavedata.todate).getDate()+'-'+(new Date(mailData.leavedata.todate).getMonth()+1) +'-'+new Date(mailData.leavedata.todate).getFullYear()
    try {
        let email = mailData.emaildata.emp_email
        let approvereason = mailData.reason !=undefined || null ? mailData.reason:''
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
      <title>Approve Cancel Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A leave request by you has been Approved by ${mailData.emaildata.rm_name}</p>
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Leave Type</b></td>
      <td>${mailData.leavedata.display_name}</td>
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
         <td width="30%"><b>Leave Count</b></td>
         <td>${mailData.leavedata.leavecount}</td>
          </tr>
          <tr>
          <td width="30%"><b>Reason</b></td>
          <td>${mailData.leavedata.leavereason}</td>
           </tr>
           <tr>
           <td width="30%"><b>Approve Reason</b></td>
           <td>${approvereason}</td>
            </tr>
      
      </tbody>
      </table>

       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emaildata.rm_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            subject: 'Cancelled Leave request approved by '+' '+ mailData.emaildata.rm_name,
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
        console.log('approveCancelLeaveRequestEmail :', e)
    }
}

function rejectCancelLeaveRequestEmail(mailData){
    let fdate =(new Date(mailData.leavedata.fromdate).getDate()<10?"0"+new Date(mailData.leavedata.fromdate).getDate():new Date(mailData.leavedata.fromdate).getDate())+'-'+((new Date(mailData.leavedata.fromdate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.fromdate).getMonth()+1):(new Date(mailData.leavedata.fromdate).getMonth()+1) )+'-'+new Date(mailData.leavedata.fromdate).getFullYear();
    let tdate =(new Date(mailData.leavedata.todate).getDate()<10?"0"+new Date(mailData.leavedata.todate).getDate():new Date(mailData.leavedata.todate).getDate())+'-'+((new Date(mailData.leavedata.todate).getMonth()+1)<10?"0"+(new Date(mailData.leavedata.todate).getMonth()+1):(new Date(mailData.leavedata.todate).getMonth()+1)) +'-'+new Date(mailData.leavedata.todate).getFullYear();
    // let fdate =new Date(mailData.leavedata.fromdate).getDate()+'-'+(new Date(mailData.leavedata.fromdate).getMonth()+1) +'-'+new Date(mailData.leavedata.fromdate).getFullYear()
    // let tdate =new Date(mailData.leavedata.todate).getDate()+'-'+(new Date(mailData.leavedata.todate).getMonth()+1) +'-'+new Date(mailData.leavedata.todate).getFullYear()
     try {
        let email = mailData.emaildata.emp_email
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
      <title>Rejected Cancel Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emaildata.emp_name},</p>
  
      <p style="color:black">A Cancelled leave request by you has been Rejected by ${mailData.emaildata.rm_name} </p>
      
      <table border="1" style='border-collapse:collapse;color:black'>
      <tbody>
      <tr>
      <td width="30%"><b>Leave Type</b></td>
      <td>${mailData.leavedata.display_name}</td>
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
         <td width="30%"><b>Leave Count</b></td>
         <td>${mailData.leavedata.leavecount}</td>
          </tr>
          <tr>
          <td width="30%"><b>Reason</b></td>
          <td>${mailData.leavedata.leavereason}</td>
           </tr>
           <tr>
           <td width="30%"><b>Rejected Reason</b></td>
           <td>${mailData.reason}</td>
            </tr>
      
      </tbody>
      </table>

      <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData.emaildata.rm_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            subject: 'Cancelled Leave request rejected by '+' '+ mailData.emaildata.rm_name,
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
        console.log('rejectCancelLeaveRequestEmail :', e)
    }
}

function deleteLeaveRequestEmail(mailData){
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
                user: 'no-reply@spryple.com',
                pass: 'Sreeb@#321'
            }
        });
        var html = `<html>
      <head>
      <title>Delete Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData[0].emp_name},</p>
  
      <p style="color:black">A leave request is deleted by ${mailData[0].emp_name}</p>
      
       <p style="color:black">Leave Type:</p>
           <p style="color:black">From Date:</p>
       <p style="color:black">To Date:</p>
       <p style="color:black">Leave Count:</p>
       <p style="color:black">Reason:</p>
       <p style="color:black">Delete Reason:</p>
       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData[0].emp_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            subject: 'Delete Leave request by  {Employee Name} ',
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
        console.log('deleteLeaveRequestEmail :', e)
    }
}

function editLeaveRequestEmail(mailData){
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
                user: 'no-reply@spryple.com',
                pass: 'Sreeb@#321'
            }
        });
        var html = `<html>
      <head>
      <title>Edit Leave Request</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData[0].emp_name},</p>
  
      <p style="color:black">A leave request is deleted by ${mailData[0].emp_name}</p>
      
       <p style="color:black">Leave Type:</p>
           <p style="color:black">From Date:</p>
       <p style="color:black">To Date:</p>
       <p style="color:black">Leave Count:</p>
       <p style="color:black">Reason:</p>
       <p style="color:black">Best regards,</p>
       <p style="color:black">${mailData[0].emp_name}</p>
  
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'no-reply@spryple.com',
            to: email,
            subject: 'Edited Leave request by {employee}',
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
        console.log('editLeaveRequestEmail :', e)
    }
}


async function getDaysToBeDisabledForFromDateCompOff(req,res){
    try{
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getdays_to_be_disabled_for_from_date_comp_off` (?,?,?)",[req.body.employeeId,
                req.body.leaveId,req.body.workedDateValue],
            async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("getDaysToBeDisabledForFromDateCompOff");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result.length > 0) {
                        res.send({ status: true, data: result[0] })
                    } else {
                        res.send({ status: false, data: [] });
                    }
                }
            })
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("getDaysToBeDisabledForFromDateCompOff");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
    }
}

/*Set Delete Leave Request */
async function deleteLeaveRequest(req,res) {
    try {
        let id = req.body.id;
        let empid = req.body.empid;
        let leavetype = req.body.leavetypeid;
        let fromDate = req.body.fromdate;
        let toDate = req.body.todate;
        // var myDateString1,myDateString2;
        // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        // let fdate = myDateString1;
        // let tdate = myDateString2;
        let fromhalfday = req.body.fromhalfdayleave;
        let tohalfday =  req.body.tohalfdayleave;
        let leavecount = req.body.leavecount;
        let leavereason = req.body.leavereason;
        let contactnumber = req.body.contactnumber;
        let email = req.body.contactemail;
        let address = 'test';
        let leavestatus = "Deleted"
        let actionreason = req.body.actionreason;
        let workedDate = req.body.worked_date?req.body.worked_date:null;
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }

            listOfConnections[companyName].query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [id,empid,leavetype,fromDate,toDate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,workedDate], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("LMSAPI");
                    errorLogArray.push("deleteLeaveRequest");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({status:false})
                } else {
                    res.send({status: true})
                }
            });

        } else {
            res.send({status: true})
        }
    }catch (e) {
       
    let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("LMSAPI");
    errorLogArray.push("deleteLeaveRequest");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
    errorLogs(errorLogArray)
    }
}



/** */
/** error logs */
async function errorLogs(errorLogArray) {
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

// setNewLeaveType

async function setNewLeaveType(req,res){
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let leaveType = req.body.leaveTypeName;
        let leaveColor = req.body.leaveColor;
        let leaveDisplayName = req.body.displayName;
        con.query("CALL `setnewleavetype` (?,?,?)",[leaveType,leaveDisplayName,leaveColor], async function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add leave type'});
                let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setnewleavetype");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray)
                
            } else {
                res.send({status: true, message: 'Leave Type added successfully'})
            }
        });

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("LMSAPI");
        errorLogArray.push("setnewleavetype");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs = await errorLogs(errorLogArray) }
}