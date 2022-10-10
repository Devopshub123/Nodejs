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
    setCandidateEducation: setCandidateEducation,
    getActiveTerminationCategories:getActiveTerminationCategories,
    getEmployeeslistforTermination:getEmployeeslistforTermination,
    getDepartmentEmployeesByDesignation:getDepartmentEmployeesByDesignation,
    setselectEmployeesProgramSchedules:setselectEmployeesProgramSchedules,
    setProgramSchedulemail:setProgramSchedulemail,
    getallEmployeeProgramSchedules:getallEmployeeProgramSchedules,
    getEmployeesForProgramSchedule: getEmployeesForProgramSchedule,

    setEmpPersonalInfo: setEmpPersonalInfo,
    getOnboardingSettings:getOnboardingSettings,
    updateselectEmployeesProgramSchedules: updateselectEmployeesProgramSchedules,
    getEmpPersonalInfo: getEmpPersonalInfo,
    setEmpJobDetails: setEmpJobDetails,
    setEmpEducationDetails: setEmpEducationDetails,
    getEmpEducationDetails: getEmpEducationDetails,
    setEmpEmployement: setEmpEmployement,
    getEmpEmployement: getEmpEmployement,
    getEmpJobDetails: getEmpJobDetails,
    getFileMasterForEMS:getFileMasterForEMS,
    setFileMasterForEMS:setFileMasterForEMS,
    getEmsEmployeeColumnConfigurationValue:getEmsEmployeeColumnConfigurationValue,
    setEmsEmployeeColumnConfigurationValues:setEmsEmployeeColumnConfigurationValues,
    getFilecategoryMasterForEMS:getFilecategoryMasterForEMS,
    getFilepathsMasterForEMS:getFilepathsMasterForEMS,
    setFilesMasterForEMS:setFilesMasterForEMS,
    setDocumentOrImageForEMS:setDocumentOrImageForEMS,
    getDocumentsForEMS:getDocumentsForEMS,
    getDocumentOrImagesForEMS:getDocumentOrImagesForEMS,
    removeDocumentOrImagesForEMS:removeDocumentOrImagesForEMS,
    deleteFilesMaster:deleteFilesMaster,
    Messages:Messages,
    getUserLoginData:getUserLoginData,
    usersLogin:usersLogin,
    getEmsEmployeeColumnFilterData:getEmsEmployeeColumnFilterData,
    getEmployeesPendingChecklists: getEmployeesPendingChecklists,
    getChecklistsMasterActive: getChecklistsMasterActive,

    getEmsEmployeeDataForReports:getEmsEmployeeDataForReports,
    getOffboardingSettings:getOffboardingSettings,
    setOffboardingSettings:setOffboardingSettings,
    setOnboardingSettings:setOnboardingSettings,
    getActiveAnnouncementsTopics:getActiveAnnouncementsTopics,
    getAnnouncements:getAnnouncements,
    setAnnouncements:setAnnouncements,
    getFilesForApproval:getFilesForApproval,
    documentApproval:documentApproval,
    getEmpAnnouncements:getEmpAnnouncements,
    getEmployeesResignationForHr:getEmployeesResignationForHr,
    setEmployeeChecklists: setEmployeeChecklists,
    getReportingManagerForEmp:getReportingManagerForEmp,
    getHrDetails:getHrDetails,
    getEmpOffboardTerminationChecklists: getEmpOffboardTerminationChecklists,
    getEmpResignationPendingChecklists:getEmpResignationPendingChecklists,
   
};
//// set new hire list
function setNewHire(req,res) {
    try {
 
        con.query("CALL `set_new_hire` (?)",[JSON.stringify(req.body)],function (err, result, fields) {
            console.log("result--" ,result) 
            console.log("error--" ,err) 
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
                var token = (Buffer.from(JSON.stringify({candidateId:result[0][0].candidate_id,email:req.body.personal_email,date:new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()}))).toString('base64')


                 var url = 'http://localhost:4200/pre-onboarding/'+token;
               // var url = 'http://122.175.62.210:6565/pre-onboarding/'+token;
                
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
        con.query("CALL `get_new_hire_details` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
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
        console.log(req.body)
        con.query("CALL `set_programs_master` (?,?,?,?,?)", [req.body.pid,req.body.programType,req.body.pDescription,req.body.pStatus, req.body.actionby], function (err, result, fields) {
            console.log(result)
            if (result) {
                result[0][0].pid=req.body.pid;
                res.send({ data: result[0]});
            } else {
                res.send({data:[{successstate:-1,pid:req.body.pid}]})
            }
        });


    } catch (e) {
        console.log('setProgramsMaster :', e)

    }

}

function getProgramsMaster(req,res) {
    try {
        con.query("CALL `get_programs_master` (?)", [parseInt(req.params.pId)?parseInt(req.params.pId):null], function (err, result, fields) {
            if (result && result.length > 0) {
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
        console.log(req.body)
        
        con.query("CALL `set_program_schedules` (?,?,?,?,?,?,?,?,?,?)", [req.body.scheduleId,req.body.programId,req.body.department,req.body.designation,req.body.Description,req.body.conductedby,req.body.scheduleDate,req.body.startTime,req.body.endTime,req.body.actionby], function (err, result, fields) {
            console.log(err)
            console.log(result)
            console.log(result[0][0])
            console.log(result[0][0].successstate)
           
           
            if (result && result[0][0].successstate == 0) {
                res.send({ status: true })
                
            } else {
                res.send({ status: false })
            }
        });
        // setProgramSchedulemail(req.body.email);


    } catch (e) {
        console.log('setProgramSchedules :', e)

    }

}


function getProgramSchedules(req,res) {
    try {
        con.query("CALL `get_program_schedules` (?,?)", [JSON.parse(req.params.sid),JSON.parse(req.params.pid)], function (err, result, fields) {
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
function setChecklistsMaster(req, res) {

    try {

        con.query("CALL `set_checklists_master` (?,?)", [JSON.stringify(req.body),req.body.actionby], function (err, result, fields) {
           
            if (result[0][0].successstate == 0) {
                res.send({  status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('setChecklistsMaster :', e)

    }

}
//** */
function getChecklistsMasterActive(req, res) {
    try {
        con.query("CALL `get_checklists_master` (?,?,?,?)", [null,JSON.parse(req.params.deptId),req.params.category,req.params.status], function (err, result, fields) {
            console.log(result)
            console.log(err)
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getChecklistsMasterActive :', e)

    }

}

//** */

function getChecklistsMaster(req, res) {
    try {
        con.query("CALL `get_checklists_master` (?,?,?,?)", [null,JSON.parse(req.params.deptId),req.params.category,null], function (err, result, fields) {
            console.log(result)
            console.log(err)
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
        console.log(req.body)
         con.query("CALL `set_preonboard_candidate_information` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
           console.log("hello" ,result)
           console.log("error" ,err)
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
           con.query("CALL `get_employee_checklists` (?,?,?,?)", [null,JSON.parse(req.params.emp_Id),req.params.category,JSON.parse(req.params.dept_Id)], function (err, result, fields) {
              console.log("result-",result)
              console.log("error-",err)
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
        con.query("CALL `get_employees_terminations` (?,?)", [null,JSON.parse(req.params.id)], function (err, result, fields) {
            console.log(result)
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
        console.log("fgfgfgfg",JSON.stringify(req.body))
        con.query("CALL `set_employee_termination` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            console.log("Result--",result)
            console.log("error---",err)
            if (result  && result[0]&& result[0][0] &&result[0][0].statuscode == 0) {
                res.send({ data: result[0][0].statuscode, status: true });
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
        con.query("CALL `set_employee_resignation` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            if(err){
                res.send({ status: false ,statusCode: req.body.resg_status})
            }
            else{
                res.send({ status: true,data:result[0][0].statuscode,statusCode: req.body.resg_status})
            }
        })

    } catch (e) {
        console.log('setEmployeeResignation :', e)

    }

}
function getActiveTerminationCategories(req,res) {
    try {
        con.query("CALL `get_active_termination_categories` ()", [], function (err, result, fields) {  
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }              
        });

    } catch (e) {
        console.log('get_active_termination_categories :', e)
    }

}
function getEmployeeslistforTermination(req,res) {
    try {
        con.query("CALL `get_active_emps_list` ()", [], function (err, result, fields) {  
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }              
        });

    } catch (e) {
        console.log('get_active_emps_list :', e)
    }

}

function setCandidateExperience(req,res) {
    console.log(req.body)
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
        console.log(req.body)
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
// get_department_employees_by_designation
function getDepartmentEmployeesByDesignation(req,res) {
    try {
        con.query("CALL `get_department_employees_by_designation` (?,?)", [JSON.parse(req.params.sid),JSON.parse(req.params.pid)], function (err, result, fields) {
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
function setselectEmployeesProgramSchedules(req,res){
    
    try{
        let array=[]
            array.push(req.body.email)
        con.query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [req.body.esid,req.body.scheduleid,JSON.stringify(req.body.empid),req.body.status,req.body.actionby], function (err, result, fields) {      
              if (result && result[0][0].successstate == 0 ) {
                array.push(result[0][0])            
                setProgramSchedulemail(array);
                res.send({ data: result[0], status: true });
              } else {
                  res.send({ status: false })
              }
          });
         

    }
    catch(e){
        console.log('setselectEmployeesProgramSchedules',e)
    }
}
function updateselectEmployeesProgramSchedules(req,res){
   
    try{
        con.query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [JSON.stringify(req.body.esid),req.body.scheduleid,JSON.stringify(req.body.empid),req.body.status,req.body.actionby], function (err, result, fields) {      
            
              if (result && result[0][0].successstate == 0) {
                  res.send({ data: result[0], status: true });
              } else {
                  res.send({ status: false })
              }
          });
         

    }
    catch(e){
        console.log('setselectEmployeesProgramSchedules',e)
    }
}
function setProgramSchedulemail(req,res){
    try{
       console.log("hi",req[0])
       let email = ['rthallapelly@sreebtech.com','smattupalli@sreebtech.com']
       var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'smattupalli@sreebtech.com',
            pass: 'Sree$sreebt'
        }
        });
        var html = `<html>
        <head>
        <title>Induction Meeting</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
        <p style="color:black">Dear Employee,</p>
        <p style="color:black">We are very excited to welcome you to our organization!<b></b></p>
        <p style="color:black"> At Sreeb we care about giving our employees everything they need to perform their best. As you will soon see, we have prepared your workstation with all necessary equipment.<b></b></p>
        <p style="color:black">You are required to attend the induction program by the Sreeb<b></b></p>
        <p style="color:black">Name of the Induction Program:Organization Norms and Values<b></b></p>
       
        <p style="color:black">Your Meeting Scheduled On ${req[1].schedule_date}<b></b></p>
        <p style="color:black">from ${req[1].schedule_starttime} to ${req[1].schedule_endtime}<b></b></p>
        <p style="color:black">We are looking forward to working with you and seeing you achieve great things!<b></b></p>
        
        <p style="color:black">Warm Regards,</p>
        <p style="color:black">Human Resources.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;
   
        var mailOptions = {
            from: 'smattupalli@sreebtech.com',
            to: email,
            subject: 'Induction Program Meeting',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.send({ status: false, })
            } else {
                res.send({ status: true })
            }
        });
   
    }
    catch (e) {
        console.log('setProgramSchedulemail :', e)

    }

}
function getallEmployeeProgramSchedules(req,res){
try{
    con.query("CALL `get_employee_program_schedules` (?,?)", [JSON.parse(req.params.eid),JSON.parse(req.params.sid)], function (err, result, fields) {
        if (result && result.length > 0) {
            res.send({ data: result[0], status: true });
        } else {
            res.send({ status: false })
        }
    });

}
catch(e){
    console.log('getallEmployeeProgramSchedules :', e)
}
}
function getEmployeesForProgramSchedule(req,res){
    try{
        con.query("CALL `get_employees_for_program_schedule` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    }
    catch(e){
        console.log('getEmployeesForProgramSchedule :', e)

    }

}

// get_employees_for_program_schedule

function getFileMasterForEMS(req,res){
    try{
        con.query("CALL `get_files_master` (?,?,?,?,?)",
            [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId], function (err, result, fields) {
            console.log("result",result)
            if (result && result.length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false})
                }
            });


    }
    catch(e){
        console.log('getFileMasterForEMS :', e)

    }

}

function setFileMasterForEMS(req,res){
    try{
        con.query("CALL `set_files_master` (?,?,?,?,?,?)",
            [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId,req.body.sta], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false})
                }
            });


    }
    catch(e){
        console.log('setFileMasterForEMS :', e)

    }

}



function getFilecategoryMasterForEMS(req,res){
    try{
        con.query("CALL `get_filecategory_master` (?,?)",
            [req.body.id,req.body.moduleId], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false})
                }
            });
    }
    catch(e){
        console.log('getFilecategoryMasterForEMS :', e)

    }

}

function setEmpPersonalInfo(req, res) {
    try {
        //console.log(req.body)
         con.query("CALL `set_emp_personal_info` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
         console.log("1st--",result[0])
         console.log("2nd --",result[0][0])
             if (result &&result[0][0].statuscode == 0) {
               res.send({status: true,data:result[0][0].empid });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setEmpPersonalInfo :', e)

    }
}

function getOnboardingSettings(req,res){
    try{
        con.query("CALL `get_onboard_settings` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getOnboardingSettings :', e)
    }
    }
    

/**  */
function setEmpJobDetails(req, res) {
    try {
        console.log(req.body)
         con.query("CALL `set_emp_job_details` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            console.log(result)
             if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setEmpJobDetails :', e)

    }
}

/**  */
function getEmpJobDetails(req, res) {
    try {
        console.log(req.body)
         con.query("CALL `get_emp_job_details` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
            console.log(result)
             if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('getEmpJobDetails :', e)

    }
}

//** get employee personal detials(HR) */
function getEmpPersonalInfo(req,res) {
    try {
        con.query("CALL `get_emp_personal_info` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
          if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
      } catch (e) {
        console.log('getEmpPersonalInfo :', e)
    }
}

/**  */
function setEmpEmployement(req, res) {
    try {
        console.log(req.body)
         con.query("CALL `set_emp_employement` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            console.log(result)
             if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setEmpEmployement :', e)

    }
}
/** get hired employee list */ 
function getEmpEmployement(req,res) {
    try {
        con.query("CALL `get_emp_employement` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
      } catch (e) {
        console.log('getEmpEmployement :', e)
    }
}

/**  */
function setEmpEducationDetails(req, res) {
    try {
         con.query("CALL `set_emp_education_details` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            console.log(result)
             if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setEmpEducationDetails :', e)

    }
}


/** get hired employee list */
function getEmpEducationDetails(req,res) {
    try {
        con.query("CALL `get_emp_education_details` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
      } catch (e) {
        console.log('getEmpEducationDetails :', e)
    }
}

function getEmsEmployeeColumnConfigurationValue(req,res){
    try{
        con.query("CALL `get_ems_employee_column_configuration_values` (?)", [req.params.id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getEmsEmployeeColumnConfigurationValue :', e)
    }
}

function setEmsEmployeeColumnConfigurationValues(req, res) {
    try { 
         con.query("CALL `set_ems_employee_column_configuration_values`(?,?,?,?,?,?,?,?,?,?,?)",
          [req.body.empid,req.body.employee_status_value,req.body.employee_type,req.body.department_value,req.body.designation_value,req.body.location_value,req.body.gender_value,req.body.blood_group_value,req.body.marital_status_value,req.body.shift_value,req.body.reporting_manager_value], function (err, result, fields) {
             if (err ) {
                res.send({ status: false })
                
            } else {
                res.send({ status: true });
            }
        });

    } catch (e) {
        console.log('setEmsEmployeeColumnConfigurationValues :', e)

    }
}



function getFilepathsMasterForEMS(req, res) {
    try { 
         con.query("CALL `get_filepaths_master`(?)",
          [req.params.moduleId], function (err, result, fields) {
             if (err ) {
                res.send({ status: false })
                
            } else {
                res.send({ status: true, data:result[0]});
            }
        });

    } catch (e) {
        console.log('getFilepathsMasterForEMS :', e)

    }
}

function setFilesMasterForEMS(req, res) {
    try { 
        con.query("CALL `set_files_master` (?,?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.employeeId,req.body.candidateId,req.body.filecategory,req.body.moduleId,req.body.documentnumber,req.body.fileName,req.body.modulecode,req.body.requestId,req.body.status], function (err, result, fields) {
                console.log("jhsjhdb",err)
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false});

                }
            });

    } catch (e) {
        console.log('setEmsEmployeeColumnConfigurationValues :', e)

    }
}


function setDocumentOrImageForEMS(req, res) {
    try { 
        file=req.files.file;
        var localPath = JSON.parse(decodeURI(req.params.path))
        console.log("localPath",localPath)

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
        console.log("setDocumentOrImageForEMS:",e)
    }
}


async function getDocumentsForEMS(req,res){
    try{
        console.log('req.body',req.body)
            con.query("CALL `get_files_master` (?,?,?,?,?,?)",
            [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory?req.body.filecategory:null,req.body.requestId,req.body.status], function (err, result, fields) {
                if (result && result.length>0) {
                    res.send({status: true,data:result[0]})
                } else {
                    res.send({status: false})
                }
            });

    }
    catch(e){
        console.log('getDocumentsForEMS :', e)

    }

}

function getDocumentOrImagesForEMS(req,res) {
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
            // return imageData;
            res.send(imageData)
        })

    }
    catch(e){
        console.log('getDocumentOrImagesForEMS',e)
    }

}


function removeDocumentOrImagesForEMS(req,res) {
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

function deleteFilesMaster(req,res){
    try {
        con.query("CALL `delete_files_master` (?)",
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
function getUserLoginData(req,res){
    try{
        console.log('hi')
        con.query("CALL `get_user_login_data` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getUserLoginData :', e)
    }
}
function usersLogin(req,res){
    try{
        con.query('CALL `setemployeelogin`(?,?,?,?,?)',[req.body.empid,req.body.userid,req.body.password,req.body.status,'N'],function(err,result){
            if(err){
                res.send({ status: false })

            }
            else{
                res.send({ status: true })
            }
        })

    }
    catch(e){
        console.log('usersLogin',e)
    }
}

function getEmsEmployeeColumnFilterData(req,res){
    try{
        console.log('hi')
        con.query("CALL `get_ems_employee_column_filter_data` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getEmsEmployeeColumnFilterData :', e)
    }
}




function getOffboardingSettings(req,res){
    try{
        con.query("CALL `get_offboard_settings` ()",  function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getOffboardingSettings :', e)
    }
}


/**  */
function setOffboardingSettings(req, res) {
    try {
        con.query("CALL `set_offboard_settings` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('setOffboardingSettings :', e)
    }
}

/**  */
function setOnboardingSettings(req, res) {
    try {
        con.query("CALL `set_onboard_settings` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('setOnboardingSettings :', e)
    }
}
function getEmsEmployeeDataForReports(req,res){
    try{
        let empid = req.body.empid;
        let emptype = (req.body.emptype.length>0?(req.body.emptype).toString():'');
        let empstatus= (req.body.empstatus.length>0?(req.body.empstatus).toString():'');
        let dept= (req.body.dept.length>0?req.body.dept.toString():'');
        let desg= (req.body.desg.length>0?req.body.desg.toString():'');
        let location= (req.body.location.length>0?req.body.location.toString():'')
        let gender= (req.body.gender.length>0?req.body.gender.toString():'');
        let bloodgroup= (req.body.bloodgroup.length>0?req.body.bloodgroup.toString():'');
        let shift= (req.body.shift.length>0?req.body.shift.toString():'');
        let maritalstatus= (req.body.maritalstatus.length>0?req.body.maritalstatus.toString():'');
        let manager= (req.body.manager.length>0?req.body.manager.toString():'');
        // console.log("eid"+empid,"estatus"+empstatus,"etype"+emptype,dept,desg,location,gender,bloodgroup,maritalstatus,shift,manager,'')

    
        con.query("CALL `get_ems_employee_data_for_reports` (?,?,?,?,?,?,?,?,?,?,?,?)", [empid,empstatus,emptype,dept,desg,location,gender,bloodgroup,maritalstatus,shift,manager,''], function (err, result, fields) {
            if (result && result.length > 0) {
                // console.log(result)
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getEmsEmployeeDataForReports :', e)
    }
}
/*To get active announcements*/
function getActiveAnnouncementsTopics(req,res){
    try{
        con.query("CALL `get_active_announcements_topics` ()", [], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    }
    catch(e){
        console.log('getActiveAnnouncementsTopics :', e)
    }
}
/*To Get Announcements*/
function getAnnouncements(req, res) {
    try {
        con.query("CALL `get_announcements` (?)", [null], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getAnnouncements :', e)
    }
}
function getEmployeesPendingChecklists(req,res) {
    try {
        con.query("CALL `get_employees_pending_checklists` (?,?,?,?)", [JSON.parse(req.params.ename),JSON.parse(req.params.date),JSON.parse(req.params.eid),JSON.parse(req.params.dept_Id)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getEmployeesPendingChecklists :', e)

    }

}


function Messages(req,res){
    try {
        con.query("CALL `get_ems_messages` (?,?,?)", [req.body.code,
            req.body.pagenumber,req.body.pagesize],
           function (err, result, fields) {
               if (result && result.length > 0) {
                   res.send({ status: true, data: result[0] })
               } else {
                   res.send({ status: false, data: [] });
               }
           })
        } catch (e) {
        console.log('Messages');
        }

}
function setAnnouncements(req,res){
    try{
        console.log(JSON.stringify(req.body))
        con.query("CALL `set_announcements` (?)", [JSON.stringify(req.body)], function (err, result, fields) {
            
            if(result && result[0] && result[0][0] && result[0][0].statuscode == 0){
                res.send({ status: true })
            }
            else{
                res.send({ status: false })
            }
        
        });

    }catch(e){
        console.log('setAnnouncements :', e)
    }
}
/*To Get Announcements*/
function getFilesForApproval(req, res) {
    try {
        con.query("CALL `get_files_for_approval` (?,?)", [null,null], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getFilesForApproval :', e)
    }
}
function documentApproval(req, res){
    try {
        con.query("CALL `set_files_master_status` (?,?)", [req.body.id,req.body.status], function (err, result, fields) {
            if (result && result[0]&&result[0][0]&&result[0][0].successstate==0) {
                res.send({ status: true })
               
            } else {
                res.send({ status: false });
            }
        });
    } catch (e) {
        console.log('documentApproval :', e)
    }
}

function setEmployeeChecklists(req, res) {
    try {
        con.query("CALL `set_employee_checklists` (?,?,?,?,?,?,?,?)", [JSON.stringify(req.body.cid),
            req.body.eid, req.body.did, req.body.cmmt,
           req.body.status, req.body.fstatus,req.body.category,
        req.body.actionBy,
        ],
            function (err, result, fields) {
                console.log("error--",err)
             console.log("1st result",result)
                console.log("3st result", result[0])
                  if (result && result[0][0].successstate == 0) {
               res.send({status: true});
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('setEmployeeChecklists :', e)

    }
}


function getEmpOffboardTerminationChecklists(req,res) {
    try {
        con.query("CALL `get_emp_offboard_termination_checklists` (?,?,?,?)", [JSON.parse(req.params.ename),JSON.parse(req.params.date),JSON.parse(req.params.eid),JSON.parse(req.params.dept_Id)], function (err, result, fields) {
           console.log("error-",err)
           console.log("result-",result[0])

            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getEmpOffboardTerminationChecklists :', e)

    }

}

/*To Get getEmpAnnouncements*/
function getEmpAnnouncements(req, res) {
    try {
        con.query("CALL `get_emp_announcements` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getEmpAnnouncements :', e)
    }
}

function getEmpResignationPendingChecklists(req, res) {
    try {
        con.query("CALL `get_emp_offboard_resignation_checklists` (?,?,?,?)", [JSON.parse(req.params.ename),JSON.parse(req.params.date),JSON.parse(req.params.eid),JSON.parse(req.params.dept_Id)], function (err, result, fields) {
         // console.log("result-1",result)
           // console.log("result-2", result[0])
            console.log("error-1", err)
            
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });
    } catch (e) {
        console.log('getEmpResignationPendingChecklists :', e)

    }

}

function getEmployeesResignationForHr(req,res) {
    try {
        con.query("CALL `get_resignation_data` (?,?,?)", [req.body.regId,req.body.empId,req.body.rmId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    } catch (e) {
        console.log('getEmployeesResignationForHr :', e)

    }

}

function getReportingManagerForEmp(req,res){
    try{
        con.query("CALL `get_reporting_manager_for_emp` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    }
    catch(e){
        console.log('getReportingManagerForEmp :', e)
    }
}
function getHrDetails(req,res){
    try{
        con.query("CALL `get_hr_details` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });

    }
    catch(e){
        console.log('getHrDetails :', e)
    }
}