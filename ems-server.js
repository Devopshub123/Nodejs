var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var path = require('path');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer')
var app = new express();
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

module.exports = {
    setProgramsMaster:setProgramsMaster,
    getProgramsMaster:getProgramsMaster,
    setProgramTasks:setProgramTasks,
    getProgramTasks:getProgramTasks,
    setProgramSchedules:setProgramSchedules,
    getProgramSchedules:getProgramSchedules,
    setEmployeeProgramSchedules:setEmployeeProgramSchedules,
    getEmployeeProgramSchedules:getEmployeeProgramSchedules,
    setChecklistsMaster:setChecklistsMaster,
    getChecklistsMaster:getChecklistsMaster,


};

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
    catch(e) {
        console.log('get_reason_master :', e)
    }
});

/** set terminate category
    in termination_id int(11),
    in termination_category varchar(64),
    in termination_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
 **/
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
        console.log('set_document_category',e)
    }
})
/**Get document category Data **/
app.get('/api/getDocumentCategory', function (req, res) {
    try {
        con.query("CALL `get_document_category` ()", function (err, result, fields) {
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

module.exports = app;


function setProgramsMaster(req,res) {
    try {
        con.query("CALL `set_programs_master` (?,?,?,?,?)", [req.body.pid,req.body.programType,req.body.pDescription,req.body.pStatus, req.body.actionby], function (err, result, fields) {
            if (result && result[0][0].successstate == 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setProgramsMaster :', e)

    }

}

function getProgramsMaster(req,res) {
    try {
        con.query("CALL `get_programs_master` (?)", [req.params.pId], function (err, result, fields) {
            console.log(res.status,'getProgramsMaster',result,err)
            if (result && result.length > 0) {
                console.log(res.status,'getProgramsMaster',result)
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getProgramsMaster :', e)

    }

}



function setProgramTasks() {
    try {
        con.query("CALL `set_program_tasks` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setProgramTasks :', e)

    }

}




function getProgramTasks(req,res) {
    try {
        con.query("CALL `get_program_tasks` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getProgramTasks :', e)

    }

}


function setProgramSchedules(req,res) {
    try {
        con.query("CALL `set_program_schedules` (?)", [req.body.scheduleId,req.body.programId,req.body.sDescription,req.body.conductedby,req.body.scheduleDate,req.body.startTime,req.body.endTime,req.body.actionby], function (err, result, fields) {
            if (result && result[0][0].successstate == 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setProgramSchedules :', e)

    }

}


function getProgramSchedules(req,res) {
    try {
        con.query("CALL `get_program_schedules` (?,?)", [req.body.scheduleId,req.body.programId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getProgramSchedules :', e)

    }

}



function setEmployeeProgramSchedules(req,res) {
    try {
        con.query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [req.body.esId,req.body.scheduleId,req.body.employeeid,req.body.status, req.body.actionby], function (err, result, fields) {

            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setEmployeeProgramSchedules :', e)

    }

}
function getEmployeeProgramSchedules(req,res) {
    try {
        con.query("CALL `get_employee_program_schedules` (?,?)", [req.body.employeeId,req.body.scheduleId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getEmployeeProgramSchedules :', e)

    }

}
function setChecklistsMaster(req,res) {
    try {
        con.query("CALL `set_checklists_master` (?,?,?,?,?,?)", [req.params.cId,req.params.department,req.params.checklistName,req.params.checklistCategory,req.params.checklistDescription,req.params.actionby], function (err, result, fields) {
            if (result  && result[0][0].successstate == 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setChecklistsMaster :', e)

    }

}


function getChecklistsMaster(req,res) {
    try {
        con.query("CALL `get_checklists_master` (?,?)", [req.body.cId,req.body.deptId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getChecklistsMaster :', e)

    }

}

