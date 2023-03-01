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









 module.exports = {
     getstatuslist:getstatuslist,
     setDesignation:setDesignation,
     putDesignation:putDesignation,
     putDepartments:putDepartments,
     setDepartment:setDepartment,
     updateStatus:updateStatus,
     designationStatus:designationStatus,
     getactiveWorkLocation:getactiveWorkLocation,
     setHolidays:setHolidays,
     getHolidysFilter:getHolidysFilter,
     deleteHoliday:deleteHoliday,
     putHolidays:putHolidays,
     putCompanyInformation:putCompanyInformation,
     setCompanyInformation:setCompanyInformation,
     getStates:getStates,
     getCities:getCities,
     getLeavePolicies:getLeavePolicies,
     updateLeaveDisplayName:updateLeaveDisplayName,
     setAdvancedLeaveRuleValues:setAdvancedLeaveRuleValues,
     setToggleLeaveType:setToggleLeaveType,
     getLeaveTypesForAdvancedLeave:getLeaveTypesForAdvancedLeave,
     setLeavePolicies:setLeavePolicies,
     getWorkLocation:getWorkLocation,
     updateStatusall:updateStatusall,
     setWorkLocation:setWorkLocation,
     getIntegrationEmpidsLookup:getIntegrationEmpidsLookup,
     setIntegrationEmpidsLookup:setIntegrationEmpidsLookup,
     getAttendenceMessages:getAttendenceMessages,
     setAttendenceMessages:setAttendenceMessages,
     getActiveShiftIds:getActiveShiftIds,
     updateShiftStatus:updateShiftStatus,
     getAllShifts:getAllShifts,
     setShiftMaster:setShiftMaster,
     getShiftsDetailsById:getShiftsDetailsById,
     getEMSMessages:getEMSMessages,
     setEMSMessages:setEMSMessages,
     getModulesWithScreens:getModulesWithScreens,
     getScreenWithFunctionalities:getScreenWithFunctionalities,
     getRoleScreenfunctionalitiesByRoleId:getRoleScreenfunctionalitiesByRoleId,
     getrolemaster:getrolemaster,
     getscreensmaster:getscreensmaster,
     getfunctionalitiesmaster:getfunctionalitiesmaster,
     getscreenfunctionalitiesmaster:getscreenfunctionalitiesmaster,
     setRoleAccess:setRoleAccess,
     setRoleMaster:setRoleMaster,
     getReportingManager:getReportingManager,
     getrolescreenfunctionalities:getrolescreenfunctionalities,
     setHolidaysMaster: setHolidaysMaster,
     errorLogs:errorLogs

 }


async function getstatuslist(req,res){
    try{
        let  dbName = await getDatebaseName(req.params.companyName);
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_status_list` (null)",
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("getstatuslist");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.params));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false, data: [] });
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
              }  else {
            res.send({status: false,Message:'Database Name is missed'})
            }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getstatuslist");
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

/*set Designation*/
async function setDesignation(req,res) {
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let infoDesignationMaster = {}
            infoDesignationMaster.designation= req.body.designationName;
            infoDesignationMaster.status= 1;
            infoDesignationMaster.created_by=req.body.created_by;
            infoDesignationMaster.created_on= req.body.created_on;
            infoDesignationMaster.updated_on=null;
            infoDesignationMaster.updated_by= null;
            listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)", ['designationsmaster',dbName, JSON.stringify(infoDesignationMaster)],async function (err,result, fields) {
               if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setDesignation");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                    res.send({status: false, message: "Unable to insert designation"});
                }else {
                    res.send({status: true, message: "Designation added successfully"})
                }
            });
    }  else {
            res.send({status: false,Message:'Database Name is missed'})
    }
    }catch (e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setDesignation");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }

}

/*set Designation*/
async function putDesignation(req,res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let infoDesignationMaster={}
            infoDesignationMaster.designation=req.body.name;
            infoDesignationMaster.status = req.body.status;
            infoDesignationMaster.created_on = req.body.created_on;
            infoDesignationMaster.created_by = req.body.created_by;
            infoDesignationMaster.updated_on = req.body.updated_on;
            infoDesignationMaster.updated_by = req.body.updated_by;
            listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)", ['designationsmaster', 'id', req.body.id, JSON.stringify(infoDesignationMaster)],
                async function (err, result, fields) {
console.log("err--",err)
console.log("result--",result)
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("putDesignation");
                    errorLogArray.push("PUT");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update designation'});
                } else {
                    res.send({status: true,message:'Designation updated successfully'})
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("putDesignation");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/*Set Departments*/
async function putDepartments(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let info={}
            info.id=req.body.id;
            info.deptname=req.body.name;
            info.depthead=null
            info.headcount=0;
            info.status = req.body.status;
            info.created_on = req.body.created_on;
            info.created_by = req.body.created_by;
            info.updated_on = req.body.updated_on;
            info.updated_by = req.body.updated_by;
            listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['departmentsmaster','id',req.body.id,JSON.stringify(info)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("putDepartments");
                    errorLogArray.push("PUT");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false,message:'Unable to update departments'});
                } else {
                    res.send({status: true,message:'Department updated successfully'})
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("putDepartments");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/*set Department*/
async function setDepartment(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let info={}
            // info.DeptId=20,
            info.deptname=req.body.departmentName;
            info.depthead=null;
            info.headcount=null;
            info.status=1;
            info.created_by=req.body.created_by;
            info.created_on = req.body.created_on;
            info.updated_on=null;
            info.updated_by = null;


            listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)",['departmentsmaster',dbName,JSON.stringify(info)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("setDepartment");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false,message:'Unable to add department'});
                } else {
                    res.send({status: true,message:'Departments added successfully'})
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setDepartment");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

async function updateStatus(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            if(req.body.status === 1 ||(!req.body.isexists.result && req.body.isexists.status)){
                listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)", ['departmentsmaster', req.body.id, req.body.status],
                    async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("updateStatus");
                        errorLogArray.push("PUT");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("updateStatus");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/**
 * Update designation status
 * @id
 * @status
 *
 * */
async function designationStatus(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            if(req.body.status === 1 ||(!req.body.isexists.result && req.body.isexists.status)) {
                listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)", ['designationsmaster', req.body.id, req.body.status],
                    async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("designationStatus");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({status: false, message: 'Unable to update designation status'});
                    } else {
                        res.send({status: true, message: 'Designation is '+req.body.status+' successfully'})
                    }
                });

            }else if(req.body.isexists.status == false){
                res.send({status: false, message: "We are unable to "+req.body.status+" this designation please try again later"});
            } else{
                res.send({status: false, message: "This designation have active employees. So we are unable to inactivate this designation now. Please move those employee to another designation and try again"});
            }
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("designationStatus");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    
    }
}


/*Get Work Location*/
async function getactiveWorkLocation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            var id = null;
            listOfConnections[companyName].query("CALL `getcompanyworklocation` (?)", [id],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getactiveWorkLocation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result && result.length > 0) {
                        var data = JSON.parse((result[0][0].json))
                        var resultdata = [];
                        var inactive = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].status == 1) {
                                resultdata.push(data[i]);
                            }
                            else {
                                inactive.push(data[i])
                            }

                        }
                        res.send({ data: resultdata, status: true });

                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getactiveWorkLocation");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/*set Holidays*/

async function setHolidays(req,res) {

    try {
        let  dbName = await getDatebaseName(req.body[0].companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            // switchDatabase(req.params.companyName);
            let tname='holidaysmaster';
            let info={}
            let reqData=req.body;
            let k=0;
            if(req.body.holidayDate == null){
                reqData.forEach(element =>{
                    info.description=element.description;
                    info.date=element.date;
                    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    let hDate = (new Date(element.date));
                    info.date = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
                    info.day=days[hDate.getDay()];

                    info.year=hDate.getFullYear();
                    info.leave_cycle_year =(new Date().getFullYear())

                    info.location=element.location;
                    info.created_by = element.created_by;
                    info.created_on = element.created_on;
                    info.updated_by = null;
                    info.updated_on = null;
                    listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)", [tname, dbName, JSON.stringify(info)],
                        async function (err, result, fields) {
                        k+=1;
                        if (err) {
                            let errorLogArray = [];
                            errorLogArray.push("AdminAPI");
                            errorLogArray.push("setHolidays");
                            errorLogArray.push("POST");
                            errorLogArray.push(JSON.stringify(req.body));
                            errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                            errorLogArray.push(null);
                            errorLogArray.push(companyName);
                            errorLogArray.push(dbName);
                             errorLogs(errorLogArray);
                           res.send({status: false, message: 'Unable to insert holidays'});
                        } else {
                            if(k===reqData.length) {
                                res.send({status: true, message: 'Holidays added successfully'});
                            }
                        }
                    });
                });
            }else{
                res.send({status: false, message: 'Unable to insert holidays'});
            }
        }  else {
             res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setHolidays");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)  }

}

/*Get Holidays filter */
async function getHolidysFilter(req, res) {
     try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getholidaysbyfilter` (?,?,?,?)", [req.params.year === 'null' ? null : req.params.year, req.params.locationId === 'null' ? null : req.params.locationId, req.params.page, req.params.size],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getHolidysFilter");
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getHolidysFilter");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}

/**
 * Delete Holiday
 * */
async function deleteHoliday(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `deleteholidays` (?)",[req.params.holidayId], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("deleteHoliday");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to delete holiday'});
                } else {
                    res.send({status: true, message: 'Holiday deleted successfully'})
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("deleteHoliday");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    
    }
}


/*set Holidays*/
async function putHolidays(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            // switchDatabase(req.params.companyShortName)
            var con  =connection.switchDatabase(req.params.companyShortName);
            let tname='holidaysmaster';
            let info={};
            info.description=req.body.description;
            info.date=req.body.date;
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let hDate = (new Date(req.body.date));
            info.date = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
            info.day=days[hDate.getDay()];
            info.year=hDate.getFullYear();
            info.location=req.body.branch;
            info.created_by=req.body.created_by;
            info.created_on = req.body.created_on;
            info.updated_on = req.body.updated_on;
            info.updated_by = req.body.updated_by;
            listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",[tname,'id',req.body.id,JSON.stringify(info)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("putHolidays");
    errorLogArray.push("PUT");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update holidays'});
                } else {

                    res.send({status: true, message: 'Holiday updated successfully'});
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("putHolidays");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**
 * put comapny information
 * **/
async function putCompanyInformation(req,res) {

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let companyInformation={}
            companyInformation.CompanyName=req.body.companyname;
            companyInformation.CompanyWebsite = req.body.companywebsite;
            companyInformation.cin = req.body.cin;
            companyInformation.gstnumber = req.body.gstnumber;
            companyInformation.established_date = req.body.established_date;
            companyInformation.primarycontactnumber=req.body.primarycontactnumber;
            companyInformation.secondarycontactnumber=req.body.secondarycontactnumber;
            companyInformation.PrimaryContactEmail=req.body.primarycontactemail;
            companyInformation.Address1=req.body.address1;
            companyInformation.Address2=req.body.address2?req.body.address2:" ";
            companyInformation.Country = req.body.country;
            companyInformation.State = req.body.state;
            companyInformation.City = req.body.city;
            companyInformation.Pincode=req.body.pincode;
            companyInformation.updated_by=req.body.updated_by;
            companyInformation.updated_on=req.body.updated_on;

            listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['companyinformation','Id',req.body.id,JSON.stringify(companyInformation)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("putCompanyInformation");
                    errorLogArray.push("PUT");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update company information'});
                } else {
                    res.send({status: true, message: 'Company Information updated Successfully'})
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("putCompanyInformation");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*Set comapny information*/
async function setCompanyInformation(req,res) {
    let  dbName = await getDatebaseName(req.body.companyName)
    let companyName = req.body.companyName;

    var listOfConnections = {};
    if(dbName){
        try {
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let companyInformation={}
            companyInformation.companyname=req.body.companyname;
            companyInformation.companywebsite = req.body.companywebsite;
            companyInformation.cin = req.body.cin;
            companyInformation.gstnumber = req.body.gstnumber;
            companyInformation.established_date = req.body.established_date;
            companyInformation.primarycontactnumber=req.body.primarycontactnumber;
            companyInformation.secondarycontactnumber=req.body.secondarycontactnumber;
            companyInformation.primarycontactemail=req.body.primarycontactemail;
            companyInformation.address1=req.body.address1;
            companyInformation.address2=req.body.address2?req.body.address2:'';
            companyInformation.country = req.body.country;
            companyInformation.state = req.body.state;
            companyInformation.city = req.body.city;
            companyInformation.pincode=req.body.pincode;
            companyInformation.created_by=req.body.created_by;
            companyInformation.created_on = req.body.created_on;
            companyInformation.updated_on = null;
            companyInformation.updated_by = null;
            listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)", ['companyinformation', req.body.companyDBName, JSON.stringify(companyInformation)],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("setCompanyInformation");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to add company information'});
                } else {
                    res.send({status: true, message: 'Company Information added successfully'})
                }
            });


        }catch (e) {
            let companyName =req.body.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("AdminAPI");
            errorLogArray.push("setCompanyInformation");
            errorLogArray.push("POST");
            errorLogArray.push(JSON.stringify(req.body));
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             errorLogs(errorLogArray)
        }
    }  else {
        res.send({status: false,Message:'Database Name is missed'})
    }
}


/**getstates */
async function getStates(req,res){
    let id = req.params.id;
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getstatesforcountry`(?)",[id],async function(error,result,fields){
                if(error){
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getStates");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status:false})
                }
                else{
                    res.send({data: result[0], status: true});
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getStates");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/**get Cities */
async function getCities(req,res){
    let id = req.params.id;
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getcitiesforstate`(?)", [id],
                async function (error, result, fields) {
                if(error){
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getCities");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status:false})
                }
                else{
                    res.send({data: result[0], status: true});
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }
    catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getCities");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


//get Leavepolices
async function getLeavePolicies(req,res) {
    let leaveCategoryId;
    let isCommonRule = req.params.isCommonRule;
    if (req.params.leaveCategoryId == 'null' && isCommonRule == 'true') {
        leaveCategoryId = null;
        isCommonRule = (isCommonRule == 'true')
    }
    else if (req.params.leaveCategoryId == 'null' && isCommonRule == 'false')
    {
        leaveCategoryId = null;
        isCommonRule = (isCommonRule == 'true')
    }
    else {
        leaveCategoryId = req.params.leaveCategoryId;
        isCommonRule = null;
    }
    let pageNumber = req.params.pageNumber;
    let pageSize = req.params.pageSize;
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getleavepolicies` (?,?)", [leaveCategoryId, isCommonRule],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getLeavePolicies");
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch(e){
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getLeavePolicies");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }

}


/**
 *  updateLeaveDisplayName
 *  */
async function updateLeaveDisplayName(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let infoDesignationMaster={}
            infoDesignationMaster.id = req.body.leaveId;
            infoDesignationMaster.display_name = req.body.displayName;

            listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['lm_leavesmaster','id',req.body.leaveId,JSON.stringify(infoDesignationMaster)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("updateLeaveDisplayName");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update designation'});
                } else {
                    res.send({status: true,message:'Designation updated successfully'})
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("updateLeaveDisplayName");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray) }
}


async function setAdvancedLeaveRuleValues(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_advanced_leave_rule_values` (?)",[req.body.id],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setAdvancedLeaveRuleValues");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                    res.send({message: 'Unable to update leave policy', status: false});
                } else {
                    res.send({message: 'Rules updated successfully', status: true})
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setAdvancedLeaveRuleValues");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*setToggleLeaveType */
async function setToggleLeaveType(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            let leaveId = req.body.id;
            let leavetype_status = req.body.leavetype_status;
            listOfConnections[companyName].query("CALL `toggle_leavetype` (?,?)",
                [leaveId, leavetype_status],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setToggleLeaveType");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                        res.send({status: false, message: 'Unable to update leave policies status'});
                    } else {
                        res.send({status: true, message: 'Leave policies status updated successfully'})
                    }
                });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setToggleLeaveType");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function getLeaveTypesForAdvancedLeave(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getleavetypesforadvancedleave` ()",
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getLeaveTypesForAdvancedLeave");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getLeaveTypesForAdvancedLeave");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

async function setLeavePolicies(req,res) {
    let ruleData = req.body.ruleData;
    console.log("rdata--",ruleData)
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `setleavepolicies` (?)",[JSON.stringify(ruleData)], async function (err, result, fields) {

            if (err) {
                let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setLeavePolicies");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
    errorLogs(errorLogArray);
                res.send({message: 'Unable to update leave policy', status: false})
            }else{
                res.send({message: "Rules updated successfully", status: true})
            }

        });
    }  else {
            res.send({status: false,Message:'Database Name is missed'})
    }
    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setLeavePolicies");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*Get Work Location*/
async function getWorkLocation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            var id = null;
            listOfConnections[companyName].query("CALL `getcompanyworklocation` (?)",[id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getWorkLocation");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        var data = JSON.parse((result[0][0].json))
                        res.send({ data: data, status: true });

                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getWorkLocation");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}



async function updateStatusall(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)){
                listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)",[req.body.checktable,req.body.id,req.body.status], async function (err, result, fields) {

                    if (err) {
                        let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("updateStatusall");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("updateStatusall");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*set Work Location*/
async function setWorkLocation(req,res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            if(req.body.id == "" || req.body.id == null){
                let infoLocationsMaster={
                    id:req.body.id,
                    branchCode:'',
                    address1:req.body.address1?req.body.address1:"",
                    address2:req.body.address2?req.body.address2:"",
                    location:req.body.location?req.body.location:"",
                    pincode:req.body.pincode?req.body.pincode:"",
                    city:req.body.cityId,
                    state:req.body.stateId,
                    country:req.body.country,
                    prefix:req.body.prefix?req.body.prefix:"",
                    seed:req.body.seed,
                    status:req.body.status?req.body.status:1,
                    created_by:req.body.created_by
                }
            }
            else{
                let infoLocationsMaster={
                    id:req.body.id,
                    branchCode:'',
                    address1:req.body.address1?req.body.address1:"",
                    address2:req.body.address2?req.body.address2:"",
                    location:req.body.location?req.body.location:"",
                    pincode:req.body.pincode?req.body.pincode:"",
                    city:req.body.cityId,
                    state:req.body.stateId,
                    country:req.body.country,
                    prefix:req.body.prefix?req.body.prefix:"",
                    seed:req.body.seed,
                    status:req.body.status?req.body.status:1,
                    updated_by:req.body.created_by
                }
            }

            let data = JSON.stringify(req.body)
            listOfConnections[companyName].query("CALL `setcompanyworklocation` (?)",[data], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setWorkLocation");
    errorLogArray.push("POST");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to add work location'});
                } else {
                    res.send({status: true,message:'Work Location added successfully'})
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setWorkLocation");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**
 *
 *@param boon_emp_id *@param biometric_id */
async function getIntegrationEmpidsLookup(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,req.body.biometric_id, req.body.calendar_date],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("getTerminationCategory");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getTerminationCategory");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**
 *
 *@param boon_emp_id *@param biometric_id */

async function setIntegrationEmpidsLookup(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,parseInt(req.body.biometric_id), req.body.calendar_date],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("setIntegrationEmpidsLookup");
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
                            res.send({ status: true, message: 'Mapping added successfully.' })
                        } else {
                            res.send({ status: false, message: 'Unable to Mapping.' });
                        }
                    }
                })
            }  else {
            res.send({status: false,Message:'Database Name is missed'})
            }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setIntegrationEmpidsLookup");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    
    }
}


//**@param code ,*@param pagenumber, @param pagesize **/
async function getAttendenceMessages(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_attendance_messages` (?,?,?)", [req.body.code,
                    req.body.pagenumber,req.body.pagesize],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("getAttendenceMessages");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getAttendenceMessages");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


//**@param jsonData */
async function setAttendenceMessages(req, res) {
    let data = JSON.stringify(req.body)
    try {
        let  dbName = await getDatebaseName(req.body[0].companyName)
        let companyName = req.body[0].companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_attendance_messages` (?)", [data],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("setAttendenceMessages");
    errorLogArray.push("POST");
    errorLogArray.push(data);
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
                        res.send({ status: false, data: "unableToSave" })
                    } else {
                        res.send({ status: true, data:"dataSaved" });
                    }
                })
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body[0].companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setAttendenceMessages");
        errorLogArray.push("POST");
        errorLogArray.push(data);
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/**Get All Active Shifts */
async function getActiveShiftIds(req, res) {

    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_shift_ids`",
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getActiveShiftIds");
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
                        res.send({ data: [], status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getActiveShiftIds");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


async function setShiftMaster(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_shift_master` (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [req.body.shift_name, req.body.shiftdescription, req.body.from_time, req.body.to_time,
                    req.body.total_hours, req.body.grace_intime, req.body.grace_outtime, req.body.max_lates, req.body.leave_deduction_count,
                    req.body.leavetype_for_deduction, req.body.overtimeduration,req.body.status,req.body.created_by], async function (err, result, fields) {

                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("setShiftMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false, message: 'UnableToSave' });
                    } else {
                        if (result[0][0].validity_status == 0) {
                            res.send({ status: true, message: "duplicateData"})
                        } else {
                            res.send({ status: true, message: "dataSave" })
                        }
                    }
                });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setShiftMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/**Get All SHifts */
async function getAllShifts(req, res) {

    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_all_shifts`", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getAllShifts");
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

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getAllShifts");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/**Update Shift Status
 **@shift_id  parameters
 **@status_value parameters

 * **/

async function updateShiftStatus(req, res) {

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `update_shift_status` (?,?)", [req.body.shift_id,req.body.status_value], async function (err, result, fields) {

                if (err) {
                    let errorLogArray = [];
    errorLogArray.push("AdminAPI");
    errorLogArray.push("updateShiftStatus");
    errorLogArray.push("PUT");
    errorLogArray.push(JSON.stringify(req.body));
    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
    errorLogArray.push(null);
    errorLogArray.push(companyName);
    errorLogArray.push(dbName);
     errorLogs(errorLogArray);
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("updateShiftStatus");
        errorLogArray.push("PUT");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/**Get getShiftsDetailsById
 **@shift_id  parameters
 * **/

async function getShiftsDetailsById(req, res) {

    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_shifts_details_by_id` (?)", [req.params.shift_id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getShiftsDetailsById");
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
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    } catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getShiftsDetailsById");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/**EMS messagemaster */
async function getEMSMessages(req, res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_ems_messages` (?,?,?)", [req.body.code,
                    req.body.pagenumber,req.body.pagesize],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("getEMSMessages");
                        errorLogArray.push("GET");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                        if (result && result.length > 0) {
                            res.send({ status: true, data: result[0] })
                        } else {
                            res.send({ status: false, data: [] });
                        }
                    }
                })
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getEMSMessages");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
async function setEMSMessages(req, res) {
    let data = JSON.stringify(req.body);
     try {
        let  dbName = await getDatebaseName(req.body[0].companyName)
        let companyName = req.body[0].companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_ems_messages` (?)", [data],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("setEMSMessages");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({status:false})
                        res.send({ status: false, data: "unableToSave" })
                    } else {
                        res.send({ status: true, data:"dataSaved" });
                    }
                })
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    } catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setEMSMessages");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*Get Modules Screens Master*/
async function getModulesWithScreens(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_modules_screens` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getModulesWithScreens");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result[0][0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getModulesWithScreens");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*Get Screens Functionalities*/
async function getScreenWithFunctionalities(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_screens_functionalities` (?)",[req.params.moduleId], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getScreenWithFunctionalities");
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
                        res.send({ data: result[0][0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getScreenWithFunctionalities");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*Get Role Screen Functionalities By Role Id*/
async function getRoleScreenfunctionalitiesByRoleId(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_screens_functionalities_for_role` (?)",[req.params.roleId], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getRoleScreenfunctionalitiesByRoleId");
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
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getRoleScreenfunctionalitiesByRoleId");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*Get Role Master*/
async function getrolemaster(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getrolemaster` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getrolemaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getrolemaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*Get Screen Master*/
async function getscreensmaster(req,res) {
    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getscreensmaster` (?)", ['4'],
                async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getscreensmaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getscreensmaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}


/*Get Functionalities Master*/
async function getfunctionalitiesmaster(req,res) {
    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getfunctionalitiesmaster` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getfunctionalitiesmaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getfunctionalitiesmaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}
/*Get Screen Functionalities Master*/
async function getscreenfunctionalitiesmaster(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `getscreenfunctionalitiesmaster` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getscreenfunctionalitiesmaster");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.params));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                } else {
                    if (result.length > 0) {
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getscreenfunctionalitiesmaster");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*setRoleAccess */
async function setRoleAccess(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_role_access` (?)",[JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("setRoleAccess");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update role permissions'});
                } else {
                    res.send({status: true, message: 'Role permissions updated successfully'})
                }
            });
        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setRoleAccess");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    
    }
}

/*setRoleMaster */
async function setRoleMaster(req,res){

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `setrolemaster` (?)",[req.body.roleName], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("setRoleMaster");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to add role name'});
                } else {
                    res.send({status: true, message: 'Role name successfully'})
                }
            });

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setRoleMaster");
        errorLogArray.push("POST");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/**getreportingmanagers */
async function getReportingManager(req,res){
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName) {
            listOfConnections = connection.checkExistingDBConnection( companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `getreportingmanagers`(?)", [req.body.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getReportingManager");
                    errorLogArray.push("GET");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);
                    res.send({ status: false })
                }
                else {
                    res.send(result)
                }

            });
        }else {
            res.send({status: false,Message:'Database Name is missed'})
        }

    }
    catch(e){
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getReportingManager");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.body));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/*Get Role Screen Functionalities*/
async function getrolescreenfunctionalities(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName) {
            listOfConnections = connection.checkExistingDBConnection(companyName)
            if (!listOfConnections.succes) {
                listOfConnections[companyName] = await connection.getNewDBConnection(companyName, dbName);
            }
            listOfConnections[companyName].query("CALL `getrolescreenfunctionalities` (?,?)", [req.params.roleId, '2'], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("AdminAPI");
                    errorLogArray.push("getrolescreenfunctionalities");
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
                        res.send({ data: result, status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
            });
        }else {
            res.send({status: false,Message:'Database Name is missed'})
            }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("getrolescreenfunctionalities");
        errorLogArray.push("GET");
        errorLogArray.push(JSON.stringify(req.params));
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         errorLogs(errorLogArray)
    }
}

/** set holidays */
async function setHolidaysMaster(req,res){

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query(
                "CALL `set_holidays_master` (?,?,?,?,?,?)",
                 [
                   req.body.hid ,
                   req.body.holiday_year,
                   req.body.holiday_description,
                    req.body.holiday_date,
                    JSON.stringify(req.body.holiday_location),
                    req.body.createdby
                 ],
                async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("AdminAPI");
                        errorLogArray.push("setHolidaysMaster");
                        errorLogArray.push("POST");
                        errorLogArray.push(JSON.stringify(req.body));
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         errorLogs(errorLogArray);
                        res.send({ status: false })
                    } else {
                        if (result && result[0][0].successstate == 0) {
                            res.send({ status: true, data: result[0][0].successstate });
                        } else if (result && result[0][0].successstate == 1) {
                            res.send({ status: true, data: result[0][0].successstate });
                        }
                        else {
                            res.send({ status: false })
                        }
                    }
                  })

        }  else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("AdminAPI");
        errorLogArray.push("setHolidaysMaster");
        errorLogArray.push("POST");
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
