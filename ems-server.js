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

app.post('/api/newhire', function (req, res) {
    try {
        con.query("CALL `set_new_hire` (?)",[JSON.stringify(req.body)],function (err, result, fields) {
            console.log(result)
            res.send(result)
        });
    }
    catch (e) {
        console.log('newhire',e)
    }
})

/** setattendanceapprovalstatus
 `set_reason_master`(
	in reason_id int(11),
	in reason varchar(64),
    in reason_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
app.post('/api/setReasonMaster', function (req, res) {
    try {
        con.query("CALL `set_reason_master` (?,?,?,?)",
        [req.body.reason_id,req.body.reason, parseInt(req.body.reason_status),req.body.actionby], function (err, result, fields) {
            console.log(result)
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
    }
    catch {
        console.log('get_reason_master :', e)
    }
})

/** set terminate category
    in termination_id int(11),
    in termination_category varchar(64),
    in termination_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
app.post('/api/setTerminationCategory', function (req, res) {

    try {
        console.log(req.body);
        con.query("CALL `set_termination_category` (?,?,?,?)",
            [req.body.termination_id, req.body.termination_category,
             parseInt(req.body.termination_status), req.body.actionby], function (err, result, fields) {
              console.log(result)   
            if (result[0][0].statuscode == 0) {
                        res.send({ status: true, message: "",data: result[0][0]})
                    } else {
                        res.send({ status: false, message: "unable to save" })
                    }
                
            });

    }catch (e) {
        console.log('set_termination_category')
    }
})

/**Get termination category Data **/
app.get('/api/getTerminationCategory', function (req, res) {
    try {
        con.query("CALL `get_termination_category` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('get_termination_category :', e)

    }
});
///////////
/** set document category
     in document_id int(11),
    in document_category varchar(64),
    in document_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
app.post('/api/setDocumentCategory', function (req, res) {
    try {
        con.query("CALL `set_document_category` (?,?,?,?)",
            [req.body.document_id, req.body.document_category,
             parseInt(req.body.document_status), req.body.actionby], function (err, result, fields) {
              console.log(result)   
            if (result[0][0].statuscode == 0) {
                        res.send({ status: true, message: "",data: result[0][0]})
                    } else {
                        res.send({ status: false, message: "unable to save" })
                    }
                
            });

    }catch (e) {
        console.log('set_document_category')
    }
})
/**Get document category Data **/
app.get('/api/getDocumentCategory', function (req, res) {
    try {
        con.query("CALL `get_document_category` ()", function (err, result, fields) {
            console.log(result)
           if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('get_document_category :', e)

    }
});

/////////
module.exports = app;