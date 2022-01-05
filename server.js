var bodyParser = require('body-parser');
var express = require('express');
var app = new express();
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
app.use(bodyParser.json({ limit: '5mb' }));

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

/*Switching database connection*/
var con;
var dbcon;
con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    port: 3306,
    password: "root",
    database: "HRMS_LM",
    dateStrings: true,
    multipleStatements: true
});
// setInterval(function () {console.log(con.query('SELECT 1'))}, 500);

// var switchDatabase= function(domain) {
//     if (domain) {
//         con = mysql.createConnection({
//             host: "127.0.0.1",
//             user: "root",
//             port: 3306,
//             password: "root",
//             database: domain,
//             dateStrings: true,
//             multipleStatements: true
//
//         });
//         // every five hours database will be hit.this is for continous connection
//         setInterval(function () {
//             con.query('SELECT 1')
//         }, 18000000);
//     } else {
//         dbcon = mysql.createConnection({
//             host: "127.0.0.1",
//             user: "root",
//             port: 3306,
//             password: "root",
//             database: "HRMS",
//             dateStrings: true,
//             multipleStatements: true
//         });
//
//     }
// }




/*Get company Information*/
app.get('/api/getCompanyInformation/:companyId',function(req,res) {
    try {

        con.query("CALL `getCompanyInformation` (?)", [req.params.companyId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getCompanyInformation :',e)

    }
});

/*Set comapny information*/

app.post('/api/setCompanyInformation',function(req,res) {
    try {
        con.query("CALL `setCompanyInformation` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.fullCompanyName, req.body.companyWebsite, req.body.primaryContact,
                req.body.primaryContactEmail, req.body.address, req.body.addressOne, req.body.country, req.body.state, req.body.city, req.body.pincode], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert company information'});
                } else {
                    res.send({status: false, message: 'Company information added Successfully'})
                }
            });
    }catch (e) {
        console.log('setCompanyInformation :',e)
    }
});

/*put comapny information*/

app.put('/api/setCompanyInformation/:companyId',function(req,res) {
    try {
        con.query("CALL `setCompanyInformation` (?,?,?,?,?,?,?,?,?,?,?,?)",
            [req.params.companyId,req.body.fullCompanyName, req.body.companyWebsite, req.body.primaryContact,
                req.body.primaryContactEmail, req.body.address, req.body.addressOne, req.body.country, req.body.state, req.body.city, req.body.pincode], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update company information'});
                } else {
                    res.send({status: false, message: 'Company information updated Successfully'})
                }
            });
    }catch (e) {
        console.log('putCompanyInformation :',e)
    }
});

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

/*set Department*/
app.get('/api/setDepartment',function(req,res) {
    try {

        con.query("CALL `setDepartment` (?)",[req.body.departmentName], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to insert department'});
            } else {
                res.send({status: true,message:'Department added successfully'})
            }
        });
    }catch (e) {
        console.log('setDepartment :',e)

    }
});
/*set Work Location*/
app.post('/api/setWorkLocation',function(req,res) {
    console.log(req.body)
    try {
        let infoLocationsMaster={}
        infoLocationsMaster.CountryId=req.body.countryId;
        infoLocationsMaster.StateId=req.body.stateId;
        infoLocationsMaster.Location=req.body.city;
        con.query("CALL `setMasterTable` (?,?)",['LocationsMaster',JSON.stringify(infoLocationsMaster)], function (err, result, fields) {
            console.log('err',err,result)

            if (err) {
                res.send({status: false, message: 'Unable to added department'});
            } else {
                res.send({status: true,message:'Department added successfully'})
            }
        });
    }catch (e) {
        console.log('setWorkLocation :',e)

    }
});
// /*Get Work Location*/
// app.get('/api/getWorkLocation',function(req,res) {
//     try {
//
//         con.query("CALL `getMastertable` ()", function (err, result, fields) {
//             if (result.length > 0) {
//                 res.send({data: result, status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
//     }catch (e) {
//         console.log('getWorkLocation :',e)
//
//     }
// });
/*Set Departments*/
app.post('/api/setDepartments',function(req,res) {
    try {
        console.log('hello',req.body)
        let tname='DepartmentsMaster';
        let info={}
        info.deptName=req.body.departmentName
        info.deptHead=null
        info.deptCount=null


        console.log('heldepartmentNamelo',info,req.body.departmentName)

        con.query("CALL `setMasterTable` (?,?)",[tname,JSON.stringify(info)], function (err, result, fields) {
            if (result.length > 0) {
                res.send({ status: true,message:'Unable to insert departments'});
            } else {
                res.send({status: false,message:'Successfully added departments'})
            }
        })
    }catch (e) {
        console.log('getHolidays :',e)

    }
});

/*Get Holidays*/
app.get('/api/getHolidays',function(req,res) {
    try {

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

/*set Holidays*/
app.post('/api/setHolidays',function(req,res) {
    try {
        let tname='HolidaysMaster';
        let info={}
        let reqData=req.body;
        let k=0;
        reqData.forEach(element =>{
            info.Description=element.holidayName;
            info.Date=element.holidayDate;
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let hDate = (new Date(element.holidayDate));
            info.Date = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
            info.Day=days[hDate.getDay()];
            info.Year=hDate.getFullYear();
            info.Location=element.Id;
            console.log('yyhh',info)

            con.query("CALL `setMasterTable` (?,?)",[tname,JSON.stringify(info)], function (err, result, fields) {
                console.log('yerryhh',err)
                k+=1;

                if (err) {
                    res.send({status: false, message: 'Unable to insert holidays'});
                } else {
                    if(k===reqData.length) {
                        res.send({status: true, message: 'Holidays added successfully'});
                    }
                }
            });
        })

    }catch (e) {
        console.log('setHolidays :',e)

    }
});
/*Set Holidays Status*/
app.post('/api/setHolidaysStatus/:holidaysId',function(req,res) {
    try {

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

/*Get Master table*/
app.get('/api/getMastertable/:tableName',function(req,res) {
    try {
        console.log("first",req.params.tableName)
        var tName = req.params.tableName;
        con.query("CALL `getMastertable` (?)",[tName], function (err, result, fields) {
            // console.log('resultgetcountry',result[0],err)

            if (result.length > 0) {
                res.send({data: result[0], status: true});
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
/*Delete Add Leave Balance*/

app.delete('/api/deleteAddLeaveBalance/:leaveBalanceId',function(req,res) {
    console.log("hellod;wrw",req.body)

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
app.get('/api/getEmployeeMaster',function(req,res) {

    try {

        con.query("CALL `getEmployeeMaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getEmployeeMaster :',e)

    }
});

/*Set Employee Master*/

app.post('/api/setEmployeeMaster',function(req,res) {
    console.log("hello",req.body)
    try {
        con.query("CALL `setEmployeeMaster` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert employee'});
                } else {
                    res.send({status: false, message: 'Employee added Successfully'})
                }
            });
    }catch (e) {
        console.log('setEmployeeMaster :',e)
    }
});

/*put Employee Master*/

app.put('/api/putEmployeeMaster',function(req,res) {
    console.log("helloput",req.body)

    try {
        con.query("CALL `putEmployeeMaster` (?,?,?,?,?)",
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
        con.query("CALL `getSearch` (?,?)",
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

/*Set Employee Master*/

app.post('/api/setEmployeeMaster',function(req,res) {
    console.log("hello",req.body)
    try {
        con.query("CALL `setEmployeeMaster` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert employee'});
                } else {
                    res.send({status: false, message: 'Employee added Successfully'})
                }
            });
    }catch (e) {
        console.log('setEmployeeMaster :',e)
    }
});

/*Get User Leave Balance*/
app.get('/api/getLeaveBalance',function(req,res) {
    try {

        con.query("CALL `getLeaveBalance` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getLeaveBalance :',e)

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

/*Get Leave History*/
app.get('/api/getLeaveHistory',function(req,res) {
    try {

        con.query("CALL `getLeaveHistory` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getLeaveHistory :',e)

    }
});
/*Set Delete Leave Request */

app.delete('/api/setDeleteLeaveRequest/:Id',function(req,res) {
    console.log("hello",req.body)
    try {
        con.query("CALL `setDeleteLeaveRequest` (?)",
            [req.params.LeaveId], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable able to delete leave request'});
                } else {
                    res.send({status: false, message: 'Leave request deleted successfully'})
                }
            });
    }catch (e) {
        console.log('setDeleteLeaveRequest :',e)
    }
});

/*Set put Leave Request */

app.put('/api/updateLeaveRequest/:Id',function(req,res) {
    console.log("hello",req.body)
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
/*Set CompOff*/

app.post('/api/setCompOff',function(req,res) {
    try {
        con.query("CALL `setCompOff` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to add comp-off'});
                } else {
                    res.send({status: false, message: 'Comp-Off added Successfully'})
                }
            });
    }catch (e) {
        console.log('setCompOff :',e)
    }
});

/*Get CompOff*/
app.get('/api/getCompOff',function(req,res) {
    try {

        con.query("CALL `getCompOff` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getCompOff :',e)

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


app.listen(6060,function (err) {
    if (err)
        console.log('Server Cant Start ...Erorr....');
    else
        console.log('Server Started at : http://localhost:6060')
})