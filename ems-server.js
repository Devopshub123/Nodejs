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
    getChecklistsMaster: getChecklistsMaster,
    setNewHire: setNewHire,
    getNewHireDetails: getNewHireDetails,
    setReasonMaster: setReasonMaster,
    getActiveReasonList: getActiveReasonList,
    getReasonMasterData: getReasonMasterData,
    setTerminationCategory: setTerminationCategory,
    getTerminationCategory: getTerminationCategory,
    setDocumentCategory: setDocumentCategory,
    getDocumentCategory: getDocumentCategory,

    getEmployeesList: getEmployeesList,
    setPreonboardCandidateInformation: setPreonboardCandidateInformation,
    getEmployeeChecklists: getEmployeeChecklists,
    getCandidateDetails: getCandidateDetails,
    getEmployeesTermination:getEmployeesTermination,
    setEmployeeTermination:setEmployeeTermination,
    setEmployeeResignation:setEmployeeResignation,
    getEmployeesResignation: getEmployeesResignation,
    setCandidateExperience: setCandidateExperience,
    setCandidateEducation: setCandidateEducation



};
//// set new hire list
function setNewHire(req,res) {
    try {
        console.log(req.body.personal_email);
        con.query("CALL `set_new_hire` (?)",[JSON.stringify(req.body)],function (err, result, fields) {
            console.log(result[0][0].candidate_id)
            if (result[0][0].statuscode == 0) {
                // res.send({status:true,data:result[0][0]})
                var transporter = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com", // hostname
                    secureConnection: false, // TLS requires secureConnection to be false
                    port: 587, // port for secure SMTP
                    tls: {
                        ciphers:'SSLv3'
                    },
                    auth: {
                        user: 'smattupalli@sreebtech.com',
                        pass: 'Sree$sreebt'
                    }
                });
               // var url = 'http://localhost:6060/api/Resetpassword/'+email+'/'+id
                var url = 'http://122.175.62.210:7575/Login'
                var html = `<html>
                <head>
                <title>Candidate Form</title></head>
                <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
                <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
                <p style="color:black">Hello,</p>
                <p style="color:black">Thank you for using HRMS&nbsp; We’re really happy to have you!<b></b></p>
                <p style="color:black"> kindly complete your application here by following link</p>
                <p style="color:black"> <a href="${url}" >${url} </a></p>   
                <p style="color:black"> Fill in all the information as per your supporting documents.</p>
                <p style="color:black">Thank You!</p>
                <p style="color:black">HRMS Team</p>
                <hr style="border: 0; border-top: 3px double #8c8c8c"/>
                </div></body>
                </html> `;
                var mailOptions = {
                    from: 'smattupalli@sreebtech.com',
                    to: req.body.personal_email,
                    subject: 'Acknowledgement form',
                    html:html
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.send({status: false})
                    } else {
                        res.send({status: true})
                    }
                });
            }
            else {
                res.send({status:false})
            }
        });
    }
    catch (e) {
        console.log('setNewHire',e)
    }
}
//// get new hire list
function getNewHireDetails(req, res) {
    try {
        con.query("CALL `get_new_hire_details` (?)", [req.params.candidate_id], function (err, result, fields) {
        if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch (e) {
        console.log('getNewHireDetails',e)
    }
}

/** setattendanceapprovalstatus
 `set_reason_master`(
	in reason_id int(11),
	in reason varchar(64),
    in reason_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
function setReasonMaster(req, res) {
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
        console.log('setReasonMaster')
    }
}

/**Get Reason Data **/
function getActiveReasonList(req,res) {
    try {
        con.query("CALL `get_active_reasons` ()", function (err, result, fields) {

            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch (e) {
        console.log('getActiveReasonList',e)
    }
}

/**Get reason list
 **@reason_id  parameters
 * **/
 function getReasonMasterData(req,res) {
    try {
        con.query("CALL `get_reason_master` (?)", [req.params.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch (e) {
        console.log('getReasonMasterData',e)
    }
}

/** set terminate category
    in termination_id int(11),
    in termination_category varchar(64),
    in termination_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
 **/
    function setTerminationCategory(req,res) {
        try {
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
            console.log('setTerminationCategory')
        }
    }

/**Get termination category Data **/
function getTerminationCategory(req, res) {
   try {
        con.query("CALL `get_termination_category` (null)", function (err, result, fields) {
            console.log(result)
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getTerminationCategory :', e)
    }
}

/** set document category
     in document_id int(11),
    in document_category varchar(64),
    in document_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
function setDocumentCategory(req,res) {
    try {
        con.query("CALL `set_document_category` (?,?,?,?)",
            [req.body.document_id, req.body.document_category,
             parseInt(req.body.document_status), req.body.actionby], function (err, result, fields) {
                if (result[0][0].statuscode == 0) {
                        res.send({ status: true, message: "",data: result[0][0]})
                    } else {
                        res.send({ status: false, message: "unable to save" })
                    }
            });

    }catch (e) {
        console.log('setDocumentCategory',e)
             }
}
/**Get document category Data **/
function getDocumentCategory(req,res) {
    try {
        con.query("CALL `get_document_category` (null)", function (err, result, fields) {
            console.log(result)
           if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getDocumentCategory :', e)
  }
}

// module.exports = app;


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
/** get hired employee list */
function getEmployeesList(req,res) {
    try {
        con.query("CALL `get_employees_list` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
      } catch (e) {
        console.log('getEmployeesList :', e)
    }
}



/** candidate pre onboarding  */

function setPreonboardCandidateInformation(req, res) {

    try {
         con.query("CALL `set_preonboard_candidate_information` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setPreonboardCandidateInformation :', e)

    }
}
    /** get candidates list */
    function getCandidateDetails(req, res) {

        try {
            con.query("CALL `get_candidate_details` (?)", [req.params.emp_Id], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
          } catch (e) {
            console.log('getCandidateDetails :', e)
        }
    }

/** get employee check list */
function getEmployeeChecklists(req, res) {
    try {
           con.query("CALL `get_employee_checklists` (?,?)", [null,req.params.emp_Id], function (err, result, fields) {
               if (result && result.length > 0) {
                   res.send({ data: result[0], status: true });
               } else {
                   res.send({ status: false })
               }
           });
         } catch (e) {
           console.log('getEmployeeChecklists :', e)
       }
}
   
// get_employees_terminations
function getEmployeesTermination(req,res) {
    try {
        con.query("CALL `get_employees_terminations` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getEmployeesTermination :', e)

    }

}

function setEmployeeTermination(req,res) {
    try {
        con.query("CALL `set_employee_termination` ()", [], function (err, result, fields) {
            if (result  && result[0][0].successstate == 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('setEmployeeTermination :', e)

    }

}
// set_employee_resignation,
// get_resignation_data
// `get_resignation_data`(in resgid int, in employee_id int(11), in manager_employee_id int(11))
function getEmployeesResignation(req,res) {
    try {
       console.log(req.params.id)
        con.query("CALL `get_resignation_data` (?,?,?)", [null,req.params.id,null], function (err, result, fields) {
           console.log(result)
           console.log(err)
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('getEmployeesResignation :', e)

    }

}
function setEmployeeResignation(req,res) {
    try {
        console.log(JSON.stringify(req.body))
        con.query("CALL `set_employee_resignation` (?)", [JSON.stringify(req.body)], function (err, result, fields) {      
            if(err){
                res.send({ status: false })
            }
            else{
                res.send({ status: true,data:result[0][0].statuscode })
            }
        });

    } catch (e) {
        console.log('setEmployeeResignation :', e)

    }

}

function setCandidateExperience(req,res) {
    
    try {
        con.query("CALL `set_preonboard_candidate_experience` (?)", [JSON.stringify(req.body)], function (err, result, fields) {      
          console.log(result)
          if (result && result.length > 0) {
            res.send({ data: result[0], status: true });
        } else {
            res.send({ status: false })
        }
        });

    } catch (e) {
        console.log('setCandidateExperience :', e)
    }
}

/** set candidate education details */
function setCandidateEducation(req,res) {
    try {
        console.log("11")
        con.query("CALL `set_preonboard_candidate_educations` (?)", [JSON.stringify(req.body)], function (err, result, fields) {      
          console.log(result)
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setCandidateEducation :', e)
    }
}
