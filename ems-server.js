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


/** setattendanceapprovalstatus
 `set_reason_master`(
	in reason_id int(11),
	in reason varchar(64),
    in reason_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
app.post('/api/set_reason_master', function (req, res) {
    try {
        con.query("CALL `set_reason_master` (?,?,?,?)",
        [req.body.reason_id,req.body.reason, parseInt(req.body.reason_status),req.body.actionby], function (err, result, fields) {
               
                    if (result[0][0].statuscode == 0) {
                        res.send({ status: true, message: "",data: result[0][0]})
                    } else {
                        res.send({ status: false, message: "unable to save" })
                    }
                
            });

    }catch (e) {
        console.log('set_reason_master')
    }
})

/**Get Reason Data **/

 app.get('/api/getActiveReasonList', function (req, res) {
    try {
        con.query("CALL `get_active_reasons` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('get_reason_master :', e)

    }
});

/**Get reason list
 **@reason_id  parameters
 * **/

 app.get('/api/getReasonMasterData/:reasonid', function (req, res) {
    try {
        con.query("CALL `get_reason_master` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('get_reason_master :', e)

    }
});

module.exports = app;