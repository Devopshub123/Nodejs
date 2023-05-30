var bodyParser = require('body-parser');
var https = require('https');
const fs = require('fs');
var express = require('express');
var app = new express();
var path = require('path');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer')
var crypto = require("crypto");
var mysql = require('mysql');
var algorithm = "aes-256-cbc";
                    // generate 16 bytes of random data
var initVector = crypto.randomBytes(16);
var Securitykey = crypto.randomBytes(32);

var admin= require('./admin-server');
var attendance= require('./attendance-server');
var leaveManagement = require('./leave-management');
var ems= require('./ems-server');
var payroll = require('./payroll');
var common = require('./common');
var subscription = require('./subscription-server');

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
var connection = require('./config/databaseConnection')

var con = connection.switchDatabase();
var pdf = require("pdf-creator-node");
var handlebars = require('handlebars');
const excelJS = require("exceljs");
var cron = require('node-cron');
const _ = require('underscore');
const async = require('async');
/**AWS */
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'AKIASAAZ23LF4AA5IPDN',
    secretAccessKey: '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',
});
const jwt = require('jsonwebtoken');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(fileUpload())
app.all("*", function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

function verifyJWTToken(req, res, next) {
    const jwtToken = req.headers.authorization?req.headers.authorization:null;
    if(jwtToken){
        // let token = jwtToken.split('-t')[1];
        let token =jwtToken
        jwt.verify(token, "HRMS",(err, data) => {
            if (err) {
                return res.send({statuscode:401,status: false,message:'In-valid Token' }); //403 is Invalid token
            }
            next();
        });
    }else {
        res.send({statuscode:403,status: false ,message:'Token is required'}); //401 is Unauthorized
    }

}
//
//
// /*Get employee Master*/
// app.post('/api/getEmployeeMaster',function(req,res) {
//     try {
//         con.query("CALL `getemployeemaster` (?)",[req.body.id], function (err, result, fields) {
//           if(err){
//             console.log(err.message);
//           }else{
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         }
//         });
//
//     }catch (e) {
//         console.log('getEmployeeMaster :',e)
//
//     }
// });
//
// /*Set Employee Master*/
//
// app.post('/api/setEmployeeMaster',function(req,res) {
//     try {
//         let hDate = (new Date(req.body.dateOfBirth));
//         var  dateOfBirth = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
//         let JoinDate = (new Date(req.body.dateOfJoin));
//         var  dateOfJoin = JoinDate.getFullYear() + "-" + (JoinDate.getMonth() + 1) + "-" + (JoinDate.getDate());
//         let input = {
//             empid:req.body.empId,
//             firstname: req.body.firstName,
//             middlename: req.body.middleName,
//             lastname: req.body.lastName,
//             personalemail: req.body.personalEmail,
//             officeemail: req.body.officeEmail,
//             dateofbirth: dateOfBirth,
//             gender: req.body.gender,
//             maritalstatus: req.body.maritalStatus,
//             usertype: req.body.userType,
//             designation: req.body.designation,
//             department: parseInt(req.body.department),
//             employmenttype: req.body.employmentType,
//             dateofjoin: dateOfJoin,
//             companylocation: req.body.companyLocation,
//             reportingmanager: req.body.reportingManager,
//             bloodgroup: req.body.bloodGroup,
//             contactnumber: req.body.contactNumber,
//             emergencycontactnumber: req.body.emergencyContactNumber,
//             emergencycontactrelation: req.body.emergencyContactRelation,
//             emergencycontactname: req.body.emergencyContactName,
//             address: req.body.address,
//             city: req.body.city,
//             state: req.body.state,
//             pincode: req.body.pincode,
//             country: req.body.country,
//             paddress: req.body.pAddress,
//             pcity: req.body.pCity,
//             pstate: req.body.pState,
//             ppincode: req.body.pPincode,
//             pcountry: req.body.pCountry,
//             aadharnumber: req.body.aadharNumber,
//             passport: req.body.passport,
//             bankname: req.body.bankName,
//             ifsccode: req.body.iFSCCode,
//             nameasperbankaccount: req.body.nameAsPerBankAccount,
//             branchname: req.body.branchName,
//             bankaccountnumber: req.body.bankAccountNumber,
//             uanumber: req.body.uANumber,
//             pfaccountnumber: req.body.pFAccountNumber,
//             pan: req.body.pAN,
//             status: 'Active',
//             esi: req.body.eSI,
//             shift: req.body.shift,
//             relations: {},
//             education: {},
//             experience:{},
//             relations: req.body.relations,
//             education: req.body.education,
//             experience: req.body.experience
//         };
//         con.query("CALL `setEmployeeMaster` (?)",
//             [JSON.stringify(input)], function (err, result, fields) {
//                 if (err) {
//                     if(err.code == 'ER_DUP_ENTRY'){
//                         var val
//                         val = err.sqlMessage.split('entry')[1];
//
//                         res.send({status: false, message: val.split('for')[0]+' is already exist in database'});
//                     }else{
//                         res.send({status: false, message: 'Unable to add employee'});
//                     }
//                 } else {
//                     res.send({status: true, message: 'Employee added successfully'})
//                 }
//             });
//
//
//     }catch (e) {
//         console.log('setEmployeeMaster :',e)
//     }
// });
//
// /*put Employee Master*/
//
// app.put('/api/putEmployeeMaster',function(req,res) {
//     try {
//         con.query("CALL `putemployeemaster` (?,?,?,?,?)",
//             [], function (err, result, fields) {
//
//                 if (err) {
//                     res.send({status: false, message: 'Unable to update employee'});
//                 } else {
//                     res.send({status: false, message: 'Employee updated Successfully'})
//                 }
//             });
//
//
//     }catch (e) {
//         console.log('putEmployeeMaster :',e)
//     }
// });
// /*Get search employee */
//
// app.put('/api/getSearch/:employeeName/:employeeId',function(req,res) {
//     try {
//         con.query("CALL `getsearch` (?,?)",
//             [req.params.employeeName,req.params.employeeId], function (err, result, fields) {
//
//                 if (err) {
//                     res.send({status: false});
//                 } else {
//                     res.send({status: true})
//                 }
//             });
//
//
//     }catch (e) {
//         console.log('getSearch :',e)
//     }
// });
//

// /*Get Get Manager And HrDetails*/
// app.get('/api/getManagerAndHrDetails/employeeId',function(req,res) {
//     try {
//         con.query("CALL `getManagerAndHrDetails` (?)",[req.params.employeeId], function (err, result, fields) {
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('getManagerAndHrDetails :',e)
//
//     }
// });
/*Set Set Apply Leave */

// app.post('/api/setApplyLeave',function(req,res) {
//     try {
//         con.query("CALL `setApplyLeave` (?,?,?,?,?)",
//             [], function (err, result, fields) {
//
//                 if (err) {
//                     res.send({status: false, message: 'Unable to insert leave request'});
//                 } else {
//                     res.send({status: false, message: 'Leave apployed successfully'})
//                 }
//             });
//
//
//     }catch (e) {
//         console.log('setApplyLeave :',e)
//     }
// });



// /*Set put Leave Request */
//
// app.put('/api/updateLeaveRequest/:Id',function(req,res) {
//     try {
//         con.query("CALL `updateLeaveRequest` (?)",
//             [req.params.LeaveId], function (err, result, fields) {
//
//                 if (err) {
//                     res.send({status: false, message: 'Unable able to update leave request'});
//                 } else {
//                     res.send({status: false, message: 'Leave request updated successfully'})
//                 }
//             });
//
//
//     }catch (e) {
//         console.log('updateLeaveRequest :',e)
//     }
// });

// /*set CompOffReviewApprove*/
// app.set('/api/setCompOffReviewApprove',function(req,res) {
//     try {
//         con.query("CALL `setCompOffReviewApprove` (?)",[req.params.employeeId], function (err, result, fields) {
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('setCompOffReviewApprove :',e)
//
//     }
// });

// /*Get UserOnLeavesmpOff*/
// app.get('/api/getUserOnLeaves',function(req,res) {
//     try {
//         con.query("CALL `getUserOnLeaves` (?)",[req.params.employeeId], function (err, result, fields) {
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('getUserOnLeaves :',e)
//
//     }
// });

//
// var saveImage = function(imgPath){
//     fs.unlink(imgPath,function (error) {
//         if(error && error.code =='ENOENT'){
//             console.info("file doesn't exist,won't remove it. ")
//         }else if (error) {
//             console.error("error occured while trying to remove  file", )
//         }else{
//             console.info("removed")
//         }
//
//     })
//
//     file.mv( imgPath,function (err, result) {
//         if(err)
//             throw err;
//     })
// }
// var file
// app.post('/api/setUploadImage/:companyName',function (req, res) {
//     try{
//         var id =1;
//         file=req.files.file;
//         var folderName = './logos/Apple/'
//         try {
//             if (!fs.existsSync(folderName)) {
//                 fs.mkdirSync(folderName)
//
//             }else {
//                 file.mv(path.resolve(__dirname,folderName,id+'.png'),function(error){
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
// });
// /*set profilepicture */
// app.post('/set_profilepicture/:companyname/:id',function(req,res){
//     try{
//         let id = req.params.id;
//         let companyName = req.params.companyname;
//         let image = req.files.image;
//         let foldername = './profile_picture/'
//         if(!fs.existsSync(foldername)){
//             fs.mkdirSync(foldername)
//         }
//         image.mv(path.resolve(__dirname,foldername,companyName+'.png'),function(error){
//             if(error){
//                 console.log(error);
//             }
//             res.send({message:'Image Uploaded Succesfully'})
//
//         })
//
//     }
//     catch(e){
//         console.log('set_profilepicture',e)
//
//     }
// });

// /*set setLeaveConfigure*/
// app.post('/api/setLeaveConfigure',function(req,res) {
//     try {
//         var l=0;
//         for(let i =0;i<req.body.length;i++){
//             let roleValues={}
//             roleValues.RuleId=req.body[i].Id;
//             roleValues.Value = req.body[i].value;
//             let hDate = (new Date());
//             roleValues.EffectiveFromDate = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
//             roleValues.EffectiveToDate=hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());;
//
//
//             con.query("CALL `setMasterTable` (?,?,?)",['LM_RuleValues','LMTHREE',JSON.stringify(roleValues)], function (err, result, fields) {
//                 l+=1;
//                 if(l ===req.body.length){
//                     if (result.length > 0) {
//                         res.send({data: result, status: true});
//                     } else {
//                         res.send({status: false})
//                     }}
//             });
//
//
//         }
//
//
//
//     }catch (e) {
//         console.log('setLeaveConfigure :',e)
//
//     }
// });



// // /*Get Employee Search Information*/
// app.post('/api/getEmployeeDetails',function(req,res) {
//     try {
//         con.query("CALL `getemployeemasterforsearch` (?,?,?,?)", [req.body.employeeId,req.body.employeeName,req.body.page,req.body.tableSize], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//     }catch (e) {
//         console.log('getEmployeeDetails :',e)
//
//     }
// });

// app.get('/api/getImage/:Id/:companyShortName', function (req, res, next) {
//
//     try{
//         folderName = './logos/Apple/';
//         var imageData={}
//         var flag=false;
//         fs.readFile(folderName+'1.png',function(err,result){
//             if(err){
//                 flag=false;
//             }else{
//                 flag=true
//                 imageData.image=result;
//             }
//             imageData.success=flag;
//             imageData.companyShortName=Buffer.from(req.params.companyShortName,'base64').toString('ascii');
//
//             res.send(imageData)
//         })
//     }catch (e) {
//         console.log("getImage:",e)
//     }
// });

// app.post('/api/validatePrefix',function(req,res) {
//     try {
//         let input={}
//         let prefix=req.body.prefix;
//         con.query("CALL `validate_prefix_assignment` (?)",prefix, function (err, result, fields) {
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('getUserOnLeaves :',e)
//
//     }
// });
// app.post('/api/setNewLeaveType',function(req,res) {
//     try {

//         let leaveType = req.body.leaveTypeName;
//         let leaveColor = req.body.leaveColor;
//         let leaveDisplayName = req.body.displayName;
//         con.query("CALL `setnewleavetype` (?,?,?)",[leaveType,leaveDisplayName,leaveColor], function (err, result, fields) {
//             if (err) {
//                 res.send({status: false, message: 'Unable to add leave type'});
//             } else {
//                 res.send({status: true, message: 'Leave Type added successfully'})
//             }
//         });

//     }catch (e) {
//         console.log('setNewLeaveType :',e)

//     }
// });

//
// /*Get Modules Screens Functionalities Master*/
// app.get('/api/getModulesScreensFunctionalitiesmaster',function(req,res) {
//     try {
//         con.query("CALL `get_modulescreenfunctionalities` ()", function (err, result, fields) {
//            console.log(result[0][0]);
//             if (result.length > 0) {
//                 res.send({data: result[0][0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//     }catch (e) {
//         console.log('get_modulescreenfunctionalities :',e)
//     }
// });




//
// /*Get Holidays filter */
//
// app.get('/api/getHolidaysFilter/:year/:locationId/:page/:size',function(req,res) {
//     console.log(req.params.year,req.params.locationId)
//
//     try {
//
//     con.query("CALL `getholidaysbyfilter` (?,?,?,?)", [req.params.year ==='null'?null:req.params.year,req.params.locationId ==='null'?null:req.params.locationId,req.params.page,req.params.size],function (err, result, fields) {
//
//     if (result && result.length > 0) {
//
//     res.send({data: result[0], status: true});
//
//     } else {
//
//     res.send({status: false})
//
//     }
//
//     });
//
//
//
//     }catch (e) {
//
//     console.log('getDesignation :',e)
//
//
//
//     }
//
//     });


// /*Get Employee Leave Balance*/
// app.get('/api/getemployeeleavebalance/:empId',function(req,res) {
//     try {
//
//         con.query("CALL `get_employee_leave_balance` (?)",[req.params.empId], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//
//         });
//
//
//
//
//     }
//     catch(e){
//         console.log('getdurationforbackdatedleave :',e)
//     }
//
// });

/*Get Employee Roles*/
app.get('/api/getemployeeroles/:empId',verifyJWTToken,function(req,res) {
    try {

        con.query("CALL `getemployeeroles` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getemployeeroles :',e)
    }
});

// /*Get Days to be disabled*/
// app.post('/api/getdaystobedisabled',function(req,res) {
//     try {
//         con.query("CALL `getdaystobedisabled` (?)",[req.body.employee_id], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//     }catch (e) {
//         console.log('getdaystobedisabled :',e)
//     }
// });
// /**Get getoffdayscount
//  *
//  * */
// app.post('/api/getoffdayscount',function(req,res) {
//     try {
//         let id = req.body.empid;
//         let leavetypeid = req.body.leaveType;
//         let fromDate =new Date(req.body.fromDate);
//         let toDate = new Date(req.body.toDate);
//         var myDateString1,myDateString2;
//         myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
//         myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
//         let fDate = myDateString1;
//         let tDate = myDateString2;
//         var fromhalfday = req.body.fromDateHalf ? 1:0;
//         var tohalfday =req.body.toDateHalf ? 1 : 0;
//         con.query("CALL `getoffdayscount` (?,?,?,?,?,?)",[id,leavetypeid,fDate,tDate,fromhalfday,tohalfday], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//     }catch (e) {
//         console.log('getoffdayscount :',e)
//     }
// });



// /**
// * getValidateExistingDetails
// * @tableNaame
// * @columnName
// * @columnValue
// *
// * */
// app.post('/api/getValidateExistingDetails',function(req,res) {
//     try {
//         con.query("CALL `checkrecord` (?,?,?)",[req.body.tableName,req.body.columnName,req.body.columnValue], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[1], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('getValidateExistingDetails :',e)
//     }
// });

// /*Get Holidays years for filter*/
// app.get('/api/getHolidaysYears/:columnName',function(req,res) {
//     try {
//         con.query("CALL `get_holiday_years_or_locations` (?)",[req.params.columnName], function (err, result, fields) {
//
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//
//     }catch (e) {
//         console.log('get_holiday_years_or_location :',e)
//
//     }
// });



async function checkRecord(req, res, next) {
    console.log("dat-",req.body)
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
        
            listOfConnections[companyName].query("CALL `checkrecord` (?,?,?)", [req.body.tableName, req.body.columnName, req.body.id], function (err, result, fields) {
                console.log("errrr-",err)
                console.log("resss-",result[1])
                if (result && result.length > 0) {
                    req.body.isexists = { result: result[1][0].isexists, status: true }
                    next()
                } else {
                    req.body.isexists = { status: false }
                    next()

                }
            });
        }
        else {
            console.log("checkRecord in employee ",e)
        }


    }catch (e) {
        console.log("checkRecord in employee ",e)
    }
}
async function checkRecordforexistence(req, res, next) {
    console.log("dat-",req.body)
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
           console.log("tableName",req.body.tableName,req.body.columnName,req.body.id)
            listOfConnections[companyName].query("CALL `checkRecordforexistence` (?,?,?)", [req.body.tableName, req.body.columnName, req.body.id], function (err, result, fields) {
                console.log("errrr-",err)
                console.log("resss-", result[0])
                console.log("resss-",result[0][0])
                if (result && result.length > 0) {
                    req.body.isexists = { result: result[0][0].isexists, status: true }
                    next()
                } else {
                    req.body.isexists = { status: false }
                    next()

                }
            });
        }
        else {
            console.log("checkRecord in employee ",e)
        }


    }catch (e) {
        console.log("checkRecord in employee ",e)
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

// /**supportingdocument for  setleave*/
// app.post('/api/setLeaveDocument/:cname/:empid',function(req,res) {
//     file=(req.files.file);
//     let cname = req.params.cname;
//     let empid = req.params.empid;
//     try {
//             let foldername = './Files/'+cname+'/employee/'+empid+'/Leave Management'
//             if (!fs.existsSync(foldername)) {
//                 fs.mkdirSync(foldername)
//             }else {
//                 file.mv(path.resolve(__dirname,foldername,empid+'.pdf'),function(error){
//                     if(error){
//                         console.log(error);
//                     }
//                     res.send({status:true})
//                 })
//             }
//
//     }catch (e) {
//         console.log('uploaddocument :',e)
//
//     }
// });
//
// app.post('/api/updateStatusall',checkRecord, function(req,res) {
//     try {
//         if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)){
//             con.query("CALL `updatestatus` (?,?,?)",[req.body.checktable,req.body.id,req.body.status], function (err, result, fields) {
//
//                 if (err) {
//                     res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
//                 } else {
//                     res.send({status: true,message:'Department is '+req.body.status+' successfully'})
//                 }
//             });
//
//         } else if(req.body.isexists.status == false){
//             res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
//         } else{
//             res.send({status: false, message: "This department have Active employees. So we are unable to inactivate this department now. Please move those employee to another department and try again"});
//         }
//
//     }catch (e) {
//         console.log('setWorkLocation :',e)
//
//     }
// });




/**
 * Getting summary report years
 * No Inputs
 *
 * */
app.get('/api/getYearsForReport/:companyName', verifyJWTToken,function(req,res) {

    leaveManagement.getYearsForReport(req,res);

});

app.post('/api/setNewLeaveType/:companyName',function(req,res) {
    leaveManagement.setNewLeaveType(req,res)
});
/**
 * get States
 * */
// app.get('/api/getStatesPerCountry/:Id', function(req,res) {

//     leaveManagement.getStates(req,res);

// });
/**
 * get States
 * */
// app.get('/api/getCitiesPerCountry/:Id', function(req,res) {

//     leaveManagement.getCities(req,res);

// });
/**
 * get States
 * */

 app.post('/api/getProfileImage/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getProfileImage(req,res);
});





/**
 * get Leaves For Cancellation
 * */
app.get('/api/getEmployeeInformation/:Id/:companyName',verifyJWTToken, function(req,res) {

    common.getEmployeeInformation(req,res);

});
app.get('/api/getEmployeeInformationforlogindate/:Id/:companyName',verifyJWTToken, function(req,res) {

    common.getEmployeeInformationforlogindate(req,res);

});

/**
 * setProfileImage
 * */
 app.post('/api/setProfileImage/',function(req,res) {
    leaveManagement.setProfileImage(req,res);
});

app.post('/api/getDaysToBeDisabledForFromDateCompOff/',verifyJWTToken,function(req,res){
    leaveManagement.getDaysToBeDisabledForFromDateCompOff(req,res)
})
// /**
//  * Remove Profile Image
//  * */
// app.delete('/api/removeProfileImage/:Id/:companyShortName', function(req,res) {
//
//     leaveManagement.removeProfileImage(req,res);
//
// });


/**
/**
 * Edit Profile
 * */
app.post('/api/editProfile',verifyJWTToken, function(req,res) {

    common.editProfile(req,res);

});










/**
 *  EMS
 * set programs master
 * */
app.post('/ems/api/setProgramsMaster/',verifyJWTToken, function(req,res) {

    ems.setProgramsMaster(req,res);

});

/**
 *  EMS
 * get programs master
 * */
app.get('/ems/api/getProgramsMaster/:pId/:companyName',verifyJWTToken, function(req,res) {

    ems.getProgramsMaster(req,res);

});


/**
 *  EMS
 * set program tasks
 * */
app.get('/ems/api/setProgramTasks/:companyName', verifyJWTToken,function(req,res) {

    ems.setProgramTasks(req,res);

});


/**
 *  EMS
 * get_program_tasks
 * */
app.get('/ems/api/getProgramTasks/:companyName',verifyJWTToken, function(req,res) {

    ems.getProgramTasks(req,res);

});



/**
 *  EMS
 * set program schedules
 * */
app.post('/ems/api/setProgramSchedules/',verifyJWTToken, function(req,res) {

    ems.setProgramSchedules(req,res);

});

/**
 *  EMS
 * get program schedules
 * */
app.get('/ems/api/getProgramSchedules/:sid/:pid/:companyName',verifyJWTToken, function(req,res) {

    ems.getProgramSchedules(req,res);

});


/**
 *  EMS
 * set employee program schedules
 * */
app.get('/ems/api/setEmployeeProgramSchedules/',verifyJWTToken, function(req,res) {

    ems.setEmployeeProgramSchedules(req,res);

});

/**
 *  EMS
 * get employee program schedules
 * */
app.get('/ems/api/getEmployeeProgramSchedules/', verifyJWTToken,function(req,res) {

    ems.getEmployeeProgramSchedules(req,res);

});



/**
 *  EMS
 * set checklists master
 * */
app.post('/ems/api/setChecklistsMaster',verifyJWTToken, function(req,res) {

    ems.setChecklistsMaster(req, res);

});



/**
 *  EMS
 * get checklists master
 * */
app.get('/ems/api/getChecklistsMaster/:deptId/:category/:companyName', verifyJWTToken,function(req,res) {
    ems.getChecklistsMaster(req,res);

});

app.get('/ems/api/getChecklistsMasterActive/:deptId/:category/:status/:companyName', verifyJWTToken,function(req,res) {
        ems.getChecklistsMasterActive(req,res);

    });

/**
 * EMS
 * set new hire
 */
app.post('/ems/api/setNewHire/', verifyJWTToken,function(req,res) {

    ems.setNewHire(req,res);
});

/**
 * EMS
 * get new hire list
 * */

app.get('/ems/api/getNewHireDetails/:id/:companyName',verifyJWTToken, function(req,res) {
    ems.getNewHireDetails(req,res);
});

/**
 * EMS
 * set reason master
 * */
app.post('/ems/api/setReasonMaster/', verifyJWTToken,function(req,res) {

    ems.setReasonMaster(req,res);
});

/** EMS
 * get active reasons list
 */
app.get('/ems/api/getActiveReasonList/:companyName',verifyJWTToken, function(req,res) {

    ems.getActiveReasonList(req,res);
});

/** EMS
 * get all reasons list
 */
 app.get('/ems/api/getReasonMasterData/:companyName', verifyJWTToken,function(req,res) {

     ems.getReasonMasterData(req, res);
 });

/** EMS
 * set termination category
 */
app.post('/ems/api/setTerminationCategory/', verifyJWTToken,function(req,res) {

        ems.setTerminationCategory(req, res);
});

/** EMS
 * get termination category
 */
 app.get('/ems/api/getTerminationCategory/:companyName', verifyJWTToken,function(req,res) {

    ems.getTerminationCategory(req, res);
 });

/** EMS
 * set document category
 */
 app.post('/ems/api/setDocumentCategory/',verifyJWTToken, function(req,res) {

    ems.setDocumentCategory(req,res);
 });

 /** EMS
 * get document category
 */
  app.get('/ems/api/getDocumentCategory/:companyName', verifyJWTToken,function(req,res) {

    ems.getDocumentCategory(req, res);
  });

/** EMS
 * get document category
 */
    app.get('/ems/api/getEmployeesList/:companyName', verifyJWTToken,function(req,res) {

        ems.getEmployeesList(req, res);
    });

 /** EMS
 * set candidate pre onboarding details
 */
  app.post('/ems/api/setPreonboardCandidateInformation',function(req,res) {
   ems.setPreonboardCandidateInformation(req,res);
 });

/** EMS
 * get candidate list
 */
 app.get('/ems/api/getCandidateDetails/:emp_Id/:companyName', function(req,res) {
    ems.getCandidateDetails(req, res);
});


/** EMS
 * get employee check list
 */
 app.get('/ems/api/getEmployeeChecklists/:emp_Id/:category/:dept_Id/:companyName',verifyJWTToken, function(req,res) {

    ems.getEmployeeChecklists(req, res);
});


  app.post('/ems/api/setEmployeeResignation/', verifyJWTToken,function(req,res) {

    ems.setEmployeeResignation(req, res);
  });
  app.get('/ems/api/getEmployeesResignation/:id/:companyName', verifyJWTToken,function(req,res) {

    ems.getEmployeesResignation(req, res);
  });
  app.post('/ems/api/setEmployeeTermination/', verifyJWTToken,function(req,res) {

    ems.setEmployeeTermination(req, res);
  });
  app.get('/ems/api/getEmployeesTermination/:id/:companyName',verifyJWTToken, function(req,res) {

    ems.getEmployeesTermination(req, res);
  });
  app.get('/ems/api/getActiveTerminationCategories/:companyName',verifyJWTToken, function(req,res){
    ems.getActiveTerminationCategories(req,res)
  })
  app.get('/ems/api/getEmployeeslistforTermination/:companyName', verifyJWTToken,function(req,res){
    ems.getEmployeeslistforTermination(req,res)
  })


  /** set onboard candidate work experience */
  app.post('/ems/api/setCandidateExperience',function(req,res) {

    ems.setCandidateExperience(req, res);
  });

    /** set onboard candidate education */
    app.post('/ems/api/setCandidateEducation',function(req,res) {
        ems.setCandidateEducation(req, res);
    });

   /** getDepartmentEmployeesByDesignation */
    app.get('/ems/api/getDepartmentEmployeesByDesignation/:sid/:pid/:companyName', verifyJWTToken,function(req,res) {

        ems.getDepartmentEmployeesByDesignation(req,res);

    });

    /** */
    app.post('/ems/api/setProgramSchedulemail/',verifyJWTToken,function(req,res){
        ems.setProgramSchedulemail(req,res);
    });
    /** */
    app.get('/ems/api/getallEmployeeProgramSchedules/:eid/:sid/:companyName',verifyJWTToken,function(req,res){
        ems.getallEmployeeProgramSchedules(req,res)
    })
    /** */
    app.post('/ems/api/setselectEmployeesProgramSchedules/',verifyJWTToken,function(req,res){
        ems.setselectEmployeesProgramSchedules(req,res)
    })
    /** */
    app.get('/ems/api/getEmployeesForProgramSchedule/:id/:companyName',verifyJWTToken,function(req,res){
        ems.getEmployeesForProgramSchedule(req,res)
    });

    /** getFileMasterForEMS*/
    app.post('/ems/api/getFileMasterForEMS/',verifyJWTToken,function(req,res){
        ems.getFileMasterForEMS(req,res)
    });

    /** */
    app.post('/ems/api/setFileMasterForEMS/',verifyJWTToken,function(req,res){
        ems.setFileMasterForEMS(req,res)
    });

    /** */
    app.post('/ems/api/getFilecategoryMasterForEMS',verifyJWTToken,function(req,res){
        ems.getFilecategoryMasterForEMS(req,res)
    });
    app.post('/ems/api/getFilecategoryMasterForEMSPreonboarding',function(req,res){
        ems.getFilecategoryMasterForEMS(req,res)
    });


  /** EMS set employee master details */

  app.post('/ems/api/setEmpPersonalInfo', verifyJWTToken,function(req,res) {
    ems.setEmpPersonalInfo(req,res);
  });

//   app.post('/ems/api/setEmployeeMasterData', function(req,res) {
//     ems.setEmployeeMasterData(req,res);
//   });


    /** getOnboardingSettings*/
    app.get('/ems/api/getOnboardingSettings/:companyName',verifyJWTToken,function(req,res){
        ems.getOnboardingSettings(req,res)
    })
     /** updateselectEmployeesProgramSchedules*/
     app.post('/ems/api/updateselectEmployeesProgramSchedules/',verifyJWTToken,function(req,res){
        ems.updateselectEmployeesProgramSchedules(req,res)
    })
    /**setEmsEmployeeColumnConfigurationValues */
    app.post('/ems/api/setEmsEmployeeColumnConfigurationValues/',verifyJWTToken,function(req,res){
        ems.setEmsEmployeeColumnConfigurationValues(req,res)
    })
    /**getEmsEmployeeColumnConfigurationValue */
    app.get('/ems/api/getEmsEmployeeColumnConfigurationValue/:id/:companyName',verifyJWTToken,function(req,res){
        ems.getEmsEmployeeColumnConfigurationValue(req,res)
    })

      /**getFilepathsMasterForEMS */
    app.get('/ems/api/getFilepathsMasterForEMS/:moduleId/:companyName',verifyJWTToken,function(req,res){
        ems.getFilepathsMasterForEMS(req,res)
    })

 /**getFilepathsMasterForEMS */
          app.get('/ems/api/getFilepathsMasterForEMSPreonboarding/:moduleId/:companyName',function(req,res){
            ems.getFilepathsMasterForEMS(req,res)
        })

   /**setFilesMasterForEMS */
   app.post('/ems/api/setFilesMasterForEMS/',verifyJWTToken,function(req,res){
    ems.setFilesMasterForEMS(req,res)
   })
       /**setFilesMasterForEMS preonboarding */
   app.post('/ems/api/setFilesMasterForEMSPreonboarding/',function(req,res){
    ems.setFilesMasterForEMS(req,res)
    })

/**setDocumentOrImageForEMS */
app.post('/ems/api/setDocumentOrImageForEMS/:companyName', function (req, res) {
   
    ems.setDocumentOrImageForEMS(req,res)
    })
/**EMS getUserLoginData */
app.get('/ems/api/getUserLoginData/:companyName',verifyJWTToken,function(req,res){
    ems.getUserLoginData(req,res)
})
/**usersLogin*/
app.post('/ems/api/usersLogin/',verifyJWTToken,function(req,res){
    ems.usersLogin(req,res)
})
/**EMS getEmsEmployeeColumnFilterData */
app.get('/ems/api/getEmsEmployeeColumnFilterData/:companyName',verifyJWTToken,function(req,res){
    ems.getEmsEmployeeColumnFilterData(req,res)
})
/**EMS getEmsEmployeeDataForReports */
app.post('/ems/api/getEmsEmployeeDataForReports/',verifyJWTToken,function(req,res){
    ems.getEmsEmployeeDataForReports(req,res)
})

    /** get Employee Personal Info (HR)*/
    app.get('/ems/api/getEmpPersonalInfo/:id/:companyName',verifyJWTToken,function(req,res){
        ems.getEmpPersonalInfo(req,res)
    })

/**getDocumentsForEMS */
app.post('/ems/api/getDocumentsForEMS/',verifyJWTToken,function(req,res){
    ems.getDocumentsForEMS(req,res)
    })

    /**getDocumentsForEMS */
app.post('/ems/api/getDocumentOrImagesForEMS/', verifyJWTToken, function (req, res) {
    ems.getDocumentOrImagesForEMS(req,res)
    })

        /**getDocumentsForEMS */
app.post('/ems/api/getDocumentOrImagesForEMSPreonboarding/',function(req,res){
    ems.getDocumentOrImagesForEMS(req,res)
    })

    // /**removeDocumentOrImagesForEMS LOCAL */

    app.delete('/ems/api/removeDocumentOrImagesForEMS/:companyName/:path',verifyJWTToken,function(req,res){
        ems.removeDocumentOrImagesForEMS(req,res)
        })
    app.delete('/ems/api/removeDocumentOrImagesForEMSpreonboarding/:companyName/:path',function(req,res){
            ems.removeDocumentOrImagesForEMS(req,res)
    })

/**removeDocumentOrImagesForEMS for AWS */

// app.post('/ems/api/removeDocumentOrImagesForEMS/', function (req, res) {
//     ems.removeDocumentOrImagesForEMS(req, res)
// })
/**
 * 
 * Delete Files Master
 * */
 app.get('/ems/api/deleteFilesMaster/:id/:companyName',verifyJWTToken,function(req,res) {

    ems.deleteFilesMaster(req,res);

});
app.get('/ems/api/deleteFilesMasterpreonboarding/:id/:companyName',function(req,res) {
    ems.deleteFilesMaster(req,res);
});
/**
 * */
 app.post('/ems/api/Messages',verifyJWTToken, function(req,res) {
    ems.Messages(req,res);

 });
 app.post('/ems/api/MessagesPreonboarding',function(req,res) {
    ems.Messages(req,res);

});
  /** EMS set employee job details */
  app.post('/ems/api/setEmpJobDetails',verifyJWTToken, function(req,res) {
    ems.setEmpJobDetails(req,res);
  });

    /** EMS set employee education details */
    app.post('/ems/api/setEmpEducationDetails', verifyJWTToken,function(req,res) {
        ems.setEmpEducationDetails(req,res);
      });

/** EMS set employee education details */
    app.post('/ems/api/setEmpEmployement',verifyJWTToken, function(req,res) {
        ems.setEmpEmployement(req,res);
    });

/** get Employee Personal Info (HR)*/
    app.get('/ems/api/getEmpEmployement/:id/:companyName',verifyJWTToken,function(req,res){
        ems.getEmpEmployement(req,res)
    })

/** get Employee Personal Info (HR)*/
app.get('/ems/api/getEmpEducationDetails/:id/:companyName',verifyJWTToken,function(req,res){
    ems.getEmpEducationDetails(req,res)
})

/** get Employee Personal Info (HR)*/
app.get('/ems/api/getEmpJobDetails/:id/:companyName',verifyJWTToken,function(req,res){
    ems.getEmpJobDetails(req,res)
})
/** getOffboardingSettings*/
app.get('/ems/api/getOffboardingSettings/:companyName',verifyJWTToken,function(req,res){
    ems.getOffboardingSettings(req,res)
});
/** EMS setOffboardingSettings */
app.post('/ems/api/setOffboardingSettings',verifyJWTToken, function(req,res) {
    ems.setOffboardingSettings(req,res);
});

//** */
app.post('/ems/api/getEmployeesPendingChecklists', verifyJWTToken,function(req,res) {
    ems.getEmployeesPendingChecklists(req,res);

});

    ////////
/** EMS setOnboardingSettings */
app.post('/ems/api/setOnboardingSettings',verifyJWTToken, function(req,res) {
    ems.setOnboardingSettings(req,res);
});

app.get('/ems/api/getActiveAnnouncementsTopics/:companyName',verifyJWTToken,function(req,res){
    ems.getActiveAnnouncementsTopics(req,res)
})
app.get('/ems/api/getAnnouncements/:announcement_id/:companyName',verifyJWTToken,function(req,res){
    ems.getAnnouncements(req,res)
})
app.post('/ems/api/setAnnouncements/',verifyJWTToken,function(req,res){
    ems.setAnnouncements(req,res)
})

app.get('/ems/api/getFilesForApproval/:companyName',verifyJWTToken,function(req,res){
    ems.getFilesForApproval(req,res)
})
/**Document Approval */
app.post('/ems/api/documentApproval/',verifyJWTToken,function(req,res){
    ems.documentApproval(req,res)
})


/**Document Approval */
app.post('/ems/api/setEmployeeChecklists',verifyJWTToken,function(req,res){
    ems.setEmployeeChecklists(req,res)
})
//** */
app.post('/ems/api/getEmpOffboardTerminationChecklists',verifyJWTToken, function(req,res) {
    ems.getEmpOffboardTerminationChecklists(req,res);

});
  /** get Employee Personal Info (HR)*/
  app.get('/ems/api/getEmpAnnouncements/:companyName',verifyJWTToken,function(req,res){
    ems.getEmpAnnouncements(req,res)
  })

  //** */
app.post('/ems/api/getEmpResignationPendingChecklists', verifyJWTToken,function(req,res) {
    ems.getEmpResignationPendingChecklists(req,res);

});

app.post('/ems/api/getEmployeesResignationForHr/', verifyJWTToken,function(req,res) {

    ems.getEmployeesResignationForHr(req, res);
});


/** EMS
 * get employee check list
 */
app.get('/ems/api/getReportingManagerForEmp/:id/:companyName',verifyJWTToken, function(req,res) {

    ems.getReportingManagerForEmp(req, res);
});


app.get('/ems/api/getHrDetails/:companyName', verifyJWTToken,function(req,res) {

    ems.getHrDetails(req, res);
});
app.get('/ems/api/getnoticeperiods/:companyName', verifyJWTToken,function(req,res) {
    ems.getnoticeperiods(req, res);
});
app.post('/ems/api/setprogramspasterstatus/', verifyJWTToken,function(req,res) {
    ems.setprogramspasterstatus(req,res);
});

app.get('/ems/api/getEmailsByEmpid/:eid/:companyName',verifyJWTToken, function (req, res) {
    ems.getEmployeeEmailData(req,res)

})

app.get('/ems/api/getActiveEmployeeProgramSchedules/:sid/:companyName',verifyJWTToken, function (req, res) {
    ems.getActiveEmployeeProgramSchedules(req,res)
})
app.get('/ems/api/getInductionProgramAssignedEmployee/:sid/:companyName',verifyJWTToken, function (req, res) {
    ems.getInductionProgramAssignedEmployee(req,res)
})
////////
// app.use("/admin", admin);
// app.use("/attendance", attendance);
// app.use("/ems",ems);
// app.use("/payroll",payroll);




 
/**employee login */
app.post('/api/emp_login', function (req, res, next) {
    common.login(req,res)
})

/**
 * Leaves
 * get all leaves related to employee
 * @empId
 * */
app.get('/api/getemployeeleaves/:empid/:page/:size/:companyName',verifyJWTToken,function(req,res){
    leaveManagement.getemployeeleaves(req,res)
})



/*Get User Leave Balance*/
app.get('/api/getLeaveBalance/:empid/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getLeaveBalance(req,res)
});

/**
 * Get Holidays based on employeeId
 * */
app.get('/api/getHolidaysList/:empId/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getHolidaysList(req,res)
})

/**
 * Leave
 *  getleavecalender based on employeeId
 *  retuens weekoffs,holidays and leaves
 * */

app.get('/api/getleavecalender/:id/:companyName',verifyJWTToken,function(req,res){
    
    leaveManagement.getleavecalender(req,res)
})

/**Get Duration for back dated leave*/
app.get('/api/getdurationforbackdatedleave/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getdurationforbackdatedleave(req,res)
    
});
/**get leave cycle for last month */
app.post('/api/getleavecyclelastmonth/:companyName',function(req,res){
    leaveManagement.getleavecyclelastmonth(req,res)

})


/**Get Leaves Types*/
app.get('/api/getLeavesTypeInfo/:companyName',verifyJWTToken,function(req,res) {
   leaveManagement.getLeavesTypeInfo(req,res)
});


/**Get approved compoffs dates for leave submit*/
app.post('/api/getApprovedCompoffs',verifyJWTToken,function(req,res) {
    leaveManagement.getApprovedCompoffs(req,res)
});

/**get relations for bereavement leave submit*/
app.post('/api/getEmployeeRelationsForBereavementLeave',verifyJWTToken,function(req,res) {

    leaveManagement.getEmployeeRelationsForBereavementLeave(req,res)
});

/**Get days to be disabled fromdate */
app.get('/api/getdaystobedisabledfromdate/:id/:leaveId/:companyName',verifyJWTToken,function(req,res){
    leaveManagement.getdaystobedisabledfromdate(req,res)
})


/**Get days to be disabled to-date */
app.get('/api/getdaystobedisabledtodate/:id/:leaveId/:companyName',verifyJWTToken,function(req,res){
   leaveManagement.getdaystobedisabletodate(req,res)
})

/**
 * Event based leave getting max number of leaves eligible per term
 **/
app.get('/api/getMaxCountPerTermValue/:id/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getMaxCountPerTermValue(req,res);
    
});

/**Validate leave and get count of leaves based on from date and to date */
app.post('/api/validateleave',verifyJWTToken,function(req,res) {
    leaveManagement.validateleave(req,res)
    
});


/** Get next leave Date for validations
 * @no parameters
 * */

 app.get('/api/getNextLeaveDate/:input',verifyJWTToken,function(req,res) {
    leaveManagement.getNextLeaveDate(req,res);
});

/**Submit leave */
app.post('/api/setemployeeleave',verifyJWTToken,function(req,res){

    leaveManagement.setemployeeleave(req,res)
})
/**
 * Leave
 * Insert or Update file data
 * */
 app.post('/api/setFilesMaster/', verifyJWTToken,function(req,res) {

    leaveManagement.setFilesMaster(req,res);

});

/**remove/delete image */
app.delete('/api/removeImage/:path',function(req,res){
    leaveManagement.removeImage(req,res)
});

/**
 * All modules
 * Delete files paths based on @id
 * */
 app.get('/ems/api/deleteFilesMaster/:id/:companyName', verifyJWTToken,function(req,res) {

    leaveManagement.deleteFilesMaster(req,res);

});
/**
 * Get module code for set file paths
 * */
 app.post('/api/getFilesMaster/',verifyJWTToken, function(req,res) {
    leaveManagement.getFilesMaster(req,res);
});
/**
 * Get module code for set file paths
 * */
 app.get('/api/getFilepathsMaster/:moduleId/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getFilepathsMaster(req,res);

});
app.get('/api/getMastertable/:tableName/:status/:page/:size/:companyName',function(req,res) {
    common.getMastertable(req, res)
});
/**pre onboardin master table */
app.get('/api/getMastertablePreonboarding/:tableName/:status/:page/:size/:companyName',function(req,res) {
     common.getMastertable(req,res)
    });

app.post('/attendance/api/getEmployeeAttendanceNotifications', verifyJWTToken,function (req, res) {
     attendance.getEmployeeAttendanceNotifications(req,res)

});
/**Get comp-off min working hours
 * @ no parameters
 *
 * */

app.get('/api/getCompOffMinWorkingHours/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getCompOffMinWorkingHours(req,res)
});

/**Get compOff details*/
app.get('/api/getCompOff/:employeeId/:rmid/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getCompOff(req,res)
});


/**Get calender details for compoff
 * @EmployeeId
 * @year
 * */

app.get('/api/getCompoffCalender/:calender',verifyJWTToken,function(req,res) {
   leaveManagement.getCompoffCalender(req,res)
});



/** Get duration for backdated comp-off leave
 * @no parameters
 * */

app.get('/api/getDurationforBackdatedCompoffLeave/:companyName',verifyJWTToken,function(req,res) {
    leaveManagement.getDurationforBackdatedCompoffLeave(req,res)

});

/**Set compOff*/

app.post('/api/setCompOff',verifyJWTToken,function(req,res) {
    leaveManagement.setCompOff(req,res)
});
/*Get Role Screen Functionalities*/
app.post('/attendance/api/getrolescreenfunctionalities',verifyJWTToken, function (req, res) {
attendance.getrolescreenfunctionalities(req,res)
});
/**
 * Manager dashboard approved or reject leaves
 * */
app.get('/api/getHandledLeaves/:id/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getHandledLeaves(req,res);

});

/**Get approved compoffs dates for leave submit*/
app.get('/api/getLeavesForApprovals/:id/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getLeavesForApprovals(req,res);

})





app.get('/api/getcompoffleavestatus/:companyName',verifyJWTToken,function(req,res){
    leaveManagement.getCompoffLeaveStatus(req,res)
});
/**
 * Manager and employee comp-off history
 * */
app.post('/api/getCompoffs',verifyJWTToken, function(req,res) {

    leaveManagement.getCompoffs(req,res);


});


/**
 * Manager approved or reject leaves
 * leave delete and cancel
 * */
app.post('/api/setLeaveStatus',verifyJWTToken, function(req,res) {

    leaveManagement.leaveSattus(req,res);

});
/**
 * Manager dashboard approved or reject compoffs
 * */
app.get('/api/getCompoffsForApproval/:id/:companyName', verifyJWTToken,function(req,res) {

    leaveManagement.getCompoffsForApproval(req,res);

});

/**
 * Manager dashboard approved or reject leaves
 * */
app.post('/api/setCompoffForApproveOrReject', verifyJWTToken,function(req,res) {

    leaveManagement.setCompoffForApproveOrReject(req,res);

});

/**
 * get Leaves For Cancellation
 * */
app.get('/api/getLeavesForCancellation/:Id/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getLeavesForCancellation(req,res);

});


/**
 * get Leave Calendar For Manager
 * */
app.get('/api/getLeaveCalendarForManager/:managerId/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getLeaveCalendarForManager(req,res);

});

app.post('/api/getMastertables', verifyJWTToken,function(req,res) {

    leaveManagement.getMastertables(req,res);


});
app.post('/api/getEmployeesForReportingManager',verifyJWTToken, function(req,res) {

    leaveManagement.getEmployeesForReportingManager(req,res);


});

app.post('/api/getEmployeeLeaveDetailedReportForManager',verifyJWTToken, function(req,res) {

    leaveManagement.getEmployeeLeaveDetailedReportForManager(req,res);


});
/**
 * Get summary report for manager
 *
 * */

app.post('/api/getSummaryReportForManager', verifyJWTToken,function(req,res) {

    leaveManagement.getSummaryReportForManager(req,res);


});
app.get('/api/getLeaveCycleYearOptions/:companyName', function (req, res) {

    leaveManagement.getLeaveCycleYearOptions(req,res);

});

// get_leave_cycle_year_options
/**Get All Employees List
 *
 */

app.get('/attendance/api/getallemployeeslist/:companyName', verifyJWTToken,function (req, res) {

    attendance.getallemployeeslist(req,res);

});


/**getReportForPayrollProcessing */
app.post('/api/getReportForPayrollProcessing/',verifyJWTToken, function(req,res) {
    leaveManagement.getReportForPayrollProcessing(req,res);
});

/**CancelLeave Request */
app.post('/api/cancelLeaveRequest',verifyJWTToken,function(req,res) {
   leaveManagement.cancelLeaveRequest(req,res)
});
/** Delete Leave Request */
app.post('/api/setDeleteLeaveRequest',verifyJWTToken,function(req,res) {
    leaveManagement.deleteLeaveRequest(req,res)
});

/**Get Leave Rules*/
app.get('/api/getErrorMessages/:errorCode/:page/:size/:companyName',verifyJWTToken,function(req,res) {
common.getErrorMessages(req,res)
});



app.get('/admin/api/getstatuslist/:companyName',verifyJWTToken,function(req,res){
    admin.getstatuslist(req,res)
})

/*set Designation*/
app.post('/api/setDesignation',verifyJWTToken,function (req,res) {
    admin.setDesignation(req,res)
});

/*set Designation*/
app.put('/api/putDesignation',verifyJWTToken,function(req,res) {
    admin.putDesignation(req,res)
});

/*Set Departments*/
app.put('/api/putDepartments',verifyJWTToken,function(req,res) {
    admin.putDepartments(req,res);
});

/*set Department*/
app.post('/api/setDepartments',verifyJWTToken,function(req,res) {
    admin.setDepartment(req,res)
});

app.post('/api/updateStatus',checkRecord, verifyJWTToken,function(req,res) {
    admin.updateStatus(req,res)
});

/**
 * Update designation status
 * @id
 * @status
 *
 * */
app.post('/api/designationstatus',checkRecord,verifyJWTToken,function(req,res) {
    admin.designationStatus(req,res)
});

/**
 * Get Work Location
 * */
app.post('/api/getactiveWorkLocation',verifyJWTToken,function(req,res) {
    admin.getactiveWorkLocation(req,res)
});

/**
 * set Holidays
 *
 * */

app.post('/api/setHolidays',verifyJWTToken,function(req,res) {
    admin.setHolidays(req,res)


});
/**
 * Get Holidays filter
 * */
app.get('/api/getHolidaysFilter/:year/:locationId/:page/:size/:companyName', verifyJWTToken,function (req, res) {
    admin.getHolidysFilter(req,res)
});

/**
 * Delete Holiday
 * */
app.delete('/api/deleteHoliday/:holidayId/:companyName',verifyJWTToken,function(req,res) {
    admin.deleteHoliday(req,res)

});


/**
 * set Holidays
 * **/
app.put('/api/putHolidays',verifyJWTToken,function(req,res) {
    admin.putHolidays(req,res)
});

/*put comapny information*/
app.put('/api/putCompanyInformation',verifyJWTToken,function(req,res) {

    admin.putCompanyInformation(req,res)
});

/*Set comapny information*/
app.post('/api/setCompanyInformation',verifyJWTToken,function(req,res) {
    admin.setCompanyInformation(req,res)
});


/**getstates */
app.get('/api/getStates/:id/:companyName',function(req,res){
   admin.getStates(req,res)
})
/**get Cities */
app.get('/api/getCities/:id/:companyName',function(req,res){
    admin.getCities(req,res)
})

/**
 * getting leave polices based on leave category Id
 */
app.get('/api/getLeavePolicies/:leaveCategoryId/:isCommonRule/:pageNumber/:pageSize/:companyName',verifyJWTToken,function(req,res) {
    admin.getLeavePolicies(req,res)
});


/**
 * Update Leave type display name*/
app.post('/api/updateLeaveDisplayName',verifyJWTToken,function(req,res) {
    admin.updateLeaveDisplayName(req,res);
});

app.post('/api/setAdvancedLeaveRuleValues',verifyJWTToken,function(req,res) {
    admin.setAdvancedLeaveRuleValues(req,res);
});

/*setToggleLeaveType */
app.post('/api/setToggleLeaveType',verifyJWTToken,function(req,res) {
    admin.setToggleLeaveType(req,res);
});
/**
 * get Leave Types to set as AdvancedLeave
 */
app.get('/api/getLeaveTypesForAdvancedLeave/:companyName',verifyJWTToken,function(req,res) {
    admin.getLeaveTypesForAdvancedLeave(req,res)
});

/**
 * Insert or update leave polices
 */
app.post('/api/setLeavePolicies',verifyJWTToken,function(req,res) {
    admin.setLeavePolicies(req,res)
});

/**
 * get Carry forwarded Leave MaxCount
 * */
app.get('/api/getCarryforwardedLeaveMaxCount/:leaveId/:companyName',verifyJWTToken, function(req,res) {

    leaveManagement.getCarryforwardedLeaveMaxCount(req,res);

});
app.get('/api/getApprovedLeaves/:id/:companyName',verifyJWTToken, function(req,res) {
    leaveManagement.getApprovedLeaves(req,res);
});
app.get('/api/getLeaveTypesToAdd/:companyName',verifyJWTToken, function(req,res) {
    leaveManagement.getLeaveTypesToAdd(req,res);
});


/** Get all Work Location for company*/
app.post('/api/getWorkLocation',verifyJWTToken,function(req,res) {
    admin.getWorkLocation(req,res)
});

/** Update status is a generic call to update status*/

app.post('/api/updateStatusall',checkRecord,verifyJWTToken, function(req,res) {
    admin.updateStatusall(req,res)
});
/**updateStatusworklocation*/

app.post('/api/updateStatusworklocation',checkRecordforexistence,verifyJWTToken, function(req,res) {
    admin.updateStatusall(req,res)
});

/** Insert or update Work Location for company*/
app.post('/api/setWorkLocation',verifyJWTToken,function(req,res) {
    admin.setWorkLocation(req,res)
});

/**SetErrorMessages is a generic procedure for insert messages */
app.post('/api/setErrorMessages',verifyJWTToken,function(req,res) {
    common.setErrorMessages(req,res)
});

/**
 *
 *@param boon_emp_id *@param biometric_id */
app.post('/admin/api/getIntegrationEmpidsLookup',verifyJWTToken, function (req, res) {
    admin.getIntegrationEmpidsLookup(req,res)


});

/**
 *
 *@param boon_emp_id *@param biometric_id */

app.post('/admin/api/setIntegrationEmpidsLookup',verifyJWTToken, function (req, res) {
    admin.setIntegrationEmpidsLookup(req,res)

});


//**@param code ,*@param pagenumber, @param pagesize **/
app.post('/admin/api/getAttendenceMessages',verifyJWTToken, function (req, res) {
    admin.getAttendenceMessages(req,res)
});

//**@param jsonData */
app.post('/admin/api/setAttendenceMessages', verifyJWTToken,function (req, res) {
    admin.setAttendenceMessages(req,res)
});

/**@param employee_id */
app.post('/attendance/api/getEmployeeCurrentShifts',verifyJWTToken,function(req,res){
    attendance.getEmployeeCurrentShifts(req,res)
});

/**
 *@param manager_id *@param employee_id *@param date */

app.post('/attendance/api/getemployeeattendancedashboard',verifyJWTToken, function (req, res) {
    attendance.getemployeeattendancedashboard(req,res)
});
/**@param employee_id in, `fromd_date` date,in `to_date` date)*/
app.post('/attendance/api/getEmployeeShiftByDates',verifyJWTToken,function(req,res){
    attendance.getEmployeeShiftByDates(req,res)
});

/**@param employee_id in, `fromd_date` date,in `to_date` date)*/
app.post('/attendance/api/getEmployeeWeekoffsHolidaysForAttendance',verifyJWTToken,function(req,res){
    attendance.getEmployeeWeekoffsHolidaysForAttendance(req,res)
});

/**Get employee_attendance_regularization
 **@employee_id  parameters
 * **/

app.get('/attendance/api/getemployeeattendanceregularization/:employee_id/:companyName',verifyJWTToken, function (req, res) {
    attendance.getemployeeattendanceregularization(req,res)
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
app.post('/attendance/api/setemployeeattendanceregularization',verifyJWTToken, function (req, res) {
    attendance.setemployeeattendanceregularization(req,res)
})

//**delete_employee_attendance_regularization */
app.post('/attendance/api/deleteAttendanceRequestById',verifyJWTToken, function (req, res) {
    attendance.deleteAttendanceRequestById(req,res)
});

/**
 *
 `get_attendance_monthly_report`(
 `manager_employee_id` int(11),
 `employee_id` int(11),
 `calendar_date` datetime
 )
 *@param manager_employee_id *@param employee_id *@param date */

app.post('/attendance/api/getAttendanceMonthlyReport',verifyJWTToken, function (req, res) {
    attendance.getAttendanceMonthlyReport(req,res)
});

/**get_pending_attendance_regularizations(23) for manager
 **@employee_id  parameters
 */

app.get('/attendance/api/getpendingattendanceregularizations/:employee_id/:companyName',verifyJWTToken, function (req, res) {
    attendance.getpendingattendanceregularizations(req,res)
});


/**get_employees_for_reporting_manager for manager
 **@employee_id  parameters
 *@designation_id  parameters
 */
app.get('/attendance/api/getEmployeesByManagerId/:employee_id/:companyName',verifyJWTToken, function (req, res) {
    attendance.getEmployeesByManagerId(req,res);
});
/** Get Shift Detaild By Employee Id
 * @employee_id Parameter */
app.get('/attendance/api/getemployeeshift/:employee_id/:companyName',verifyJWTToken, function (req, res) {
    attendance.getemployeeshift(req,res);
});


app.get('/attendance/api/getAttendanceRegularizationByManagerId/:manager_employee_id/:companyName', verifyJWTToken,function (req, res) {
    attendance.getAttendanceRegularizationByManagerId(req,res);
});


/** setattendanceapprovalstatus
 `set_attendance_approval_status`(
 `id` int(11),
 `approver_comments` varchar(255),
 `action_by` int(11),
 `approval_status` varchar(32)
 ) */
app.post('/attendance/api/setattendanceapprovalstatus',verifyJWTToken, function (req, res) {
    attendance.setattendanceapprovalstatus(req,res)

})

app.post('/attendance/api/getallemployeeslistByManagerId',verifyJWTToken, function (req, res) {
    attendance.getallemployeeslistByManagerId(req,res)

})

/**
 *@param manager_empid *@param employee *@param fromdate *@param todate */

app.post('/attendance/api/getAttendanceSummaryReport',verifyJWTToken, function (req, res) {
    attendance.getAttendanceSummaryReport(req,res)
});


/**
 *@param attendanceid  */

app.post('/attendance/api/getAttendanceDetailsByAttendanceId',verifyJWTToken, function (req, res) {
    attendance.getAttendanceDetailsByAttendanceId(req,res)
});


app.post('/attendance/api/getEmployeeConfigureShifts',verifyJWTToken, function (req, res) {
    attendance.getEmployeeConfigureShifts(req,res)
});
/**Get All Active Shifts */
app.get('/admin/api/getActiveShiftIds/:companyName',verifyJWTToken, function (req, res) {
    admin.getActiveShiftIds(req,res);

});

/** `set_employee_shifts`(
 `shift_id` int(11),
 `from_date` datetime,
 `to_date` datetime,
 `weekoffs` JSON, -- format: [1,2] 1- Sunday, 2 - Monday etc.
 `empids` JSON -- format: [1,2,3,4]
 ) */
app.post('/attendance/api/setEmployeeConfigureShift',verifyJWTToken, function (req, res) {
    attendance.setEmployeeConfigureShift(req,res);
});



/**
 `get_employee_late_attendance_report`(
 'manager_empid'
     `employee_id` int(11),
     `shift_id` int(11),
     `from_date` date,
     `to_date` date
 )
 */
app.post('/attendance/api/getEmployeeLateAttendanceReport', verifyJWTToken,function (req, res) {
    attendance.getEmployeeLateAttendanceReport(req,res);
});


app.get('/attendance/api/getAttendanceRegularizationsHistoryForManager/:employee_id/:companyName', verifyJWTToken,function (req, res) {
    attendance.getAttendanceRegularizationsHistoryForManager(req,res)
});
/**attendance Excel Data insert Method  set_employee_attendance

 */

app.post('/attendance/api/setEmployeeAttendance/:companyName',verifyJWTToken, function (req, res) {
  attendance.setEmployeeAttendance(req,res);
});



app.post('/admin/api/setShiftMaster',verifyJWTToken, function (req, res) {
    admin.setShiftMaster(req,res)
})
/**Get All SHifts */
app.get('/admin/api/getAllShifts/:companyName',verifyJWTToken, function (req, res) {
    admin.getAllShifts(req,res);

});
/**Update Shift Status
 **@shift_id  parameters
 **@status_value parameters

 * **/

app.post('/admin/api/updateShiftStatus',verifyJWTToken, function (req, res) {
    admin.updateShiftStatus(req,res);

});



/**Get getShiftsDetailsById
 **@shift_id  parameters
 * **/

app.get('/admin/api/getShiftsDetailsById/:shift_id/:companyName', verifyJWTToken,function(req, res) {
    admin.getShiftsDetailsById(req,res)
});








/**verify email for forget password */
app.get('/api/forgetpassword/:email/:companyName', function (req, res, next) {
    common.forgetpassword(req,res)

})



/**reset password */
app.post('/api/resetpassword', function (req, res, next) {
 common.resetpassword(req,res);
})

/**Change Password */
app.post('/api/changePassword',verifyJWTToken,function(req,res){
   common.changePassword(req,res);
})




/**EMS messagemaster */
app.post('/admin/api/getEMSMessages', verifyJWTToken,function (req, res) {
 admin.getEMSMessages(req,res)
});
app.post('/admin/api/setEMSMessages',verifyJWTToken, function (req, res) {
    admin.setEMSMessages(req,res)
});

/*Get Modules Screens Master*/
app.get('/api/getModulesWithScreens/:companyName',verifyJWTToken,function(req,res) {
  admin.getModulesWithScreens(req,res);
});

/*Get Screens Functionalities*/
app.get('/api/getScreenWithFunctionalities/:moduleId/:companyName',verifyJWTToken,function(req,res) {
    admin.getScreenWithFunctionalities(req,res);
});

/*Get Role Screen Functionalities By Role Id*/
app.get('/api/getRoleScreenfunctionalitiesByRoleId/:roleId/:companyName',verifyJWTToken,function(req,res) {
    admin.getRoleScreenfunctionalitiesByRoleId(req,res);
});

/*Get Role Screen Functionalities Based On Role*/
app.post('/attendance/api/getrolescreenfunctionalitiesforrole',verifyJWTToken, function (req, res) {
   attendance.getrolescreenfunctionalitiesforrole(req,res)
});

/*Get Role Master*/
app.get('/api/getrolemaster/:companyName',verifyJWTToken,function(req,res) {
    admin.getrolemaster(req,res);
});


/*Get Screen Master*/
app.get('/api/getscreensmaster/:companyName',verifyJWTToken,function(req,res) {
    admin.getscreensmaster(req,res)
});


/*Get Functionalities Master*/
app.get('/api/getfunctionalitiesmaster/:companyName',verifyJWTToken,function(req,res) {
   admin.getfunctionalitiesmaster(req,res);
});
/*Get Screen Functionalities Master*/
app.get('/api/getscreenfunctionalitiesmaster/:companyName',verifyJWTToken,function(req,res) {
   admin.getscreenfunctionalitiesmaster(req,res)
});

/*setRoleAccess */
app.post('/api/setRoleAccess',verifyJWTToken,function(req,res) {
    admin.setRoleAccess(req,res)
});

/*setRoleMaster */
app.post('/api/setRoleMaster',verifyJWTToken,function(req,res) {
    admin.setRoleMaster(req,res)
});

/**getreportingmanagers */
app.post('/api/getReportingManager',verifyJWTToken,function(req,res){
   admin.getReportingManager(req,res)
})

/*Get Role Screen Functionalities*/
app.get('/api/getrolescreenfunctionalities/:roleId/:companyName',verifyJWTToken,function(req,res) {
    admin.getrolescreenfunctionalities(req,res)
});
//-------------------
/** get employees list by department */
app.get('/ems/api/getEmployeesListByDeptId/:did/:companyName',verifyJWTToken, function (req, res) {
    ems.getEmployeesListByDeptId(req,res)
})

/** set induction conduct by */
app.post('/ems/api/setInductionConductedby',verifyJWTToken, function (req, res) {
    ems.setInductionConductedby(req,res)
})

/** get induction conducted by employees */
app.get('/ems/api/getInductionConductedbyEmployees/:companyName',verifyJWTToken, function (req, res) {
    ems.getInductionConductedbyEmployees(req,res)
})

/** get employees list by program id and dept id */
app.get('/ems/api/getCondcutedEmployeesByPrgIdAndDeptId/:pid/:did/:companyName',verifyJWTToken,function(req,res) {
    ems.getCondcutedEmployeesByPrgIdAndDeptId(req,res)
 });

/** get departments by program id  */
app.get('/ems/api/getDepartmentsByProgramId/:pid/:companyName',verifyJWTToken,function(req,res) {
    ems.getDepartmentsByProgramId(req,res)
 });

/** update induction conduct by status */
app.post('/ems/api/updateInductionConductedbyStatus', verifyJWTToken,function (req, res) {
    ems.updateInductionConductedbyStatus(req,res)
})


app.get('/api/payrollReport', function (req, res) {
    generatePayrollReport()
    res.send({Status :200,Date:new Date()})
})

cron.schedule('0  9 * * *', async function () {   // Every day 11 am
    let date = new Date();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    let day = new Date(lastDay.toJSON().slice(0, 10).replace(/-/g, '/')).getDay();
    if (day != 0 && day != 6) {
        lastDay.setDate(lastDay.getDate() - 1);
    } else if (day === 0) {   //0 means Sunday
        lastDay.setDate(lastDay.getDate() - 2); // last but two days
    } else if (day === 6) { //6 means Saturday
        lastDay.setDate(lastDay.getDate() - 1); // last but one dasy
    }
    let todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    if (lastDay.toJSON().slice(0, 10).replace(/-/g, '/') == todayDate) {
        generatePayrollReport()
    }
});



async function generatePayrollReport() {
    let connection  = mysql.createConnection( {
        // host: "192.168.1.30",
        host: "65.0.224.72",
        user: "root",
         port: 3306,
         password: "Sreebaw$1103",
         database: 'spryple_sreeb',
         dateStrings: true,
         multipleStatements: true
    });
    connection.query("CALL `get_report_for_payroll_processing` (?,?)", [null, new Date().getFullYear() + '/' + (new Date().getMonth()+1) + '/' + new Date().getDate()], async function (err, result, fields) {
        if (result && result[0] && result[0].length > 0) {
            for (let i = 0; i < result[0].length; i++) {
                result[0][i].index = i + 1;
                if (i === result[0].length - 1) {
                    try {
                        let excelBufferData=  await generateExcel(result[0]);
                        // let pdfBufferData = await  generatePDF(result[0]);
                        let info = result[0];
                        let subject = 'Payroll report-' + new Date().toJSON().slice(0, 10).replace(/-/g, '/');
                        readHTMLFile('./templates/emailPayrollReport.html', function (err, html) {
                            if (err) {
                                console.log('error reading file', err);
                                return;
                            }
                            var template = handlebars.compile(html);
                            var replacements = {
                                payrollData: info,
                                date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                                companyName: 'Sreeb Technologies Pvt Ltd'
                            };
                            var htmlToSend = template(replacements);
                            transporter.sendMail({
                                sender: 'no-reply@spryple.com',
                                //  to: 'finance@sreebtech.com',
                                to:  ['finance@sreebtech.com','sraavi@sreebtech.com'],
                                subject: subject,
                                body: 'mail content...',
                                html: htmlToSend,
                                attachments: [
                                   
                                    {
                                        'filename': 'Payroll report ' + new Date().toJSON().slice(0, 10).replace(/-/g, '/') + '.xlsx',
                                        'content': excelBufferData,
                                        'contentType':
                                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    }
                                ]
                            }), function (err, success) {
                                if (err) {
                                    // Handle error
                                }

                            }
                        });
                    } catch (e) {
                        console.log("Payroll report error",e)
                    }
                }
            }

        } else {
            console.log(err, 'Payroll report error ')
        }
    });

}


/**
 * file or html read function
 * @param {*} path is for file path
 * @param {*} callback
 */

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};



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


async function generatePDF(data) {
    let _this = this;
    let info = data;
    const html = fs.readFileSync("./templates/monthlyPayrollReport.html", "utf8");
    let options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "15mm",
            contents: '<div style="text-align: center;">Payroll Report -' + new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' </div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
    let document = {
        html: html,
        data: {
            payrollData: data,
            // users:users
        },
        type:'buffer'
    };
    return await pdf.create(document,options);
    
}




async function generateExcel(results) {
/** Create Excel workbook and worksheet **/
const workbook = new excelJS.Workbook();
const worksheet = workbook.addWorksheet('Report');

/** Define columns in the worksheet, these columns are identified using a key.**/
worksheet.columns = [
    { header: "S no", key: "index", width: 15 },
    { header: "Employee Id", key: "empid", width: 15 },
    { header: "Employee Name", key: "empname", width: 25 },
    { header: "Loss of Pay Count ", key: "lopcount", width: 20 },
    { header: "Absent ", key: "absents", width: 10 },

]

/** Add rows from database to worksheet **/
for (const row of results) {
    worksheet.addRow(row);
}
worksheet.autoFilter = 'A1:E1';

worksheet.eachRow(function (row, rowNumber) {

    row.eachCell((cell, colNumber) => {
        if (rowNumber == 1) {
            /** First set the background of header row **/
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '41f5b9' }
            }
        }
        /** Set border of each cell **/
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    })
    /** Commit the changed row to the stream **/
    row.commit();
});
// Finally save the worksheet into the folder from where we are running the code.
// return await workbook.xlsx.writeFile('./files/Payroll Report.xlsx');
return await workbook.xlsx.writeBuffer()
}


/** Event Scheduler ON Cron */
cron.schedule('0 */3 * * *', async function getActiveEmployeesCount(req,res) {
    try {
        console.log("Event Schedule Cron start");
           con.query(
                "CALL `set_event_scheduler_cron` ()",[  ],
                async function (err, result, fields) {
                if (err) {
                    console.log("Event Schedule Cron error : " + err);
                  //  result.send({ status: false });
                     } else {
                        console.log("Event Schedule Cron success");
                    //   result.send({ status: true });
                    }
                }
            );
        
    } catch (e) {
        errorLogArray.push( e.message);
         errorLogs(errorLogArray)
    }
});



/** get maindashborad employee count data   */
app.get('/ems/api/getAttendanceCountsForDate/:mid/:empid/:date/:companyName', verifyJWTToken,function (req, res) {
    ems.getAttendanceCountsForDate(req,res)
 });

/** get induction alerts to employee in maindashboard   */
app.get('/ems/api/getEmployeeProgramAlerts/:empid/:companyName', verifyJWTToken, function (req, res) {
    ems.getEmployeeProgramAlerts(req,res)
 });

  /** get sidenavigation */
  app.post('/attendance/api/getSideNavigation',verifyJWTToken, function (req, res) {
    attendance.getSideNavigation(req,res)
    });
    /** get getCommonSideNavigation */
    app.post('/api/getCommonSideNavigation',verifyJWTToken, function (req, res) {
        common.getCommonSideNavigation(req,res)
    });
//**--------------------------------------------------- */

/**Payroll */
/**employeeprofessionaltax */
app.get('/api/employeeprofessionaltax/:companyName',verifyJWTToken,function (req, res) {
     payroll.employeeprofessionaltax(req,res);
 });
/**employerprofessionaltax */
app.get('/api/employerprofessionaltax/:companyName',verifyJWTToken, function (req, res) {
    payroll.employerprofessionaltax(req,res);
});
/**getesidetails */
app.get('/api/getesidetails/:companyName',verifyJWTToken, function (req, res) {
    payroll.getesidetails(req,res);
});
/**getpayrollsections */
app.post('/api/getpayrollsections/:companyName',function (req, res) {
    payroll.getpayrollsections(req,res);
});
/**getearningsalarycomponent */
app.post('/api/getearningsalarycomponent/:id/:companyName', function (req, res) {
    payroll.getearningsalarycomponent(req,res);
});
/**getdeductionsalarycomponent */
app.post('/api/getdeductionsalarycomponent/:id/:companyName', function (req, res) {
    payroll.getdeductionsalarycomponent(req,res);
});
/**getpayrollincomegroups*/
app.get('/api/getpayrollincomegroups/:companyName',verifyJWTToken, function (req, res) {
    payroll.getpayrollincomegroups(req,res);
});
/**getsalarycomponentsforpaygroup */
app.post('/api/getsalarycomponentsforpaygroup',verifyJWTToken, function (req, res) {
    payroll.getsalarycomponentsforpaygroup(req,res);
});
/**setincomegroup */
app.post('/api/setincomegroup',verifyJWTToken, function (req, res) {
    payroll.setincomegroup(req,res);
});
/**getErrorMessages */
app.get('/payroll/api/getErrorMessages/:errorCode/:page/:size/:companyName',verifyJWTToken, function (req, res) {
    payroll.getErrorMessages(req,res);
});
/**setErrorMessages */
app.post('/payroll/api/setErrorMessages/:companyName',verifyJWTToken, function (req, res) {
    payroll.setErrorMessages(req,res);
});
/**getEmployeeDurationsForSalaryDisplay */
app.get('/api/getEmployeeDurationsForSalaryDisplay/:id/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeDurationsForSalaryDisplay(req,res);
});
/**getEmployee ctc Durations For Salary Display */
app.get('/api/getEmployeeCtcDurations/:id/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeCtcDurations(req,res);
});
/** getCtcDetails*/
app.get('/api/getCtcDetails/:eid/:ctcid/:companyName',verifyJWTToken,function(req,res){
    payroll.getCtcDetails(req,res);

});
/**getEmployeeInvestments */
app.get('/api/getEmployeeInvestments/:empid/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeInvestments(req,res);
});
/**deleteEmployeeInvestments */
app.post('/api/deleteEmployeeInvestments/',verifyJWTToken,function(req,res){
    payroll.deleteEmployeeInvestments(req,res);
});
/**setEmployeeInvestments */
app.post('/api/setEmployeeInvestments',verifyJWTToken,function(req,res){
    payroll.setEmployeeInvestments(req,res);

});
/**getComponentEditableConfigurations */
app.get('/api/getComponentEditableConfigurations/:empid/:companyName',verifyJWTToken,function(req,res){
    payroll.getComponentEditableConfigurations(req,res);
});
/**configurePayGroupComponent */
app.post('/api/configurePayGroupComponent',verifyJWTToken,function(req,res){
    payroll.configurePayGroupComponent(req,res);
});
/**getPayGroupComponentValues*/
app.get('/api/getPayGroupComponentValues/:id/:companyName',verifyJWTToken,function(req,res){
    payroll.getPayGroupComponentValues(req,res);
});
/** editPayGroupComponent*/
app.post('/api/editPayGroupComponent',verifyJWTToken,function(req,res){
    payroll.editPayGroupComponent(req,res);

});
/**getEmployeesListForInvestmentsApproval*/
app.get('/api/getEmployeesListForInvestmentsApproval/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeesListForInvestmentsApproval(req,res);
});
/**getEmployerEpfContributionOptions */
app.get('/api/getEmployerEpfContributionOptions/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployerEpfContributionOptions(req,res);
});
/**getEmployeeEpfContributionOptions */
app.get('/api/getEmployeeEpfContributionOptions/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeEpfContributionOptions(req,res);

});
/**setCompanyEpfValues */
app.post('/api/setCompanyEpfValues',verifyJWTToken,function(req,res){
    payroll.setCompanyEpfValues(req,res);
});
/**getStatutoryMaxPfWageForEmployerContribution */
app.get('/api/getStatutoryMaxPfWageForEmployerContribution/:companyName',verifyJWTToken,function(req,res){
    payroll.getStatutoryMaxPfWageForEmployerContribution(req,res);
});
/**getCompanyPaySchedule */
app.get('/api/getCompanyPaySchedule/:companyName',verifyJWTToken,function(req,res){
    payroll.getCompanyPaySchedule(req,res);
});
/**setCompanyPaySchedule */
app.post('/api/setCompanyPaySchedule',verifyJWTToken,function(req,res){
    payroll.setCompanyPaySchedule(req,res);
});
/**updateMonthlySalary */
app.post('/api/updateMonthlySalary',verifyJWTToken,function(req,res){
    payroll.updateMonthlySalary(req,res);
});
/**getFinancialYears */
app.get('/api/getFinancialYears/:companyName',verifyJWTToken,function(req,res){
    payroll.getFinancialYears(req,res);
});
/**MonthYear */
app.get('/api/MonthYear/:fyear/:companyName',verifyJWTToken,function(req,res){
    payroll.MonthYear(req,res);
});
/**getEpfDetails */
app.get('/api/getEpfDetails/:companyName',verifyJWTToken,function(req,res){
    payroll.getEpfDetails(req,res);
});
/**getEmployeeListForSalaryProcessing */
app.get('/api/getEmployeeListForSalaryProcessing/:year/:month/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeListForSalaryProcessing(req,res);
});
/**getEmployeesForAssignPaygroup */
app.get('/api/getEmployeesForAssignPaygroup/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeesForAssignPaygroup(req,res);
});
/**getPayGroupsForCtc */
app.get('/api/getPayGroupsForCtc/:amount/:companyName',verifyJWTToken,function(req,res){
    payroll.getPayGroupsForCtc(req,res);
});
/**getActiveComponentsValuesForPayGroup */
app.get('/api/getActiveComponentsValuesForPayGroup/:id/:companyName',verifyJWTToken,function(req,res){
    payroll.getActiveComponentsValuesForPayGroup(req,res);
});
/**assignPayGroup */
app.post('/api/assignPayGroup',verifyJWTToken,function(req,res){
    payroll.assignPayGroup(req,res);
});
/**getComponentWiseValuesForPayGroupAssignment */
app.get('/api/getComponentWiseValuesForPayGroupAssignment/:ctc/:pgid/:companyName',verifyJWTToken,function(req,res){
    payroll.getComponentWiseValuesForPayGroupAssignment(req,res);
});
/**getEmployeePaySlips */
app.get('/api/getEmployeePaySlips/:fyear/:empid/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeePaySlips(req,res);
});
/** getEmployeePayslipDetails*/
app.get('/api/getEmployeePayslipDetails/:id/:empid/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeePayslipDetails(req,res);
});
/**getEmployeeEpfDetails */
app.get('/api/getEmployeeEpfDetails/:id/:companyName',verifyJWTToken,function(req,res){
    payroll.getEmployeeEpfDetails(req,res);
});
/**getMonthlyPayrollData */
app.get('/api/getMonthlyPayrollData/:month/:year/:deptid/:companyName',verifyJWTToken,function(req,res){
    payroll.getMonthlyPayrollData(req,res);
})
/** getMonthlyPayrollDataForGraph*/
app.get('/api/getMonthlyPayrollDataForGraph/:month/:year/:companyName',verifyJWTToken,function(req,res){
    payroll.getMonthlyPayrollDataForGraph(req,res);
});
/**getComponentConfiguredValuesForPayGroup */
app.get('/api/getComponentConfiguredValuesForPayGroup/:pgmid/:flat/:companyName',verifyJWTToken,function(req,res){
    payroll.getComponentConfiguredValuesForPayGroup(req,res);
});
/**get_epf_values_for_challan */
app.post('/api/getEpfValuesForChallan',verifyJWTToken, function (req, res) {
    payroll.getEpfValuesForChallan(req,res)
});
/**get_esi_values_for_challan */
app.post('/api/getESIValuesForChallan',verifyJWTToken, function (req, res) {
    payroll.getESIValuesForChallan(req,res)
});
/**getProfessionalTaxValuesForChallan */
app.post('/api/getProfessionalTaxValuesForChallan',verifyJWTToken, function (req, res) {
    payroll.getProfessionalTaxValuesForChallan(req,res)
});
/**monthlyPayrollReportChallan */
app.post('/api/monthlyPayrollReportChallan',verifyJWTToken, function (req, res) {
    payroll.monthlyPayrollReportChallan(req,res)
});
/**get_states_for_professional_tax */
app.post('/api/getStatesForProfessionalTax',verifyJWTToken, function (req, res) {
    payroll.getStatesForProfessionalTax(req,res)
});

/**getDocumentsFiles */
app.post('/ems/api/getDocumentsFiles/',verifyJWTToken,function(req,res){
    ems.getDocumentsFiles(req, res)
})
app.post('/ems/api/getDocumentsFilesPreonboarding/',function(req,res){
    ems.getDocumentsFiles(req, res)
})

/*setHolidaysMaster */
app.post('/api/setHolidaysMaster',verifyJWTToken, function (req, res) {
    admin.setHolidaysMaster(req,res)
});
/**otherAllowancePopup */
app.get('/api/otherAllowancePopup/:pgid/:companyName',function (req, res) {
    payroll.otherAllowancePopup(req,res);
});
/**getStateForEsi */
app.get('/api/getStateForEsi/:companyName',verifyJWTToken,function (req, res) {
    payroll.getStateForEsi(req,res);
});
/**set_esi_for_state */
app.post('/api/setEsiForState',verifyJWTToken, function (req, res) {
    payroll.setEsiForState(req,res)
});

// set_company_esi_values
app.post('/api/setCompanyEsiValues',verifyJWTToken, function (req, res) {
    payroll.setCompanyEsiValues(req,res)
});
/** api/getCompanyEsiValues/*/
app.get('/api/getCompanyEsiValues/:companyName',verifyJWTToken, function (req, res) {
    payroll.getCompanyEsiValues(req,res)
});
/**get_esi_employer_contribution */
app.get('/api/getEsiEmployerContribution/:companyName',verifyJWTToken, function (req, res) {
    payroll.getEsiEmployerContribution(req,res)
});
/**validate_epf_challan_download */
app.get('/api/getEsiEmployerContribution/:companyName',verifyJWTToken, function (req, res) {
    payroll.validateEpfChallanDownload(req,res)
});
/**validate_salary_challan_download */
app.get('/api/getEsiEmployerContribution/:companyName',verifyJWTToken, function (req, res) {
    payroll.validateSalaryChallanDownload(req,res)
});
/**validate_esi_challan_download */

app.get('/api/getEsiEmployerContribution/:companyName',verifyJWTToken, function (req, res) {
    payroll.validateSalaryChallanDownload(req,res)
});
/** */
app.get('/ems/api/validateReportingManager/:eid/:companyName',verifyJWTToken, function (req, res) {
    ems.validateReportingManager(req,res)

})
/**validateSalaryProcessingDate */
app.get('/api/validateSalaryProcessingDate/:year/:month/:companyName',function (req, res) {
    payroll.validateSalaryProcessingDate(req,res);
});

// set_spryple_plan
app.post('/subscription/api/setSpryplePlan', function (req, res) {
    common.setSpryplePlan(req,res)
});
// get_min_user_for_plan
app.get('/subscription/api/getMinUserForPlan/:planid', function (req, res) {
    common.getMinUserForPlan(req,res)
});
app.post('/subscription/api/getAllModules/', function (req, res) {
    common.getAllModules(req,res)
});
app.post('/subscription/api/Validateemail', function (req, res) {
    common.Validateemail(req,res)
});
// set_spryple_client 
app.post('/subscription/api/setSprypleClient', function (req, res) {
    common.setSprypleClient(req,res)
});
/**set_plan_details */
app.post('/subscription/api/setPlanDetails', function (req, res) {
    common.setPlanDetails(req,res)
});
/**get_spryple_plans */
app.get('/subscription/api/getSpryplePlans', function (req, res) {
    common.getSpryplePlans(req,res)
});
// get_spryple_plan_cost_details
app.get('/subscription/api/getSpryplePlanCostDetails', function (req, res) {
    common.getSpryplePlanCostDetails(req,res)
});

/** */
app.post('/api/contactUsFormMail', function(req,res) {
    common.contactUsFormMail(req,res);
});

/**pre onboardin master table */
app.get('/api/getMastertableSignup/:tableName/:status/:page/:size/:companyName',function(req,res) {
    common.getMastertable(req,res)
   });

// get payments
app.get('/subscription/api/getPayments', function (req, res) {
    common.getPayments(req,res)
});

// get Spryple Clients
app.get('/subscription/api/getSprypleClients', function (req, res) {
    common.getSprypleClients(req,res)
});
// get Renewal Details
app.get('/subscription/api/getRenewalDetails', function (req, res) {
    common.getRenewalDetails(req,res)
});

// get ClientPlan Details
app.post('/subscription/api/getClientPlanDetails', function (req, res) {
    common.getClientPlanDetails(req,res)
});

/**get_users */
app.get('/subscription/api/getUsers/:id', function (req, res) {
    common.getUsers(req,res)
});
/**enable_renew_button */
app.post('/subscription/api/enableRenewButton', function (req, res) {
    common.enableRenewButton(req,res)
});
/**addUsers for existing subscription */
app.post('/subscription/api/addUsers', function (req, res) {
    common.addUsers (req,res)
});
app.post('/subscription/api/renewUsers', function (req, res) {
    common.renewUsers (req,res)
});
// add_users_display_info 
app.post('/subscription/api/addUsersDisplayInfo', function (req, res) {
    common.addUsersDisplayInfo (req,res)
});
// renew_users_display_information
app.post('/subscription/api/renewUsersDisplayInformation', function (req, res) {
    common.renewUsersDisplayInformation (req,res)
});

/**get_payment_details */
app.get('/subscription/api/getClientPaymentDetails/:clientid/:companyName', function (req, res) {
    common.getClientPaymentDetails (req,res)
});
/**change_client_plan */
app.post('/subscription/api/changeClientPlan', function (req, res) {
    common.changeClientPlan (req,res)
});
/**get_client_details */
app.get('/subscription/api/getClientDetails/:clientid/:companyName', function (req, res) {
   common.getClientDetails (req,res)
});
app.get('/subscription/agreement', function (req, res) {
    common.agreement(req,res)
})
/**get_unverified_spryple_client */
app.post('/subscription/getUnverifiedSprypleClient', function (req, res) {
    common.getUnverifiedSprypleClient(req,res)
})
   /**get_comp_off_validity_duration */
   app.get('/api/getCompOffValidityDuration/:companyName',function(req,res) {
    leaveManagement.getCompOffValidityDuration(req,res)
   });
   
app.post('/ems/api/setEmployeeExcelData/:companyName', verifyJWTToken, function (req, res) {
    ems.setEmployeeExcelData(req,res);
  });

   /**get Plan Details by plan Id and client Id */
app.post('/subscription/api/getSpryplePlanDetailsById', function (req, res) {
    common.getSpryplePlanDetailsById (req,res)
})

   /**Get Client Details By ClientId */
   app.get('/subscription/api/getSprypleClientDetailsByClientId/:clientId/:companyName',function(req,res) {
    common.getSprypleClientDetailsByClientId(req,res)
   });

/**get client payments invoice history */
app.get('/subscription/api/getPaymentsDetailsByClientId/:clientid/:companyName', function (req, res) {
    common.getPaymentsDetailsByClientId (req,res)
});

/**get payments invoice history by payment Id */
app.get('/subscription/api/getPaymentInvoiceDataByPaymentid/:clientid/:companyName', function (req, res) {
    common.getPaymentInvoiceDataByPaymentid (req,res)
});

/**get all spryple clients */
app.get('/subscription/api/getAllSprypleClientDetails/:companyName', function (req, res) {
    common.getAllSprypleClientDetails (req,res)
});
app.post('/subscription/api/setSprypleClientPlanPayment', function (req, res) {
    common.setSprypleClientPlanPayment(req,res)
})


/**get Spryple Activations Count By Month */
app.get('/subscription/api/getSprypleActivationsCountByMonth/:date/:companyName', function (req, res) {
    common.getSprypleActivationsCountByMonth (req,res)
});

/**get Spryple Activations Count By Year */
app.get('/subscription/api/getSprypleActivationsCountByYear/:date/:companyName', function (req, res) {
    common.getSprypleActivationsCountByYear (req,res)
});

/**get all spryple clients */
app.get('/subscription/api/getSprypleClientsStatusWiseCount/:companyName', function (req, res) {
    common.getSprypleClientsStatusWiseCount (req,res)
});

/**get spryple revenue By month */
app.get('/subscription/api/getRevenueByMonth/:date/:companyName', function (req, res) {
    common.getRevenueByMonth (req,res)
});

/**get Year Wise Clients Count */
app.get('/subscription/api/getYearWiseClientsCount/:companyName', function (req, res) {
    common.getYearWiseClientsCount (req,res)
});

/**get Month Wise Clients Count By Year */
app.get('/subscription/api/getMonthWiseClientsCountByYear/:date/:companyName', function (req, res) {
    common.getMonthWiseClientsCountByYear (req,res)
});

app.get('/subscription/api/getClientSubscriptionDetails/:companyName', function (req, res) {
    common.getClientSubscriptionDetails(req, res)
});
//** subscription- client super admindashboard api's */

/**get New & Exit Employee Count By Month */
app.get('/subscription/api/getNewExitEmployeeCountByMonth/:date/:companyName', function (req, res) {
   subscription.getNewExitEmployeeCountByMonth(req, res)
});

/**get Department Wise Employee Count By Location */
app.get('/subscription/api/getDepartmentWiseEmployeeCountByLocation/:deptId/:companyName', function (req, res) {
    subscription.getDepartmentWiseEmployeeCountByLocation(req, res)
 });

/**get Location Wise Employee Count */
app.get('/subscription/api/getLocationWiseEmployeeCount/:companyName', function (req, res) {
   subscription.getLocationWiseEmployeeCount(req, res)
 });

/**get Attendance Employees Count By Date */
app.get('/subscription/api/getAttendanceEmployeesCountByDate/:date/:companyName', function (req, res) {
     subscription.getAttendanceEmployeesCountByDate(req, res)
});
 
/**get Leaves Types Count By Month */
app.get('/subscription/api/getLeavesTypesCountByMonth/:date/:companyName', function (req, res) {
    subscription.getLeavesTypesCountByMonth(req, res)
});

/**get Department Wise Employee Count By Shift */
app.get('/subscription/api/getDepartmentWiseEmployeeCountByShift/:shiftId/:companyName', function (req, res) {
    subscription.getDepartmentWiseEmployeeCountByShift(req, res)
});
 
/**get Department Wise Leaves Count By Month */
app.get('/subscription/api/getDepartmentWiseLeavesCountByMonth/:date/:companyName', function (req, res) {
    subscription.getDepartmentWiseLeavesCountByMonth(req, res)
 });
/**get_active_employees_count */
app.get('/api/getActiveEmployeesCount/:companyName', function (req, res) {
    common.getActiveEmployeesCount(req, res)
 });
 app.post('/api/getScreensForSuperAdmin',verifyJWTToken, function (req, res) {
    common.getScreensForSuperAdmin(req,res)
});

/**get Department Wise Monthly Salaries */
app.get('/subscription/api/getDepartmentWiseMonthlySalaries/:date/:companyName', function (req, res) {
    subscription.getDepartmentWiseMonthlySalaries(req, res)
});
app.get('/subscription/api/getUnmappedPlans', function (req, res) {
    common.getUnmappedPlans (req,res)
});
app.post('/subscription/api/paymentFailedMail', function (req, res) {
    common.paymentFailedMail(req,res)
});
 
/**get Active Programs Master */
app.get('/api/getActiveProgramsMaster/:companyName',verifyJWTToken,function(req,res) {
    admin.getActiveProgramsMaster(req,res);
});
  
/**get Active Programs types */
app.get('/api/getActiveProgramTypes/:companyName',verifyJWTToken,function(req,res) {
    admin.getActiveProgramTypes(req,res);
  });

/**get Active branch cities */
app.get('/api/getActiveBranchCities/:companyName',verifyJWTToken,function(req,res) {
    admin.getActiveBranchCities(req,res);
  });

/** preonboarding setDocumentOrImageForEMS */
app.post('/ems/api/preonboardingSetDocumentOrImageForEMS/:companyName', function (req, res) {
    ems.preonboardingSetDocumentOrImageForEMS(req,res)
    })

/***------------------------------------------------------------------------------------------ */
///** for AWS */

// var options = {}

// function step1() {
//     const certificateParams = {
//         Bucket: 'ssl-bucket12345/ssl-folder', // pass your bucket name
//         //   Key: 'private.key'
//         Key:'cert.pem'
//     };
//     s3.getObject(certificateParams, function (err, data) {
//         if (err) {
//             flag = false;
//             console.log('err',err)
//         }else {
//             options.cert = data.Body;
//             step2();
//         }
//     });
// }
    
// function step2(){
//     const certificateParams = {
//         Bucket: 'ssl-bucket12345/ssl-folder', // pass your bucket name
//         Key: 'privkey.pem'
//        // Key:'cert.pem'
//     };
//     s3.getObject(certificateParams, function (err, data) {

//         if (err) {
//             console.log('err',err)
//         }else {
//             options.key = data.Body;
//            step3();
//         }
//     });

// }
    
// function step3(){
//     const certificateParams = {
//         Bucket: 'ssl-bucket12345/ssl-folder', // pass your bucket name
//         Key: 'chain.pem'
//         // Key:'cert.pem'
//     };
//     s3.getObject(certificateParams, function (err, data) {

//         if (err) {
//             console.log('err',err)
//         }else {
//             options.ca =[];
//             options.ca.push(data.Body);
//             step4();
//         }
//     });

// }

// function step4(){
//     const certificateParams = {
//         Bucket: 'ssl-bucket12345/ssl-folder', // pass your bucket name
//         Key: 'fullchain.pem'
//         // Key:'cert.pem'
//     };
//     s3.getObject(certificateParams, function (err, data) {

//         if (err) {
//             console.log('err',err)
//         }else {
//             options.ca.push(data.Body);
//             https.createServer(options, app).listen(6060,'0.0.0.0',function (error) {
//                 if (error)
//                     console.log('Server Cant Start ...Erorr....');
//                 else
//                     console.log('Server Started at : https://52.66.89.72:6060');
//             });

//         }
//     });

// }

// step1()

/** Local server */

app.listen(6060,function (err) {
    if (err)
        console.log('Server Cant Start ...Erorr....');
    else
        console.log('Server Started at : http://localhost:6060');
});

/** uncomment in QA build time */

// app.listen(6060,'192.168.1.86',function (err) {
//     if (err)
//         console.log('Server Cant Start ...Erorr....');
//     else
//         console.log('Server Started at :  http://192.168.1.86:6060');
// });