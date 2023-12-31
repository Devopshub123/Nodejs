var bodyParser = require("body-parser");
var express = require("express");
var fs = require("fs");
var path = require("path");
var fileUpload = require("express-fileupload");
var nodemailer = require("nodemailer");
var app = new express();
var global_url = 'http://35.91.144.240:60/#/';

/**AWS */
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'AKIASAAZ23LF4AA5IPDN',
    secretAccessKey: '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',
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
var connection = require('./config/databaseConnection')
var common = require('./common');
var con = connection.switchDatabase();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(fileUpload());
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  return next();
});
var emailComponentData = [];
var companyNameData = [];
module.exports = {
  setProgramsMaster: setProgramsMaster,
  getProgramsMaster: getProgramsMaster,
  setProgramTasks: setProgramTasks,
  getProgramTasks: getProgramTasks,
  setProgramSchedules: setProgramSchedules,
  getProgramSchedules: getProgramSchedules,
  setEmployeeProgramSchedules: setEmployeeProgramSchedules,
  getEmployeeProgramSchedules: getEmployeeProgramSchedules,
  setChecklistsMaster: setChecklistsMaster,
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
  getEmployeesTermination: getEmployeesTermination,
  setEmployeeTermination: setEmployeeTermination,
  setEmployeeResignation: setEmployeeResignation,
  getEmployeesResignation: getEmployeesResignation,
  setCandidateExperience: setCandidateExperience,
  setCandidateEducation: setCandidateEducation,
  getActiveTerminationCategories: getActiveTerminationCategories,
  getEmployeeslistforTermination: getEmployeeslistforTermination,
  getDepartmentEmployeesByDesignation: getDepartmentEmployeesByDesignation,
  setselectEmployeesProgramSchedules: setselectEmployeesProgramSchedules,
  setProgramSchedulemail: setProgramSchedulemail,
  getallEmployeeProgramSchedules: getallEmployeeProgramSchedules,
  getEmployeesForProgramSchedule: getEmployeesForProgramSchedule,

  setEmpPersonalInfo: setEmpPersonalInfo,
  getOnboardingSettings: getOnboardingSettings,
  updateselectEmployeesProgramSchedules: updateselectEmployeesProgramSchedules,
  getEmpPersonalInfo: getEmpPersonalInfo,
  setEmpJobDetails: setEmpJobDetails,
  setEmpEducationDetails: setEmpEducationDetails,
  getEmpEducationDetails: getEmpEducationDetails,
  setEmpEmployement: setEmpEmployement,
  getEmpEmployement: getEmpEmployement,
  getEmpJobDetails: getEmpJobDetails,
  getFileMasterForEMS: getFileMasterForEMS,
  setFileMasterForEMS: setFileMasterForEMS,
  getEmsEmployeeColumnConfigurationValue:
  getEmsEmployeeColumnConfigurationValue,
  setEmsEmployeeColumnConfigurationValues:
  setEmsEmployeeColumnConfigurationValues,
  getFilecategoryMasterForEMS: getFilecategoryMasterForEMS,
  getFilepathsMasterForEMS: getFilepathsMasterForEMS,
  setFilesMasterForEMS: setFilesMasterForEMS,
  setDocumentOrImageForEMS: setDocumentOrImageForEMS,
  getDocumentsForEMS: getDocumentsForEMS,
  getDocumentOrImagesForEMS: getDocumentOrImagesForEMS,
  removeDocumentOrImagesForEMS: removeDocumentOrImagesForEMS,
  deleteFilesMaster: deleteFilesMaster,
  Messages: Messages,
  getUserLoginData: getUserLoginData,
  usersLogin: usersLogin,
  getEmsEmployeeColumnFilterData: getEmsEmployeeColumnFilterData,
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
    getEmployeesResignationForHr:getEmployeesResignationForHr,
    setEmployeeChecklists: setEmployeeChecklists,
    getReportingManagerForEmp:getReportingManagerForEmp,
    getHrDetails:getHrDetails,
    getEmpOffboardTerminationChecklists: getEmpOffboardTerminationChecklists,
    getEmpResignationPendingChecklists: getEmpResignationPendingChecklists,
    getnoticeperiods: getnoticeperiods,
    setprogramspasterstatus: setprogramspasterstatus,
    getEmailsByEmpid:getEmailsByEmpid,
    getActiveEmployeeProgramSchedules: getActiveEmployeeProgramSchedules,
    sendEmailToAdminAboutNewHire:sendEmailToAdminAboutNewHire,
    sendEmailToEmployeeAboutLogins: sendEmailToEmployeeAboutLogins,
    sendEmailToChecklistManager: sendEmailToChecklistManager,
    sendEmailToEmployeeAboutChecklistUpdate: sendEmailToEmployeeAboutChecklistUpdate,
    checklistFinalUpdateEmailToEmployee: checklistFinalUpdateEmailToEmployee,
    checklistCompleteEmailToEmployee: checklistCompleteEmailToEmployee,
    roleRemoveInformationEmailToEmployee: roleRemoveInformationEmailToEmployee,
    newRoleInformationEmailToEmployee: newRoleInformationEmailToEmployee,
    documentReuploadInformationEmailToHr: documentReuploadInformationEmailToHr,
    documentRejectEmailtoEmployee: documentRejectEmailtoEmployee,
    documentApprovalEmailToEmployee: documentApprovalEmailToEmployee,
    documentApprovalEmailToHR: documentApprovalEmailToHR,
    inductionProgramCancelEmailToEmployee: inductionProgramCancelEmailToEmployee,
    getEmployeeEmailData: getEmployeeEmailData,
    rescheduledInductionProgramEmail: rescheduledInductionProgramEmail,
    getInductionProgramAssignedEmployee:getInductionProgramAssignedEmployee,
    getEmpAnnouncements:getEmpAnnouncements,
    getEmployeesListByDeptId: getEmployeesListByDeptId,
    setInductionConductedby: setInductionConductedby,
    getInductionConductedbyEmployees: getInductionConductedbyEmployees,
    getCondcutedEmployeesByPrgIdAndDeptId: getCondcutedEmployeesByPrgIdAndDeptId,
    getDepartmentsByProgramId: getDepartmentsByProgramId,
    updateInductionConductedbyStatus:updateInductionConductedbyStatus,
    getAttendanceCountsForDate:getAttendanceCountsForDate,
    getEmployeeProgramAlerts:getEmployeeProgramAlerts,
    getDocumentsFiles: getDocumentsFiles,
    validateReportingManager: validateReportingManager,
    setEmployeeExcelData: setEmployeeExcelData,
    preonboardingSetDocumentOrImageForEMS:preonboardingSetDocumentOrImageForEMS
    
};

//// set new hire list
async function setNewHire(req, res) {
    try {
      
        let emailData = req.body;
        let companyName =req.body.companyName;
        let dbName = await getDatebaseName(companyName);
        let loginToken = req.body.loginToken;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_new_hire` (?)", [JSON.stringify(req.body)],
                async function (err, result, fields) {
             
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setNewHire");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                        res.send({ status: false });
                } else {

                    if (result[0][0].statuscode == 0) {
                       if (emailData.personal_email != '' || undefined || null) {
                            var transporter = nodemailer.createTransport({
                                host: "smtp-mail.gmail.com", // hostname
                                secureConnection: false, // TLS requires secureConnection to be false
                                port: 587, // port for secure SMTP
                                tls: {
                                    ciphers: 'SSLv3'
                                },
                                auth: {
                                    user: 'anceplab@gmail.com',
                                    pass: 'Anceplab@123'
                                }
                            });
                            var token = (Buffer.from(JSON.stringify({ companyName:companyName, candidateId: result[0][0].candidate_id, email: emailData.personal_email, date: new Date(),loginToken:loginToken }))).toString('base64')
                         
                           var url = global_url + 'pre-onboarding/' + token;
                           
                           let mname = emailData.middlename !=null ? emailData.middlename: ' ';
                           var name = emailData.firstname+' ' + mname +' '+ emailData.lastname;
                            var html = `<html>
                        <head>
                        <title>Candidate Form</title></head>
                        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
                        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
                        <p style="color:black">Dear ${name},</p>
                        <p style="color:black"> We are excited to have you aboard and look forward to working with you. Click on the link below, fill your details, and submit the form ASAP.<b></b></p>
                        <p style="color:black"> Please make it a note that, the below link can be deactivated in 24 Hours.</p>
                        <p style="color:black"> <a href="${url}" >${url} </a></p>   
                        <p style="color:black"> If you experience any issues when accessing the above link, please reach out <b>anceplab@gmail.com</b>  </p>  
                        <p style="color:black">Thank you!</p>
                        <p style="color:black">Human Resources Team.</p>
                        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
                        </div></body>
                        </html> `;
                            var mailOptions = {
                                from: 'anceplab@gmail.com',
                                to: emailData.personal_email,
                                subject: 'Welcome to Andro care Hospital',
                                html: html
                            };
                           transporter.sendMail(mailOptions, function (error, info) {
                          if (error) {
                                    res.send({ status: false })
                                } else {
                                    res.send({ status: true, data: { empid: result[0][0].empid, email: null } });
                                }
                            });
                        }
                        res.send({ status: true, data: { empid: result[0][0].empid, email: null } });
                    }
                    else if (result[0][0].statuscode == 2) {
                        res.send({ status: true, data: { empid: result[0][0].empid, email: null } });
                    }
                    else if (result[0][0].statuscode == 1) {
                        res.send({ status: true, data: { empid: result[0][0].empid, email: result[0][0].email } });
                    }
                    else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setNewHire");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
//// get new hire list
async function getNewHireDetails(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_new_hire_details` (?)", [JSON.parse(req.params.id)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getNewHireDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    
         
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getNewHireDetails");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** setattendanceapprovalstatus
 `set_reason_master`(
	in reason_id int(11),
	in reason varchar(64),
    in reason_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
async function setReasonMaster(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_reason_master` (?,?,?,?)",
                [req.body.reason_id, req.body.reason, parseInt(req.body.reason_status), req.body.actionby],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setReasonMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result[0][0].statuscode == 0) {
                            res.send({ status: true, message: "", data: result[0][0] })
                        } else {
                            res.send({ status: false, message: "unable to save" })
                        }
                    }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }    

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setReasonMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**Get Reason Data **/
async function getActiveReasonList(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_reasons` ()",
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getActiveReasonList");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }    
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getActiveReasonList");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**Get reason list
 **@reason_id  parameters
 * **/
 async function getReasonMasterData(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_reason_master` (?)", [null],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getReasonMasterData");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                     if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }    
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getReasonMasterData");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** set terminate category
    in termination_id int(11),
    in termination_category varchar(64),
    in termination_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
 **/
    async function setTerminationCategory(req,res) {
        try {
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            var listOfConnections = {};
            if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
                if(!listOfConnections.succes) {
                    listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
                }
                listOfConnections[companyName].query("CALL `set_termination_category` (?,?,?,?)",
                    [req.body.termination_id, req.body.termination_category,
                        parseInt(req.body.termination_status), req.body.actionby],
                    async function (err, result, fields) {
                        if (err) {
                            let errorLogArray = [];
                            errorLogArray.push("EMSAPI");
                            errorLogArray.push("setTerminationCategory");
                            errorLogArray.push("POST");
                            errorLogArray.push(JSON.stringify(req.body));
                            errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                            errorLogArray.push(null);
                            errorLogArray.push(companyName);
                            errorLogArray.push(dbName);
                            console.log("errorLogArray",errorLogArray)
                             errorLogs(errorLogArray);
                            res.send({ status: false });
                        } else {
                            if (result[0][0].statuscode == 0) {
                                res.send({ status: true, message: "", data: result[0][0] })
                            } else {
                                res.send({ status: false, message: "unable to save" })
                            }
                        }
                    });
                }
                else {
                res.send({status: false,Message:'Database Name is missed'})
                }        

        }catch (e) {
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("setTerminationCategory");
            errorLogArray.push("POST");
            errorLogArray.push(JSON.stringify(req.body));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
        }
      }


/**Get termination category Data **/

async function getTerminationCategory(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_termination_category` (null)", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getTerminationCategory");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getTerminationCategory");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/** set document category
     in document_id int(11),
    in document_category varchar(64),
    in document_status int(11), -- values: 1(Active) , 2(Inactive)
    in actionby int(11)
) */
async function setDocumentCategory(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_document_category` (?,?,?,?)",
                [req.body.document_id, req.body.document_category,
                    parseInt(req.body.document_status), req.body.actionby],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setDocumentCategory");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result[0][0].statuscode == 0) {
                            res.send({ status: true, message: "", data: result[0][0] })
                        } else {
                            res.send({ status: false, message: "unable to save" })
                        }
                    }
                });
            }
            else {
            res.send({status: false,Message:'Database Name is missed'})
            }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setDocumentCategory");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
             }
}
/**Get document category Data **/
async function getDocumentCategory(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_document_category` (null)", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getDocumentCategory");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getDocumentCategory");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
  }
}

// module.exports = app;


async function setProgramsMaster(req,res) {
    try {
        let companyName =req.body.companyName;

        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_programs_master` (?,?,?,?,?)", [req.body.pid, req.body.programType, req.body.pDescription, req.body.pStatus, req.body.actionby],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setProgramsMaster");
                    errorLogArray.push("post");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result) {
                        result[0][0].pid=req.body.pid;
                        res.send({ data: result[0]});
                    } else {
                        res.send({data:[{successstate:-1,pid:req.body.pid}]})
                    }        
                }
             });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setProgramsMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)

    }

}

async function getProgramsMaster(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_programs_master` (?)", [parseInt(req.params.pId) ? parseInt(req.params.pId) : null],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getProgramsMaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getProgramsMaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}



async function setProgramTasks() {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_program_tasks` (?)", [req.params.employee_id],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setProgramTasks");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setProgramTasks");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}




async function getProgramTasks(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_program_tasks` (?)", [req.params.employee_id], function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        console.log('getProgramTasks :', e)

    }

}


async function setProgramSchedules(req,res) {
      try {
        let companyName=req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
          var listOfConnections = {};
         if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `set_program_schedules` (?,?,?,?,?,?,?,?,?,?,?)",
                [
                    req.body.scheduleid,
                    req.body.programid,
                    req.body.department_id,
                    //req.body.designation,
                    req.body.s_description,
                    req.body.s_status,
                    req.body.reason,
                    req.body.conductedby,
                    req.body.scheduledate,
                    req.body.starttime,
                    req.body.endtime,
                    req.body.actionby,
                ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setProgramSchedules");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result[0][0].successstate == 0) {
                            res.send({ status: true, data: result[0][0].successstate });
                            if (req.body.s_status == "Rescheduled") {
                                rescheduledInductionProgramEmail(req.body);

                            } else if (req.body.s_status == "Cancelled") {

                                inductionProgramCancelEmailToEmployee(req.body)
                            }
                        } else if (result && result[0][0].successstate == 1) {
                            res.send({ status: true, data: result[0][0].successstate });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setProgramSchedules");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)

    }

}


async function getProgramSchedules(req,res) {
    try {
        let companyName=req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_program_schedules` (?,?)", [JSON.parse(req.params.sid), JSON.parse(req.params.pid)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getProgramSchedules");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getProgramSchedules");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)

    }

}



async function setEmployeeProgramSchedules(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [req.body.esId, req.body.scheduleId, req.body.employeeid, req.body.status, req.body.actionby],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmployeeProgramSchedules");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setEmployeeProgramSchedules");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
   }

}
async function getEmployeeProgramSchedules(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_employee_program_schedules` (?,?)",
                [JSON.parse(req.params.eid), JSON.parse(req.params.sid)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmployeeProgramSchedules");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                            let data;
                            data = result[0];
                            scheduleEmpList = data.map((e) => { return e.officeemail; });

                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeeProgramSchedules");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)

    }

}
/** set Checklists Master */
async function setChecklistsMaster(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_checklists_master` (?,?)", [JSON.stringify(req.body), req.body.actionby],
                async function (err, result, fields) {
                                       
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setChecklistsMaster");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs = errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                 
                    if (result[0][0].successstate == 0 && JSON.parse(result[0][0].failed_descriptions).length == 0) {
                        res.send({ status: true ,data: JSON.parse(result[0][0].failed_descriptions)});

                    } else if(result[0][0].successstate == 0 && JSON.parse(result[0][0].failed_descriptions).length > 0){
                        res.send({ status: true, data: JSON.parse(result[0][0].failed_descriptions) })
                 
                    } else {
                 
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setChecklistsMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}
//** */
async function getChecklistsMasterActive(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_checklists_master` (?,?,?,?)", [null, JSON.parse(req.params.deptId), req.params.category, req.params.status],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getChecklistsMasterActive");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getChecklistsMasterActive");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)  }

}

//** */

async function getChecklistsMaster(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_checklists_master` (?,?,?,?)", [null, JSON.parse(req.params.deptId), req.params.category, null],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getChecklistsMaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
            
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getChecklistsMaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)

    }

}
/** get hired employee list */
async function getEmployeesList(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_list` ()", [],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeesList");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
            
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesList");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** candidate pre onboarding  */

async function setPreonboardCandidateInformation(req, res) {

    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_preonboard_candidate_information` (?)", [JSON.stringify(req.body)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setPreonboardCandidateInformation");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                   errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setPreonboardCandidateInformation");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
 }
}
    /** get candidates list */
    async function getCandidateDetails(req, res) {
        try {
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            var listOfConnections = {};
            if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
                if(!listOfConnections.succes) {
                    listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
                }
 
                listOfConnections[companyName].query("CALL `get_candidate_details` (?)", [req.params.emp_Id],
                    async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getCandidateDetails");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                       errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
            }
            else {
                res.send({status: false,Message:'Database Name is missed'})
            }    
          } catch (e) {
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("getCandidateDetails");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.params));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
        }
      }


/** get employee check list */
async function getEmployeeChecklists(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_checklists` (?,?,?,?)", [null, JSON.parse(req.params.emp_Id), req.params.category, JSON.parse(req.params.dept_Id)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeeChecklists");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
            }
            else {
            res.send({status: false,Message:'Database Name is missed'})
            }
        } catch (e) {
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("getEmployeeChecklists");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.params));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
       }
}

// get_employees_terminations
async function getEmployeesTermination(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_terminations` (?,?)", [null, JSON.parse(req.params.id)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeesTermination");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesTermination");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}

async function setEmployeeTermination(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_termination` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmployeeTermination");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result[0] && result[0][0] && result[0][0].statuscode == 0) {
                        res.send({ data: result[0][0].statuscode, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmployeeTermination");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
       }

}

// `get_resignation_data`(in resgid int, in employee_id int(11), in manager_employee_id int(11))
async function getEmployeesResignation(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_resignation_data` (?,?,?)", [null,req.params.id,null], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeesResignation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
            
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesResignation");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}
async function setEmployeeResignation(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_resignation` (?)", [JSON.stringify(req.body)],
                async function (err, result, fields) {
                    if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmployeeResignation");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                   errorLogs(errorLogArray);
                    res.send({ status: false, statusCode: req.body.resg_status })
                   } else {
                    if (result[0][0].statuscode == 0) {
                        res.send({ status: true, data: result[0][0].statuscode, statusCode: req.body.resg_status })
                        if (req.body.resg_status == "Submitted") {
                                if (req.body.emailData.rm_email != '' || req.body.emailData.rm_email != null) {
                                separationRequestEmail(req.body)
                            }  
                        } else if (req.body.resg_status == "Approved") {
                               separationRequestApprovedEmail(req.body) 
                        } else if (req.body.resg_status == "Rejected") {
                             separationRequestRejectedEmail(req.body) 
                        }
                        
                    }
                    else {
                        res.send({ status: false, statusCode: req.body.resg_status })
                    }
                }
            })
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setEmployeeResignation");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray) }

}
async function getActiveTerminationCategories(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_termination_categories` ()", [],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getActiveTerminationCategories");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }    
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getActiveTerminationCategories");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}

async function getEmployeeslistforTermination(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_emps_list` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeeslistforTermination");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }            
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeeslistforTermination");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

async function setCandidateExperience(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_preonboard_candidate_experience` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setCandidateExperience");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setCandidateExperience");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** set candidate education details */
async function setCandidateEducation(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_preonboard_candidate_educations` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setCandidateEducation");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setCandidateEducation");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
// get_department_employees_by_designation
async function getDepartmentEmployeesByDesignation(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection('e26',companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_department_employees_by_designation` (?,?)", [JSON.parse(req.params.sid),JSON.parse(req.params.pid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getDepartmentEmployeesByDesignation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
            
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getDepartmentEmployeesByDesignation");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

async function setselectEmployeesProgramSchedules(req,res){
     try {
        let array = []
        array.push(req.body.email);
        array.push(req.body.companyname);
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            console.log("JSON.stringify(req.body.empid)JSON.stringify(req.body.empid)",JSON.stringify(req.body.empid))
            listOfConnections[companyName].query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [req.body.esid, req.body.scheduleid, JSON.stringify(req.body.empid), req.body.status, req.body.actionby], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setselectEmployeesProgramSchedules");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result[0][0].successstate == 0) {
                        array.push(result[0][0])
                        setProgramSchedulemail(array);
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setselectEmployeesProgramSchedules");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)   }
}

async function updateselectEmployeesProgramSchedules(req,res){
       try{
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_program_schedules` (?,?,?,?,?)", [JSON.stringify(req.body.esid),req.body.scheduleid,JSON.stringify(req.body.empid),req.body.status,req.body.actionby], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("updateselectEmployeesProgramSchedules");
                    errorLogArray.push("PUT");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result[0][0].successstate == 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }     

    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("updateselectEmployeesProgramSchedules");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
     }
}

function setProgramSchedulemail(mailData) {
    try {
        let fdate =(new Date(mailData[2].schedule_date).getDate()<10?"0"+new Date(mailData[2].schedule_date).getDate():new Date(mailData[2].schedule_date).getDate())+'-'+((new Date(mailData[2].schedule_date).getMonth()+1)<10?"0"+(new Date(mailData[2].schedule_date).getMonth()+1):(new Date(mailData[2].schedule_date).getMonth()+1) )+'-'+new Date(mailData[2].schedule_date).getFullYear();
    let email = mailData; 
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.gmail.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
          user: 'anceplab@gmail.com',
          pass: 'Anceplab@123'
      },
    });
    var html = `<html>
        <head>
        <title>Induction Meeting</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
        <p style="color:black">Dear Employee,</p>
        <p style="color:black">We are very excited to welcome you to our organization!<b></b></p>
        <p style="color:black"> At ${mailData[1]} we care about giving our employees everything they need to perform their best. As you will soon see, we have prepared your workstation with all necessary equipment.</p>
        <p style="color:black">You are requested to attend the induction program as per schedule mentioned below </p>
        <p style="color:black">Name of the Induction Program: <b>${mailData[2].program_name}</b></p>
        <p style="color:black">Your Meeting Scheduled On <b>${fdate}</b></p>
        <p style="color:black">from <b>${mailData[2].schedule_starttime}</b> to <b>${mailData[2].schedule_endtime}</b></p>
        <p style="color:black">We are looking forward to working with you and seeing you achieve great things!<b></b></p>
        
        <p style="color:black">Best Regards,</p>
        <p style="color:black">Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

    var mailOptions = {
      from: "anceplab@gmail.com",
      to: email,
      subject: "Induction Program Meeting",
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log("Filed to sent Mail",error)
        // res.send({ status: false });
      } else {
          console.log("Mail sent Successfully")
        // res.send({ status: true });
      }
    });
  } catch (e) {
    console.log("setProgramSchedulemail :", e);
  }
}

async function getallEmployeeProgramSchedules(req,res) {
    try {
        let companyName = req.params.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_program_schedules` (?,?)", [JSON.parse(req.params.eid), JSON.parse(req.params.sid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getallEmployeeProgramSchedules");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getallEmployeeProgramSchedules");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

async function getEmployeesForProgramSchedule(req,res){
    try{
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_for_program_schedule` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                  if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeesForProgramSchedule");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesForProgramSchedule");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

// get_employees_for_program_schedule

async function getFileMasterForEMS(req,res){
    try{
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_files_master` (?,?,?,?,?)",
                [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getFileMasterForEMS");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getFileMasterForEMS");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

async function setFileMasterForEMS(req,res){
    try{
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_files_master` (?,?,?,?,?,?)",
                [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory,req.body.requestId,req.body.sta], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setFileMasterForEMS");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }
    catch(e){
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setFileMasterForEMS");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)  }

}



async function getFilecategoryMasterForEMS(req,res){
    try{
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_filecategory_master` (?,?)",
                [req.body.id, req.body.moduleId], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getFilecategoryMasterForEMS");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
            }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }    
    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getFilecategoryMasterForEMS");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)  }

}

async function setEmpPersonalInfo(req, res) {
    try {
        //console.log(req.body)
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_emp_personal_info` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmpPersonalInfo");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result[0][0].statuscode == 0) {
                        res.send({ status: true, data: { empid: result[0][0].empid, email: null } });
                        let edata = {
                            empid: result[0][0].empid,
                            cname:companyName
                        }
                       getEmailsByEmpid(edata);
                      
                    } else if (result && result[0][0].statuscode == 2) {
                      res.send({ status: true, data: { empid: result[0][0].empid, email: null } });
                      
                    }  else if (result && result[0][0].statuscode == 1) {
                       res.send({status: true,data: { empid: result[0][0].empid,email:result[0][0].email }  });
                  } else {
                   res.send({ status: false, })
                   }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmpPersonalInfo");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

async function getOnboardingSettings(req,res){
    try{
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_onboard_settings` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getOnboardingSettings");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getOnboardingSettings");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)  }
    }
    

/**  */
async function setEmpJobDetails(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_emp_job_details` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmpJobDetails");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmpJobDetails");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/**  */
async function getEmpJobDetails(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_emp_job_details` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmpJobDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
         }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmpJobDetails");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

// //** get employee personal detials(HR) */
// function getEmpPersonalInfo(req, res) {
//   try {
//     let companyName = req.params.companyName;
//     let dbName = await getDatebaseName(companyName)
//     var listOfConnections = {};
//     if (dbName) {
//         listOfConnections = connection.checkExistingDBConnection('e26', companyName)
//         if (!listOfConnections.succes) {
//             listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
//         }
//         listOfConnections[companyName].query(
//       "CALL `get_emp_personal_info` (?)",
//       [JSON.parse(req.params.id)],
//         function (err, result, fields) {
//           console.log("err-",err)
//           console.log("res-",result)
//         if (result && result.length > 0) {
//           res.send({ data: result[0], status: true });
//         } else {
//           res.send({ status: false });
//         }
//       }
//     );
//     }else{
//         res.send({status:false})
//     }
//   } catch (e) {
//     console.log("getEmpPersonalInfo :", e);
//   }
// }

/**  */
async function setEmpEmployement(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_emp_employement` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmpEmployement");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmpEmployement");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}
/** get hired employee list */ 
async function getEmpEmployement(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_emp_employement` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmpEmployement");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
      } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmpEmployement");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/**  */
async function setEmpEducationDetails(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_emp_education_details` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setEmpEducationDetails");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setEmpEducationDetails");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
 }
}

/** get hired employee list */
async function getEmpEducationDetails(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_emp_education_details` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmpEducationDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
        });
    } else {
            res.send({status: false,Message:'Database Name is missed'})
    }
      } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmpEducationDetails");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

async function getEmsEmployeeColumnConfigurationValue(req,res){
    try{
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_ems_employee_column_configuration_values` (?)", [req.params.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmsEmployeeColumnConfigurationValue");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmsEmployeeColumnConfigurationValue");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function setEmsEmployeeColumnConfigurationValues(req, res) {
    try {
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `set_ems_employee_column_configuration_values`(?,?,?,?,?,?,?,?,?,?,?)",
                [req.body.empid, req.body.employee_status_value, req.body.employee_type, req.body.department_value, req.body.designation_value, req.body.location_value, req.body.gender_value, req.body.blood_group_value, req.body.marital_status_value, req.body.shift_value, req.body.reporting_manager_value], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setEmsEmployeeColumnConfigurationValues");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                        if (err) {
                            res.send({ status: false })

                        } else {
                            res.send({ status: true });
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmsEmployeeColumnConfigurationValues");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
  }
}



async function getFilepathsMasterForEMS(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `get_filepaths_master`(?)",
            [req.params.moduleId], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getFilepathsMasterForEMS");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (err) {
                        res.send({ status: false })

                    } else {
                        res.send({ status: true, data: result[0] });
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
        } catch (err) {
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("getFilepathsMasterForEMS");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.params));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
        }
      }

async function setDocumentOrImageForEMS(req, res) {
   //** for local deployment */ 
  try {
        let emailData;
        file = req.files.file;
        var localPath = JSON.parse(req.body.info);
        var folderName = localPath.filepath;
        let dataa = JSON.parse(JSON.stringify(folderName));
        if (req.body.email != undefined) {
             emailData = JSON.parse(req.body.email);
          }
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(dataa, { recursive: true })
                file.mv(path.resolve(__dirname,dataa,localPath.filename),function(error){
                    if(error){
                       res.send({status:false})
                    } else {
                        res.send({status:true,message:'Image Uploaded Succesfully'})
                        if (req.body.data != "Approved") {
                            if (emailData.rm_email != '' || emailData.rm_name != null) [
                                documentApprovalEmailToHR(emailData)
                            ]
                        }
                    }
                })
            } else {
                try {
                    file.mv(
                        path.resolve(__dirname, folderName, localPath.filename),
                        async function (error) {
                            console.log("kkk-",error)
                            if (error) {
                                res.send({ status: false });
                                let errorLogArray = [];
                                let companyName =req.params.companyName;
                                let  dbName = await getDatebaseName(companyName)
                                errorLogArray.push("EMSAPI");
                                errorLogArray.push("setDocumentOrImageForEMS");
                                errorLogArray.push("POST");
                                errorLogArray.push(JSON.stringify(req.body));
                                errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                                errorLogArray.push(null);
                                errorLogArray.push(companyName);
                                errorLogArray.push(dbName);
                                errorLogs(errorLogArray);
                                
                            } else {
                                res.send({
                                    status: true,
                                    message: "Image Uploaded Succesfully",
                                });
                                if (req.body.data != "Approved") {
                                    if (emailData.rm_email != '' || emailData.rm_name != null) [
                                        documentApprovalEmailToHR(emailData)
                                    ]
                                }
                                
                            }
                        });
                } catch (err) {
                    res.send({ status: false });
                    let companyName =req.params.companyName;
                    let  dbName = await getDatebaseName(companyName)
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setDocumentOrImageForEMS");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push( e.message);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray)

                }
            }
        }
        catch (e) {
            res.send({status: false});
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("setDocumentOrImageForEMS");
            errorLogArray.push("POST");
            errorLogArray.push(JSON.stringify(req.body));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
        }
    } catch (e) {
         res.send({ status: false });
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setDocumentOrImageForEMS");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)

    }

/**For AWS Documents */

// try {
//     let emailData;
//     file = req.files.file;
//     var localPath = JSON.parse(req.body.info);
//     var folderName = localPath.filepath;
//     if (req.body.email != undefined) {
//         emailData = JSON.parse(req.body.email);
//     } 
//     try {
//       const params = {
//         Bucket: folderName, //format:spryple/core
//         Key: localPath.filename, // file will be saved as testBucket/contacts.csv
//         Body: file.data
//       };
//       s3.upload(params, function(error, data) {
//         if(error){
//             res.send({status:false})
//         }
//         else{
//             res.send({status:true,message:'Image Uploaded Succesfully'})
//             if (req.body.data != "Approved") {
//               if (emailData.rm_email !='' || emailData.rm_name !=null) [
//                 documentApprovalEmailToHR(emailData)
//               ]
//             }
//         }
//       });
//     } 
//     catch (err) {
//       console.error(err);
//       res.send({ status: false });
//     }
//   } 
//   catch (e) {
//       console.log("setDocumentOrImageForEMS:", e);
//       res.send({ status: false });
//     }
  

}

async function setFilesMasterForEMS(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_files_master` (?,?,?,?,?,?,?,?,?,?)",
                [req.body.id,req.body.employeeId,req.body.candidateId,req.body.filecategory,req.body.moduleId,req.body.documentnumber,req.body.fileName,req.body.modulecode,req.body.requestId,req.body.status], async function (err, result, fields) {
                    
                    
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setFilesMasterForEMS");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                       errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false });
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setFilesMasterForEMS");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
      }
    }


async function getDocumentOrImagesForEMS(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            // folderName = req.body.filepath+'/';
            // var imageData = {};
            // var flag = false;
            folderName = req.body.filepath+'/';
            let data = JSON.parse(JSON.stringify(folderName));
            var imageData = {};
            var flag = false;
            
/** AWS */
// const params = {
//     Bucket: data, // pass your bucket name
//     Key: req.body.filename 
//   };
  
//   s3.getObject(params, function (err, data) {
//     if (err) {
//       flag = false;
//     }
//     else {
//       flag = true;
//       imageData.image = data.Body;
//     }
//         imageData.success = flag;
//         res.send(imageData);
//   });

/**Local */
            fs.readFile(folderName + req.body.filename, async function (err, result) {
            if (err) {
                    let companyName =req.params.companyName;
                    let  dbName = await getDatebaseName(companyName)
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getDocumentOrImagesForEMS");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(err);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray)
                } else {
                    flag = true;
                    imageData.image = result;
             
                    imageData.success = flag;
                    res.send(imageData);
                }
        });
            
        } 
        
  } catch (e) {
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getDocumentOrImagesForEMS");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
    errorLogs(errorLogArray)
  }
}

function removeDocumentOrImagesForEMS(req, res) {
  try {
    var localPath = JSON.parse(decodeURI(req.params.path));
    let foldername = localPath.filepath;
    fs.unlink(foldername + localPath.filename, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: true });
        console.log("Image Deleted successfully");
      }
    });
  } catch (e) {
    console.log("removeImage", e);
  }
}

async function getUserLoginData(req, res) {
  try {
    var  dbName = await getDatebaseName(req.params.companyName)
    let companyName = req.params.companyName;

    var listOfConnections = {};
    if(dbName){
        listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query(
      "CALL `get_user_login_data` ()",
      [],
            async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getUserLoginData");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            }
    );
    } else {
        res.send({status: false,Message:'Database Name is missed'})
  
    }
  } catch (e) {
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getUserLoginData");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.params));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
    errorLogs(errorLogArray)
  }
}

async function usersLogin(req, res) {
  try {
    let array=[{
        empname:req.body.empname,
        email:req.body.email,
        empid:req.body.empid,
        userid:req.body.userid,
        password: req.body.password,
        companyname: req.body.companyname,
        companycode: req.body.companyCode,
      }];
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
    
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
      "CALL `setemployeelogin`(?,?,?,?,?)",
      [
        req.body.empid,
        req.body.userid,
        req.body.password,
        req.body.status,
        "N",
      ],
                async function (err, result) {
                              if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("usersLogin");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                       errorLogs(errorLogArray);
                        res.send({ status: false });
                    } 
                    else if(result[0][0].successstate==1){
                        res.send({ status: false,successstate :result[0][0].successstate});
                    }else {
                       if (array[0].email != '' && array[0].email != null) {
                             sendEmailToEmployeeAboutLogins(array, result);
                            }
                            res.send({ status: true });
                    }
                }
    );
        }else {
            res.send({status: false,Message:'Database Name is missed'})

        }
  } catch (e) {
    let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("usersLogin");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
  }
}

// function setDocumentOrImageForEMS(req, res) {
//     try { 
//         file=req.files.file;
//         var localPath = JSON.parse(decodeURI(req.params.path))
async function getEmsEmployeeColumnFilterData(req, res) {
  try {
    let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
    
        listOfConnections[companyName].query(
      "CALL `get_ems_employee_column_filter_data` ()",
      [],
            async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmsEmployeeColumnFilterData");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            }
    );
    }else {
            res.send({status: false,Message:'Database Name is missed'})
      }

  } catch (e) {
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getEmsEmployeeColumnFilterData");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.params));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
   errorLogs(errorLogArray)
  }
}

async function getOffboardingSettings(req, res) {
  try {
      let companyName =req.params.companyName;
      let  dbName = await getDatebaseName(companyName)
      var listOfConnections = {};
      if(dbName){
          listOfConnections= connection.checkExistingDBConnection(companyName)
          if(!listOfConnections.succes) {
              listOfConnections[companyName] = await
              connection.getNewDBConnection(companyName, dbName);
          }
          listOfConnections[companyName].query(
      "CALL `get_offboard_settings` ()",
              async function (err, result, fields) {
                  if (err) {
                      let errorLogArray = [];
                      errorLogArray.push("EMSAPI");
                      errorLogArray.push("getOffboardingSettings");
                      errorLogArray.push("GET");
                      errorLogArray.push(JSON.stringify(req.params));
                      errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                      errorLogArray.push(null);
                      errorLogArray.push(companyName);
                      errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                      res.send({ status: false });
                  } else {
                      if (result && result.length > 0) {
                          res.send({ data: result[0], status: true });
                      } else {
                          res.send({ status: false });
                      }
                  }
              }
    );
      } else {
          res.send({status: false,Message:'Database Name is missed'})
      }
  } catch (e) {
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getOffboardingSettings");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.params));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
   errorLogs(errorLogArray)
  }
}

async function setAnnouncements(req, res) {
  try {
      let companyName =req.body.companyName;
      let  dbName = await getDatebaseName(companyName)
      var listOfConnections = {};
      if(dbName) {
          listOfConnections = connection.checkExistingDBConnection(companyName)
          if (!listOfConnections.succes) {
              listOfConnections[companyName] = await
              connection.getNewDBConnection(companyName, dbName);
          }
          listOfConnections[companyName].query(
              "CALL `set_announcements` (?)",
              [JSON.stringify(req.body)],
              async function (err, result, fields) {
                 if (err) {
                      let errorLogArray = [];
                      errorLogArray.push("EMSAPI");
                      errorLogArray.push("setAnnouncements");
                      errorLogArray.push("POST");
                      errorLogArray.push(JSON.stringify(req.body));
                      errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                      errorLogArray.push(null);
                      errorLogArray.push(companyName);
                      errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                      res.send({ status: false });
                  } else {
                      if (
                          result &&
                          result[0] &&
                          result[0][0] &&
                          result[0][0].statuscode == 0
                      ) {
                          res.send({ status: true });
                      } else {
                          res.send({ status: false });
                      }
                  }
              }
          );
      }else{
          res.send({status: false,Message:'Database Name is missed'})

      }
  }
   catch (e) {
    let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setAnnouncements");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
  }
}

async function deleteFilesMaster(req,res){
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `delete_files_master` (?)",
                [req.params.id], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("deleteFilesMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                            // res.send({status: false});
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("deleteFilesMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function getHrDetails(req, res) {
  try {
      let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_hr_details` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getHrDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
    });
    }else {
            res.send({status: false,Message:'Database Name is missed'})
    }
  } catch (e) {
    let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getHrDetails");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
  }
}

async function getnoticeperiods(req,res){
    try{
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await
                connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `get_notice_period` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getnoticeperiods");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getnoticeperiods");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

// async function usersLogin(req,res) {
//     try {
//         let companyName = req.body.companyName;
//         let dbName = await getDatebaseName(companyName)
//         var listOfConnections = {};
//         if (dbName) {
//             listOfConnections = connection.checkExistingDBConnection(companyName)
//             if (!listOfConnections.succes) {
//                 listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
//             }
//             listOfConnections[companyName].query('CALL `setemployeelogin`(?,?,?,?,?)', [req.body.empid, req.body.userid, req.body.password, req.body.status, 'N'], async function (err, result) {
//                 if (err) {
//                     let errorLogArray = [];
//                     errorLogArray.push("EMSAPI");
//                     errorLogArray.push("usersLogin");
//                     errorLogArray.push("POST");
//                     errorLogArray.push(JSON.stringify(req.body));
//                     errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
//                     errorLogArray.push(null);
//                     errorLogArray.push(companyName);
//                     errorLogArray.push(dbName);
//                      errorLogs(errorLogArray);
//                     res.send({ status: false })
//                 } else {
//                     if (err) {
//                         res.send({ status: false })

//                     }
//                     else {
//                         res.send({ status: true })
//                     }
//                 }
//             })
//         }
//         else {
//             res.send({status: false,Message:'Database Name is missed'})
//         }

//     }
//     catch (e) {
//         let companyName =req.body.companyName;
//     let  dbName = await getDatebaseName(companyName)
//     let errorLogArray = [];
//     errorLogArray.push("EMSAPI");
//     errorLogArray.push("usersLogin");
//     errorLogArray.push("POST");
//     errorLogArray.push(JSON.stringify(req.body));
//     errorLogArray.push( e.message);
//     errorLogArray.push(null);
//     errorLogArray.push(companyName);
//     errorLogArray.push(dbName);
//      errorLogs(errorLogArray)
//     }
// }

async function setprogramspasterstatus(req, res) {
  try {
    let companyName = req.body.companyName;
    let dbName = await getDatebaseName(companyName)
    var listOfConnections = {};
    if (dbName) {
        listOfConnections = connection.checkExistingDBConnection( companyName)
        if (!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
        }
        listOfConnections[companyName].query(
      "CALL `set_programs_status` (?,?,?)",
      [req.body.pid, req.body.pStatus, req.body.actionby],
            async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setprogramspasterstatus");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result[0][0].successstate == 0) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            }
    );
    }else {
        res.send({status: false,Message:'Database Name is missed'})
        }
  } catch (e) {
    let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setprogramspasterstatus");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
  }
}

async function getEmailsByEmpid(req, res) {
   try {
        let companyName = req.cname;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
        listOfConnections[companyName].query("CALL `get_emails_by_empid` (?)", [req.empid], async function (err, result, fields) {
            emailComponentData = [];
              if (err) {
                let errorLogArray = [];
                errorLogArray.push("EMSAPI");
                errorLogArray.push("getEmailsByEmpid");
                errorLogArray.push("GET");
                errorLogArray.push(JSON.stringify(req.params));
                errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                errorLogArray.push(null);
                errorLogArray.push(companyName);
                errorLogArray.push(dbName);
                errorLogs(errorLogArray);
                res.send({ status: false })
              } else {
               
                if (result && result.length > 0) {
                    emailComponentData = result[0][0];
                    let data = JSON.parse(emailComponentData.jsonvalu)[0];
                    if (data.rm_email != null || data.rm_email != '') {
                    sendEmailToAdminAboutNewHire(emailComponentData);
                    sendEmailToChecklistManager(emailComponentData); 
                    }
                } else {
                    res.send({ status: false })
                }
            }
        });
    }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmailsByEmpid");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}



/** send email to Admin About NewHire */
function sendEmailToAdminAboutNewHire(mailData) {
     try {
        let data = JSON.parse(mailData.jsonvalu)[0];
        let email = data.admin_email
        let empname = data.emp_name;
        var transporter = nodemailer.createTransport({
        host: "smtp-mail.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'anceplab@gmail.com',
            pass: 'Anceplab@123'
        }
        });
        var html = `<html>
        <head>
        <title>New login Creation</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${data.admin_name},</p>
        
        <p style="color:black">Please create login credentials for the new employee: <b>${data.emp_name}</b> at the earliest possible time.</p>
        
        <p style="color:black">Thank you,</p>
        <p style="color:black">Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;
   
        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Create a new login for'+' '+empname,
            html: html
        };
         transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail for",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });

    }
    catch (e) {
        console.log('sendEmailToAdminAboutNewHire :', e)

    }
}

/** send email to employee About logins */
function sendEmailToEmployeeAboutLogins(maileData, result) {
  try {
    let email = maileData[0].email;
    let companycode = maileData[0].companycode;
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.gmail.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
          user: 'anceplab@gmail.com',
          pass: 'Anceplab@123'
      },
    });
      var url =  global_url + 'Login';
    var html = `<html>
        <head>
        <title>New login Credentiols</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hello ${maileData[0].empname},</p>
        
        <p style="color:black">Welcome to ${maileData[0].companyname}</p>


        <p style="color:black">We’d like to inform you that your login credentials were created successfully. To access your account, click on the link below. </p>
       
        <p style="color:black"> <a href="${url}" >${url} </a></p>   
                   
        <p style="color:black">Your login credentials:</p>
        <p style="color:black"><b>Company Code: </b>${maileData[0].companycode}</p>
        <p style="color:black"><b>Username: </b>${maileData[0].userid}</p>
        <p style="color:black"><b>Password: </b>${maileData[0].password}</p>
        <p style="color:black">If you experience any issues while login to your account, reach out to us at <b>anceplab@gmail.com</b> </p>
        
        <p style="color:black">Best Regards,</p>

        <p style="color:black">Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

    var mailOptions = {
      from: "anceplab@gmail.com",
      to: email,
      subject: "New Login Credentials",
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log("Failed To Sent  Mail",error)
      } else {
          console.log("Mail Sent Successfully")
  }
    });
  } catch (e) {
    console.log("sendEmailToEmployeeAboutLogins :", e);
  }
}

/**  */
async function setOffboardingSettings(req, res) {
    try {
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `set_offboard_settings` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setOffboardingSettings");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                  
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setOffboardingSettings");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** send email to checklist manager */
function sendEmailToChecklistManager(mailData){
try {
        let data = JSON.parse(mailData.jsonvalu)[0];
        let email = data.rm_email
       var transporter = nodemailer.createTransport({
        host: "smtp-mail.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'anceplab@gmail.com',
            pass: 'Anceplab@123'
        }
       });
       var html = `<html>
        <head>
        <title>Employee Onboarding Checklist</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${data.rm_name},</p>
        
        <p style="color:black">Hopefully, you're aware of the onboarding checklist for the new employees 
        and everything should be taken care of. The checklist should be followed in order and needs to 
        be completed in one or two days of time.</p>

        <p style="color:black">It's very important that all the checklist items should be completed as 
        soon as possible before the new hire starts working.</p>
    
        <p style="color:black">Thanks<br>Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

    var mailOptions = {
      from: "anceplab@gmail.com",
      to: email,
      subject: "New Employee Onboarding Checklist",
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Failed To Sent  Mail",error)
        } else {
            console.log("Mail Sent Successfully")
        }
    });
  } catch (e) {
    console.log("sendEmailToChecklistManager :", e);
  }

}

async function setOnboardingSettings(req, res) {
    try {
        let companyName = req.body.companyName;
        let dbName = await
        getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await
                connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `set_onboard_settings` (?)", [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("setOnboardingSettings");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false})
        }
    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setOnboardingSettings");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)

    }
}

async function getEmsEmployeeDataForReports(req,res){
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
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query(
                    "CALL `get_ems_employee_data_for_reports` (?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        empid,
                        empstatus,
                        emptype,
                        dept,
                        desg,
                        location,
                        gender,
                        bloodgroup,
                        maritalstatus,
                        shift,
                        manager,
                        "",
                    ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmsEmployeeDataForReports");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            // console.log(result)
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
                );
                } else {
            res.send({status: false,Message:'Database Name is missed'})
                }
            } catch (e) {
                let companyName =req.body.companyName;
                let  dbName = await getDatebaseName(companyName)
                let errorLogArray = [];
                errorLogArray.push("EMSAPI");
                errorLogArray.push("getEmsEmployeeDataForReports");
                errorLogArray.push("GET");
                errorLogArray.push(JSON.stringify(req.body));
                errorLogArray.push( e.message);
                errorLogArray.push(null);
                errorLogArray.push(companyName);
                errorLogArray.push(dbName);
                 errorLogs(errorLogArray)
            }
        }
                /** send email to employee about checklist update */
function sendEmailToEmployeeAboutChecklistUpdate(maileData) {
  try {
    let email = maileData;
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.gmail.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
          user: 'anceplab@gmail.com',
          pass: 'Anceplab@123'
      },
    });
    var html = `<html>
        <head>
        <title>Employee Onboarding Checklist</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${req[0].emp_name},</p>
        
        <p style="color:black">I wanted to give you an update about the checklist.</p>

        <p style="color:black">We completed 80% of it! We've also added a few things that we think will be helpful for your department, and we'll be in touch with more updates soon. <b></b></p>
                   
        <p style="color:black">If you have any questions, feel free to reach out anytime! </p>
        
        <p style="color:black">Thanks, and have a great day!<br>Human Resources Team. </p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

    var mailOptions = {
      from: "anceplab@gmail.com",
      to: email,
      subject: "Onboarding Checklist Updates",
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Failed To Sent  Mail",error)
        } else {
            console.log("Mail Sent Successfully")
        }
    });
  } catch (e) {
    console.log("sendEmailToEmployeeAboutChecklistUpdate :", e);
  }
}

/*To get active announcements*/
async function getActiveAnnouncementsTopics(req,res){

try {
    let companyName = req.params.companyName;
    let dbName = await getDatebaseName(companyName)
    var listOfConnections = {};
    if (dbName) {
        listOfConnections = connection.checkExistingDBConnection(companyName)
        if (!listOfConnections.succes) {
            listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
        }
        listOfConnections[companyName].query("CALL `get_active_announcements_topics` ()", [], async function (err, result, fields) {
            if (err) {
                let errorLogArray = [];
                errorLogArray.push("EMSAPI");
                errorLogArray.push("getActiveAnnouncementsTopics");
                errorLogArray.push("GET");
                errorLogArray.push(JSON.stringify(req.params));
                errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                errorLogArray.push(null);
                errorLogArray.push(companyName);
                errorLogArray.push(dbName);
                 errorLogs(errorLogArray);
                res.send({ status: false })
            } else {
                if (result && result.length > 0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            }
        });
    }
    else {
        res.send({status: false,Message:'Database Name is missed'})
    }
}catch(e){
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getActiveAnnouncementsTopics");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.params));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
}

}


/*To Get Announcements*/
async function getAnnouncements(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_announcements` (?)", [null], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getAnnouncements");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
            
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getAnnouncements");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function getEmployeesPendingChecklists(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_pending_checklists` (?,?,?,?)", [req.body.name,req.body.date,req.body.eid,req.body.did], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeesPendingChecklists");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesPendingChecklists");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}


async function Messages(req,res) {
    try {
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `get_ems_messages` (?,?,?)", [req.body.code,
                    req.body.pagenumber, req.body.pagesize],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("Messages");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("Messages");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*To Get Announcements*/
async function getFilesForApproval(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_files_for_approval` (?,?)", [null,null], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getFilesForApproval");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getFilesForApproval");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function documentApproval(req, res) {
    try {
        let emailData = JSON.parse(req.body.email)
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `set_files_master_status` (?,?)", [req.body.id, req.body.status], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("documentApproval");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                  
                    if (result && result[0] && result[0][0] && result[0][0].successstate == 0) {
                        res.send({ status: true })
                        if (emailData.emp_email != '' || emailData.emp_email != null) {
                            if (req.body.status == 'Approved') {
                                documentApprovalEmailToEmployee(emailData);
                            } else {
                                documentRejectEmailtoEmployee(emailData)
                            }
                        }

                    } else {
                        res.send({ status: false });
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("documentApproval");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function setEmployeeChecklists(req, res) {
    try {
        let mailData =req.body.emaildata;
        let companyName = req.body.companyName;
        let dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if (dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query(
                "CALL `set_employee_checklists` (?,?,?,?,?,?,?,?)",
                [
                    JSON.stringify(req.body.cid),
                    req.body.eid,
                    req.body.did,
                    req.body.cmmt,
                    req.body.status,
                    req.body.fstatus,
                    req.body.category,
                    req.body.actionBy,
                ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setEmployeeChecklists");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result[0][0].successstate == 0) {
                            res.send({ status: true });
                            if (req.body.fstatus == "Completed") {
                                if (mailData.emp_email !='' || mailData.emp_email !=null) {
                                    checklistCompleteEmailToEmployee(mailData);
                                   }     
                            }
                        } else {
                            res.send({ status: false })
                        }
                    }
                });

        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmployeeChecklists");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}


async function getEmpOffboardTerminationChecklists(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
                listOfConnections[companyName].query("CALL `get_emp_offboard_termination_checklists` (?,?,?,?)", [req.body.name,req.body.date,req.body.eid,req.body.did], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmpOffboardTerminationChecklists");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
            }
            else {
            res.send({status: false,Message:'Database Name is missed'})
            }
        } catch (e) {
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("EMSAPI");
            errorLogArray.push("getEmpOffboardTerminationChecklists");
            errorLogArray.push("GET");
            errorLogArray.push(JSON.stringify(req.body));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)   }

}
    
/** send email to employee about reject document */
function sendEmailToEmployeeAboutDocumentReject(mailData){
    try{
       let email = mailData
       var transporter = nodemailer.createTransport({
        host: "smtp-mail.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'anceplab@gmail.com',
            pass: 'Anceplab@123'
        }
       });
       var html = `<html>
        <head>
        <title>Documents approval</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color:s #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${mailData[0].emp_name},</p>

        <p style="color:black">Please re-upload the documents that were rejected. We apologize for the inconvenience. </p>
        
         <p style="color:black">Thank you,<br>Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;
   
        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Re-upload document ',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
     }
    catch (e) {
        console.log('sendEmailToEmployeeAboutDocumentReject :', e)

    }

}

async function getEmpResignationPendingChecklists(req, res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_emp_offboard_resignation_checklists` (?,?,?,?)", [req.body.name,req.body.date,req.body.eid,req.body.did], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmpResignationPendingChecklists");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmpResignationPendingChecklists");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

async function getEmployeesResignationForHr(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
                listOfConnections[companyName].query("CALL `get_resignation_data` (?,?,?)", [req.body.regId,req.body.empId,req.body.rmId], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmployeesResignationForHr");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
            }
            else {
            res.send({status: false,Message:'Database Name is missed'})
            }
    }
    catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesResignationForHr");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)  }

}
/** send email to employee about new role */
function sendEmailToEmployeeAboutNewRole(mailData){
    try{
       let email = mailData
       var transporter = nodemailer.createTransport({
        host: "smtp-mail.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'anceplab@gmail.com',
            pass: 'Anceplab@123'
        }
       });
       var html = `<html>
        <head>
        <title>New role</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Dear ${mailData[0].hr_name},</p>

        <p style="color:black">Congratulations on your new role as Tech Lead! We're confident that your experience and expertise will help us grow and succeed.</p>
        
         <p style="color:black">We're always available to help out with any questions.</p>
         <p style="color:black">Best,<br>Human Resources Team.</p>

        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;
   
        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Welcome to Tech Lead ',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });
     }
    catch (e) {
        console.log('sendEmailToEmployeeAboutNewRole :', e)

    }

}

/** send email to employee about remove role */
function sendEmailToEmployeeAboutRemoveRole(mailData){

// async function getHrDetails(req,res){
    try {
        // let companyName =req.params.companyName;
        // let  dbName = await getDatebaseName(companyName)
        // var listOfConnections = {};
        // if(dbName){
        //     listOfConnections= connection.checkExistingDBConnection('e65',companyName)
        //     if(!listOfConnections.succes) {
        //         listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        let email = mailData
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
        <head>
        <title>Role Change </title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${mailData[0].hr_name},</p>

        <p style="color:black">We would like to let you know that you have been removed from the ${req[0].role_name} role. This means that you will no longer be able to access the administrative interface, which manages campaign and customer data as well as internal company information. </p>
        
         <p style="color:black">However, we are happy to offer you with all your current access privileges on our module. Please do not hesitate to reach out if you have any questions or concerns.</p>
         <p style="color:black">Regards,<br>Human Resources Team.</p>

        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Role Change ',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });

//      // })
// }
// else{
//
//         }
    }
    catch (e) {
        console.log('sendEmailToEmployeeAboutRemoveRole :', e)

    }


}

async function getReportingManagerForEmp(req,res){
    try{
        var  dbName = await getDatebaseName(req.params.companyName)
       let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_reporting_manager_for_emp` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getReportingManagerForEmp");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getReportingManagerForEmp");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** get employee personal detials(HR) */

async function getEmpPersonalInfo(req, res) {
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_emp_personal_info` (?)",
                [JSON.parse(req.params.id)],
                async function (err, result, fields) {
                     if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getTerminationCategory");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }

            );
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getTerminationCategory");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/****
 *
 * To Get getEmpAnnouncements
 * ***/
async  function getEmpAnnouncements(req, res) {
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_emp_announcements` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmpAnnouncements");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false });
                } else {
                    if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmpAnnouncements");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}






async function getDocumentsForEMS(req,res){
    try{
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_files_master` (?,?,?,?,?,?)",
                [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory?req.body.filecategory:null,req.body.requestId,req.body.status], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getDocumentsForEMS");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getDocumentsForEMS");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

async function getActiveEmployeeProgramSchedules(req, res) {
  try {
    var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_allemployees_program_schedules` (?)",[JSON.parse(req.params.sid)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getActiveEmployeeProgramSchedules");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
} else {
            res.send({status: false,Message:'Database Name is missed'})
  }
  } catch (e) {
    let companyName =req.params.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("getActiveEmployeeProgramSchedules");
    errorLogArray.push("GET");
    errorLogArray.push(JSON.stringify(req.params));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
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


/** send email to employee about checklist final update */
function checklistFinalUpdateEmailToEmployee(mailData) {
    try {
        let email = mailData;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: "SSLv3",
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            },
        });
        var html = `<html>
        <head>
        <title>Employee Onboarding Checklist</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${mailData[0].emp_name},</p>

        <p style="color:black">Hope you're doing well.</p>
        
        <p style="color:black">I wanted to give you an update about the checklist, we completed it! </p>

        <p style="color:black">If you have any questions, feel free to reach out anytime! <b></b></p>
                   
        <p style="color:black">Thanks,<br>Human Resources Team.</p>

        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

        var mailOptions = {
            from: "anceplab@gmail.com",
            to: email,
            subject: "Onboarding Checklist Final Update",
            html: html,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    } catch (e) {
        console.log("sendEmailToEmployeeAboutChecklistFinalUpdate :", e);
    }
}
/** send email to employee about checklist complete */
function checklistCompleteEmailToEmployee(mailData) {
    try {
        let email = mailData.emp_mail;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: "SSLv3",
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            },
        });
        var html = `<html>
        <head>
        <title>Employee Onboarding Checklist</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Hi ${mailData.emp_name},</p>

        <p style="color:black">We're delighted to have you on board. Please go through the following onboarding checklist quickly that we've completed for you. </p>
        
        <p style="color:black"> - You can set up a user account and can start working on the tasks assigned to you.</p>

        <p style="color:black"> - The HR team has welcomed you and given you all the benefits that come with your role. </p>
                   
        <p style="color:black">- You have been briefed about our company values and mission followed by company specific policies and procedures.  </p>
       
        <p style="color:black">- We've also sent you a welcome email.</p>
      
        <p style="color:black"> We hope this helps you onboarding.  Please let us know if anything is required in addition to the above.</p>
        <p style="color:black">Thanks<br>Human Resources Team.</p>
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Welcome to'+' '+ companyNameData.companyname,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });

    }
    catch (e) {
        console.log('checklistCompleteEmailToEmployee :', e)

    }
}

function roleRemoveInformationEmailToEmployee(mailData){
    try {
        // let companyName =req.params.companyName;
        // let  dbName = await getDatebaseName(companyName)
        // var listOfConnections = {};
        // if(dbName){
        //     listOfConnections= connection.checkExistingDBConnection('e65',companyName)
        //     if(!listOfConnections.succes) {
        //         listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        let email = mailData
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
    <head>
    <title>Role Change </title></head>
    <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
    <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
  
    <p style="color:black">Hi ${mailData[0].hr_name},</p>

    <p style="color:black">We would like to let you know that you have been removed from the ${req[0].role_name} role. This means that you will no longer be able to access the administrative interface, which manages campaign and customer data as well as internal company information. </p>
    
     <p style="color:black">However, we are happy to offer you with all your current access privileges on our module. Please do not hesitate to reach out if you have any questions or concerns.</p>
     <p style="color:black">Regards,<br>Human Resources Team.</p>
    <hr style="border: 0; border-top: 3px double #8c8c8c"/>
    </div></body>
    </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Role Change ',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });

//      // })
// }
// else{
//
//         }
    }
    catch (e) {
        console.log('roleRemoveInformationEmailToEmployee :', e)

    }

}



/** send email to employee about new role */
function newRoleInformationEmailToEmployee(mailData){
    try{
        let email = mailData
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
     <head>
     <title>New role</title></head>
     <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
     <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
   
     <p style="color:black">Dear ${mailData[0].hr_name},</p>

     <p style="color:black">Congratulations on your new role as Tech Lead! We're confident that your experience and expertise will help us grow and succeed.</p>
     
      <p style="color:black">We're always available to help out with any questions.</p>
      <p style="color:black">Best,<br>Human Resources Team.</p>

     <hr style="border: 0; border-top: 3px double #8c8c8c"/>
     </div></body>
     </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Welcome to Tech Lead ',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }

        });
    }
    catch (e) {
        console.log('newRoleInformationEmailToEmployee :', e)

    }

}
/** send email to employee about reupload document */
function documentReuploadInformationEmailToHr(req,res){
    try{
        let email = req
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
        <head>
        <title>Documents Reupload</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Dear ${req[0].hr_name},</p>

        <p style="color:black">Due to some changes in the documents, we need you to approve the documents uploaded by the ${req[0].emp_name}. Please find the attached document for your approval. </p>
        
         <p style="color:black">I hope it is not an inconvenience for you but this is a very important process that we need to complete urgently. Please let me know if you have any questions. </p>
         <p style="color:black">Thank you,<br> ${req[0].emp_name}.</p>

        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Documents Re uploaded ',
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
        console.log('documentReuploadInformationEmailToHr :', e)

    }

}
/** send email to employee about reupload document */
function documentReuploadInformationEmailToHr(req,res){
    try{
        let email = req
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
        <head>
        <title>Documents Reupload</title></head>
        <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
        <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
      
        <p style="color:black">Dear ${req[0].hr_name},</p>

        <p style="color:black">Due to some changes in the documents, we need you to approve the documents uploaded by the ${req[0].emp_name}. Please find the attached document for your approval. </p>
        
         <p style="color:black">I hope it is not an inconvenience for you but this is a very important process that we need to complete urgently. Please let me know if you have any questions. </p>
         <p style="color:black">Thank you,<br>${req[0].emp_name}.</p>

       
        <hr style="border: 0; border-top: 3px double #8c8c8c"/>
        </div></body>
        </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Documents Re uploaded ',
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
        console.log('documentReuploadInformationEmailToHr :', e)

    }

}
/** send email to employee about document approval */
function documentApprovalEmailToEmployee(mailData) {
    try {
        let toEmail = mailData.emp_email;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
      <head>
      <title>Documents approval</title></head>
      <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
      <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
    
      <p style="color:black">Hi ${mailData.emp_name},</p>
  
  
      <p style="color:black">HR department has approved documents uploaded by you. Don’t hesitate to contact me if you have any queries.</p>
      
       <p style="color:black">Best,</p>
        <p style="color:black">Human Resources Team.</p>
      <p style="color:black">${mailData.companyname}.</p>
      <hr style="border: 0; border-top: 3px double #8c8c8c"/>
      </div></body>
      </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: toEmail,
            subject: 'HR Approved Your Uploaded Document',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    }
    catch (e) {
        console.log('documentApprovalEmailToEmployee :', e)

    }
}


/** send email to employee about reject document */
function documentRejectEmailtoEmployee(mailData) {
    try{
        let toEmail = mailData.emp_email;
           var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
           });
           var html = `<html>
            <head>
            <title>Documents approval</title></head>
            <body style="font-family:'Segoe UI',sans-serif; color:s #7A7A7A">
            <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
          
            <p style="color:black">Hi ${mailData.emp_name},</p>
    
            <p style="color:black">I regret to inform you that some of the total documents uploaded by you were
             rejected. Do upload rejected documents again to complete the process. </p>
            
             <p style="color:black">Thank you,</p>
                <p style="color:black">Human Resources Team.</p>
            <p style="color:black">${mailData.companyname}</p>
            <hr style="border: 0; border-top: 3px double #8c8c8c"/>
            </div></body>
            </html> `;
       
            var mailOptions = {
                from: 'anceplab@gmail.com',
                  to: toEmail,
                subject: 'Re-upload Document ',
                html: html
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Failed To Sent  Mail",error)
                } else {
                    console.log("Mail Sent Successfully")
                }
            });
         }
        catch (e) {
            console.log('documentRejectEmailtoEmployee :', e)
    
        }
    
    }

/** send email to Hr about document approval */
function documentApprovalEmailToHR(mailData) {
    let emailData = mailData;
    try{
        let toEmail = mailData.rm_email;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com",
            secureConnection: false,
            port: 587,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
                <head>
                <title>Documents uploaded</title></head>
                <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
                <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
                <p style="color:black">Dear ${emailData.rm_name},</p>
                 <p style="color:black">I would like to inform you that I have uploaded the documents for your approval. Please find document.</p>
                 <p style="color:black">Sincerely,<br>${emailData.emp_name}.</p>
                
                <hr style="border: 0; border-top: 3px double #8c8c8c"/>
                </div></body>
                </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: toEmail,
            subject: 'Documents Uploaded by'+' '+emailData.emp_name,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    }
    catch(e){
        console.log('documentApprovalEmailToHR :', e)
    }
}
/** send email to employee about induction cancel */
function inductionProgramCancelEmailToEmployee(mailData) {
    try {
        let date =(new Date(mailData.scheduledate).getDate()<10?"0"+new Date(mailData.scheduledate).getDate():new Date(mailData.scheduledate).getDate())+'-'+((new Date(mailData.scheduledate).getMonth()+1)<10?"0"+(new Date(mailData.scheduledate).getMonth()+1):(new Date(mailData.scheduledate).getMonth()+1) )+'-'+new Date(mailData.scheduledate).getFullYear();
        let email = mailData.emails;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
     <head>
     <title>Induction program cancel</title></head>
     <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
     <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
   
     <p style="color:black">Dear Employee,</p>

     <p style="color:black">I hope that you are doing well. </p>
     
     <p style="color:black">We regret to inform you that the Induction program which was scheduled on <b> ${date} </b>
     has been cancelled.  We will reschedule the Induction program and update you soon.</p>

     <p style="color:black">See you soon in the Induction Program on an updated scheduled date. </p>
                
     <p style="color:black">Sincerely<br>Human Resources Team.</p>
     
     <hr style="border: 0; border-top: 3px double #8c8c8c"/>
     </div></body>
     </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Induction Program Cancelled',
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    }
    catch (e) {
        console.log('inductionProgramCancelEmailToEmployee :', e)
    }
}

async function getEmployeeEmailData(req, res) {
    companyNameData = [];
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query(
            "CALL `get_emails_by_empid` (?)",[JSON.parse(req.params.eid)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmployeeEmailData");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            companyNameData = JSON.parse(result[0][0].jsonvalu)[0];
                            res.send({ data: result[0], status: true });

                        } else {
                            res.send({ status: false });
                        }
                    }
                }
        );
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeeEmailData");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


function rescheduledInductionProgramEmail(mailData) {
    try {
        let fdate =(new Date(mailData.programDate).getDate()<10?"0"+new Date(mailData.programDate).getDate():new Date(mailData.programDate).getDate())+'-'+((new Date(mailData.programDate).getMonth()+1)<10?"0"+(new Date(mailData.programDate).getMonth()+1):(new Date(mailData.programDate).getMonth()+1) )+'-'+new Date(mailData.programDate).getFullYear();
        let email = mailData.emails;
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'anceplab@gmail.com',
                pass: 'Anceplab@123'
            }
        });
        var html = `<html>
     <head>
     <title>Induction program rescheduled</title></head>
     <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
     <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
   
     <p style="color:black">Dear Employee,</p>

     <p style="color:black">I hope that you are doing well. </p>
     
     <p style="color:black">We regret to inform you that the planned date for our induction program has been rescheduled.New schedule details mentioned here</p>

     <p style="color:black">Name of the Induction Program: <b>${mailData.programName}</b></p>
     <p style="color:black">Your Meeting Scheduled On <b>${fdate}</b></p>
     <p style="color:black">from <b>${mailData.starttime}</b> to <b>${mailData.endtime}</b></p>           
    
     <p style="color:black">We hope to see you soon at our upcoming induction program! </p>
     
     <p style="color:black">Sincerely<br>Human Resources Team.</p>
       <p style="color:black"></p>
     <hr style="border: 0; border-top: 3px double #8c8c8c"/>
     </div></body>
     </html> `;

        var mailOptions = {
            from: 'anceplab@gmail.com',
            to: email,
            subject: 'Induction Program Rescheduled' ,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Failed To Sent  Mail",error)
            } else {
                console.log("Mail Sent Successfully")
            }
        });
    }
    catch (e) {
        console.log('rescheduledInductionProgramEmail :', e)
    }

}


async function getInductionProgramAssignedEmployee(req, res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_emails_for_program_schedule` (?)", [JSON.parse(req.params.sid)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getInductionProgramAssignedEmployee");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });

                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getInductionProgramAssignedEmployee");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** employee list by department id */
async function getEmployeesListByDeptId(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_employees_for_department` (?)",
                [JSON.parse(req.params.did)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getEmployeesListByDeptId");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeesListByDeptId");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}
/** set induction conducted by employees*/
async function setInductionConductedby(req, res) {
    try {
        let companyName = req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_ems_induction_conductedby` (?)",
                [JSON.stringify(req.body)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("setInductionConductedby");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result[0][0].statuscode == 0) {
                            res.send({ status: true ,data:result[0][0].statuscode});
                        } else if(result && result[0][0].statuscode == 1){
                            res.send({ status: true ,data:result[0][0].statuscode});
                        }
                        else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
    let  dbName = await getDatebaseName(companyName)
    let errorLogArray = [];
    errorLogArray.push("EMSAPI");
    errorLogArray.push("setInductionConductedby");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push( e.message);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray)
    }
}

/** get induction conducted employees */
async function getInductionConductedbyEmployees(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_ems_induction_conductedby` ()",[],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getInductionConductedbyEmployees");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getInductionConductedbyEmployees");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** get employees by program id and department id */
async function getCondcutedEmployeesByPrgIdAndDeptId(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_conducted_employees_for_department` (?,?)",
                [
                    JSON.parse(req.params.pid),
                    JSON.parse(req.params.did)
                ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getCondcutedEmployeesByPrgIdAndDeptId");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0], status: true });
                        } else {
                            res.send({ status: false });
                        }
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getCondcutedEmployeesByPrgIdAndDeptId");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs =  errorLogs(errorLogArray)
    }
}

/** get departments by program id */
async function getDepartmentsByProgramId(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_departmentss_for_program` (?)",[ JSON.parse(req.params.pid)],
                async function (err, result, fields) {
                     if (err) {
                            let errorLogArray = [];
                            errorLogArray.push("EMSAPI");
                            errorLogArray.push("getDepartmentsByProgramId");
                            errorLogArray.push("GET");
                            errorLogArray.push(JSON.stringify(req.params));
                            errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                            errorLogArray.push(null);
                            errorLogArray.push(companyName);
                            errorLogArray.push(dbName);
                            errorLogs = errorLogs(errorLogArray)
                        res.send({ status: false });
                    }else if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getDepartmentsByProgramId");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** set induction conducted by status*/
async function updateInductionConductedbyStatus(req,res) {
    try {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `update_ems_induction_conductedby_status` (?,?)",
                [JSON.stringify(req.body.id),JSON.stringify(req.body.status)],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("updateInductionConductedbyStatus");
                        errorLogArray.push("PUT");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result[0][0].statuscode == 0) {
                            res.send({ status: true });
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("updateInductionConductedbyStatus");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/** get maindashborad employee count data */
async function getAttendanceCountsForDate(req, res) {
    try {
       let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_attendance_counts_for_date` (?,?,?)",
                [JSON.parse(req.params.mid),
                    JSON.parse(req.params.empid),
                    req.params.date,
                ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getAttendanceCountsForDate");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    }else if (result && result.length > 0) {
                        res.send({ data: result[0][0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getAttendanceCountsForDate");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/** get induction program alerts to employee in maindashboard */
async function getEmployeeProgramAlerts(req,res) {
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `get_employee_program_alerts` (?)",[ JSON.parse(req.params.empid) ],
                async function (err, result, fields) {
                 if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("EMSAPI");
                    errorLogArray.push("getEmployeeProgramAlerts");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                     res.send({ status: false });

                    }else if (result && result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false });
                    }
                }
            );
        }
        else {
            res.send({ status: false })
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getEmployeeProgramAlerts");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** */
async function getDocumentsFiles(req,res) {
    try{
  var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_documents_files` (?,?,?,?,?,?)",
                [req.body.employeeId,req.body.candidateId,req.body.moduleId,req.body.filecategory?req.body.filecategory:null,req.body.requestId,req.body.status], async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("getDocumentsFiles");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs = errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false })
                        }
                    }
                });
        }
        else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("getDocumentsFiles");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
       errorLogs(errorLogArray)
    }
}

/** error logs */
function errorLogs(errorLogArray) {
    return new Promise(async (res,rej)=>{
       try {
           let companyName =errorLogArray[6];
           let dbName = errorLogArray[7];
           listOfConnections= connection.checkExistingDBConnection(companyName)
           if(!listOfConnections.succes) {
               listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
           }
               listOfConnections[companyName].query(  "CALL `set_error_logs` (?,?,?,?,?,?)",
               [
                errorLogArray[0], errorLogArray[1], errorLogArray[2], JSON.stringify(errorLogArray[3]),errorLogArray[4], errorLogArray[5]
               ],
             function (err, result, fields) {
              if (result) {
                       res({ status: true });
                   } else {
                       res({ status: false })
                   }
               });
           }
         catch (e) {
           rej(e)
       }
   });

}

/** */
async function validateReportingManager(req, res) {
    companyNameData = [];
    try {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        var listOfConnections = {};
        if(dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query(
            "CALL `validate_reporting_manager` (?)",[JSON.parse(req.params.eid)],
                async function (err, result, fields) {
                     if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("EMSAPI");
                        errorLogArray.push("validateReportingManager");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);
                        res.send({ status: false });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ data: result[0][0].validity, status: true });

                        } else {
                            res.send({ status: false });
                        }
                    }
                }
        );
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("validateReportingManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs = errorLogs(errorLogArray)
    }
}


/** separation mail to manager */

function separationRequestEmail(mailData) {
    
    let releavedate =(new Date(mailData.original_relieving_date).getDate()<10?"0"+new Date(mailData.original_relieving_date).getDate():new Date(mailData.original_relieving_date).getDate())+'-'+((new Date(mailData.original_relieving_date).getMonth()+1)<10?"0"+(new Date(mailData.original_relieving_date).getMonth()+1):(new Date(mailData.original_relieving_date).getMonth()+1) )+'-'+new Date(mailData.original_relieving_date).getFullYear();
    let resigndate =(new Date(mailData.applied_date).getDate()<10?"0"+new Date(mailData.applied_date).getDate():new Date(mailData.applied_date).getDate())+'-'+((new Date(mailData.applied_date).getMonth()+1)<10?"0"+(new Date(mailData.applied_date).getMonth()+1):(new Date(mailData.applied_date).getMonth()+1)) +'-'+new Date(mailData.applied_date).getFullYear();
    let exitdate =(new Date(mailData.requested_relieving_date).getDate()<10?"0"+new Date(mailData.requested_relieving_date).getDate():new Date(mailData.requested_relieving_date).getDate())+'-'+((new Date(mailData.requested_relieving_date).getMonth()+1)<10?"0"+(new Date(mailData.requested_relieving_date).getMonth()+1):(new Date(mailData.requested_relieving_date).getMonth()+1)) +'-'+new Date(mailData.requested_relieving_date).getFullYear();
    try {
         let email = mailData.emailData.rm_email
         var transporter = nodemailer.createTransport({
           host: "smtp-mail.gmail.com", // hostname
           secureConnection: false, // TLS requires secureConnection to be false
           port: 587, // port for secure SMTP
           tls: {
               ciphers: 'SSLv3'
           },
           auth: {
             user: 'anceplab@gmail.com',
             pass: 'Anceplab@123'
           }
         });
       var html = `<html>
       <head>
       <title>Separation Request</title></head>
       <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
       <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
     
       <p style="color:black">Dear ${mailData.emailData.rm_name},</p>
   
       <p style="color:black">I am writing to inform you that I have submitted my separation through the HR system. Please find the details corresponding to my resignation below: </p>
       <p style="color:black"><b>Emp ID: </b>${mailData.emailData.employee_id}</p>
       <p style="color:black"><b>Emp Name: </b>${mailData.emailData.emp_name}</p>
       <p style="color:black"><b>Date of Request Resignation: </b>${resigndate}</p>
       <p style="color:black"><b>Notice Period: </b>${mailData.notice_period}</p>
       <p style="color:black"><b>Relieving Date: </b>${releavedate}</p>
       <p style="color:black"><b>Request Exit Date: </b>${exitdate}</p>
       <p style="color:black"><b>Reason: </b>${mailData.reasonName}</p>
       <p style="color:black"><b>Notes: </b>${mailData.resg_comment}</p>

       <p style="color:black">I would like to take this opportunity to express my gratitude for the opportunity and experience that I have had while working with ${mailData.emailData.companyname}. I have learned a lot during my tenure here and I am thankful for the support and guidance provided by my colleagues and management. </p>
       <p style="color:black">I will ensure that I complete all formalities as per guidelines on or before my last day of work. Please let me know If anything is required in addition to this.</p>
       <p style="color:black">I solicit your cooperation and thank you for understanding. </p>

        <p style="color:black">Sincerely,<br>${mailData.emailData.emp_name}</p>
        
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       </div>
       </body>
       </html> `;
   
       var mailOptions = {
           from: 'anceplab@gmail.com',
           to: email,
           subject: 'Separation request raised by'+' '+mailData.emailData.emp_name,
           html: html
       };
       transporter.sendMail(mailOptions, async function (error, info) {
           if (error) {
               console.log("Failed To Sent  Mail",error)
           } else {
               console.log("Mail Sent Successfully")
           }
   
       });
   
   }
   catch (e) {
       console.log('attendanceRequestEmail :', e)
     }
   
}
   
/** separation request approved mail */

function separationRequestApprovedEmail(value) {
    
    let releavedate =(new Date(value.original_relieving_date).getDate()<10?"0"+new Date(value.original_relieving_date).getDate():new Date(value.original_relieving_date).getDate())+'-'+((new Date(value.original_relieving_date).getMonth()+1)<10?"0"+(new Date(value.original_relieving_date).getMonth()+1):(new Date(value.original_relieving_date).getMonth()+1) )+'-'+new Date(value.original_relieving_date).getFullYear();
    let resigndate =(new Date(value.applied_date).getDate()<10?"0"+new Date(value.applied_date).getDate():new Date(value.applied_date).getDate())+'-'+((new Date(value.applied_date).getMonth()+1)<10?"0"+(new Date(value.applied_date).getMonth()+1):(new Date(value.applied_date).getMonth()+1)) +'-'+new Date(value.applied_date).getFullYear();
    let exitdate =(new Date(value.requested_relieving_date).getDate()<10?"0"+new Date(value.requested_relieving_date).getDate():new Date(value.requested_relieving_date).getDate())+'-'+((new Date(value.requested_relieving_date).getMonth()+1)<10?"0"+(new Date(value.requested_relieving_date).getMonth()+1):(new Date(value.requested_relieving_date).getMonth()+1)) +'-'+new Date(value.requested_relieving_date).getFullYear();
    try {
         let email = value.emailData.emp_email
         var transporter = nodemailer.createTransport({
           host: "smtp-mail.gmail.com", // hostname
           secureConnection: false, // TLS requires secureConnection to be false
           port: 587, // port for secure SMTP
           tls: {
               ciphers: 'SSLv3'
           },
           auth: {
             user: 'anceplab@gmail.com',
             pass: 'Anceplab@123'
           }
         });
       var html = `<html>
       <head>
       <title>Separation Request Approve</title></head>
       <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
       <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
     
       <p style="color:black">Dear ${value.emailData.emp_name},</p>
   
       <p style="color:black">Your resignation request has been approved. Please find the notice period and other details below:</p>
      
       <p style="color:black"><b>Emp ID: </b>${value.emailData.employee_id}</p>
       <p style="color:black"><b>Emp Name: </b>${value.emailData.emp_name}</p>
       <p style="color:black"><b>Date of Request Resignation: </b>${resigndate}</p>
       <p style="color:black"><b>Notice Period: </b>${value.notice_period}</p>
       <p style="color:black"><b>Relieving Date: </b>${releavedate}</p>
       <p style="color:black"><b>Request Exit Date: </b>${exitdate}</p>
       <p style="color:black"><b>Notes: </b>${value.approver_comment}</p>

       <p style="color:black">Thank you for your contributions to the company during your tenure. Your hard work and dedication have been greatly appreciated.</p>
       <p style="color:black">We wish you all the best for your future endeavors.</p>
         <p style="color:black">Sincerely,<br>${value.emailData.rm_name}</p>
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       </div>
       </body>
       </html> `;
   
       var mailOptions = {
           from: 'anceplab@gmail.com',
           to: email,
           subject: 'Separation request approved  by'+' '+value.emailData.rm_name,
           html: html
       };
       transporter.sendMail(mailOptions, async function (error, info) {
           if (error) {
               console.log("Failed To Sent  Mail",error)
           } else {
               console.log("Mail Sent Successfully")
           }
   
       });
   
   }
   catch (e) {
       console.log('separationRequestApprovedEmail :', e)
     }
   
}
   
/** separation request rejected mail */

function separationRequestRejectedEmail(value) {
    try {
         let email = value.emailData.emp_email
         var transporter = nodemailer.createTransport({
           host: "smtp-mail.gmail.com", // hostname
           secureConnection: false, // TLS requires secureConnection to be false
           port: 587, // port for secure SMTP
           tls: {
               ciphers: 'SSLv3'
           },
           auth: {
             user: 'anceplab@gmail.com',
             pass: 'Anceplab@123'
           }
         });
       var html = `<html>
       <head>
       <title>Separation Request reject</title></head>
       <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">
       <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">
     
       <p style="color:black">Dear ${value.emailData.emp_name},</p>
   
       <p style="color:black">We respect your decision, but I am unable to accept your resignation immediately.  I would like to discuss your concerns about leaving the organization. Based on mutual discussion we can come to the conclusion regarding your resignation. </p>

        <p style="color:black">Thank you for your cooperation.</p>

        <p style="color:black">Sincerely,<br>${value.emailData.rm_name}</p>
       
       <hr style="border: 0; border-top: 3px double #8c8c8c"/>
       </div>
       </body>
       </html> `;
   
       var mailOptions = {
           from: 'anceplab@gmail.com',
           to: email,
           subject: 'Separation request rejected by'+' '+value.emailData.rm_name,
           html: html
       };
       transporter.sendMail(mailOptions, async function (error, info) {
           if (error) {
               console.log("Failed To Sent  Mail",error)
           } else {
               console.log("Mail Sent Successfully")
           }
   
       });
   
   }
   catch (e) {
       console.log('separationRequestRejectedEmail :', e)
     }
   
}
async function setEmployeeExcelData(req, res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
       if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            console.log("req-data--",JSON.stringify(req.body))
            listOfConnections[companyName].query("CALL `set_upload_employees` (?)",
                [JSON.stringify(req.body)], async function (err, result, fields) {
                    console.log("err-",err)
                    console.log("resss-",result)
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("ATTENDANCEAPI");
                        errorLogArray.push("setEmployeeAttendance");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                        errorLogs(errorLogArray);  
                        res.send({ status: false, message: "unableToUpload" });      
                    }
                    else {
                        res.send({ status: true, message: "excelUploadSave" })
                    }
                });

        }
        else {
           res.send({status: false,Message:'Database Name is missed'})
        }
     } 
     catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("EMSAPI");
        errorLogArray.push("setEmployeeAttendance");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
    }
}

// 
async function preonboardingSetDocumentOrImageForEMS(req, res) {
    //** for local deployment */ 
   try {
         let emailData;
         file = req.files.file;
         var localPath = JSON.parse(req.body.info);
         var folderName = localPath.filepath;
         let dataa = JSON.parse(JSON.stringify(folderName));
         if (req.body.email != undefined) {
              emailData = JSON.parse(req.body.email);
           }
         try {
             if (!fs.existsSync(folderName)) {
                 fs.mkdirSync(dataa, { recursive: true })
                 file.mv(path.resolve(__dirname,dataa,localPath.filename),function(error){
                     if(error){
                        res.send({status:false})
                     } else {
                         res.send({status:true,message:'Image Uploaded Succesfully'})
                    }
                 })
             } else {
                 try {
                     file.mv(
                         path.resolve(__dirname, folderName, localPath.filename),
                         async function (error) {
                             if (error) {
                                 res.send({ status: false });
                                 let errorLogArray = [];
                                 let companyName =req.params.companyName;
                                 let  dbName = await getDatebaseName(companyName)
                                 errorLogArray.push("EMSAPI");
                                 errorLogArray.push("setDocumentOrImageForEMS");
                                 errorLogArray.push("POST");
                                 errorLogArray.push(JSON.stringify(req.body));
                                 errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                                 errorLogArray.push(null);
                                 errorLogArray.push(companyName);
                                 errorLogArray.push(dbName);
                                 errorLogs(errorLogArray);
                                 
                             } else {
                                 res.send({
                                     status: true,
                                     message: "Image Uploaded Succesfully",
                                 });
                              }
                         });
                 } catch (err) {
                     res.send({ status: false });
                     let companyName =req.params.companyName;
                     let  dbName = await getDatebaseName(companyName)
                     let errorLogArray = [];
                     errorLogArray.push("EMSAPI");
                     errorLogArray.push("preonboardingSetDocumentOrImageForEMS");
                     errorLogArray.push("POST");
                     errorLogArray.push(JSON.stringify(req.body));
                     errorLogArray.push( e.message);
                     errorLogArray.push(null);
                     errorLogArray.push(companyName);
                     errorLogArray.push(dbName);
                     errorLogs(errorLogArray)
 
                 }
             }
         }
         catch (e) {
             res.send({status: false});
             let companyName =req.body.companyName;
             let  dbName = await getDatebaseName(companyName)
             let errorLogArray = [];
             errorLogArray.push("EMSAPI");
             errorLogArray.push("preonboardingSetDocumentOrImageForEMS");
             errorLogArray.push("POST");
             errorLogArray.push(JSON.stringify(req.body));
             errorLogArray.push( e.message);
             errorLogArray.push(null);
             errorLogArray.push(companyName);
             errorLogArray.push(dbName);
              errorLogs(errorLogArray)
         }
     } catch (e) {
          res.send({ status: false });
         let companyName =req.body.companyName;
         let  dbName = await getDatebaseName(companyName)
         let errorLogArray = [];
         errorLogArray.push("EMSAPI");
         errorLogArray.push("preonboardingSetDocumentOrImageForEMS");
         errorLogArray.push("POST");
         errorLogArray.push(JSON.stringify(req.body));
         errorLogArray.push( e.message);
         errorLogArray.push(null);
         errorLogArray.push(companyName);
         errorLogArray.push(dbName);
          errorLogs(errorLogArray)
 
     }
 
 /**For AWS Documents */
 
 // try {
 //     let emailData;
 //     file = req.files.file;
 //     var localPath = JSON.parse(req.body.info);
 //     var folderName = localPath.filepath;
 //     if (req.body.email != undefined) {
 //         emailData = JSON.parse(req.body.email);
 //     } 
 //     try {
 //       const params = {
 //         Bucket: folderName, //format:spryple/core
 //         Key: localPath.filename, // file will be saved as testBucket/contacts.csv
 //         Body: file.data
 //       };
 //       s3.upload(params, function(error, data) {
 //         if(error){
 //             res.send({status:false})
 //         }
 //         else{
 //             res.send({status:true,message:'Image Uploaded Succesfully'})
 //             if (req.body.data != "Approved") {
 //               if (emailData.rm_email !='' || emailData.rm_name !=null) [
 //                 documentApprovalEmailToHR(emailData)
 //               ]
 //             }
 //         }
 //       });
 //     } 
 //     catch (err) {
 //       console.error(err);
 //       res.send({ status: false });
 //     }
 //   } 
 //   catch (e) {
 //       console.log("setDocumentOrImageForEMS:", e);
 //       res.send({ status: false });
 //     }
   
 
 }
