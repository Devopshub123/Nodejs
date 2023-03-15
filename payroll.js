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
module.exports = {
    employeeprofessionaltax:employeeprofessionaltax,
    employerprofessionaltax:employerprofessionaltax,
    getesidetails:getesidetails,
    getpayrollsections:getpayrollsections,
    getearningsalarycomponent:getearningsalarycomponent,
    getdeductionsalarycomponent:getdeductionsalarycomponent,
    getpayrollincomegroups:getpayrollincomegroups,
    getsalarycomponentsforpaygroup:getsalarycomponentsforpaygroup,
    setincomegroup:setincomegroup,
    getErrorMessages:getErrorMessages,
    setErrorMessages:setErrorMessages,
    getEmployeeDurationsForSalaryDisplay:getEmployeeDurationsForSalaryDisplay,
    getCtcDetails:getCtcDetails,
    getEmployeeInvestments:getEmployeeInvestments,
    deleteEmployeeInvestments:deleteEmployeeInvestments,
    setEmployeeInvestments:setEmployeeInvestments,
    getComponentEditableConfigurations:getComponentEditableConfigurations,
    configurePayGroupComponent:configurePayGroupComponent,
    getPayGroupComponentValues:getPayGroupComponentValues,
    editPayGroupComponent:editPayGroupComponent,
    getEmployeesListForInvestmentsApproval:getEmployeesListForInvestmentsApproval,
    getEmployerEpfContributionOptions:getEmployerEpfContributionOptions,
    getEmployeeEpfContributionOptions:getEmployeeEpfContributionOptions,
    setCompanyEpfValues:setCompanyEpfValues,
    getStatutoryMaxPfWageForEmployerContribution:getStatutoryMaxPfWageForEmployerContribution,
    getCompanyPaySchedule:getCompanyPaySchedule,
    setCompanyPaySchedule:setCompanyPaySchedule,
    updateMonthlySalary:updateMonthlySalary,
    getFinancialYears:getFinancialYears,
    MonthYear:MonthYear,
    getEpfDetails:getEpfDetails,
    getEmployeeListForSalaryProcessing:getEmployeeListForSalaryProcessing,
    getEmployeesForAssignPaygroup:getEmployeesForAssignPaygroup,
    getPayGroupsForCtc:getPayGroupsForCtc,
    getActiveComponentsValuesForPayGroup:getActiveComponentsValuesForPayGroup,
    assignPayGroup:assignPayGroup,
    getComponentWiseValuesForPayGroupAssignment:getComponentWiseValuesForPayGroupAssignment,
    getEmployeePaySlips:getEmployeePaySlips,
    getEmployeePayslipDetails:getEmployeePayslipDetails,
    getEmployeeEpfDetails:getEmployeeEpfDetails,
    getMonthlyPayrollData:getMonthlyPayrollData,
    getMonthlyPayrollDataForGraph:getMonthlyPayrollDataForGraph,
    getComponentConfiguredValuesForPayGroup:getComponentConfiguredValuesForPayGroup,
    otherAllowancePopup:otherAllowancePopup,
    getStateForEsi:getStateForEsi,
    setCompanyEsiValues:setCompanyEsiValues,
    setEsiForState:setEsiForState,
    getCompanyEsiValues:getCompanyEsiValues,
    getEsiEmployerContribution: getEsiEmployerContribution,
    getEmployeeCtcDurations: getEmployeeCtcDurations,
    validateSalaryProcessingDate:validateSalaryProcessingDate
    
};
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
/**Employee professional tax */
async function employeeprofessionaltax(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_professional_tax_details` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("employeeprofessionaltax");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result &&result[0] && result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("employeeprofessionaltax");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray)

    }
}
/**Employer Professional tax */

async function employerprofessionaltax(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employer_professional_tax_details` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("employerprofessionaltax");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result &&result[0] && result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }
                }
               
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('employerprofessionaltax :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("employerprofessionaltax");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray)

    }
}
/**Get Esi Details */
async function getesidetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_esi_details` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getesidetails");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result &&result[0] && result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }
                    
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getesidetails :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getesidetails");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**getpayrollsections */
async function getpayrollsections(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_payroll_sections` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getesidetails");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result && result[0]&& result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getpayrollsections :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getpayrollsections");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/** getearningsalarycomponent*/

async function getearningsalarycomponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components` (?)", [req.params.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getesidetails");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                     if(result && result[0]&& result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getearningsalarycomponent :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getearningsalarycomponent");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/** getdeductionsalarycomponent*/
async function getdeductionsalarycomponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components` (?)", [req.params.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getdeductionsalarycomponent");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result && result[0]&& result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getdeductionsalarycomponent :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getdeductionsalarycomponent");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getpayroll incomegroups */
async function getpayrollincomegroups(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_payroll_income_groups` ()", [], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getpayrollincomegroups");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                } 
                else{
                    if(result &&result[0] && result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getdeductigetpayrollincomegroupsonsalarycomponent :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getdeductigetpayrollincomegroupsonsalarycomponent");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);
        

    }
}

// app.post('/api/getpayrollincomegroups',function(req,res){
//     try{
//         con.query("CALL `get_payroll_income_groups` ()", [], function (err, result, fields) {
//             if(result &&result[0] && result[0].length>0){
//                 res.send({data: result[0], status: true});
//             }
//             else{
//                 res.send({status: false});
//             }
//         });

//     }
//     catch(e){
//         console.log('getpayrollincomegroups :', e);
//     }
// })

/**get salary components of a pay group */

async function getsalarycomponentsforpaygroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components_for_pay_group` (?)", [req.body.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getdeductionsalarycomponent");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray)
                }
                else{
                    if(result &&result[0] && result[0].length>0){
                        res.send({data: result[0], status: true});
                    }
                    else{
                        res.send({status: false});
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getdeductigetpayrollincomegroupsonsalarycomponent :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getdeductigetpayrollincomegroupsonsalarycomponent");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
// app.post('/api/getsalarycomponentsforpaygroup',function(req,res){
//     try{
//         con.query("CALL `get_salary_components_for_pay_group` (?)", [req.body.id], function (err, result, fields) {
//             if(result &&result[0] && result[0].length>0){
//                 res.send({data: result[0], status: true});
//             }
//             else{
//                 res.send({status: false});
//             }
//         });

//     }
//     catch(e){
//         console.log('getsalarycomponentsforpaygroup :', e);
//     }
// })
/**set income group */

async function setincomegroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_income_group` (?,?,?,?,?,?)", [req.body.group,req.body.from,req.body.to,req.body.status,req.body.description,JSON.stringify(req.body.component)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setincomegroup");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true })
                }
             });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('setincomegroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setincomegroup");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
// app.post('/api/setincomegroup',function(req,res){
//     try {
//         console.log(req.body)
//         con.query("CALL `set_income_group` (?,?,?,?,?,?)", [req.body.group,req.body.from,req.body.to,req.body.status,req.body.description,JSON.stringify(req.body.component)], function (err, result, fields) {
//            console.log("err",err);
//            console.log("result",result)
//             if (err) {
//                 res.send({ status: false });
//             } else {
//                 res.send({ status: true })
//             }
//         });
        
//     } 
//     catch (e) {
//         console.log('setincomegroup :', e);
//     }

// })
/*Get Leave Rules*/


    async function getErrorMessages(req,res){
        try {
            var  dbName = await getDatebaseName(req.params.companyName)
            let companyName = req.params.companyName;
    
            var listOfConnections = {};
            if(dbName){
                listOfConnections= connection.checkExistingDBConnection(companyName)
                if(!listOfConnections.succes) {
                    listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
                }
                let errorCode;
                if(req.params.errorCode == 'null')
                {
                    errorCode = '';
                }
                else {
                    errorCode = req.params.errorCode
                }
                
                listOfConnections[companyName].query("CALL `get_payroll_messages` (?,?,?)", [errorCode,req.params.page,req.params.size],async function (err, result, fields) {
                    if (err) {
                        let errorLogArray = [];
                        errorLogArray.push("PAYROLLAPI");
                        errorLogArray.push("getErrorMessages");
                        errorLogArray.push("GET");
                        errorLogArray.push('');
                        errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                        errorLogArray.push(null);
                        errorLogArray.push(companyName);
                        errorLogArray.push(dbName);
                         await errorLogs(errorLogArray);
                    }
                    else{
                        if (result &&result[0] && result[0].length>0) {
                            res.send({data: result[0], status: true});
                        } else {
                            res.send({status: false})
                        }
                    }
                    
                });
            } else {
                res.send({status: false,Message:'Database Name is missed'})
            }
        }catch (e) {
            // console.log('setincomegroup :',e)
            let companyName =req.params.companyName;
            let  dbName = await getDatebaseName(companyName)
            let errorLogArray = [];
            errorLogArray.push("PAYROLLAPI");
            errorLogArray.push("getErrorMessages");
            errorLogArray.push("GET");
            errorLogArray.push("");
            errorLogArray.push( e.message);
            errorLogArray.push(null);
            errorLogArray.push(companyName);
            errorLogArray.push(dbName);
             await errorLogs(errorLogArray);
    
        }
    }
/*setErrorMessages */
async function setErrorMessages(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_payroll_messages` (?)",
            [JSON.stringify(req.body)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setErrorMessages");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);
                    res.send({status: false, message: 'Unable to update leave error messages'});                
                }
                else {
                    res.send({status: true, message: 'Messages updated successfully'})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('setErrorMessages :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setErrorMessages");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**getEmployeeDurationsForSalaryDisplay*/

async function getEmployeeDurationsForSalaryDisplay(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_durations_for_salary_display` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeDurationsForSalaryDisplay");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);               
                }
                else{
                    if(result && result[0] && result[0].length>0){              
                        res.send({status:true,data:result});
                     }
                     else{
                         res.send({status:false});
                     }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeDurationsForSalaryDisplay :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeDurationsForSalaryDisplay");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**CTC Duration */
async function getEmployeeCtcDurations(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_ctc_durations` (?)", [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeCtcDurations");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);               
                }
                else{
                    if(result && result[0] && result[0].length>0){              
                        res.send({status:true,data:result});
                     }
                     else{
                         res.send({status:false});
                     }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
         let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeCtcDurations");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}


// app.get('/api/getEmployeeDurationsForSalaryDisplay/:id',function(req,res){
//     try{
//         con.query("CALL `get_employee_durations_for_salary_display` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){              
//                res.send({status:true,data:result});
//             }
//             else{
//                 res.send({status:false});
//             }
//         });

//     }
//     catch(e){
//         console.log('getEmployeeDurationsForSalaryDisplay :', e);
//     }
// })
/**getCtcDetails */

async function getCtcDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_ctc_details` (?,?)", [JSON.parse(req.params.eid),JSON.parse(req.params.ctcid)], async function (err, result, fields) {            
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getCtcDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);               
                }
                else{
                    if(result && result[0] && result[0].length>0){   
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getCtcDetails :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getCtcDetails");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getEmployeeInvestments */
async function getEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_investments` (?)", [JSON.parse(req.params.empid)], async function (err, result, fields) {
           
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeInvestments");
                    errorLogArray.push("GET");
                    errorLogArray.push(req.params.empid);
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);               
                }
                else{
                    if(result && result[0] && result[0].length>0){               
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeInvestments :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeInvestments");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**delete_employee_investments */

async function deleteEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `delete_employee_investments` (?)", [req.body.id], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeInvestments");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('deleteEmployeeInvestments :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("deleteEmployeeInvestments");
        errorLogArray.push("DELETE");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);
    }
}

/**set_employee_investments */
async function setEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_investments` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.iid,req.body.empid,req.body.investmentid,req.body.declaredamount,req.body.submittedamount,req.body.verifiedamount,req.body.receiptnumber,req.body.disabilitypercentage,req.body.statusvalue,req.body.statusreason,req.body.actionby], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setEmployeeInvestments");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if (result && result[0] && result[0][0]&& result[0][0].successstate==0) {
                        res.send({ data: result[0], status: true });
                    } else {
                        res.send({ status: false })
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('setEmployeeInvestments :',e)
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("deleteEmployeeInvestments");
        errorLogArray.push("DELETE");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**get_component_editable_configurations*/
async function getComponentEditableConfigurations(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_editable_configurations` (?)", [JSON.parse(req.params.empid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getComponentEditableConfigurations");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){               
                        res.send({status:true,data:result});
                    }
                    else{
                        res.send({status:false});
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getComponentEditableConfigurations :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getComponentEditableConfigurations");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);


    }
}

/** configure_pay_group_component*/  

async function configurePayGroupComponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `configure_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,req.body.epf_always_value,req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value,req.body.show_this_component_in_payslip_value,req.body.status], async function (err, result, fields) {
                
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("configurePayGroupComponent");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('configurePayGroupComponent :',e);
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("configurePayGroupComponent");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**get_pay_group_component_values*/

async function getPayGroupComponentValues(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_pay_group_component_values`(?)",  [JSON.parse(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getPayGroupComponentValues");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result});
                    }
                    else{
                        res.send({status:false});
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getPayGroupComponentValues :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getPayGroupComponentValues");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**edit_pay_group_component */
async function editPayGroupComponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `edit_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,Number(req.body.epf_always_value),Number(req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value),req.body.show_this_component_in_payslip_value,req.body.status], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("editPayGroupComponent");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('editPayGroupComponent :',e);
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("editPayGroupComponent");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

// get_employees_list_for_investments_approval
async function getEmployeesListForInvestmentsApproval(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_list_for_investments_approval` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeesListForInvestmentsApproval");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result});
                    }
                    else{
                        res.send({status:false});
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeesListForInvestmentsApproval :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeesListForInvestmentsApproval");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**  get_employer_epf_contribution_options */
async function getEmployerEpfContributionOptions(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employer_epf_contribution_options` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployerEpfContributionOptions");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){  
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployerEpfContributionOptions :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployerEpfContributionOptions");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}



// get_employee_epf_contribution_options

async function getEmployeeEpfContributionOptions(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_epf_contribution_options` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeEpfContributionOptions");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeEpfContributionOptions :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeEpfContributionOptions");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

//setCompanyEpfValues 

async function setCompanyEpfValues(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_company_epf_values` (?,?,?,?,?,?,?,?)",   [req.body.pf_number,req.body.actual_pf_wage_or_restricted_pf_wage_for_employer_contribution,req.body.actual_pf_wage_or_restricted_pf_wage_for_employee_contribution ,req.body.include_employer_contribution_in_ctc_value ,req.body.include_employer_edli_contribution_in_ctc_value,req.body.include_admin_charges_in_ctc_value,req.body.consider_all_comp_if_pf_wage_is_lt_statutory_value,req.body.effective_fdate],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setCompanyEpfValues");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
            
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('setCompanyEpfValues :',e);
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setCompanyEpfValues");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

// get_statutory_max_pf_wage_for_employer_contribution
async function getStatutoryMaxPfWageForEmployerContribution(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_statutory_max_pf_wage_for_employer_contribution` ()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getStatutoryMaxPfWageForEmployerContribution");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result.length>0){
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getStatutoryMaxPfWageForEmployerContribution :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getStatutoryMaxPfWageForEmployerContribution");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
// update_epf_wages
app.post('/api/updateEpfWages',function(req,res){
    try{
        // con.query("CALL `update_epf_wages` (?,?,?,?,?,?,?,?)",   [req.body.pf_number,req.body.actual_pf_wage_or_restricted_pf_wage_for_employer_contribution,req.body.actual_pf_wage_or_restricted_pf_wage_for_employee_contribution ,req.body.include_employer_contribution_in_ctc_value ,req.body.include_employer_edli_contribution_in_ctc_value,req.body.include_admin_charges_in_ctc_value,req.body.consider_all_comp_if_pf_wage_is_lt_statutory_value,req.body.effective_fdate],function (err, result, fields) {
        //     if(err){
        //         res.send({status:false})
        //     }
        //     else{
        //         res.send({status:true,data:result})
        //     }
        // });
    }
    catch(e){
        console.log('updateEpfWages',e);
    }
});
// calculate_monthly_epf_values
app.post('/api/calculateMonthlyEpfValues',function(req,res){
    try{
        // con.query("CALL `calculate_monthly_epf_values` (?,?,?,?,?,?,?,?)",   [req.body.pf_number,req.body.actual_pf_wage_or_restricted_pf_wage_for_employer_contribution,req.body.actual_pf_wage_or_restricted_pf_wage_for_employee_contribution ,req.body.include_employer_contribution_in_ctc_value ,req.body.include_employer_edli_contribution_in_ctc_value,req.body.include_admin_charges_in_ctc_value,req.body.consider_all_comp_if_pf_wage_is_lt_statutory_value,req.body.effective_fdate],function (err, result, fields) {
        //     if(err){
        //         res.send({status:false})
        //     }
        //     else{
        //         res.send({status:true,data:result})
        //     }
        // });
    }
    catch(e){
        console.log('calculateMonthlyEpfValues',e);
    }
});
//getCompanyPaySchedule
async function getCompanyPaySchedule(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_company_pay_schedule`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getCompanyPaySchedule");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getCompanyPaySchedule :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getCompanyPaySchedule");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**set_company_pay_schedule*/
async function setCompanyPaySchedule(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_company_pay_schedule` (?,?,?,?,?,?,?)",   [req.body.monthlySalaryCalculationBasis,req.body.payDayOfMonth,req.body.payrollWindowFromDate ,req.body.payrollWindowToDate ,req.body.leaveWindowFromDateInPreviousMonth,req.body.leaveWindowToDateInCurrentMonth,req.body.nonWorkingDayPaymentOption],async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setCompanyPaySchedule");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0][0] && result[0][0].successstate ==0){
                        res.send({status:true})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('setCompanyPaySchedule :',e)
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setCompanyPaySchedule");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**update_monthly_salary */
async function updateMonthlySalary(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
           
            listOfConnections[companyName].query("CALL `update_monthly_salary` (?,?,?,?,?)",[JSON.stringify(req.body.employee_list),req.body.year_value, req.body.month_value ,req.body.financial_year_value,req.body.created_by_value] ,async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("updateMonthlySalary");
                    errorLogArray.push("POST");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                 else{
                     res.send({status:true,data:result})
                 }
             });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('updateMonthlySalary :',e);
        let companyName =req.body.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("updateMonthlySalary");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getFinancialYears */
 
async function getFinancialYears(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_financial_years`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getFinancialYears");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getFinancialYears :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getFinancialYears");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**MonthYear Details */

async function MonthYear(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_months_for_financial_year`(?)",[req.params.fyear] ,async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("MonthYear");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                 
             });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('MonthYear :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("MonthYear");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**get_epf_details */

async function getEpfDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_epf_details`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEpfDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEpfDetails");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/**getEmployeeListForSalaryProcessing */
async function getEmployeeListForSalaryProcessing(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_list_for_salary_processing`(?,?)",[req.params.year,req.params.month], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeListForSalaryProcessing");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeListForSalaryProcessing :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeListForSalaryProcessing");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/** getEmployeesForAssignPaygroup */
async function getEmployeesForAssignPaygroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_for_assign_pay_group`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeesForAssignPaygroup");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeesForAssignPaygroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeesForAssignPaygroup");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getPayGroupsForCtc */

async function getPayGroupsForCtc(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_pay_groups_for_ctc`(?)",[req.params.amount], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getPayGroupsForCtc");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
               
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getPayGroupsForCtc :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getPayGroupsForCtc");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getActiveComponentsValuesForPayGroup */
async function getActiveComponentsValuesForPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_components_values_for_pay_group`(?)",[Number(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getActiveComponentsValuesForPayGroup");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getActiveComponentsValuesForPayGroup");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}
/**getStateForEsi */
async function getStateForEsi(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_states_for_esi`()", async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getStateForEsi");
                    errorLogArray.push("GET");
                    errorLogArray.push('');
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getStateForEsi");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}
/**assignPayGroup*/
async function assignPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;
        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_pay_group_to_employee` (?,?,?,?,?)",[Number(req.body.empid), Number(req.body.paygroupid) ,Number(req.body.CTC),JSON.stringify(req.body.data),req.body.esi_applicable] ,async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("assignPayGroup");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('assignPayGroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("assignPayGroup");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}

/**get_component_wise_values_for_pay_group_assignment  */
async function getComponentWiseValuesForPayGroupAssignment(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_wise_values_for_pay_group_assignment`(?,?)",[req.params.ctc,Number(req.params.pgid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getComponentWiseValuesForPayGroupAssignment");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getComponentWiseValuesForPayGroupAssignment :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getComponentWiseValuesForPayGroupAssignment");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}
/**getEmployeePaySlips */
async function getEmployeePaySlips(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_payslips`(?,?)",[Number(req.params.empid),req.params.fyear], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeePaySlips");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeePaySlips :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeePaySlips");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}

/**get_employee_payslip_details */
async function getEmployeePayslipDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_payslip_details`(?,?)",[Number(req.params.id),Number(req.params.empid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeePayslipDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeePayslipDetails :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeePayslipDetails");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}

// get_employee_epf_details
async function getEmployeeEpfDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_epf_details`(?)",[Number(req.params.id)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEmployeeEpfDetails");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeEpfDetails :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEmployeeEpfDetails");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}

// get_monthly_payroll_data
async function getMonthlyPayrollData(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_monthly_payroll_data`(?,?,?)",[Number(req.params.month),Number(req.params.year),null], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getMonthlyPayrollData");
                    errorLogArray.push("GET");
                    errorLogArray.push("req.params.month");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }
                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getMonthlyPayrollData :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getMonthlyPayrollData");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}

// get_monthly_payroll_data_for_graph
async function getMonthlyPayrollDataForGraph(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_monthly_payroll_data_for_graph`(?,?)",[Number(req.params.month),req.params.year], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getMonthlyPayrollDataForGraph");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getMonthlyPayrollDataForGraph :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getMonthlyPayrollDataForGraph");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}
// get_component_configured_values_for_pay_group
async function getComponentConfiguredValuesForPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_configured_values_for_pay_group`(?,?)",[Number(req.params.pgmid),Number(req.params.flat)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getComponentConfiguredValuesForPayGroup");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                    errorLogs(errorLogArray);  
                    res.send({status:false});           
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]});
                    }
                    else{
                        res.send({status:false});
                    }

                }
               
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getComponentConfiguredValuesForPayGroup");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);

    }
}
// module.exports = app;
// otherAllowancePopup
async function otherAllowancePopup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `other_allowance_popup`(?)",[Number(req.params.pgid)], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("otherAllowancePopup");
                    errorLogArray.push("GET");
                    errorLogArray.push("");
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    if(result && result[0] && result[0].length>0){
                        res.send({status:true,data:result[0]})
                    }
                    else{
                        res.send({status:false})
                    }

                }
                
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('getEmployeeEpfDetails :',e)
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("otherAllowancePopup");
        errorLogArray.push("GET");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
        errorLogs(errorLogArray);
    }
}

/**assignPayGroup*/
async function setEsiForState(req,res){
    try {
       
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_esi_for_state` (?,?)",[req.body.esi_number ,req.body.state_id] ,async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setEsiForState");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('assignPayGroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setEsiForState");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**setCompanyEsiValues */
async function setCompanyEsiValues(req,res){
    try {
      
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_company_esi_values` (?)",[Number(req.body.include_employer_contribution_in_ctc)] ,async function (err, result, fields) {

                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("setCompanyEsiValues");
                    errorLogArray.push("POST");
                    errorLogArray.push(JSON.stringify(req.body));
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('assignPayGroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("setCompanyEsiValues");
        errorLogArray.push("POST");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
async function getCompanyEsiValues(req,res){
    try {
      
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_esi_for_states` ()",async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEsiForStates");
                    errorLogArray.push("get");
                    errorLogArray.push();
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     await errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('assignPayGroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getCompanyEsiValues");
        errorLogArray.push("get");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}
/**getEsiEmployerContribution */
async function getEsiEmployerContribution(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_esi_employer_contribution` ()",async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("getEsiEmployerContribution");
                    errorLogArray.push("get");
                    errorLogArray.push();
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        // console.log('assignPayGroup :',e);
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("getEsiEmployerContribution");
        errorLogArray.push("get");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}

/** error logs */
async function errorLogs(errorLogArray) {
  
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

/**validateSalaryProcessingDate */
async function validateSalaryProcessingDate(req, res) {
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `validate_salary_processing_date` (?,?)",
                [
                Number(req.params.year),
                Number(req.params.month),
                ], async function (err, result, fields) {
                if (err) {
                    let errorLogArray = [];
                    errorLogArray.push("PAYROLLAPI");
                    errorLogArray.push("validateSalaryProcessingDate");
                    errorLogArray.push("get");
                    errorLogArray.push();
                    errorLogArray.push(" (" + err.errno + ") " + err.sqlMessage);
                    errorLogArray.push(null);
                    errorLogArray.push(companyName);
                    errorLogArray.push(dbName);
                     errorLogs(errorLogArray);  
                    res.send({status:false})             
                }
                else{
                    res.send({status:true,data:result[0]})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        let companyName =req.params.companyName;
        let  dbName = await getDatebaseName(companyName)
        let errorLogArray = [];
        errorLogArray.push("PAYROLLAPI");
        errorLogArray.push("validateSalaryProcessingDate");
        errorLogArray.push("get");
        errorLogArray.push("");
        errorLogArray.push( e.message);
        errorLogArray.push(null);
        errorLogArray.push(companyName);
        errorLogArray.push(dbName);
         await errorLogs(errorLogArray);

    }
}