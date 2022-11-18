
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
    getLeavesForApprovals:getLeavesForApprovals,
    leaveSattus:leaveSattus,
    getCompoffsForApproval:getCompoffsForApproval,
    getHandledLeaves:getHandledLeaves,
    getApprovedLeaves:getApprovedLeaves,
    setCompoffForApproveOrReject:setCompoffForApproveOrReject,
    getCompoffs:getCompoffs,
    getEmployeeLeaveDetailedReportForManager:getEmployeeLeaveDetailedReportForManager,
    getMastertables:getMastertables,
    getEmployeesForReportingManager:getEmployeesForReportingManager,
    getSummaryReportForManager:getSummaryReportForManager,
    getYearsForReport:getYearsForReport,
    getLeaveCalendarForManager:getLeaveCalendarForManager,
    getStates:getStates,
    getCities:getCities,
    getProfileImage:getProfileImage,
    getLeavesForCancellation:getLeavesForCancellation,
    getEmployeeInformation:getEmployeeInformation,
    setProfileImage:setProfileImage,
    removeProfileImage:removeProfileImage,
    editProfile:editProfile,
    getCarryforwardedLeaveMaxCount:getCarryforwardedLeaveMaxCount,
    getFilepathsMaster:getFilepathsMaster,
    setFilesMaster:setFilesMaster,
    getFilesMaster:getFilesMaster,
    deleteFilesMaster:deleteFilesMaster.apply,
    getReportForPayrollProcessing:getReportForPayrollProcessing
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
        con.query("CALL `set_approve_leave` (?,?,?,?,?,?,?)",
            [req.body.id,req.body.leaveId,req.body.empId,req.body.approverId,req.body.leaveStatus,req.body.reason,req.body.detail], function (err, result, fields) {
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



function getApprovedLeaves(req,res){
    try {
        con.query("CALL `get_approved_leaves_above_currentdate` (?)",[req.params.id],function (err, result, fields) {
           console.log("getApprovedLeaves:",result);
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getApprovedLeaves :',e)

    }
}
function setCompoffForApproveOrReject(req,res){
    try {
        con.query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.empid,req.body.comp_off_date,parseInt(req.body.worked_hours),parseInt(req.body.worked_minutes),req.body.reason,req.body.rmid,req.body.status,req.body.remarks], function (err, result, fields) {
                if(err){
                    res.send({status: false, message: 'Unable to applied comp-off'});
                }else {
                    res.send({status: true,compoffStatus:req.body.status})
                }
            });

    }catch (e) {
        console.log('setCompoffForApproveOrReject :', e)

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
        console.log('getCompoffs :',e)

    }
}

function getEmployeeLeaveDetailedReportForManager(req,res){
    try {
        con.query("CALL `get_employee_leave_detailed_report_for_manager` (?,?,?,?,?,?,?,?,?)",[req.body.employeeId,req.body.managerId,req.body.leaveType,req.body.leaveStatus,req.body.designation,req.body.fromDate,req.body.toDate,req.body.pageNumber,req.body.pageSize],function (err, result, fields) {
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
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getEmployeesForReportingManager :',e)

    }
}

function getMastertables(req,res) {
    try {
        con.query("CALL `getmastertable` (?,?,?,?)",[req.body.tableName,req.body.status,req.body.pageNumber,req.body.pageSize,req.body.databaseName], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getMastertables :',e)

    }
}
function getSummaryReportForManager(req,res) {
    try {
        con.query("CALL `get_summary_report_for_manager` (?,?,?,?,?)",[req.body.managerId,req.body.employeeId,req.body.designationId,req.body.departmentId,req.body.calenderYear],function (err, result, fields) {
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

function getLeaveCalendarForManager(req,res) {


    try {
        con.query("CALL `get_leave_calendar_for_manager` (?)",[req.params.managerId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeaveCalendarForManager :',e)

    }
}


function getStates(req,res) {
    try{
        con.query("CALL `getstatesforcountry`(?)",[req.params.Id],function(error,result,fields){
            if (result && result.length > 0) {
                res.send({data:result[0],status:true})
            }
            else{
                res.send({status:false})
            }
        });

    }
    catch(e){
        console.log('getstates',e)
    }

}
function getCities(req,res) {
    try{
        con.query("CALL `getcitiesforstate`(?)",[req.params.Id],function(error,result,fields){
            if (result && result.length > 0) {
                res.send({data:result[0],status:true});
            }
            else{
                res.send({status:false});
            }
        });

    }
    catch(e){
        console.log('getCities',e)
    }

}


function getProfileImage(req,res) {
    try{
        folderName = req.body.filepath;
        var imageData={}
        var flag=false;
        fs.readFile(folderName+req.body.filename,function(err,result){
            if(err){
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
        console.log('getProfileImage',e)
    }

}

function getLeavesForCancellation(req,res) {
    try {
        con.query("CALL `get_leaves_for_cancellation` (?)",[req.params.Id],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeavesForCancellation :',e)

    }

}


function getEmployeeInformation(req,res) {
    try {
        con.query("CALL `getemployeemaster` (?)",[req.params.Id], function (err, result, fields) {
            if(result && result.length > 0){
                res.send({data: result[0], status: true});
            }else{
                res.send({status: false});
            }
        });

    }catch (e) {
        console.log('getEmployeeInformation :',e)

    }
    
}


// function setProfileImage(req,res) {
//     try{
//         file=req.files.file;
//         var folderName = './Files/google/employee/'
//         try {
//             if (!fs.existsSync(folderName)) {
//                 fs.mkdirSync(folderName)
//
//             }else {
//                 file.mv(path.resolve(__dirname,folderName,req.params.Id+'.png'),function(error){
//                     if(error){
//                         console.log(error);
//                     }
//                     res.send({message:'Image Uploaded Succesfully'})
//
//                 })
//
//
//             }
//         }
//         catch (err) {
//             console.error(err)
//         }
//     }catch (e) {
//         console.log("setUploadImage:",e)
//     }
//
// }

function setProfileImage(req,res) {
    try{
        file=req.files.file;
        var localPath = JSON.parse(req.body.info);
        var folderName =localPath.filepath;
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)

            }else {
                try{
                file.mv(path.resolve(__dirname,folderName,localPath.filename),function(error){
                    if(error){
                        console.log(error);
                        res.send({status:false})
                    }else{
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
            console.error(err)
        }
    }catch (e) {
        console.log("setUploadImage:",e)
    }

}


function removeProfileImage(req,res) {
        try{
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


function editProfile(req,res){
    try {
        con.query("CALL `edit_profile` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.firstName,req.body.middlename,req.body.lastName,req.body.email,req.body.contact,req.body.address,req.body.cityId,req.body.stateId,req.body.zipCode,req.body.countryId], function (err, result, fields) {
               console.log("err-",err)
               console.log("res-",result)
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });


    }catch (e) {
        console.log('editProfile :',e)
    }

}


function getCarryforwardedLeaveMaxCount(req,res){
    try {
        con.query("CALL `get_carryforwarded_leave_max_count` (?)",
            [req.params.leaveId], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})

                } else {
                    res.send({status: false});

                }
            });


    }catch (e) {
        console.log('getCarryforwardedLeaveMaxCount :',e)
    }

}



function getFilepathsMaster(req,res){
    try {
        con.query("CALL `get_filepaths_master` (?)",
            [req.params.moduleId], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})

                } else {
                    res.send({status: false});

                }
            });


    }catch (e) {
        console.log('getFilepathsMaster :',e)
    }

}


function setFilesMaster(req, res) {
    console.log("input--",req.body)
    try {
        con.query("CALL `set_files_master` (?,?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.employeeId,null,req.body.filecategory,req.body.moduleId,req.body.documentnumber,req.body.fileName,req.body.modulecode,req.body.requestId,req.body.status], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})

                } else {
                    res.send({status: false});

                }
            });


    }catch (e) {
        console.log('setFilesMaster :',e)
    }

}


function getFilesMaster(req,res){
    try {
        con.query("CALL `get_files_master` (?,?,?,?,?,?)",
            [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId,req.body.status], function (err, result, fields) {
            
                console.log(err,result);
                if (result && result.length>0) {

                    // let serverName:string = "localhost:4200";
                    // if(result[0][0]){
                    //     let filePath = result[0][0].filepath+result[0][0].filename;
                    //     let path = url.pathToFileURL(filePath);
                    //     result[0][0].path = path;
                    // }
                                
                    res.send({status: true,data:result[0]})

                    // res.send({status: false});
                } else {
                    res.send({status: false})
                }
            });


    }catch (e) {
        console.log('getFilesMaster :',e)
    }

}

function deleteFilesMaster(req,res){
    try {
        con.query("CALL `delete_files_master` (?)",
            [req.params.id], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})

                    // res.send({status: false});
                } else {
                    res.send({status: false})
                }
            });


    }catch (e) {
        console.log('deleteFilesMaster :',e)
    }

}
// get_report_for_payroll_processing
function getReportForPayrollProcessing(req,res){
    try {
        con.query("CALL `get_report_for_payroll_processing` (?,?)",[req.body.empid,req.body.date], function (err, result, fields) {   
            if (result && result[0]&& result[0].length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false});
                }
            });


    }catch (e) {
        console.log('getReportForPayrollProcessing :',e)
    }

}