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


/**
 * 
*@param boon_emp_id *@param biometric_id */

app.post('/api/setIntegrationEmpidsLookup', function (req, res) {
      
    try {
        ;
        con.query("CALL `set_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,parseInt(req.body.biometric_id), req.body.calendar_date],
            function (err, result, fields) {
             console.log(result);
                if (result && result.length > 0) {
                    res.send({ status: true, message: 'Mapping added successfully.' })
                } else {
                    res.send({ status: false, message: 'Unable to Mapping.' });
                }
            })
    } catch (e) {
        console.log('set_integration_empids_lookup');
    }
});
/**
 * 
*@param boon_emp_id *@param biometric_id */
app.post('/api/getIntegrationEmpidsLookup', function (req, res) {
      
    try {
        ;
        con.query("CALL `get_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,req.body.biometric_id, req.body.calendar_date],
            function (err, result, fields) {

                if (result && result.length > 0) {
                    res.send({ status: true, data:result[0]})
                } else {
                    res.send({ status: false, data: [] });
                }
            })
    } catch (e) {
        console.log('get_integration_empids_lookup');
    }
});
app.post('/api/setShiftMaster', function (req, res) {
    try {
        ;
        con.query("CALL `set_shift_master` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.shift_name, req.body.shiftdescription, req.body.from_time, req.body.to_time,
                req.body.total_hours, req.body.grace_intime, req.body.grace_outtime, req.body.max_lates, req.body.leave_deduction_count,
                req.body.leavetype_for_deduction, req.body.overtimeduration], function (err, result, fields) {
                  
                    if (err) {
                        res.send({ status: false, message: 'UnableToSave' });
                    } else {
                        if (result[0][0].validity_status == 0) {
                            res.send({ status: true, message: "duplicateData"})
                        } else {
                            res.send({ status: true, message: "dataSave" })
                        }
                    }
                });

    } catch (e) {
        console.log('setShiftMaster')
    }
})
/**Get All SHifts */
app.get('/api/getAllShifts', function (req, res) {

    try {


        con.query("CALL `get_all_shifts`", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('get_all_shifts :', e)

    }
});
/**Update Shift Status
 **@shift_id  parameters
 **@status_value parameters

 * **/

 app.post('/api/updateShiftStatus', function (req, res) {
 
    try {
        con.query("CALL `update_shift_status` (?,?)", [req.body.shift_id,req.body.status_value], function (err, result, fields) {
            
               if (err) {
                res.send({ status: false, message: "unableToUpdate" });
               }
               else {
                   console.log(result[0][0].updateStatus)
                     if (result[0][0].updateStatus == 0) {
                            res.send({ status: false, message: "alreadyAssigned" })
                         }
                     else {
                           res.send({ status: true, message: "statusUpdated" })
                      }
            }
        });
    } catch (e) {
        console.log('updateShiftStatus :', e)
    }
});
/**Get getShiftsDetailsById
 **@shift_id  parameters
 * **/

 app.get('/api/getShiftsDetailsById/:shift_id', function (req, res) {

    try {


        con.query("CALL `get_shifts_details_by_id` (?)", [req.params.shift_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('get_shifts_details_by_id :', e)

    }
});
/**Get All Active Shifts */
app.get('/api/getActiveShiftIds', function (req, res) {

    try {
        con.query("CALL `get_active_shift_ids`", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ data: [],status: false })
            }
        });


    } catch (e) {
        console.log('get_all_shifts :', e)

    }
});


//**@param code ,*@param pagenumber, @param pagesize **/
app.post('/api/getAttendenceMessages', function (req, res) {
    try {
        con.query("CALL `get_attendance_messages` (?,?,?)", [req.body.code,
             req.body.pagenumber,req.body.pagesize],
            function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ status: true, data: result[0] })
                } else {
                    res.send({ status: false, data: [] });
                }
            })
    } catch (e) {
        console.log('get_attendance_messages');
    }
});
//**@param jsonData */
app.post('/api/setAttendenceMessages', function (req, res) {
    let data = JSON.stringify(req.body)
    try {
        con.query("CALL `set_attendance_messages` (?)", [data],
            function (err, result, fields) {
                if (err) {
                    res.send({ status: false, data: "unableToSave" })
                } else {
                    res.send({ status: true, data:"dataSaved" });
                }
            })
    } catch (e) {
        console.log('set_attendance_messages');
    }
});
/*Get Role Master*
**@paramater department_id */
app.post('/api/getRolesByDepartment',function(req,res) {
    try {
        console.log(req.body)
        con.query("CALL `getrolemaster_by_dept` (?)",[req.body.department_id ], function (err, result, fields) {
           console.log(result);
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false,data: []})
            }
        });
        

    }catch (e) {
        console.log('getrolemaster :',e)
    }
});
module.exports = app;