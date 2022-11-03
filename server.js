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

var admin= require('./admin-server');
var attendance= require('./attendance-server');
var leaveManagement = require('./leave-management');

var ems= require('./ems-server');
var payroll = require('./payroll');
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




// /**reset password */
// app.post('/api/resetpassword',function(req,res,next){
//
//     let id = req.body.empid;
//     let email = req.body.email;
//     let password = req.body.newpassword;
//     try{
//         con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,email,password,'Active','N'],function(err,result){
//             if(err){
//                 console.log(err)
//             }
//             else{
//                 res.send({status: true, message: 'reset password successfully'})
//
//             }
//
//      });
//
//     }
//     catch(e){
//         console.log("resetpassword",e)
//     }
// })



// /**employee login */
// app.post('/api/emp_login',function(req,res,next){
//     try{
//         // let 
//         var email = req.body.email;
//         var password = req.body.password;
        
//         con.query('CALL `authenticateuser` (?,?)',[email,password],function(err,results,next){
            
//             console.log(results)
//             var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
//             console.log(result)
//             if (result[0] > 0) {
//                 con.query('CALL `getemployeeinformation`(?)',[result[0]],function(err,results,next){
//                     try{
//                         if(results && results.length>0){
//                             var result = JSON.parse(results[0][0].result)
//                             res.send({status: true,result})

//                         }
//                         else{
//                             res.send({status: false,result})
//                         }
//                     }
//                     catch (e){
//                         console.log("employee_login",e)
//                     }

//                 })

//             }
//             else{
//                 res.send({status: false,message:"Invalid userName or password"})
//             }

//         });

//     }
//     catch (e){
//         console.log("employee_login",e)
//     }
// })



/*Get Department*/
app.get('/api/getDepartment',function(req,res) {
    
    try {
        con.query("CALL `getDepartment` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
       

    }catch (e) {
        console.log('getDepartment :',e)

    }
});


/*Get Designation*/
app.get('/api/getDesignation',function(req,res) {
    try {
        

        con.query("CALL `getmastertable` (?)", ['designationsmaster'],function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getDesignation :',e)

    }
});

// /*set Designation*/
// app.post('/api/setDesignation',function(req,res) {
//     try {
//         //
//
//         let infoDesignationMaster={}
//         infoDesignationMaster.designation=req.body.designationName;
//         infoDesignationMaster.status = 'Active';
//
//
//         con.query("CALL `setmastertable` (?,?,?)",['designationsmaster',,JSON.stringify(infoDesignationMaster)], function (err, result, fields) {
//             if (err) {
//                 res.send({status: false, message: 'Unable to insert designation'});
//             } else {
//                 res.send({status: true,message:'Designation added successfully'})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('setDesignation :',e)
//
//     }
// });






// /*Set Departments*/
// app.post('/api/setDepartments',function(req,res) {
//     try {
//         let info={}
//         // info.DeptId=20,
//         info.deptname=req.body.departmentName;
//         info.depthead=null;
//         info.headcount=null;
//         info.status=1;
//         info.created_by=req.body.created_by;
//         info.created_on = req.body.created_on;
//         info.updated_on=null;
//         info.updated_by = null;
//
//
//         con.query("CALL `setmastertable` (?,?,?)",['departmentsmaster','ems',JSON.stringify(info)], function (err, result, fields) {
//             console.log(err)
//             console.log(result)
//
//             if (err) {
//
//                 res.send({ status: false,message:'Unable to add department'});
//             } else {
//                 res.send({status: true,message:'Departments added successfully'})
//             }
//         });
//
//
//     }catch (e) {
//         console.log('setmastertable :',e)
//
//     }
// });


/*Get Holidays*/
app.get('/api/getHolidays',function(req,res) {
    try {
        ;
        con.query("CALL `getHolidays` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getHolidays :',e)

    }
});



/*Set Holidays Status*/
app.post('/api/setHolidaysStatus/:holidaysId',function(req,res) {
    try {
        //        

        ;

        con.query("CALL `setHolidaysStatus` (?)",[req.params.holidaysId,req.body.status], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update holidays status'});
            } else {
                res.send({status: true,message:'Holidays status updated successfully'})
            }
        });
        

    }catch (e) {
        console.log('setHolidaysStatus :',e)

    }
});
/*Get Shift*/
app.get('/api/getShift',function(req,res) {
    try {
        

        con.query("CALL `getShift` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getShift :',e)

    }
});


// // /*Get Master table*/
// app.get('/api/getMastertable/:tableName/:status/:page/:size/:companyShortName',function(req,res) {
//     try {
       
//         var tName = req.params.tableName;
//         if(req.params.status=="null"){
//             con.query("CALL `getmastertable` (?,?,?,?)",[tName,null,req.params.page,req.params.size], function (err, result, fields) {
//                 console.log("getmastertable",err,result)

//                 if (result && result.length > 0) {
//                     if(tName == 'holidaysmaster'){
//                         for (let i=0; i<result[0].length;i++){
//                             let hDate = (new Date(result[0][i].Date));
//                             result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
//                         }
//                         res.send({data: result[0], status: true});


//                     }else {
//                         res.send({data: result[0], status: true});
//                     }
//                 } else {
//                     res.send({status: false})
//                 }
//             });
            
//         }
//         else{
//             ;
//             con.query("CALL `getmastertable` (?,?,?,?)",[tName,req.params.status,req.params.page,req.params.size], function (err, result, fields) {
//                 if (result && result.length > 0) {
//                     if(tName == 'holidaysmaster'){
//                         for (let i=0; i<result[0].length;i++){
//                             let hDate = (new Date(result[0][i].Date));
//                             result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
//                         }
//                         res.send({data: result[0], status: true});


//                     }else {
//                         res.send({data: result[0], status: true});
//                     }
//                 } else {
//                     res.send({status: false})
//                 }
//             });
            


//         }
//     }catch (e) {
//         console.log('getMastertable :',e)

//     }
// });

/*Get Master table*/
app.get('/api/getLeaveTypes/:tableName/:page/:size',function(req,res) {
    try {
        var tName = req.params.tableName;

        con.query("CALL `getmastertable` (?,?,?)",[tName,req.params.page,req.params.size], function (err, result, fields) {

            if (result.length > 0) {
                if(tName == 'HolidaysMaster'){
                    for (let i=0; i<result[0].length;i++){
                        let hDate = (new Date(result[0][i].Date));
                        result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                    }
                    res.send({data: result[0], status: true});


                }else {
                    res.send({data: result[0], status: true});
                }
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getMastertable :',e)

    }
});



/*Set Shift*/

app.post('/api/setShift',function(req,res) {
    try {
        con.query("CALL `setShift` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to insert shift'});
                } else {
                    res.send({status: false, message: 'Shift added Successfully'})
                }
            });
        

    }catch (e) {
        console.log('setShift :',e)
    }
});

/*put Shift*/

app.put('/api/putShift',function(req,res) {
    try {
        con.query("CALL `putShift` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update shift'});
                } else {
                    res.send({status: false, message: 'Shift updated Successfully'})
                }
            });
        

    }catch (e) {
        console.log('putShift :',e)
    }
});

/*Get Add Leave Balance*/
app.get('/api/getAddLeaveBalance',function(req,res) {

    try {
        con.query("CALL `getAddLeaveBalance` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getAddLeaveBalance :',e)

    }
});

/*Set Add Leave Balance*/

app.post('/api/setAddLeaveBalance',function(req,res) {
    try {
        con.query("CALL `setAddLeaveBalance` (?,?,?,?,?)",
            [req.body.leaveTypeName, req.body.description, req.body.color], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert leave balance'});
                } else {
                    res.send({status: false, message: 'Leave balance added Successfully'})
                }
            });
        

    }catch (e) {
        console.log('setAddLeaveBalance :',e)
    }
});

/*put Add Leave Balance*/

app.put('/api/putAddLeaveBalance',function(req,res) {

    try {       
        con.query("CALL `putLeaveBalance` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update leave balance'});
                } else {
                    res.send({status: false, message: 'Leave balance updated Successfully'})
                }
            });
        

    }catch (e) {
        console.log('putLeaveBalance :',e)
    }
});
/*Delete Add Leave Balance
*
* */
app.delete('/api/deleteAddLeaveBalance/:leaveBalanceId',function(req,res) {
    try {
        con.query("CALL `deleteLeaveBalance` (?)",[req.params.leaveBalanceId], function (err, result, fields) {

            if (err) {
                res.send({status: false, message: 'Unable to delete leave balance'});
            } else {
                res.send({status: false, message: 'Leave balance deleted Successfully'})
            }
        });
    }catch (e) {
        console.log('deleteLeaveBalance :',e)
    }
});

/*Get employee Master*/
app.post('/api/getEmployeeMaster',function(req,res) {
    try {
        con.query("CALL `getemployeemaster` (?)",[req.body.id], function (err, result, fields) {
          if(err){
            console.log(err.message);
          }else{
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        }
        });

    }catch (e) {
        console.log('getEmployeeMaster :',e)

    }
});

/**getreportingmanagers */
app.post('/api/getReportingManager',function(req,res){
    try{
        con.query("CALL `getreportingmanagers`(?)",[req.body.id],function (err, result, fields) {
            if(err){
                console.log(err)
            }
            else{
                res.send(result)
            }

        });      

    }
    catch(e){
        console.log("getreportingmanager",e)
    }
})
/*Set Employee Master*/

app.post('/api/setEmployeeMaster',function(req,res) {
    try {
        let hDate = (new Date(req.body.dateOfBirth));
        var  dateOfBirth = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
        let JoinDate = (new Date(req.body.dateOfJoin));
        var  dateOfJoin = JoinDate.getFullYear() + "-" + (JoinDate.getMonth() + 1) + "-" + (JoinDate.getDate());
        let input = {
            empid:req.body.empId,
            firstname: req.body.firstName,
            middlename: req.body.middleName,
            lastname: req.body.lastName,
            personalemail: req.body.personalEmail,
            officeemail: req.body.officeEmail,
            dateofbirth: dateOfBirth,
            gender: req.body.gender,
            maritalstatus: req.body.maritalStatus,
            usertype: req.body.userType,
            designation: req.body.designation,
            department: parseInt(req.body.department),
            employmenttype: req.body.employmentType,
            dateofjoin: dateOfJoin,
            companylocation: req.body.companyLocation,
            reportingmanager: req.body.reportingManager,
            bloodgroup: req.body.bloodGroup,
            contactnumber: req.body.contactNumber,
            emergencycontactnumber: req.body.emergencyContactNumber,
            emergencycontactrelation: req.body.emergencyContactRelation,
            emergencycontactname: req.body.emergencyContactName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            paddress: req.body.pAddress,
            pcity: req.body.pCity,
            pstate: req.body.pState,
            ppincode: req.body.pPincode,
            pcountry: req.body.pCountry,
            aadharnumber: req.body.aadharNumber,
            passport: req.body.passport,
            bankname: req.body.bankName,
            ifsccode: req.body.iFSCCode,
            nameasperbankaccount: req.body.nameAsPerBankAccount,
            branchname: req.body.branchName,
            bankaccountnumber: req.body.bankAccountNumber,
            uanumber: req.body.uANumber,
            pfaccountnumber: req.body.pFAccountNumber,
            pan: req.body.pAN,
            status: 'Active',
            esi: req.body.eSI,
            shift: req.body.shift,
            relations: {},
            education: {},
            experience:{},
            relations: req.body.relations,
            education: req.body.education,
            experience: req.body.experience
        };
        con.query("CALL `setEmployeeMaster` (?)",
            [JSON.stringify(input)], function (err, result, fields) {
                if (err) {
                    if(err.code == 'ER_DUP_ENTRY'){
                        var val
                        val = err.sqlMessage.split('entry')[1];

                        res.send({status: false, message: val.split('for')[0]+' is already exist in database'});
                    }else{
                        res.send({status: false, message: 'Unable to add employee'});
                    }
                } else {
                    res.send({status: true, message: 'Employee added successfully'})
                }
            });
        

    }catch (e) {
        console.log('setEmployeeMaster :',e)
    }
});

/*put Employee Master*/

app.put('/api/putEmployeeMaster',function(req,res) {
    try {
        con.query("CALL `putemployeemaster` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update employee'});
                } else {
                    res.send({status: false, message: 'Employee updated Successfully'})
                }
            });
        

    }catch (e) {
        console.log('putEmployeeMaster :',e)
    }
});
/*Get search employee */

app.put('/api/getSearch/:employeeName/:employeeId',function(req,res) {
    try {
        con.query("CALL `getsearch` (?,?)",
            [req.params.employeeName,req.params.employeeId], function (err, result, fields) {

                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });
        

    }catch (e) {
        console.log('getSearch :',e)
    }
});


// /*Get User Leave Balance*/
// app.get('/api/getLeaveBalance/:empid',function(req,res) {
//     try {
        
//         let id = req.params.empid;
//         con.query("CALL `get_employee_leave_balance` (?)",[id], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getLeaveBalance :',e)

//     }
// });







/*Get Leave Rules*/
app.get('/api/getLeaveRules/:Id/:page/:size',function(req,res) {
    try {
        con.query("CALL `getleavepolicies` (?,?,?)", [req.params.Id,req.params.page,req.params.size],function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getLeaves :',e)

    }
});
/*Get Get Manager And HrDetails*/
app.get('/api/getManagerAndHrDetails/employeeId',function(req,res) {
    try {
        con.query("CALL `getManagerAndHrDetails` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getManagerAndHrDetails :',e)

    }
});
/*Set Set Apply Leave */

app.post('/api/setApplyLeave',function(req,res) {
    try {
        con.query("CALL `setApplyLeave` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert leave request'});
                } else {
                    res.send({status: false, message: 'Leave apployed successfully'})
                }
            });
        

    }catch (e) {
        console.log('setApplyLeave :',e)
    }
});

/*Set Delete Leave Request */
app.post('/api/setDeleteLeaveRequest',function(req,res) {
    try {        
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
        let leavestatus = "Deleted"
        let actionreason = req.body.actionreason;
        let workedDate = req.body.worked_date?req.body.worked_date:null;
        con.query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [id,empid,leavetype,fdate,tdate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,workedDate], function (err, result, fields) {
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });
        

    }catch (e) {
        console.log('setDeleteLeaveRequest :',e)
    }
});

/*Set put Leave Request */

app.put('/api/updateLeaveRequest/:Id',function(req,res) {
    try {
        con.query("CALL `updateLeaveRequest` (?)",
            [req.params.LeaveId], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable able to update leave request'});
                } else {
                    res.send({status: false, message: 'Leave request updated successfully'})
                }
            });
        

    }catch (e) {
        console.log('updateLeaveRequest :',e)
    }
});

/*set CompOffReviewApprove*/
app.set('/api/setCompOffReviewApprove',function(req,res) {
    try {
        con.query("CALL `setCompOffReviewApprove` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('setCompOffReviewApprove :',e)

    }
});

/*Get UserOnLeavesmpOff*/
app.get('/api/getUserOnLeaves',function(req,res) {
    try {
        con.query("CALL `getUserOnLeaves` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getUserOnLeaves :',e)

    }
});


/*Get Approvals*/
app.get('/api/getApprovals',function(req,res) {
    try {
        con.query("CALL `getApprovals` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getApprovals :',e)

    }
});

var saveImage = function(imgPath){
    fs.unlink(imgPath,function (error) {
        if(error && error.code =='ENOENT'){
            console.info("file doesn't exist,won't remove it. ")
        }else if (error) {
            console.error("error occured while trying to remove  file", )
        }else{
            console.info("removed")
        }

    })

    file.mv( imgPath,function (err, result) {
        if(err)
            throw err;
    })
}
var file
app.post('/api/setUploadImage/:companyName',function (req, res) {
    try{
        var id =1;
        file=req.files.file;
        var folderName = './logos/Apple/'
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)

            }else {
                file.mv(path.resolve(__dirname,folderName,id+'.png'),function(error){
                    if(error){
                        console.log(error);
                    }
                    res.send({message:'Image Uploaded Succesfully'})

                })


            }
        }
        catch (err) {
            console.error(err)
        }
    }catch (e) {
        console.log("setUploadImage:",e)
    }
});
/*set profilepicture */
app.post('/set_profilepicture/:companyname/:id',function(req,res){
    try{
        let id = req.params.id;
        let companyName = req.params.companyname;
        let image = req.files.image;
        let foldername = './profile_picture/'
        if(!fs.existsSync(foldername)){
            fs.mkdirSync(foldername)
        }
        image.mv(path.resolve(__dirname,foldername,companyName+'.png'),function(error){
            if(error){
                console.log(error);
            }
            res.send({message:'Image Uploaded Succesfully'})

        })

    }
    catch(e){
        console.log('set_profilepicture',e)

    }
});

/*set setLeaveConfigure*/
app.post('/api/setLeaveConfigure',function(req,res) {
    try {
        var l=0;
        for(let i =0;i<req.body.length;i++){
            let roleValues={}
            roleValues.RuleId=req.body[i].Id;
            roleValues.Value = req.body[i].value;
            let hDate = (new Date());
            roleValues.EffectiveFromDate = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
            roleValues.EffectiveToDate=hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());;


            con.query("CALL `setMasterTable` (?,?,?)",['LM_RuleValues','LMTHREE',JSON.stringify(roleValues)], function (err, result, fields) {
                l+=1;
                if(l ===req.body.length){
                    if (result.length > 0) {
                        res.send({data: result, status: true});
                    } else {
                        res.send({status: false})
                    }}
            });
            

        }



    }catch (e) {
        console.log('setLeaveConfigure :',e)

    }
});



// /*Get Employee Search Information*/
app.post('/api/getEmployeeDetails',function(req,res) {
    try {
        con.query("CALL `getemployeemasterforsearch` (?,?,?,?)", [req.body.employeeId,req.body.employeeName,req.body.page,req.body.tableSize], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        
    }catch (e) {
        console.log('getCompanyInformation :',e)

    }
});

app.get('/api/getImage/:Id/:companyShortName', function (req, res, next) {

    try{
        folderName = './logos/Apple/';
        var imageData={}
        var flag=false;
        fs.readFile(folderName+'1.png',function(err,result){
            if(err){
                flag=false;
            }else{
                flag=true
                imageData.image=result;
            }
            imageData.success=flag;
            imageData.companyShortName=Buffer.from(req.params.companyShortName,'base64').toString('ascii');

            res.send(imageData)
        })
    }catch (e) {
        console.log("getImage:",e)
    }
});

app.post('/api/validatePrefix',function(req,res) {
    try {
        let input={}
        let prefix=req.body.prefix;
        con.query("CALL `validate_prefix_assignment` (?)",prefix, function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getUserOnLeaves :',e)

    }
});
app.post('/api/setNewLeaveType',function(req,res) {
    try {

        let leaveType = req.body.leaveTypeName;
        let leaveColor = req.body.leaveColor;
        let leaveDisplayName = req.body.displayName;
        con.query("CALL `setnewleavetype` (?,?,?)",[leaveType,leaveDisplayName,leaveColor], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add leave type'});
            } else {
                res.send({status: true, message: 'Leave Type added successfully'})
            }
        });
        
    }catch (e) {
        console.log('setNewLeaveType :',e)

    }
});
// /*Get Leaves Type Info*/
// app.get('/api/getLeavesTypeInfo',function(req,res) {
//     try {
//         con.query("CALL `get_leavetypes_data` ()", function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//     }catch (e) {
//         console.log('getLeavesTypeInfo :',e)

//     }
// });



/*Get Role Master*/
app.get('/api/getrolemaster',function(req,res) {
    try {
        
        con.query("CALL `getrolemaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getrolemaster :',e)
    }
});
/*Get Screen Master*/
app.get('/api/getscreensmaster',function(req,res) {
    try {
        
        con.query("CALL `getscreensmaster` (?)",['4'], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getscreensmaster :',e)
    }
});
/*Get Functionalities Master*/
app.get('/api/getfunctionalitiesmaster',function(req,res) {
    try {
        
        con.query("CALL `getfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getfunctionalitiesmaster :',e)
    }
});
/*Get Screen Functionalities Master*/
app.get('/api/getscreenfunctionalitiesmaster',function(req,res) {
    try {       
        con.query("CALL `getscreenfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
});
/*Get Modules Screens Functionalities Master*/
app.get('/api/getModulesScreensFunctionalitiesmaster',function(req,res) {
    try {       
        con.query("CALL `get_modulescreenfunctionalities` ()", function (err, result, fields) {
           console.log(result[0][0]);
            if (result.length > 0) {
                res.send({data: result[0][0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('get_modulescreenfunctionalities :',e)
    }
});
/*Get Modules Screens Master*/
app.get('/api/getModulesWithScreens',function(req,res) {
    try {       
        con.query("CALL `get_modules_screens` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0][0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('get_modules_screens :',e)
    }
});
/*Get Screens Functionalities*/
app.get('/api/getScreenWithFunctionalities/:moduleId',function(req,res) {
    try {        
        con.query("CALL `get_screens_functionalities` (?)",[req.params.moduleId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0][0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('get_screens_functionalities :',e)
    }
});

/*Get Role Screen Functionalities By Role Id*/
app.get('/api/getRoleScreenfunctionalitiesByRoleId/:roleId',function(req,res) {
    try {        
        con.query("CALL `get_screens_functionalities_for_role` (?)",[req.params.roleId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
});
/*Get Role Screen Functionalities*/
app.get('/api/getrolescreenfunctionalities/:roleId',function(req,res) {
    try {        
        con.query("CALL `getrolescreenfunctionalities` (?,?)",[req.params.roleId,'2'], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
});
/*setRoleAccess */
app.post('/api/setRoleAccess',function(req,res) {
    try {
        con.query("CALL `set_role_access` (?)",[JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update role permissions'});
                } else {
                    res.send({status: true, message: 'Role permissions updated successfully'})
                }
            });        
    }catch (e) {
        console.log('setRoleAccess :',e)
    }
});

/*setRoleMaster */
app.post('/api/setRoleMaster',function(req,res) {

    try {
        con.query("CALL `setrolemaster` (?)",[req.body.roleName], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to add role name'});
                } else {
                    res.send({status: true, message: 'Role name successfully'})
                }
            });
        

    }catch (e) {
        console.log('setRoleMaster :',e)
    }
});

// /*Get Holidays based on employeeId*/
// app.get('/api/getHolidaysList/:empId',function(req,res) {
//     try {        
//         con.query("CALL `getemployeeholidays` (?)",[req.params.empId], function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result, status: true});
//             }
//         });

//     }
//     catch(e){
//         console.log()
//     }
// })
/*Get Holidays filter */

app.get('/api/getHolidaysFilter/:year/:locationId/:page/:size',function(req,res) {
    console.log(req.params.year,req.params.locationId)

    try {
    
    con.query("CALL `getholidaysbyfilter` (?,?,?,?)", [req.params.year ==='null'?null:req.params.year,req.params.locationId ==='null'?null:req.params.locationId,req.params.page,req.params.size],function (err, result, fields) {
    
    if (result && result.length > 0) {
    
    res.send({data: result[0], status: true});
    
    } else {
    
    res.send({status: false})
    
    }
    
    });
    
    
    
    }catch (e) {
    
    console.log('getDesignation :',e)
    
    
    
    }
    
    });

// /**get employe leaves */
// app.get('/api/getemployeeleaves/:empid/:page/:size/:companyName',function(req,res){
//     try{
        
//         let id = req.params.empid;
//         let page = req.params.page;
//         let size = req.params.size;
//         con.query("CALL `get_employee_leaves`(?,?,?)",[id,page,size],function (err, result, fields) {
//             console.log("gvjhshvhsdhjvhs",result)
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }

//         });
        
//     }
//     catch(e){
//         console.log('getemployeeholidays :',e)
//     }
// })
/*Get Employee Leave Balance*/
app.get('/api/getemployeeleavebalance/:empId',function(req,res) {
    try {
        
        con.query("CALL `get_employee_leave_balance` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }

        });
        



    }
    catch(e){
        console.log('getdurationforbackdatedleave :',e)
    }

});

/*Get Employee Roles*/
app.get('/api/getemployeeroles/:empId',function(req,res) {
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
// /**Get Duration for back dated leave*/
// app.get('/api/getdurationforbackdatedleave',function(req,res) {
//     try {
        
//         con.query("CALL `getdurationforbackdatedleave` ()", function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getdurationforbackdatedleave :',e)
//     }
// });
// /**Get Duration for back dated leave*/
// app.post('/api/validateleave',function(req,res) {
//     try {
//         let id = req.body.empid;
//         let fromdate = req.body.fromDate;
//         let todate = req.body.toDate;
//         let leavetype = req.body.leaveTypeId;
//         // var fromDate = new Date(fromdate);
//         // var toDate = new Date(todate);
//         // var myDateString1,myDateString2;
//         // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
//         // // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
//         // let fdate = myDateString1;
//         // let tdate = myDateString2;
//         var fromhalfday = req.body.fromDateHalf ? 1:0;
//         var tohalfday =req.body.toDateHalf ? 1 : 0;
//         var document = req.body.document ? 1 : 0;
//         var leaveId = req.body.leaveId?req.body.leaveId:null

//         /*Sample Format: call validateleave(23,2,'2022-04-20','2022-04-29',0,0)*/
//         con.query("CALL `validateleave` (?,?,?,?,?,?,?,?)",[id,leavetype,fromdate,todate,fromhalfday,tohalfday,document,leaveId], function (err, result, fields) {
//             if(result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             }else {
//                 res.send({status: false})
//             }
//         });
        
//     }catch (e) {
//         console.log('validateleave :',e)
//     }
// });
// /**get leave cycle for last month */
// app.post('/api/getleavecyclelastmonth',function(req,res){
//     try{
//         con.query("CALL `get_leave_cycle_last_month`()",function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });

//     }
//     catch(e){
//         console.log('getleavecyclelastmonth :',e)
//     }
// })
// /**set employee leave */
// app.post('/api/setemployeeleave',function(req,res){
//     try{
//         var id = req.body.id ? req.body.id : null;
//         let empid = req.body.empid;
//         let leavetype = req.body.leaveTypeId;
//         let fromdate = req.body.fromDate;
//         let todate = req.body.toDate;
//         // var fromDate = new Date(fromdate);
//         // var toDate = new Date(todate);
//         // var myDateString1,myDateString2;
//         // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
//         // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
//         // let fdate = myDateString1;
//         // let tdate = myDateString2;
//         let leavecount = req.body.leaveCount
//         let leavereason = req.body.reason;
//         let leavestatus = "Submitted";
//         let contactnumber = req.body.contact;
//         let email = req.body.emergencyEmail;
//         let address = 'test';
//         var fromhalfdayleave=req.body.fromDateHalf?1:0;
//         var tohalfdayleave =req.body.toDateHalf?1:0;
//         var details = req.body.relation?req.body.relation:req.body.compOffWorkedDate?req.body.compOffWorkedDate:null;
//         con.query("CALL `set_employee_leave`(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[id,empid,leavetype,fromdate,todate,fromhalfdayleave,tohalfdayleave,leavecount,leavereason,leavestatus,contactnumber,email,address,null,details],function(err,result,fields){
//             if(err){
//                   res.send({status:false})
//               }
//               else{
//                 res.send({status:true,isLeaveUpdated:id?1:0,data:result[0]})

//               }
//         })
//     }
//     catch(e){
//         console.log('setemployeeleaverr',e)
//     }
// })
// /**Get days to be disabled fromdate */
// app.get('/api/getdaystobedisabledfromdate/:id/:leaveId',function(req,res){
//     try{
//         ;
//         con.query("CALL `getdays_to_be_disabled_for_from_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         })
        
//     }
//     catch (e){
//         console.log('getdaystobedisabledfromdate :',e)
//     }
// })

// /**Get days to be disabled fromdate */
// app.get('/api/getdaystobedisabledtodate/:id/:leaveId/:companyName',function(req,res){
//     try{
//         con.query("CALL `getdays_to_be_disabled_for_to_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         })
        

//     }
//     catch (e){
//         console.log('getdaystobedisabletodate :',e)
//     }
// })
/*Get Days to be disabled*/
app.post('/api/getdaystobedisabled',function(req,res) {
    try {
        con.query("CALL `getdaystobedisabled` (?)",[req.body.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        
    }catch (e) {
        console.log('getdaystobedisabled :',e)
    }
});
/**Get getoffdayscount
 *
 * */
app.post('/api/getoffdayscount',function(req,res) {
    try {
        let id = req.body.empid;
        let leavetypeid = req.body.leaveType;
        let fromDate =new Date(req.body.fromDate);
        let toDate = new Date(req.body.toDate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fDate = myDateString1;
        let tDate = myDateString2;
        var fromhalfday = req.body.fromDateHalf ? 1:0;
        var tohalfday =req.body.toDateHalf ? 1 : 0;
        con.query("CALL `getoffdayscount` (?,?,?,?,?,?)",[id,leavetypeid,fDate,tDate,fromhalfday,tohalfday], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        
    }catch (e) {
        console.log('getoffdayscount :',e)
    }
});



/**
* getValidateExistingDetails
* @tableNaame
* @columnName
* @columnValue
*
* */
app.post('/api/getValidateExistingDetails',function(req,res) {
    try {
        con.query("CALL `checkrecord` (?,?,?)",[req.body.tableName,req.body.columnName,req.body.columnValue], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[1], status: true});
            } else {
                res.send({status: false})
            }
        });
        

    }catch (e) {
        console.log('getValidateExistingDetails :',e)
    }
});

/*Get Holidays years for filter*/
app.get('/api/getHolidaysYears/:columnName',function(req,res) {
    try {
        con.query("CALL `get_holiday_years_or_locations` (?)",[req.params.columnName], function (err, result, fields) {

            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }catch (e) {
        console.log('get_holiday_years_or_location :',e)

    }
});



function checkRecord (req, res, next){
    try{    console.log(req.body.tableName)
        console.log(req.body.columnName)
        console.log(req.body.id)
            con.query("CALL `checkrecord` (?,?,?)",[req.body.tableName,req.body.columnName,req.body.id], function (err, result, fields) {
                if (result && result.length > 0) {
                    console.log("hii",result[0])
                    console.log("hii",result[1])
                    console.log("hi",result[1][0])
                    req.body.isexists={result:result[1][0].isexists,status :true}
                    next()
                } else {
                    req.body.isexists={status:false}
                    next()

                }
            });
            


    }catch (e) {
        console.log("checkRecord in employee ",e)
    }
}










// /** Get next leave Date for validations
//  * @no parameters
//  * */

// app.get('/api/getNextLeaveDate/:input',function(req,res) {
//     try {
//         var input = JSON.parse(req.params.input)
//         con.query("CALL `get_next_leave_date` (?,?)",[input.id,input.date],function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getNextLeaveDate :',e)

//     }
// });


/**supportingdocument for  setleave*/
app.post('/api/setLeaveDocument/:cname/:empid',function(req,res) {
    file=(req.files.file);
    let cname = req.params.cname;
    let empid = req.params.empid;
    try {
            let foldername = './Files/'+cname+'/employee/'+empid+'/Leave Management'
            if (!fs.existsSync(foldername)) {
                fs.mkdirSync(foldername)
            }else {
                file.mv(path.resolve(__dirname,foldername,empid+'.pdf'),function(error){
                    if(error){
                        console.log(error);
                    }
                    res.send({status:true})
                })   
            }

    }catch (e) {
        console.log('uploaddocument :',e)

    }
});

// /**get relations for bereavement leave submit*/
// app.post('/api/getEmployeeRelationsForBereavementLeave',function(req,res) {

//     try {
//         con.query("CALL `get_employee_relations_for_bereavement_leave` (?,?)",[req.body.id,req.body.leaveId],function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getEmployeeRelationsForBereavementLeave :',e)

//     }
// });

// /**Get approved compoffs dates for leave submit*/
// app.post('/api/getApprovedCompoffs',function(req,res) {

//     try {
//         con.query("CALL `get_approved_compoffs` (?,?)",[req.body.id,req.body.leaveId],function (err, result, fields) {
//             console.log("jjhshj",err,result)
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getApprovedCompoffs :',e)

//     }
// });




// /**Get approved compoffs dates for leave submit*/
// app.get('/api/getMaxCountPerTermValue/:id',function(req,res) {

//     try {
//         con.query("CALL `get_max_count_per_term_value` (?)",[req.params.id],function (err, result, fields) {
//             if (result && result.length > 0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('getMaxCountPerTermValue :',e)

//     }
// });






// if(e.present_or_absent=='P'){
//     color='#32cd32';
// }else if(e.present_or_absent=='W'){
//     color='#2e0cf3';
// } else if(e.present_or_absent=='H'){
//     color='#ffff00';
// } else if(e.present_or_absent=='A'){
//     color='#FF3131';
// }
// app.post('/api/getleavecalender/:id/:companyName',function(req,res){
//     try {
//         con.query("CALL `getleavecalendar` (?)",[req.params.id],function (err, result, fields) {
//            console.log("getleavecalendar",err,result)
//             if (result && result[0].length > 0) {
//                for(var i = 0; i< result[0].length; i ++ ){
//                    if(result[0][i].ltype == 'weekoff'){
//                        result[0][i].color = '#2e0cf3'
//                    }else if (result[0][i].ltype != 'weekoff' && !result[0][i].color ){

//                        result[0][i].color = '#800000'
//                    }
//                    if(i === result[0].length-1){
//                        res.send({data: result[0], status: true});
//                    }

//                }
//             } else {
//                 res.send({status: false})
//             }
//         });
//     }catch (e) {
//         console.log('getleavecalender :',e)

//     }
    
// })






app.post('/api/updateStatusall',checkRecord, function(req,res) {
    try {
        if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)){
            con.query("CALL `updatestatus` (?,?,?)",[req.body.checktable,req.body.id,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
                } else {
                    res.send({status: true,message:'Department is '+req.body.status+' successfully'})
                }
            });

        } else if(req.body.isexists.status == false){
            res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
        } else{
            res.send({status: false, message: "This department have Active employees. So we are unable to inactivate this department now. Please move those employee to another department and try again"});
        }

    }catch (e) {
        console.log('setWorkLocation :',e)

    }
});




/**
 * Getting summary report years
 * */
app.get('/api/getYearsForReport', function(req,res) {

    leaveManagement.getYearsForReport(req,res);

});


/**
 * get States
 * */
app.get('/api/getStatesPerCountry/:Id', function(req,res) {

    leaveManagement.getStates(req,res);

});
/**
 * get States
 * */
app.get('/api/getCitiesPerCountry/:Id', function(req,res) {

    leaveManagement.getCities(req,res);

});
/**
 * get States
 * */
 app.post('/api/getProfileImage/', function(req,res) {
    leaveManagement.getProfileImage(req,res);
});





/**
 * get Leaves For Cancellation
 * */
app.get('/api/getEmployeeInformation/:Id/:companyName', function(req,res) {

    common.getEmployeeInformation(req,res);

});

/**
 * setProfileImage
 * */
 app.post('/api/setProfileImage/:path', function(req,res) {
    leaveManagement.setProfileImage(req,res);
});
/**
 * Remove Profile Image
 * */
app.delete('/api/removeProfileImage/:Id/:companyShortName', function(req,res) {

    leaveManagement.removeProfileImage(req,res);

});


/**
/**
 * Edit Profile
 * */
app.post('/api/editProfile', function(req,res) {

    common.editProfile(req,res);

});










/**
 *  EMS
 * set programs master
 * */
app.post('/ems/api/setProgramsMaster/', function(req,res) {

    ems.setProgramsMaster(req,res);

});

/**
 *  EMS
 * get programs master
 * */
app.get('/ems/api/getProgramsMaster/:pId', function(req,res) {

    ems.getProgramsMaster(req,res);

});


/**
 *  EMS
 * set program tasks
 * */
app.get('/ems/api/setProgramTasks/', function(req,res) {

    ems.setProgramTasks(req,res);

});


/**
 *  EMS
 * get_program_tasks
 * */
app.get('/ems/api/getProgramTasks/', function(req,res) {

    ems.getProgramTasks(req,res);

});



/**
 *  EMS
 * set program schedules
 * */
app.post('/ems/api/setProgramSchedules/', function(req,res) {

    ems.setProgramSchedules(req,res);

});

/**
 *  EMS
 * get program schedules
 * */
app.get('/ems/api/getProgramSchedules/:sid/:pid', function(req,res) {

    ems.getProgramSchedules(req,res);

});


/**
 *  EMS
 * set employee program schedules
 * */
app.get('/ems/api/setEmployeeProgramSchedules/', function(req,res) {

    ems.setEmployeeProgramSchedules(req,res);

});

/**
 *  EMS
 * get employee program schedules
 * */
app.get('/ems/api/getEmployeeProgramSchedules/', function(req,res) {

    ems.getEmployeeProgramSchedules(req,res);

});



/**
 *  EMS
 * set checklists master
 * */
app.post('/ems/api/setChecklistsMaster', function(req,res) {
  
    ems.setChecklistsMaster(req, res);

});



/**
 *  EMS
 * get checklists master
 * */
app.get('/ems/api/getChecklistsMaster/:deptId/:category', function(req,res) {
    ems.getChecklistsMaster(req,res);

});

app.get('/ems/api/getChecklistsMasterActive/:deptId/:category/:status', function(req,res) {
        ems.getChecklistsMasterActive(req,res);
    
    });

/** 
 * EMS 
 * set new hire
 */ 
app.post('/ems/api/setNewHire/', function(req,res) {

    ems.setNewHire(req,res);
});

/** 
 * EMS
 * get new hire list 
 * */

app.get('/ems/api/getNewHireDetails/:id', function(req,res) {

    ems.getNewHireDetails(req,res);

});

/** 
 * EMS
 * set reason master 
 * */
app.post('/ems/api/setReasonMaster/', function(req,res) {

    ems.setReasonMaster(req,res);
});

/** EMS
 * get active reasons list
 */
app.get('/ems/api/getActiveReasonList/', function(req,res) {

    ems.getActiveReasonList(req,res);
});

/** EMS
 * get all reasons list
 */
 app.get('/ems/api/getReasonMasterData/:reasonid/', function(req,res) {

     ems.getReasonMasterData(req, res);
 });

/** EMS
 * set termination category
 */
app.post('/ems/api/setTerminationCategory/', function(req,res) {

        ems.setTerminationCategory(req, res);
});

/** EMS
 * get termination category
 */
 app.get('/ems/api/getTerminationCategory/', function(req,res) {

    ems.getTerminationCategory(req, res);
 });

/** EMS
 * set document category
 */
 app.post('/ems/api/setDocumentCategory/', function(req,res) {

    ems.setDocumentCategory(req,res);
 });

 /** EMS
 * get document category
 */
  app.get('/ems/api/getDocumentCategory/', function(req,res) {

    ems.getDocumentCategory(req, res);
  });

/** EMS
 * get document category
 */
    app.get('/ems/api/getEmployeesList/', function(req,res) {

        ems.getEmployeesList(req, res);
    });
      
 /** EMS
 * set candidate pre onboarding details
 */
  app.post('/ems/api/setPreonboardCandidateInformation', function(req,res) {
   ems.setPreonboardCandidateInformation(req,res);
 });   
  
/** EMS
 * get candidate list
 */
 app.get('/ems/api/getCandidateDetails/:emp_Id', function(req,res) {

    ems.getCandidateDetails(req, res);
});


/** EMS
 * get employee check list
 */
 app.get('/ems/api/getEmployeeChecklists/:emp_Id/:category/:dept_Id', function(req,res) {

    ems.getEmployeeChecklists(req, res);
});


  app.post('/ems/api/setEmployeeResignation/', function(req,res) {

    ems.setEmployeeResignation(req, res);
  });
  app.get('/ems/api/getEmployeesResignation/:id', function(req,res) {

    ems.getEmployeesResignation(req, res);
  });
  app.post('/ems/api/setEmployeeTermination/', function(req,res) {

    ems.setEmployeeTermination(req, res);
  });
  app.get('/ems/api/getEmployeesTermination/:id', function(req,res) {

    ems.getEmployeesTermination(req, res);
  });
  app.get('/ems/api/getActiveTerminationCategories/', function(req,res){
    ems.getActiveTerminationCategories(req,res)
  })
  app.get('/ems/api/getEmployeeslistforTermination/', function(req,res){
    ems.getEmployeeslistforTermination(req,res)
  })
  

  /** set onboard candidate work experience */
  app.post('/ems/api/setCandidateExperience', function(req,res) {

    ems.setCandidateExperience(req, res);
  });

    /** set onboard candidate education */
    app.post('/ems/api/setCandidateEducation', function(req,res) {
        ems.setCandidateEducation(req, res);
    });

   /** getDepartmentEmployeesByDesignation */
    app.get('/ems/api/getDepartmentEmployeesByDesignation/:sid/:pid', function(req,res) {

        ems.getDepartmentEmployeesByDesignation(req,res);
    
    });
      
    /** */
    app.post('/ems/api/setProgramSchedulemail/',function(req,res){
        ems.setProgramSchedulemail(req,res);
    })
    /** */
    app.get('/ems/api/getallEmployeeProgramSchedules/:eid/:sid',function(req,res){
        ems.getallEmployeeProgramSchedules(req,res)
    })
    /** */
    app.post('/ems/api/setselectEmployeesProgramSchedules/',function(req,res){
        ems.setselectEmployeesProgramSchedules(req,res)
    })
    /** */
    app.get('/ems/api/getEmployeesForProgramSchedule/:id',function(req,res){
        ems.getEmployeesForProgramSchedule(req,res)
    });

    /** getFileMasterForEMS*/
    app.post('/ems/api/getFileMasterForEMS/',function(req,res){
        ems.getFileMasterForEMS(req,res)
    });

    /** */
    app.post('/ems/api/setFileMasterForEMS/',function(req,res){
        ems.setFileMasterForEMS(req,res)
    });

    /** */
    app.post('/ems/api/getFilecategoryMasterForEMS/',function(req,res){
        ems.getFilecategoryMasterForEMS(req,res)
    });


  /** EMS set employee master details */

  app.post('/ems/api/setEmpPersonalInfo', function(req,res) {
    ems.setEmpPersonalInfo(req,res);
  });  

//   app.post('/ems/api/setEmployeeMasterData', function(req,res) {
//     ems.setEmployeeMasterData(req,res);
//   });


    /** getOnboardingSettings*/
    app.get('/ems/api/getOnboardingSettings/',function(req,res){
        ems.getOnboardingSettings(req,res)
    })
     /** updateselectEmployeesProgramSchedules*/
     app.post('/ems/api/updateselectEmployeesProgramSchedules/',function(req,res){
        ems.updateselectEmployeesProgramSchedules(req,res)
    })
    /**setEmsEmployeeColumnConfigurationValues */
    app.post('/ems/api/setEmsEmployeeColumnConfigurationValues/',function(req,res){
        ems.setEmsEmployeeColumnConfigurationValues(req,res)
    })
    /**getEmsEmployeeColumnConfigurationValue */
    app.get('/ems/api/getEmsEmployeeColumnConfigurationValue/:id',function(req,res){
        ems.getEmsEmployeeColumnConfigurationValue(req,res)
    })
   
      /**getFilepathsMasterForEMS */
    app.get('/ems/api/getFilepathsMasterForEMS/:moduleId/:companyName',function(req,res){
        ems.getFilepathsMasterForEMS(req,res)
    })
    
   /**setFilesMasterForEMS */
   app.post('/ems/api/setFilesMasterForEMS/',function(req,res){
    ems.setFilesMasterForEMS(req,res)
    })

/**setDocumentOrImageForEMS */
app.post('/ems/api/setDocumentOrImageForEMS/:path',function(req,res){
    ems.setDocumentOrImageForEMS(req,res)
    })
/**EMS getUserLoginData */
app.get('/ems/api/getUserLoginData/',function(req,res){
    ems.getUserLoginData(req,res)
})
/**usersLogin*/
app.post('/ems/api/usersLogin/',function(req,res){
    ems.usersLogin(req,res)
})
/**EMS getEmsEmployeeColumnFilterData */
app.get('/ems/api/getEmsEmployeeColumnFilterData/',function(req,res){
    ems.getEmsEmployeeColumnFilterData(req,res)
})
/**EMS getEmsEmployeeDataForReports */
app.post('/ems/api/getEmsEmployeeDataForReports/',function(req,res){
    ems.getEmsEmployeeDataForReports(req,res)
})

    /** get Employee Personal Info (HR)*/
    app.get('/ems/api/getEmpPersonalInfo/:id/:companyName',function(req,res){
        ems.getEmpPersonalInfo(req,res)
    })

/**getDocumentsForEMS */
app.post('/ems/api/getDocumentsForEMS/',function(req,res){
    ems.getDocumentsForEMS(req,res)
    })
    
    /**getDocumentsForEMS */
app.post('/ems/api/getDocumentOrImagesForEMS/',function(req,res){
    ems.getDocumentOrImagesForEMS(req,res)
    })

    
    /**removeDocumentOrImagesForEMS */
    app.delete('/ems/api/removeDocumentOrImagesForEMS/:path',function(req,res){
        ems.removeDocumentOrImagesForEMS(req,res)
        })

/**
 * Delete Files Master
 * */
 app.get('/ems/api/deleteFilesMaster/:id', function(req,res) {

    ems.deleteFilesMaster(req,res);

});

/**
 * Delete Files Master
 * */
 app.post('/ems/api/Messages', function(req,res) {
    ems.Messages(req,res);

});
  /** EMS set employee job details */
  app.post('/ems/api/setEmpJobDetails', function(req,res) {
    ems.setEmpJobDetails(req,res);
  });  

    /** EMS set employee education details */
    app.post('/ems/api/setEmpEducationDetails', function(req,res) {
        ems.setEmpEducationDetails(req,res);
      });  

/** EMS set employee education details */
    app.post('/ems/api/setEmpEmployement', function(req,res) {
        ems.setEmpEmployement(req,res);
    });  

/** get Employee Personal Info (HR)*/
    app.get('/ems/api/getEmpEmployement/:id',function(req,res){
        ems.getEmpEmployement(req,res)
    })

/** get Employee Personal Info (HR)*/
app.get('/ems/api/getEmpEducationDetails/:id',function(req,res){
    ems.getEmpEducationDetails(req,res)
})

/** get Employee Personal Info (HR)*/
app.get('/ems/api/getEmpJobDetails/:id',function(req,res){
    ems.getEmpJobDetails(req,res)
})
/** getOffboardingSettings*/
app.get('/ems/api/getOffboardingSettings/',function(req,res){
    ems.getOffboardingSettings(req,res)
});
/** EMS setOffboardingSettings */
app.post('/ems/api/setOffboardingSettings', function(req,res) {
    ems.setOffboardingSettings(req,res);
});

//** */
app.post('/ems/api/getEmployeesPendingChecklists', function(req,res) {
    ems.getEmployeesPendingChecklists(req,res);

});

    //////// 
/** EMS setOnboardingSettings */
app.post('/ems/api/setOnboardingSettings', function(req,res) {
    ems.setOnboardingSettings(req,res);
});

app.get('/ems/api/getActiveAnnouncementsTopics/',function(req,res){
    ems.getActiveAnnouncementsTopics(req,res)
})
app.get('/ems/api/getAnnouncements/:announcement_id',function(req,res){
    ems.getAnnouncements(req,res)
})
app.post('/ems/api/setAnnouncements/',function(req,res){
    ems.setAnnouncements(req,res)
})

app.get('/ems/api/getFilesForApproval/',function(req,res){
    ems.getFilesForApproval(req,res)
})
/**Document Approval */
app.post('/ems/api/documentApproval/',function(req,res){
    ems.documentApproval(req,res)
})


/**Document Approval */
app.post('/ems/api/setEmployeeChecklists',function(req,res){
    ems.setEmployeeChecklists(req,res)
})
//** */
app.post('/ems/api/getEmpOffboardTerminationChecklists', function(req,res) {
    ems.getEmpOffboardTerminationChecklists(req,res);

});
  /** get Employee Personal Info (HR)*/
  app.get('/ems/api/getEmpAnnouncements/:companyName',function(req,res){
    ems.getEmpAnnouncements(req,res)
  })

  //** */
app.post('/ems/api/getEmpResignationPendingChecklists', function(req,res) {
    ems.getEmpResignationPendingChecklists(req,res);

});

app.post('/ems/api/getEmployeesResignationForHr/', function(req,res) {

    ems.getEmployeesResignationForHr(req, res);
});


/** EMS
 * get employee check list
 */
app.get('/ems/api/getReportingManagerForEmp/:id/:companyName', function(req,res) {

    ems.getReportingManagerForEmp(req, res);
});


app.get('/ems/api/getHrDetails/', function(req,res) {

    ems.getHrDetails(req, res);
});
app.get('/ems/api/getnoticeperiods/', function(req,res) {
    ems.getnoticeperiods(req, res);
});
////////
// app.use("/admin", admin);
// app.use("/attendance", attendance);
// app.use("/ems",ems);
app.use("/payroll",payroll);



/*****
 * Multitenant
 * 
 * ****/
 var common = require('./common');


 
/**employee login */
app.post('/api/emp_login',function(req,res,next){
    common.login(req,res)
})

/**get employe leaves */
app.get('/api/getemployeeleaves/:empid/:page/:size/:companyName',function(req,res){
    leaveManagement.getemployeeleaves(req,res)
})



/*Get User Leave Balance*/
app.get('/api/getLeaveBalance/:empid/:companyName',function(req,res) {
    leaveManagement.getLeaveBalance(req,res)
});

/*Get Holidays based on employeeId*/
app.get('/api/getHolidaysList/:empId/:companyName',function(req,res) {
    leaveManagement.getHolidaysList(req,res)
})

app.post('/api/getleavecalender/:id/:companyName',function(req,res){
    
    leaveManagement.getleavecalender(req,res)
})

/**Get Duration for back dated leave*/
app.get('/api/getdurationforbackdatedleave/:companyName',function(req,res) {
    leaveManagement.getdurationforbackdatedleave(req,res)
    
});
/**get leave cycle for last month */
app.post('/api/getleavecyclelastmonth/:companyName',function(req,res){
    leaveManagement.getleavecyclelastmonth(req,res)

})


/*Get Leaves Type Info*/
app.get('/api/getLeavesTypeInfo/:companyName',function(req,res) {
   leaveManagement.getLeavesTypeInfo(req,res)
});


/**Get approved compoffs dates for leave submit*/
app.post('/api/getApprovedCompoffs',function(req,res) {
    leaveManagement.getApprovedCompoffs(req,res)
});

/**get relations for bereavement leave submit*/
app.post('/api/getEmployeeRelationsForBereavementLeave',function(req,res) {

    leaveManagement.getEmployeeRelationsForBereavementLeave(req,res)
});

/**Get days to be disabled fromdate */
app.get('/api/getdaystobedisabledfromdate/:id/:leaveId/:companyName',function(req,res){
    leaveManagement.getdaystobedisabledfromdate(req,res)
})


/**Get days to be disabled fromdate */
app.get('/api/getdaystobedisabledtodate/:id/:leaveId/:companyName',function(req,res){
   leaveManagement.getdaystobedisabletodate(req,res)
})

/**Get approved compoffs dates for leave submit*/
app.get('/api/getMaxCountPerTermValue/:id/:companyName',function(req,res) {
    leaveManagement.getMaxCountPerTermValue(req,res);
    
});

/**Get Duration for back dated leave*/
app.post('/api/validateleave',function(req,res) {
    leaveManagement.validateleave(req,res)
    
});


/** Get next leave Date for validations
 * @no parameters
 * */

 app.get('/api/getNextLeaveDate/:input',function(req,res) {
    leaveManagement.getNextLeaveDate(req,res);
});

/**set employee leave */
app.post('/api/setemployeeleave',function(req,res){

    leaveManagement.setemployeeleave(req,res)
})
/**
 * Get module code for set file paths
 * */
 app.post('/api/setFilesMaster/', function(req,res) {

    leaveManagement.setFilesMaster(req,res);

});

/**remove/delete image */
app.delete('/api/removeImage/:path',function(req,res){
    leaveManagement.removeImage(req,res)
});

/**
 * Delete Files Master
 * */
 app.get('/ems/api/deleteFilesMaster/:id/:companyName', function(req,res) {

    leaveManagement.deleteFilesMaster(req,res);

});
/**
 * Get module code for set file paths
 * */
 app.post('/api/getFilesMaster/', function(req,res) {
    leaveManagement.getFilesMaster(req,res);
});
/**
 * Get module code for set file paths
 * */
 app.get('/api/getFilepathsMaster/:moduleId/:companyName', function(req,res) {

    leaveManagement.getFilepathsMaster(req,res);

});
app.get('/api/getMastertable/:tableName/:status/:page/:size/:companyName',function(req,res) {

    common.getMastertable(req,res)
});

app.post('/attendance/api/getEmployeeAttendanceNotifications', function (req, res) {
     attendance.getEmployeeAttendanceNotifications(req,res)

});
/**Get comp-off min working hours
 * @ no parameters
 *
 * */

app.get('/api/getCompOffMinWorkingHours/:companyName',function(req,res) {
    leaveManagement.getCompOffMinWorkingHours(req,res)
});

/**Get compOff details*/
app.get('/api/getCompOff/:employeeId/:rmid/:companyName',function(req,res) {
    console.log("kjnjjk",req.params)
    leaveManagement.getCompOff(req,res)
});


/**Get calender details for compoff
 * @EmployeeId
 * @year
 * */

app.get('/api/getCompoffCalender/:calender',function(req,res) {
   leaveManagement.getCompoffCalender(req,res)
});



/** Get duration for backdated comp-off leave
 * @no parameters
 * */

app.get('/api/getDurationforBackdatedCompoffLeave/:companyName',function(req,res) {
    leaveManagement.getDurationforBackdatedCompoffLeave(req,res)

});

/**Set compOff*/

app.post('/api/setCompOff',function(req,res) {
    leaveManagement.setCompOff(req,res)
});
/*Get Role Screen Functionalities*/
app.post('/attendance/api/getrolescreenfunctionalities', function (req, res) {
attendance.getrolescreenfunctionalities(req,res)
});
/**
 * Manager dashboard approved or reject leaves
 * */
app.get('/api/getHandledLeaves/:id/:companyName', function(req,res) {

    leaveManagement.getHandledLeaves(req,res);

});

/**Get approved compoffs dates for leave submit*/
app.get('/api/getLeavesForApprovals/:id/:companyName', function(req,res) {

    leaveManagement.getLeavesForApprovals(req,res);

})





app.get('/api/getcompoffleavestatus/:companyName',function(req,res){
    leaveManagement.getCompoffLeaveStatus(req,res)
});
/**
 * Manager and employee comp-off history
 * */
app.post('/api/getCompoffs', function(req,res) {

    leaveManagement.getCompoffs(req,res);


});


/**
 * Manager approved or reject leaves
 * leave delete and cancel
 * */
app.post('/api/setLeaveStatus', function(req,res) {

    leaveManagement.leaveSattus(req,res);

});
/**
 * Manager dashboard approved or reject compoffs
 * */
app.get('/api/getCompoffsForApproval/:id/:companyName', function(req,res) {

    leaveManagement.getCompoffsForApproval(req,res);

});

/**
 * Manager dashboard approved or reject leaves
 * */
app.post('/api/setCompoffForApproveOrReject', function(req,res) {

    leaveManagement.setCompoffForApproveOrReject(req,res);

});

/**
 * get Leaves For Cancellation
 * */
app.get('/api/getLeavesForCancellation/:Id/:companyName', function(req,res) {

    leaveManagement.getLeavesForCancellation(req,res);

});


/**
 * get Leave Calendar For Manager
 * */
app.get('/api/getLeaveCalendarForManager/:managerId/:companyName', function(req,res) {

    leaveManagement.getLeaveCalendarForManager(req,res);

});

app.post('/api/getMastertables', function(req,res) {

    leaveManagement.getMastertables(req,res);


});
app.post('/api/getEmployeesForReportingManager', function(req,res) {

    leaveManagement.getEmployeesForReportingManager(req,res);


});

app.post('/api/getEmployeeLeaveDetailedReportForManager', function(req,res) {

    leaveManagement.getEmployeeLeaveDetailedReportForManager(req,res);


});
/**
 * Get summary report for manager
 *
 * */

app.post('/api/getSummaryReportForManager', function(req,res) {

    leaveManagement.getSummaryReportForManager(req,res);


});
/**Get All Employees List
 *
 */

app.get('/attendance/api/getallemployeeslist/:companyName', function (req, res) {

    attendance.getallemployeeslist(req,res);

});


/**getReportForPayrollProcessing */
app.post('/api/getReportForPayrollProcessing/', function(req,res) {
    leaveManagement.getReportForPayrollProcessing(req,res);
});

/*CancelLeave Request */
app.post('/api/cancelLeaveRequest',function(req,res) {
   leaveManagement.cancelLeaveRequest(req,res)
});

/*Get Leave Rules*/
app.get('/api/getErrorMessages/:errorCode/:page/:size/:companyName',function(req,res) {
common.getErrorMessages(req,res)
});



app.post('/api/getstatuslist/:companyName',function(req,res){
    admin.getstatuslist(req,res)
})

/*set Designation*/
app.post('/api/setDesignation',function (req,res) {
    admin.setDesignation(req,res)
});

/*set Designation*/
app.put('/api/putDesignation',function(req,res) {
    admin.putDesignation(req,res)
});

/*Set Departments*/
app.put('/api/putDepartments',function(req,res) {
    admin.putDepartments(req,res);
});

/*set Department*/
app.post('/api/setDepartments',function(req,res) {
    admin.setDepartment(req,res)
});

app.post('/api/updateStatus',checkRecord, function(req,res) {
    admin.updateStatus(req,res)
});

/**
 * Update designation status
 * @id
 * @status
 *
 * */
app.post('/api/designationstatus',checkRecord,function(req,res) {
    admin.designationStatus(req,res)
});

/**
 * Get Work Location
 * */
app.post('/api/getactiveWorkLocation',function(req,res) {
    admin.getactiveWorkLocation(req,res)
});

/**
 * set Holidays
 *
 * */

app.post('/api/setHolidays',function(req,res) {
    admin.setHolidays(req,res)


});
/**
 * Get Holidays filter
 * */
app.get('/api/getHolidysFilter/:year/:locationId/:page/:size/:companyName',function(req,res) {
    admin.getHolidysFilter(req,res)
});

/**
 * Delete Holiday
 * */
app.delete('/api/deleteHoliday/:holidayId/:companyName',function(req,res) {
    admin.deleteHoliday(req,res)

});


/**
 * set Holidays
 * **/
app.put('/api/putHolidays',function(req,res) {
    admin.putHolidays(req,res)
});

/*put comapny information*/
app.put('/api/putCompanyInformation',function(req,res) {

    admin.putCompanyInformation(req,res)
});


/*Set comapny information*/
app.post('/api/setCompanyInformation',function(req,res) {
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

//get Leavepolices
app.get('/api/getLeavePolicies/:leaveCategoryId/:isCommonRule/:pageNumber/:pageSize/:companyName',function(req,res) {
    admin.getLeavePolicies(req,res)
});


/*set Designation*/
app.post('/api/updateLeaveDisplayName',function(req,res) {
    admin.updateLeaveDisplayName(req,res);
});

app.post('/api/setAdvancedLeaveRuleValues',function(req,res) {
    admin.setAdvancedLeaveRuleValues(req,res);
});

/*setToggleLeaveType */
app.post('/api/setToggleLeaveType',function(req,res) {
    admin.setToggleLeaveType(req,res);
});
app.get('/api/getLeaveTypesForAdvancedLeave/:companyName',function(req,res) {
    admin.getLeaveTypesForAdvancedLeave(req,res)
});

app.post('/api/setLeavePolicies',function(req,res) {
    admin.setLeavePolicies(req,res)
});

/**
 * get Carry forwarded Leave MaxCount
 * */
app.get('/api/getCarryforwardedLeaveMaxCount/:leaveId/:companyName', function(req,res) {

    leaveManagement.getCarryforwardedLeaveMaxCount(req,res);

});

/*Get Work Location*/
app.post('/api/getWorkLocation',function(req,res) {
    admin.getWorkLocation(req,res)
});

app.post('/api/updateStatusall',checkRecord, function(req,res) {
    admin.updateStatusall(req,res)
});

/*set Work Location*/
app.post('/api/setWorkLocation',function(req,res) {
    admin.setWorkLocation(req,res)
});

/*setErrorMessages */
app.post('/api/setErrorMessages',function(req,res) {
    common.setErrorMessages(req,res)
});

/**
 *
 *@param boon_emp_id *@param biometric_id */
app.post('/admin/api/getIntegrationEmpidsLookup', function (req, res) {
    admin.getIntegrationEmpidsLookup(req,res)


});

/**
 *
 *@param boon_emp_id *@param biometric_id */

app.post('/admin/api/setIntegrationEmpidsLookup', function (req, res) {
    admin.setIntegrationEmpidsLookup(req,res)

});


//**@param code ,*@param pagenumber, @param pagesize **/
app.post('/admin/api/getAttendenceMessages', function (req, res) {
    admin.getAttendenceMessages(req,res)
});

//**@param jsonData */
app.post('/admin/api/setAttendenceMessages', function (req, res) {
    admin.setAttendenceMessages(req,res)
});

/**@param employee_id */
app.post('/attendance/api/getEmployeeCurrentShifts',function(req,res){
    attendance.getEmployeeCurrentShifts(req,res)
});

/**
 *@param manager_id *@param employee_id *@param date */

app.post('/attendance/api/getemployeeattendancedashboard', function (req, res) {
    attendance.getemployeeattendancedashboard(req,res)
});
/**@param employee_id in, `fromd_date` date,in `to_date` date)*/
app.post('/attendance/api/getEmployeeShiftByDates',function(req,res){
    attendance.getEmployeeShiftByDates(req,res)
});

/**@param employee_id in, `fromd_date` date,in `to_date` date)*/
app.post('/attendance/api/getEmployeeWeekoffsHolidaysForAttendance',function(req,res){
    attendance.getEmployeeWeekoffsHolidaysForAttendance(req,res)
});

/**Get employee_attendance_regularization
 **@employee_id  parameters
 * **/

app.get('/attendance/api/getemployeeattendanceregularization/:employee_id/:companyName', function (req, res) {
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
app.post('/attendance/api/setemployeeattendanceregularization', function (req, res) {
    attendance.setemployeeattendanceregularization(req,res)
})

//**delete_employee_attendance_regularization */
app.post('/attendance/api/deleteAttendanceRequestById', function (req, res) {
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

app.post('/attendance/api/getAttendanceMonthlyReport', function (req, res) {
    attendance.getAttendanceMonthlyReport(req,res)
});

/**get_pending_attendance_regularizations(23) for manager
 **@employee_id  parameters
 */

app.get('/attendance/api/getpendingattendanceregularizations/:employee_id/:companyName', function (req, res) {
    attendance.getpendingattendanceregularizations(req,res)
});


/**get_employees_for_reporting_manager for manager
 **@employee_id  parameters
 *@designation_id  parameters
 */
app.get('/attendance/api/getEmployeesByManagerId/:employee_id/:companyName', function (req, res) {
    attendance.getEmployeesByManagerId(req,res);
});
/** Get Shift Detaild By Employee Id
 * @employee_id Parameter */
app.get('/attendance/api/getemployeeshift/:employee_id/:companyName', function (req, res) {
    attendance.getemployeeshift(req,res);
});


app.get('/attendance/api/getAttendanceRegularizationByManagerId/:manager_employee_id/:companyName', function (req, res) {
    attendance.getAttendanceRegularizationByManagerId(req,res);
});


/** setattendanceapprovalstatus
 `set_attendance_approval_status`(
 `id` int(11),
 `approver_comments` varchar(255),
 `action_by` int(11),
 `approval_status` varchar(32)
 ) */
app.post('/attendance/api/setattendanceapprovalstatus', function (req, res) {
    attendance.setattendanceapprovalstatus(req,res)

})

app.post('/attendance/api/getallemployeeslistByManagerId', function (req, res) {
    attendance.getallemployeeslistByManagerId(req,res)

})

/**
 *@param manager_empid *@param employee *@param fromdate *@param todate */

app.post('/attendance/api/getAttendanceSummaryReport', function (req, res) {
    attendance.getAttendanceSummaryReport(req,res)
});


/**
 *@param attendanceid  */

app.post('/attendance/api/getAttendanceDetailsByAttendanceId', function (req, res) {
    attendance.getAttendanceDetailsByAttendanceId(req,res)
});


app.post('/attendance/api/getEmployeeConfigureShifts', function (req, res) {
    attendance.getEmployeeConfigureShifts(req,res)
});
/**Get All Active Shifts */
app.get('/admin/api/getActiveShiftIds/:companyName', function (req, res) {
    admin.getActiveShiftIds(req,res);

});

/** `set_employee_shifts`(
 `shift_id` int(11),
 `from_date` datetime,
 `to_date` datetime,
 `weekoffs` JSON, -- format: [1,2] 1- Sunday, 2 - Monday etc.
 `empids` JSON -- format: [1,2,3,4]
 ) */
app.post('/attendance/api/setEmployeeConfigureShift', function (req, res) {
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
app.post('/attendance/api/getEmployeeLateAttendanceReport', function (req, res) {
    attendance.getEmployeeLateAttendanceReport(req,res);
});


app.get('/attendance/api/getAttendanceRegularizationsHistoryForManager/:employee_id/:companyName', function (req, res) {
    attendance.getAttendanceRegularizationsHistoryForManager(req,res)
});
/**attendance Excel Data insert Method  set_employee_attendance

 */

app.post('/api/setEmployeeAttendance', function (req, res) {
  attendance.setEmployeeAttendance(req,res);
});








app.listen(6060,function (err) {
    if (err)
        console.log('Server Cant Start ...Erorr....');
    else
        console.log('Server Started at : http://localhost:6060');
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
app.post('/api/changePassword',function(req,res){
   common.changePassword(req,res);
})









// app.listen(6464,'0.0.0.0',function (err) {
//     if (err)
//         console.log('Server Cant Start ...Erorr....');
//     else
//         console.log('Server Started at :  http://122.175.62.210:6464');
// });
