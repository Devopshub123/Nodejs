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
var switchDatabase= function(domain) {
    if (domain) {
        con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            port: 3306,
            password: "root",
            database: domain,
            dateStrings: true,
            multipleStatements: true

        });
        // every five hours database will be hit.this is for continous connection
        setInterval(function () {
            con.query('SELECT 1')
        }, 18000000);
    } else {
        dbcon = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            port: 3306,
            password: "root",
            database: "HRMS",
            dateStrings: true,
            multipleStatements: true
        });

    }
}




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


/*Set Departments Status*/
app.post('/api/setDepartmentsStatus/:departmentId',function(req,res) {
    try {

        con.query("CALL `setDepartmentsStatus` (?)",[req.params.departmentId,req.body.status], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update department status'});
            } else {
                res.send({status: true,message:'Department status updated successfully'})
            }
        });
    }catch (e) {
        console.log('setDepartmentsStatus :',e)

    }
});

/*Get workloaction*/
app.get('/api/getWorklocation',function(req,res) {
    try {

        con.query("CALL `getWorklocation` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getWorklocation :',e)

    }
});

/*set worklocation*/
app.get('/api/setWorklocation',function(req,res) {
    try {

        con.query("CALL `setWorklocation` (?)",[req.body.country, req.body.state,req.body.city], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to insert work location'});
            } else {
                res.send({status: true,message:'Work location added successfully'})
            }
        });
    }catch (e) {
        console.log('setWorklocation :',e)

    }
});


/*Set Worklocation Status*/
app.post('/api/setWorklocationStatus/:workloacrionId',function(req,res) {
    try {

        con.query("CALL `setWorklocationStatus` (?)",[req.params.workloacrionId,req.body.status], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update work location status'});
            } else {
                res.send({status: true,message:'Work location status updated successfully'})
            }
        });
    }catch (e) {
        console.log('setWorklocationStatus :',e)

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
app.get('/api/setHolidays',function(req,res) {
    try {

        con.query("CALL `setHolidays` (?)",[req.body.year, req.body.holidayName,req.body.date], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to insert holidays'});
            } else {
                res.send({status: true,message:'Holidays added successfully'})
            }
        });
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
app.get('/api/getLeaveBalance',function(req,res) {
    console.log("hellogetLeaveBalance")

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

/*Set Add Leave Balance*/

app.post('/api/setLeaveBalance',function(req,res) {
    console.log("hello",req.body)
    try {
        con.query("CALL `setLeaveBalance` (?,?,?,?,?)",
            [req.body.leaveTypeName, req.body.description, req.body.color], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert leave balance'});
                } else {
                    res.send({status: false, message: 'Leave balance added Successfully'})
                }
            });
    }catch (e) {
        console.log('setLeaveBalance :',e)
    }
});

/*put Add Leave Balance*/

app.put('/api/putLeaveBalance',function(req,res) {
    console.log("helloput",req.body)

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

app.delete('/api/deleteLeaveBalance/:leaveBalanceId',function(req,res) {
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

app.listen(6060,function (err) {
    if (err)
        console.log('Server Cant Start ...Erorr....');
    else
        console.log('Server Started at : http://localhost:6060')
})