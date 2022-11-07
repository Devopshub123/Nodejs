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

 }


async function getstatuslist(req,res){
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a1',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_status_list` (null)",
            function (err, result, fields) {
                console.log(err)
                if (result && result.length > 0) {
                    console.log("dfgfgh")
                    res.send({ status: true, data: result[0] })
                } else {
                    res.send({ status: false, data: [] });
                }

            })
    }
    catch(e){
        console.log('get statuslist');
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

        console.log(req.body,"vjhvhjvgvhgjvghvhgjvhg        console.log(req.body)\n")

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a2',companyName)
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
        listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)", ['designationsmaster',dbName, JSON.stringify(infoDesignationMaster)],function (err,result, fields) {
            console.log(err);
            if(err) {
                res.send({status: false, message: "Unable to insert designation"});
            }else {
                res.send({status: true, message: "Designation added successfully"})
            }
        });
    }catch (e){

        console.log('setDesignation :', e)

    }

}

/*set Designation*/
async function putDesignation(req,res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a3',companyName)
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
        listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['designationsmaster','id',req.body.id,JSON.stringify(infoDesignationMaster)], function (err, result, fields) {

            if (err) {
                res.send({status: false, message: 'Unable to update designation'});
            } else {
                res.send({status: true,message:'Designation updated successfully'})
            }
        });


    }catch (e) {
        console.log('setDesignation :',e)

    }
}

/*Set Departments*/
async function putDepartments(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a4',companyName)
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
        listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['departmentsmaster','id',req.body.id,JSON.stringify(info)], function (err, result, fields) {
            if (err) {
                res.send({ status: false,message:'Unable to update departments'});
            } else {
                res.send({status: true,message:'Department updated successfully'})
            }
        });


    }catch (e) {
        console.log('getHolidays :',e)

    }
}

/*set Department*/
async function setDepartment(req,res) {
    try {
        console.log("hgvhvhhvhv",req.body)
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a5',companyName)
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


        listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)",['departmentsmaster',dbName,JSON.stringify(info)], function (err, result, fields) {
            console.log(err)
            console.log(result,"listOfConnections[companyName]")

            if (err) {

                res.send({ status: false,message:'Unable to add department'});
            } else {
                res.send({status: true,message:'Departments added successfully'})
            }
        });


    }catch (e) {
        console.log('setmastertable :',e)

    }
}

async function updateStatus(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a6',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        if(req.body.status === 1 ||(!req.body.isexists.result && req.body.isexists.status)){
            listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)",['departmentsmaster',req.body.id,req.body.status], function (err, result, fields) {

                if (err) {
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

    }catch (e) {
        console.log('updateStatus :',e)

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
        listOfConnections= connection.checkExistingDBConnection('a7',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        if(req.body.status === 1 ||(!req.body.isexists.result && req.body.isexists.status)) {
            listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)", ['designationsmaster', req.body.id, req.body.status], function (err, result, fields) {
                if (err) {
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
    }catch (e) {
        console.log('designationStatus :',e) }
}


/*Get Work Location*/
async function getactiveWorkLocation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a8',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        var id = null;
        listOfConnections[companyName].query("CALL `getcompanyworklocation` (?)",[id], function (err, result, fields) {
            if (result && result.length > 0) {
                var data = JSON.parse((result[0][0].json))
                var resultdata=[];
                var inactive =[];
                for(var i=0;i<data.length;i++){
                    if(data[i].status == 1){
                        resultdata.push(data[i]);
                    }
                    else{
                        inactive.push(data[i])
                    }

                }
                res.send({data: resultdata, status: true});

            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getWorkLocation :',e)

    }
}

/*set Holidays*/

async function setHolidays(req,res) {

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a9',companyName)
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
                listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)",[tname,dbName,JSON.stringify(info)], function (err, result, fields) {
                    k+=1;
                    if (err) {
                        console.log(err);
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



    }catch (e) {

        console.log('setHolidays :',e)



    }

}

/*Get Holidays filter */
async function getHolidysFilter(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a10',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getholidaysbyfilter` (?,?,?,?)", [req.params.year ==='null'?null:req.params.year,req.params.locationId ==='null'?null:req.params.locationId,req.params.page,req.params.size],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getDesignation :',e)

    }
}

/**
 * Delete Holiday
 * */
async function deleteHoliday(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a11',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `deleteholidays` (?)",[req.params.holidayId], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to delete holiday'});
            } else {
                res.send({status: true, message: 'Holiday deleted successfully'})
            }
        });

    }catch (e) {
        console.log('deleteHoliday :',e)
    }
}


/*set Holidays*/
async function putHolidays(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a12',companyName)
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
        listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",[tname,'id',req.body.id,JSON.stringify(info)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update holidays'});
            } else {

                res.send({status: true, message: 'Holiday updated successfully'});
            }
        });



    }catch (e) {
        console.log('putHolidays :',e)

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
        listOfConnections= connection.checkExistingDBConnection('a13',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        let companyInformation={}
        companyInformation.CompanyName=req.body.companyname;
        companyInformation.CompanyWebsite = req.body.companywebsite;
        companyInformation.PrimaryContactNumber=req.body.primarycontactnumber;
        companyInformation.PrimaryContactEmail=req.body.primarycontactemail;
        companyInformation.Address1=req.body.address1;
        companyInformation.Address2=req.body.address2?req.body.address2:" ";
        companyInformation.Country = req.body.country;
        companyInformation.State = req.body.state;
        companyInformation.City = req.body.city;
        companyInformation.Pincode=req.body.pincode;
        companyInformation.updated_by=req.body.updated_by;
        companyInformation.updated_on=req.body.updated_on;

        listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['companyinformation','Id',req.body.id,JSON.stringify(companyInformation)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update company information'});
            } else {
                res.send({status: true, message: 'Company Information updated Successfully'})
            }
        });


    }catch (e) {
        console.log('putCompanyInformation :',e)
    }
}


/*Set comapny information*/
async function setCompanyInformation(req,res) {
    let  dbName = await getDatebaseName(req.body.companyName)
    let companyName = req.body.companyName;

    var listOfConnections = {};
    listOfConnections= connection.checkExistingDBConnection('a14',companyName)
    if(!listOfConnections.succes) {
        listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
    }
    let companyInformation={}
    companyInformation.companyname=req.body.companyname;
    companyInformation.companywebsite = req.body.companywebsite;
    companyInformation.primarycontactnumber=req.body.primarycontactnumber;
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
    try {
        listOfConnections[companyName].query("CALL `setmastertable` (?,?,?)",['companyinformation',dbName,JSON.stringify(companyInformation)],function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add company information'});
            } else {
                res.send({status: true, message: 'Company Information added successfully'})
            }
        });


    }catch (e) {
        console.log('setCompanyInformation :',e)
    }
}


/**getstates */
async function getStates(req,res){
    let id = req.params.id;
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a15',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getstatesforcountry`(?)",[id],function(error,result,fields){
            if(error){
                console.log(error)
            }
            else{
                res.send(result)
            }
        });

    }
    catch(e){
        console.log('getstates',e)
    }
}
/**get Cities */
async function getCities(req,res){
    let id = req.params.id;
    try{
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a16',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getcitiesforstate`(?)",[id],function(error,result,fields){
            if(error){
                console.log(error)
            }
            else{
                res.send(result)
            }
        });

    }
    catch(e){
        console.log('getstates',e)
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
        listOfConnections= connection.checkExistingDBConnection('a17',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getleavepolicies` (?,?)",[leaveCategoryId,isCommonRule], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch(e){
        console.log("getLeavePolicies",e)
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
        listOfConnections= connection.checkExistingDBConnection('a18',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        let infoDesignationMaster={}
        infoDesignationMaster.id = req.body.leaveId;
        infoDesignationMaster.display_name = req.body.displayName;

        listOfConnections[companyName].query("CALL `updatemastertable` (?,?,?,?)",['lm_leavesmaster','id',req.body.leaveId,JSON.stringify(infoDesignationMaster)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update designation'});
            } else {
                res.send({status: true,message:'Designation updated successfully'})
            }
        });


    }catch (e) {
        console.log('setDesignation :',e)

    }
}


async function setAdvancedLeaveRuleValues(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a19',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_advanced_leave_rule_values` (?)",[req.body.id],function (err, result, fields) {
            if (err) {
                res.send({message: 'Unable to update leave policy', status: false});
            } else {
                res.send({message: 'Rules updated successfully', status: true})
            }
        });


    }catch (e) {
        console.log('getemployeeleavebalance :',e)
    }
}


/*setToggleLeaveType */
async function setToggleLeaveType(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a20',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        let leaveId = req.body.id;
        let leavetype_status = req.body.leavetype_status;
        listOfConnections[companyName].query("CALL `toggle_leavetype` (?,?)",
            [leaveId,leavetype_status], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update leave policies status'});
                } else {
                    res.send({status: true, message: 'Leave policies status updated successfully'})
                }
            });


    }catch (e) {
        console.log('setToggleLeaveType :',e)
    }
}

async function getLeaveTypesForAdvancedLeave(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a21',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getleavetypesforadvancedleave` ()",function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getemployeeholidays :',e)
    }
}

async function setLeavePolicies(req,res) {
    let ruleData = req.body.ruleData;
    try{
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_leavepolicies` (?)",[JSON.stringify(ruleData)], function (err, result, fields) {
            console.log(JSON.stringify(ruleData));
            console.log(result);
            console.log(err);
            if(err){
                res.send({message: 'Unable to update leave policy', status: false})
            }else{
                res.send({message: "Rules updated successfully", status: true})
            }

        });
    }
    catch(e){
        console.log("setLeavePolicies",e)
    }
}

/*Get Work Location*/
async function getWorkLocation(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a23',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        var id = null;
        listOfConnections[companyName].query("CALL `getcompanyworklocation` (?)",[id], function (err, result, fields) {
            if (result.length > 0) {
                var data = JSON.parse((result[0][0].json))
                res.send({data: data, status: true});

            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getWorkLocation :',e)

    }
}



async function updateStatusall(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a24',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)){
            listOfConnections[companyName].query("CALL `updatestatus` (?,?,?)",[req.body.checktable,req.body.id,req.body.status], function (err, result, fields) {

                if (err) {
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

    }catch (e) {
        console.log('updateStatusall :',e)

    }
}

/*set Work Location*/
async function setWorkLocation(req,res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a25',companyName)
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
        listOfConnections[companyName].query("CALL `setcompanyworklocation` (?)",[data], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add work location'});
            } else {
                res.send({status: true,message:'Work Location added successfully'})
            }
        });


    }catch (e) {
        console.log('setWorkLocation :',e)

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
        listOfConnections= connection.checkExistingDBConnection('a26',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,req.body.biometric_id, req.body.calendar_date],
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
}

/**
 *
 *@param boon_emp_id *@param biometric_id */

async function setIntegrationEmpidsLookup(req, res) {

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a27',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }

        listOfConnections[companyName].query("CALL `set_integration_empids_lookup` (?,?)", [req.body.boon_emp_id,parseInt(req.body.biometric_id), req.body.calendar_date],
            function (err, result, fields) {
                if (result && result.length > 0) {
                    res.send({ status: true, message: 'Mapping added successfully.' })
                } else {
                    res.send({ status: false, message: 'Unable to Mapping.' });
                }
            })
    } catch (e) {
        console.log('set_integration_empids_lookup');
    }
}


//**@param code ,*@param pagenumber, @param pagesize **/
async function getAttendenceMessages(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a28',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_attendance_messages` (?,?,?)", [req.body.code,
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
}


//**@param jsonData */
async function setAttendenceMessages(req, res) {
    let data = JSON.stringify(req.body)
    try {
        let  dbName = await getDatebaseName(req.body[0].companyName)
        let companyName = req.body[0].companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a29',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_attendance_messages` (?)", [data],
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
}


/**Get All Active Shifts */
async function getActiveShiftIds(req, res) {

    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('a29',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_active_shift_ids`", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ data: [],status: false })
            }
        });


    } catch (e) {
        console.log('getActiveShiftIds :', e)

    }
}


async function setShiftMaster(req, res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_shift_master` (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.shift_name, req.body.shiftdescription, req.body.from_time, req.body.to_time,
                req.body.total_hours, req.body.grace_intime, req.body.grace_outtime, req.body.max_lates, req.body.leave_deduction_count,
                req.body.leavetype_for_deduction, req.body.overtimeduration,req.body.status,req.body.created_by], function (err, result, fields) {

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
}
/**Get All SHifts */
async function getAllShifts(req, res) {

    try {


        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_all_shifts`", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('get_all_shifts :', e)

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
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `update_shift_status` (?,?)", [req.body.shift_id,req.body.status_value], function (err, result, fields) {

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
}


/**Get getShiftsDetailsById
 **@shift_id  parameters
 * **/

async function getShiftsDetailsById(req, res) {

    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_shifts_details_by_id` (?)", [req.params.shift_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({ data: result[0], status: true });
            } else {
                res.send({ status: false })
            }
        });


    } catch (e) {
        console.log('get_shifts_details_by_id :', e)

    }
}


/**EMS messagemaster */
async function getEMSMessages(req, res) {
    try {

        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_ems_messages` (?,?,?)", [req.body.code,
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
}
async function setEMSMessages(req, res) {
    let data = JSON.stringify(req.body)
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_ems_messages` (?)", [data],
            function (err, result, fields) {
                if (err) {
                    res.send({ status: false, data: "unableToSave" })
                } else {
                    res.send({ status: true, data:"dataSaved" });
                }
            })
    } catch (e) {
        console.log('set_ems_messages');
    }
}


/*Get Modules Screens Master*/
async function getModulesWithScreens(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_modules_screens` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0][0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('get_modules_screens :',e)
    }
}

/*Get Screens Functionalities*/
async function getScreenWithFunctionalities(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_screens_functionalities` (?)",[req.params.moduleId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0][0], status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('get_screens_functionalities :',e)
    }
}


/*Get Role Screen Functionalities By Role Id*/
async function getRoleScreenfunctionalitiesByRoleId(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `get_screens_functionalities_for_role` (?)",[req.params.roleId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
}

/*Get Role Master*/
async function getrolemaster(req,res) {
    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getrolemaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getrolemaster :',e)
    }
}


/*Get Screen Master*/
async function getscreensmaster(req,res) {
    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getscreensmaster` (?)",['4'], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getscreensmaster :',e)
    }
}


/*Get Functionalities Master*/
async function getfunctionalitiesmaster(req,res) {
    try {

        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });


    }catch (e) {
        console.log('getfunctionalitiesmaster :',e)
    }
}
/*Get Screen Functionalities Master*/
async function getscreenfunctionalitiesmaster(req,res) {
    try {
        let  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `getscreenfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
}

/*setRoleAccess */
async function setRoleAccess(req,res) {
    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `set_role_access` (?)",[JSON.stringify(req.body)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update role permissions'});
            } else {
                res.send({status: true, message: 'Role permissions updated successfully'})
            }
        });
    }catch (e) {
        console.log('setRoleAccess :',e)
    }
}

/*setRoleMaster */
async function setRoleMaster(req,res){

    try {
        let  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        listOfConnections= connection.checkExistingDBConnection('at22',companyName)
        if(!listOfConnections.succes) {
            listOfConnections[companyName]=await connection.getNewDBConnection(companyName,dbName);
        }
        listOfConnections[companyName].query("CALL `setrolemaster` (?)",[req.body.roleName], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add role name'});
            } else {
                res.send({status: true, message: 'Role name successfully'})
            }
        });


    }catch (e) {
        console.log('setRoleMaster :',e)
    }
}