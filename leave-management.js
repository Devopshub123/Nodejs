
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







};















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
        var localPath = JSON.parse(decodeURI(req.params.path))
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











async function getemployeeleaves(req,res){
    try{  
        var  dbName = await getDatebaseName(req.params.companyName)
        let id = req.params.empid;
        let page = req.params.page;
        let size = req.params.size;
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(1,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_employee_leaves`(?,?,?)",[id,page,size],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }

        });
        
    }
    catch(e){
        console.log('getemployeeholidays :',e)
    }
}



async function getLeaveBalance(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(2,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        let id = req.params.empid;
        listOfConnections[companyName].query("CALL `get_employee_leave_balance` (?)",[id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getLeaveBalance :',e)

    }
}

async function getHolidaysList(req,res){
    try { 
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(2,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }       
        listOfConnections[companyName].query("CALL `getemployeeholidays` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {.0
                res.send({data: result, status: true});
            }
        });

    }
    catch(e){
        console.log()
    }
}

async function getleavecalender(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(3,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        listOfConnections[companyName].query("CALL `getleavecalendar` (?)",[req.params.id],function (err, result, fields) {
            if (result && result[0].length > 0) {
               for(var i = 0; i< result[0].length; i ++ ){
                   if(result[0][i].ltype == 'weekoff'){
                       result[0][i].color = '#2e0cf3'
                   }else if (result[0][i].ltype != 'weekoff' && !result[0][i].color ){

                       result[0][i].color = '#800000'
                   }
                   if(i === result[0].length-1){
                       res.send({data: result[0], status: true});
                   }

               }
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getleavecalender :',e)

    }
}


async function getdurationforbackdatedleave(req, res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(4,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `getdurationforbackdatedleave` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getdurationforbackdatedleave :',e)
    }
}

async function getleavecyclelastmonth(req,res){
    try{
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(5,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
    
        listOfConnections[companyName].query("CALL `get_leave_cycle_last_month`()",function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }
    catch(e){
        console.log('getleavecyclelastmonth :',e)
    }
}

async function getLeavesTypeInfo(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(6,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `get_leavetypes_data` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getLeavesTypeInfo :',e)

    }
}

async function getApprovedCompoffs(req,res){
    
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(7,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `get_approved_compoffs` (?,?)",[req.body.id,req.body.leaveId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getApprovedCompoffs :',e)

    }
}

async function getEmployeeRelationsForBereavementLeave(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(8,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        listOfConnections[companyName].query("CALL `get_employee_relations_for_bereavement_leave` (?,?)",[req.body.id,req.body.leaveId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getEmployeeRelationsForBereavementLeave :',e)

    }
}

async function getdaystobedisabletodate(req,res){
    try{
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(9,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `getdays_to_be_disabled_for_to_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        })
        

    }
    catch (e){
        console.log('getdaystobedisabletodate :',e)
    }
}

async function getdaystobedisabledfromdate(req,res){
    try{
        
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(10,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `getdays_to_be_disabled_for_from_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        })
        
    }
    catch (e){
        console.log('getdaystobedisabledfromdate :',e)
    }
}

async function getMaxCountPerTermValue(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(11,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        
        listOfConnections[companyName].query("CALL `get_max_count_per_term_value` (?)",[req.params.id],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getMaxCountPerTermValue :',e)

    }
}

async function validateleave(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(12,companyName)
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
        listOfConnections[companyName].query("CALL `validateleave` (?,?,?,?,?,?,?,?)",[id,leavetype,fromdate,todate,fromhalfday,tohalfday,document,leaveId], function (err, result, fields) {
            console.log("jkbbjbbbbb",err,)
            if(result && result.length > 0) {
                res.send({data: result[0], status: true});
            }else {
                res.send({status: false})
            }
        });
        
    }catch (e) {
        console.log('validateleave :',e)
    }
}

async function getNextLeaveDate(req,res){
    try {
        var input = JSON.parse(req.params.input)
        var  dbName = await getDatebaseName(input.companyName)
        let companyName = input.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(13,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        con.query("CALL `get_next_leave_date` (?,?)",[input.id,input.date],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getNextLeaveDate :',e)

    }
}

async function setemployeeleave(req,res){
    try{

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(14,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 

        var id = req.body.id ? req.body.id : null;
        let empid = req.body.empid;
        let leavetype = req.body.leaveTypeId;
        let fromdate = req.body.fromDate;
        let todate = req.body.toDate;
        // var fromDate = new Date(fromdate);
        // var toDate = new Date(todate);
        // var myDateString1,myDateString2;
        // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        // let fdate = myDateString1;
        // let tdate = myDateString2;
        let leavecount = req.body.leaveCount
        let leavereason = req.body.reason;
        let leavestatus = "Submitted";
        let contactnumber = req.body.contact;
        let email = req.body.emergencyEmail;
        let address = 'test';
        var fromhalfdayleave=req.body.fromDateHalf?1:0;
        var tohalfdayleave =req.body.toDateHalf?1:0;
        var details = req.body.relation?req.body.relation:req.body.compOffWorkedDate?req.body.compOffWorkedDate:null;
        listOfConnections[companyName].query("CALL `set_employee_leave`(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[id,empid,leavetype,fromdate,todate,fromhalfdayleave,tohalfdayleave,leavecount,leavereason,leavestatus,contactnumber,email,address,null,details],function(err,result,fields){
            if(err){
                  res.send({status:false})
              }
              else{
                res.send({status:true,isLeaveUpdated:id?1:0,data:result[0]})

              }
        })
    }
    catch(e){
        console.log('setemployeeleaverr',e)
    }
}

async function setFilesMaster(req, res) {
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(15,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_files_master` (?,?,?,?,?,?,?,?,?,?)",
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

async function deleteFilesMaster(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(16,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 

        listOfConnections[companyName].query("CALL `delete_files_master` (?)",
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

async function getFilesMaster(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(17,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        con.query("CALL `get_files_master` (?,?,?,?,?,?)",
            [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId,req.body.status], function (err, result, fields) {
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



function removeImage(req,res){
    try{
        var localPath = JSON.parse(decodeURI(req.params.path))
        let foldername = localPath.filepath;
        fs.unlink(foldername+localPath.filename,function(err,result){
            if(err){
                console.log(err)
            }
            else{
                res.send({status: true});
                console.log("Image Deleted successfully")
            }
        })
    }
    catch(e){
        console.log("removeImage",e)
    }
}
async function getFilepathsMaster(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(18,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        } 
        listOfConnections[companyName].query("CALL `get_filepaths_master` (?)",
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

/**Get comp-off min working hours
 * @ no parameters
 *
 * */

async function getCompOffMinWorkingHours(req,res) {

    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(19,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_compoff_min_working_hours` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
    } catch (e) {
        console.log('getCompOffMinWorkingHours :', e)

    }
}

/**Get compOff details*/
async function getCompOff(req,res) {
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(20,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_compoffs` (?,?)",[req.params.employeeId,null], function (err, result, fields) {
            console.log("result",result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getCompOff :',e)
    }
}




async  function getCompoffCalender(req,res) {
    try {
        var calender = JSON.parse(req.params.calender);
        let  dbName = await getDatebaseName(calender.companyName)
        let companyName = calender.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(21,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getcompoff_calendar` (?)",[calender.employeeId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getCompoffCalender :',e)

    }
}




/** Get duration for backdated comp-off leave
 * @no parameters
 * */

async function getDurationforBackdatedCompoffLeave(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(22,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_duration_for_backdated_compoff_leave` ()",function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getDurationforBackdatedCompoffLeave :',e)

    }
}


/**Set compOff*/

async function setCompOff(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(23,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.empId,req.body.workDate,parseInt(req.body.workedHours),parseInt(req.body.workedMinutes),req.body.reason,req.body.rmId,req.body.status,req.body.remarks], function (err, result, fields) {
                if(err){
                    res.send({status: false, message: 'Unable to applied comp-off'});
                }else {
                    res.send({status: true, message: 'Comp-off applied successfully'})
                }
            });

    }catch (e) {
        console.log('setCompOff :',e)
    }
};

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
        listOfConnections= connection.checkExistingDBConnection(23,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_handled_leaves` (?)",[req.params.id],function (err, result, fields) {
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

async function getCompoffLeaveStatus(req,res) {
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(23,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_compoff_leave_status`()", function (err, result, fields) {
            if(result && result.length >0){
                res.send({data: result[0][0], status: true});
            }
            else{
                res.send({status: false})
            }


        })
    }
    catch(e){
        console.log('get_compoff_leave_status :',e)
    }

}


async function getCompoffs(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(24,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_compoffs` (?,?)",[req.body.empId,req.body.rmId],function (err, result, fields) {
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



async function getLeavesForApprovals(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(25,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_leaves_for_approval` (?)",[req.params.id],function (err, result, fields) {
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



async function leaveSattus(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(26,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_approve_leave` (?,?,?,?,?,?,?)",
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


async function getCompoffsForApproval(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(27,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_compoffs_for_approval` (?)",[req.params.id],function (err, result, fields) {
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


async  function setCompoffForApproveOrReject(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(28,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
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


async function getLeavesForCancellation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(29,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_leaves_for_cancellation` (?)",[req.params.Id],function (err, result, fields) {
            if (result && result.length > 0) {
                console.log("hbdjhvbjhdfbhvh",result,req.params.Id)
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('getLeavesForCancellation :',e)

    }

}


async function getLeaveCalendarForManager(req,res) {


    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(30,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_leave_calendar_for_manager` (?)",[req.params.managerId],function (err, result, fields) {
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

async function getMastertables(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(31,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getmastertable` (?,?,?,?)",[req.body.tableName,req.body.status,req.body.pageNumber,req.body.pageSize,'spryple_sreeb'], function (err, result, fields) {
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


async function getEmployeesForReportingManager(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(32,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_employees_for_reporting_manager` (?,?)",[req.body.managerId,req.body.departmentId], function (err, result, fields) {
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

async function getEmployeeLeaveDetailedReportForManager(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(33,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_employee_leave_detailed_report_for_manager` (?,?,?,?,?,?,?,?,?)",[req.body.employeeId,req.body.managerId,req.body.leaveType,req.body.leaveStatus,req.body.designation,req.body.fromDate,req.body.toDate,req.body.pageNumber,req.body.pageSize],function (err, result, fields) {
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



async function getSummaryReportForManager(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(34,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }

        listOfConnections[companyName].query("CALL `get_summary_report_for_manager` (?,?,?,?,?)",[req.body.managerId,req.body.employeeId,req.body.designationId,req.body.departmentId,req.body.calenderYear],function (err, result, fields) {
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



/***
 *
 * get_report_for_payroll_processing
 * ***/
async function getReportForPayrollProcessing(req,res){
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(35,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_report_for_payroll_processing` (?,?)",[req.body.empid,req.body.date], function (err, result, fields) {
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


async function cancelLeaveRequest(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(36,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        let id = req.body.id;
        let empid = req.body.empid;
        let leavetype = req.body.leavetypeid;
        let fromDate = new Date(req.body.fromdate);
        let toDate = new Date(req.body.todate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fdate = myDateString1;
        let tdate = myDateString2;let fromhalfday = req.body.fromhalfdayleave;
        let tohalfday =  req.body.tohalfdayleave;
        let leavecount = req.body.leavecount;
        let leavereason = req.body.leavereason;
        let contactnumber = req.body.contactnumber;
        let email = req.body.contactemail;
        let address = 'test';
        let leavestatus = "Cancelled"
        let actionreason = req.body.actionreason;

        listOfConnections[companyName].query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [id,empid,leavetype,fdate,tdate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,null], function (err, result, fields) {
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });


    }catch (e) {
        console.log('cancelLeaveRequest :',e)
    }
}


async function getCarryforwardedLeaveMaxCount(req,res){
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection(36,companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_carryforwarded_leave_max_count` (?)",
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

