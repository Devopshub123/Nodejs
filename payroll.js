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
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_professional_tax_details` ()", [], function (err, result, fields) {
                if(result &&result[0] && result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('employeeprofessionaltax :',e)

    }
}
/**Employer Professional tax */

async function employerprofessionaltax(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employer_professional_tax_details` ()", [], function (err, result, fields) {
                if(result &&result[0] && result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('employerprofessionaltax :',e)

    }
}
/**Get Esi Details */
async function getesidetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_esi_details` ()", [], function (err, result, fields) {
                if(result &&result[0] && result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getesidetails :',e)

    }
}

/**getpayrollsections */
async function getpayrollsections(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_payroll_sections` ()", [], function (err, result, fields) {
                if(result && result[0]&& result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getpayrollsections :',e)

    }
}

/** getearningsalarycomponent*/

async function getearningsalarycomponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components` (?)", [req.params.id], function (err, result, fields) {
                if(result && result[0]&& result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getearningsalarycomponent :',e)

    }
}

/** getdeductionsalarycomponent*/
async function getdeductionsalarycomponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components` (?)", [req.params.id], function (err, result, fields) {
                if(result && result[0]&& result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getdeductionsalarycomponent :',e)

    }
}
/**getpayroll incomegroups */
async function getpayrollincomegroups(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_payroll_income_groups` ()", [], function (err, result, fields) {
                if(result &&result[0] && result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getdeductigetpayrollincomegroupsonsalarycomponent :',e)

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
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_salary_components_for_pay_group` (?)", [req.body.id], function (err, result, fields) {
                if(result &&result[0] && result[0].length>0){
                    res.send({data: result[0], status: true});
                }
                else{
                    res.send({status: false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getdeductigetpayrollincomegroupsonsalarycomponent :',e)

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
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_income_group` (?,?,?,?,?,?)", [req.body.group,req.body.from,req.body.to,req.body.status,req.body.description,JSON.stringify(req.body.component)], function (err, result, fields) {
                console.log("err",err);
                console.log("result",result)
                 if (err) {
                     res.send({ status: false });
                 } else {
                     res.send({ status: true })
                 }
             });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('setincomegroup :',e)

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
                listOfConnections= connection.checkExistingDBConnection(2,companyName)
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
                
                listOfConnections[companyName].query("CALL `get_payroll_messages` (?,?,?)", [errorCode,req.params.page,req.params.size],function (err, result, fields) {
                    if (result &&result[0] && result[0].length>0) {
                        res.send({data: result[0], status: true});
                    } else {
                        res.send({status: false})
                    }
                });
            } else {
                res.send({status: false,Message:'Database Name is missed'})
            }
        }catch (e) {
            console.log('setincomegroup :',e)
    
        }
    }
//     app.get('/api/getErrorMessages/:errorCode/:page/:size',function(req,res) {
//     try {
//         let errorCode;
//         if(req.params.errorCode == 'null')
//         {
//             errorCode = '';
//         }
//         else {
//             errorCode = req.params.errorCode
//         }
//         con.query("CALL `get_payroll_messages` (?,?,?)", [errorCode,req.params.page,req.params.size],function (err, result, fields) {
//             if (result &&result[0] && result[0].length>0) {
//                 res.send({data: result[0], status: true});
//             } else {
//                 res.send({status: false})
//             }
//         });
        

//     }catch (e) {
//         console.log('geterrormessages :',e);

//     }
// });
/*setErrorMessages */
async function setErrorMessages(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_payroll_messages` (?)",
            [JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update leave error messages'});
                } else {
                    res.send({status: true, message: 'Messages updated successfully'})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('setErrorMessages :',e)

    }
}

// app.post('/api/setErrorMessages',function(req,res) {
//     try {
//         con.query("CALL `set_payroll_messages` (?)",
//             [JSON.stringify(req.body)], function (err, result, fields) {
//                 if (err) {
//                     res.send({status: false, message: 'Unable to update leave error messages'});
//                 } else {
//                     res.send({status: true, message: 'Messages updated successfully'})
//                 }
//             });
        

//     }catch (e) {
//         console.log('seterrormessages :',e);
//     }
// });

/**getEmployeeDurationsForSalaryDisplay*/

async function getEmployeeDurationsForSalaryDisplay(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_durations_for_salary_display` (?)", [JSON.parse(req.params.id)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){              
                   res.send({status:true,data:result});
                }
                else{
                    res.send({status:false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeeDurationsForSalaryDisplay :',e)

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
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_ctc_details` (?,?)", [JSON.parse(req.params.eid),JSON.parse(req.params.ctcid)], function (err, result, fields) {            
                if(result && result[0] && result[0].length>0){   
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getCtcDetails :',e)

    }
}

// app.get('/api/getCtcDetails/:eid/:ctcid',function(req,res){
//     try{
//         con.query("CALL `get_ctc_details` (?,?)", [JSON.parse(req.params.eid),JSON.parse(req.params.ctcid)], function (err, result, fields) {            
//             if(result && result[0] && result[0].length>0){   
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });

//     }
//     catch(e){
//         console.log('getCtcDetails :', e);
//     }
// })
/**getEmployeeInvestments */
async function getEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_investments` (?)", [JSON.parse(req.params.empid)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){               
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeeInvestments :',e)

    }
}

// app.get('/api/getEmployeeInvestments/:empid',function(req,res){
//     try{
//         con.query("CALL `get_employee_investments` (?)", [JSON.parse(req.params.empid)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){               
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeeInvestments',e);
//     }
// })
/**delete_employee_investments */

async function deleteEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `delete_employee_investments` (?)", [req.body.id], function (err, result, fields) {
                if(err){
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
        console.log('deleteEmployeeInvestments :',e)

    }
}
// app.post('/api/deleteEmployeeInvestments/',function(req,res){
//     try{
//         con.query("CALL `delete_employee_investments` (?)", [req.body.id], function (err, result, fields) {
//              if(err){
//                  res.send({status:false})
//              }
//              else{
//                  res.send({status:true})
//              }
//          });
//     }
//     catch(e){
//         console.log('deleteEmployeeInvestments',e);
//     }
// })


/**set_employee_investments */

async function setEmployeeInvestments(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_employee_investments` (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.iid,req.body.empid,req.body.investmentid,req.body.declaredamount,req.body.submittedamount,req.body.verifiedamount,req.body.receiptnumber,req.body.disabilitypercentage,req.body.statusvalue,req.body.statusreason,req.body.actionby], function (err, result, fields) {
                console.log("err",err);
                console.log("res",result)
                if (result && result[0] && result[0][0]&& result[0][0].successstate==0) {
                    res.send({ data: result[0], status: true });
                } else {
                    res.send({ status: false })
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('setEmployeeInvestments :',e)

    }
}

// app.post('/api/setEmployeeInvestments',function(req,res){
//     try{  

//         con.query("CALL `set_employee_investments` (?,?,?,?,?,?,?,?,?,?,?)",
//         [req.body.iid,req.body.empid,req.body.investmentid,req.body.declaredamount,req.body.submittedamount,req.body.verifiedamount,req.body.receiptnumber,req.body.disabilitypercentage,req.body.statusvalue,req.body.statusreason,req.body.actionby], function (err, result, fields) {
//             console.log("err",err);
//             console.log("res",result)
//             if (result && result[0] && result[0][0]&& result[0][0].successstate==0) {
//                 res.send({ data: result[0], status: true });
//             } else {
//                 res.send({ status: false })
//             }
//         });

//     }
//     catch(e)
//     {
//        console.log('setEmployeeInvestments',e);
//     }
// })
/**get_component_editable_configurations*/
async function getComponentEditableConfigurations(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_editable_configurations` (?)", [JSON.parse(req.params.empid)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){               
                    res.send({status:true,data:result});
                }
                else{
                    res.send({status:false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getComponentEditableConfigurations :',e)

    }
}

// app.get('/api/getComponentEditableConfigurations/:empid',function(req,res){
//     try{
//         con.query("CALL `get_component_editable_configurations` (?)", [JSON.parse(req.params.empid)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){               
//                 res.send({status:true,data:result});
//             }
//             else{
//                 res.send({status:false});
//             }
//         });
//     }catch(e){
//         console.log('getComponentEditableConfigurations',e);
//     }
// });
/** configure_pay_group_component*/  

async function configurePayGroupComponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `configure_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,req.body.epf_always_value,req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value,req.body.show_this_component_in_payslip_value,req.body.status], function (err, result, fields) {
                console.log(err);
                if(err){
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
        console.log('configurePayGroupComponent :',e)

    }
}
// app.post('/api/configurePayGroupComponent',function(req,res){
//     try{
//         con.query("CALL `configure_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,req.body.epf_always_value,req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value,req.body.show_this_component_in_payslip_value,req.body.status], function (err, result, fields) {
//             console.log(err);
//             if(err){
//                 res.send({status:false})
//             }
//             else{
//                 res.send({status:true,data:result})
//             }
//         });

//     }
//     catch(e){
//         console.log('configurePayGroupComponent',e);
//     }

// })

/**get_pay_group_component_values*/

async function getPayGroupComponentValues(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_pay_group_component_values`(?)",  [JSON.parse(req.params.id)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result});
                }
                else{
                    res.send({status:false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getPayGroupComponentValues :',e)

    }
}
// app.get('/api/getPayGroupComponentValues/:id',function(req,res){
//     try{
//         con.query("CALL `get_pay_group_component_values`(?)",  [JSON.parse(req.params.id)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result});
//             }
//             else{
//                 res.send({status:false});
//             }
//         });
//     }
//     catch(e){
//         console.log('getPayGroupComponentValues',e);
//     }

// })
/**edit_pay_group_component */
async function editPayGroupComponent(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `edit_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,Number(req.body.epf_always_value),Number(req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value),req.body.show_this_component_in_payslip_value,req.body.status], function (err, result, fields) {
                console.log(err);
                if(err){
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
        console.log('editPayGroupComponent :',e)

    }
}
// app.post('/api/editPayGroupComponent',function(req,res){
//     try{
//         console.log(req.body)
//         con.query("CALL `edit_pay_group_component` (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",  [req.body.pigcm_id_value,req.body.is_percentage_or_flat_amount_value,Number(req.body.input_value),req.body.parent_component_id_value,req.body.display_name_value,req.body.is_this_component_a_part_of_employee_salary_structure_value,req.body.calculate_on_pro_rata_basis_value,req.body.is_this_component_taxable_value,req.body.consider_for_esi_contribution_value,req.body.consider_for_epf_contribution_value,Number(req.body.epf_always_value),Number(req.body.epf_only_when_pf_wage_is_less_than_standard_pf_wage_value),req.body.show_this_component_in_payslip_value,req.body.status], function (err, result, fields) {
//             console.log(err);
//             if(err){
//                 res.send({status:false})
//             }
//             else{
//                 res.send({status:true,data:result})
//             }
//         });

//     }
//     catch(e){
//         console.log('editPayGroupComponent',e);
//     }

// });

// get_employees_list_for_investments_approval

async function getEmployeesListForInvestmentsApproval(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_list_for_investments_approval` ()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result});
                }
                else{
                    res.send({status:false});
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeesListForInvestmentsApproval :',e)

    }
}
// app.get('/api/getEmployeesListForInvestmentsApproval',function(req,res){
//     try{
//         con.query("CALL `get_employees_list_for_investments_approval` ()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result});
//             }
//             else{
//                 res.send({status:false});
//             }
//         });
//     }catch(e){
//         console.log('getEmployeesListForInvestmentsApproval',e);
//     }
// });

/**  get_employer_epf_contribution_options */
async function getEmployerEpfContributionOptions(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employer_epf_contribution_options` ()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){  
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployerEpfContributionOptions :',e)

    }
}
// app.get('/api/getEmployerEpfContributionOptions',function(req,res){
//     try{
//         con.query("CALL `get_employer_epf_contribution_options` ()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){  
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployerEpfContributionOptions',e);
//     }
// });


// get_employee_epf_contribution_options

async function getEmployeeEpfContributionOptions(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_epf_contribution_options` ()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeeEpfContributionOptions :',e)

    }
}
// app.get('/api/getEmployeeEpfContributionOptions',function(req,res){
//     try{
//         con.query("CALL `get_employee_epf_contribution_options` ()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeeEpfContributionOptions',e);
//     }
// });
//setCompanyEpfValues 

async function setCompanyEpfValues(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_company_epf_values` (?,?,?,?,?,?,?,?)",   [req.body.pf_number,req.body.actual_pf_wage_or_restricted_pf_wage_for_employer_contribution,req.body.actual_pf_wage_or_restricted_pf_wage_for_employee_contribution ,req.body.include_employer_contribution_in_ctc_value ,req.body.include_employer_edli_contribution_in_ctc_value,req.body.include_admin_charges_in_ctc_value,req.body.consider_all_comp_if_pf_wage_is_lt_statutory_value,req.body.effective_fdate],function (err, result, fields) {
                if(err){
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
        console.log('setCompanyEpfValues :',e)

    }
}
// app.post('/api/setCompanyEpfValues',function(req,res){
//     try{
//         con.query("CALL `set_company_epf_values` (?,?,?,?,?,?,?,?)",   [req.body.pf_number,req.body.actual_pf_wage_or_restricted_pf_wage_for_employer_contribution,req.body.actual_pf_wage_or_restricted_pf_wage_for_employee_contribution ,req.body.include_employer_contribution_in_ctc_value ,req.body.include_employer_edli_contribution_in_ctc_value,req.body.include_admin_charges_in_ctc_value,req.body.consider_all_comp_if_pf_wage_is_lt_statutory_value,req.body.effective_fdate],function (err, result, fields) {
//             if(err){
//                 res.send({status:false})
//             }
//             else{
//                 res.send({status:true,data:result})
//             }
//         });
//     }
//     catch(e){
//         console.log('setCompanyEpfValues',e);
//     }
// });
// get_statutory_max_pf_wage_for_employer_contribution

async function getStatutoryMaxPfWageForEmployerContribution(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_statutory_max_pf_wage_for_employer_contribution` ()", function (err, result, fields) {
                if(result && result.length>0){
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getStatutoryMaxPfWageForEmployerContribution :',e)

    }
}
// app.get('/api/getStatutoryMaxPfWageForEmployerContribution',function(req,res){
//     try{
//         con.query("CALL `get_statutory_max_pf_wage_for_employer_contribution` ()", function (err, result, fields) {
//             if(result && result.length>0){
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getStatutoryMaxPfWageForEmployerContribution',e);
//     }
// });
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
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_company_pay_schedule`()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getCompanyPaySchedule :',e)

    }
}
// app.get('/api/getCompanyPaySchedule',function(req,res){
//     try{
//         con.query("CALL `get_company_pay_schedule`()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getCompanyPaySchedule',e);
//     }
// });
/**set_company_pay_schedule*/
async function setCompanyPaySchedule(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_company_pay_schedule` (?,?,?,?,?,?,?)",   [req.body.monthlySalaryCalculationBasis,req.body.payDayOfMonth,req.body.payrollWindowFromDate ,req.body.payrollWindowToDate ,req.body.leaveWindowFromDateInPreviousMonth,req.body.leaveWindowToDateInCurrentMonth,req.body.nonWorkingDayPaymentOption],function (err, result, fields) {
                if(result && result[0] && result[0][0] && result[0][0].successstate ==0){
                    res.send({status:true})
                }
                else{
                    res.send({status:false})
    
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('setCompanyPaySchedule :',e)

    }
}
// app.post('/api/setCompanyPaySchedule',function(req,res){
//     try{

//         con.query("CALL `set_company_pay_schedule` (?,?,?,?,?,?,?)",   [req.body.monthlySalaryCalculationBasis,req.body.payDayOfMonth,req.body.payrollWindowFromDate ,req.body.payrollWindowToDate ,req.body.leaveWindowFromDateInPreviousMonth,req.body.leaveWindowToDateInCurrentMonth,req.body.nonWorkingDayPaymentOption],function (err, result, fields) {
//             if(result && result[0] && result[0][0] && result[0][0].successstate ==0){
//                 res.send({status:true})
//             }
//             else{
//                 res.send({status:false})

//             }
//         });
//     }
//     catch(e){
//         console.log('setCompanyPaySchedule',e);
//     }
// });
/**update_monthly_salary */
async function updateMonthlySalary(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `update_monthly_salary` (?,?,?,?,?)",[JSON.stringify(req.body.employee_list),req.body.year_value, req.body.month_value ,req.body.financial_year_value,req.body.created_by_value] ,function (err, result, fields) {
                console.log(err)
                 if(err){
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
        console.log('updateMonthlySalary :',e)

    }
}
// app.post('/api/updateMonthlySalary',function(req,res){
//     try{
//         con.query("CALL `update_monthly_salary` (?,?,?,?,?)",[JSON.stringify(req.body.employee_list),req.body.year_value, req.body.month_value ,req.body.financial_year_value,req.body.created_by_value] ,function (err, result, fields) {
//            console.log(err)
//             if(err){
//                 res.send({status:false})
//             }
//             else{
//                 res.send({status:true,data:result})
//             }
//         });
//     }
//     catch(e){
//         console.log('updateMonthlySalary',e);
//     }
// });
/**getFinancialYears */
 
async function getFinancialYears(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_financial_years`()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getFinancialYears :',e)

    }
}
// app.get('/api/getFinancialYears',function(req,res){
//     try{
//         con.query("CALL `get_financial_years`()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getFinancialYears',e);;
//     }
// });
/**MonthYear Details */

async function MonthYear(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_months_for_financial_year`(?)",[req.params.fyear] ,function (err, result, fields) {
                console.log("year",result)
                 if(result && result[0] && result[0].length>0){
                     res.send({status:true,data:result[0]})
                 }
                 else{
                     res.send({status:false})
                 }
             });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('MonthYear :',e)

    }
}

// app.get('/api/MonthYear/:fyear',function(req,res){
//     try{
//         console.log("fyear",req.params.fyear)
//         con.query("CALL `get_months_for_financial_year`(?)",[req.params.fyear] ,function (err, result, fields) {
//            console.log("year",result)
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('MonthYear',e);
//     }
// });
/**get_epf_details */

async function getEpfDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_epf_details`()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEpfDetails :',e)

    }
}
// app.get('/api/getEpfDetails',function(req,res){
//     try{
//         con.query("CALL `get_epf_details`()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEpfDetails',e);
//     }
// });
/**getEmployeeListForSalaryProcessing */
async function getEmployeeListForSalaryProcessing(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_list_for_salary_processing`(?,?)",[req.params.year,req.params.month], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeeListForSalaryProcessing :',e)

    }
}
// app.get('/api/getEmployeeListForSalaryProcessing/:year/:month',function(req,res){
//     try{
//         con.query("CALL `get_employee_list_for_salary_processing`(?,?)",[req.params.year,req.params.month], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeeListForSalaryProcessing',e);
//     }
// });
/** getEmployeesForAssignPaygroup */

async function getEmployeesForAssignPaygroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.body.companyName)
        let companyName = req.body.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employees_for_assign_pay_group`()", function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeesForAssignPaygroup :',e)

    }
}
// app.get('/api/getEmployeesForAssignPaygroup',function(req,res){
//     try{
//         con.query("CALL `get_employees_for_assign_pay_group`()", function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeesForAssignPaygroup',e);
//     }
// });

/**getPayGroupsForCtc */

async function getPayGroupsForCtc(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_pay_groups_for_ctc`(?)",[req.params.amount], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getPayGroupsForCtc :',e)

    }
}
// app.get('/api/getPayGroupsForCtc/:amount',function(req,res){
//     try{
//         con.query("CALL `get_pay_groups_for_ctc`(?)",[req.params.amount], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getPayGroupsForCtc',e);
//     }
// });
/**getActiveComponentsValuesForPayGroup */
async function getActiveComponentsValuesForPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_active_components_values_for_pay_group`(?)",[Number(req.params.id)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getActiveComponentsValuesForPayGroup :',e)

    }
}
// app.get('/api/getActiveComponentsValuesForPayGroup/:id',function(req,res){
//     try{
//         con.query("CALL `get_active_components_values_for_pay_group`(?)",[Number(req.params.id)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getActiveComponentsValuesForPayGroup',e);
//     }
// });
/**assignPayGroup*/
async function assignPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `set_pay_group_to_employee` (?,?,?,?)",[Number(req.body.empid), Number(req.body.paygroupid) ,Number(req.body.CTC),JSON.stringify(req.body.data)] ,function (err, result, fields) {
                if(err){
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
        console.log('assignPayGroup :',e)

    }
}
// app.post('/api/assignPayGroup',function(req,res){
//     try{
//         con.query("CALL `set_pay_group_to_employee` (?,?,?,?)",[Number(req.body.empid), Number(req.body.paygroupid) ,Number(req.body.CTC),JSON.stringify(req.body.data)] ,function (err, result, fields) {
//             if(err){
//                 res.send({status:false})
//             }
//             else{
//                 res.send({status:true,data:result})
//             }
//         });
//     }
//     catch(e){
//         console.log('assignPayGroup',e);
//     }
// });
/**get_component_wise_values_for_pay_group_assignment  */
async function getComponentWiseValuesForPayGroupAssignment(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_wise_values_for_pay_group_assignment`(?,?)",[req.params.ctc,Number(req.params.pgid)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getComponentWiseValuesForPayGroupAssignment :',e)

    }
}
// app.get('/api/getComponentWiseValuesForPayGroupAssignment/:ctc/:pgid',function(req,res){
//     try{
//         con.query("CALL `get_component_wise_values_for_pay_group_assignment`(?,?)",[req.params.ctc,Number(req.params.pgid)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getComponentWiseValuesForPayGroupAssignment',e);
//     }
// });
/**getEmployeePaySlips */
async function getEmployeePaySlips(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_payslips`(?,?)",[Number(req.params.empid),req.params.fyear], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeePaySlips :',e)

    }
}

// app.get('/api/getEmployeePaySlips/:fyear/:empid',function(req,res){
//     try{
//         console.log(req.params);
//         con.query("CALL `get_employee_payslips`(?,?)",[Number(req.params.empid),req.params.fyear], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeePaySlips',e);
//     }
// });
/**get_employee_payslip_details */
async function getEmployeePayslipDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_payslip_details`(?,?)",[Number(req.params.id),Number(req.params.empid)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeePayslipDetails :',e)

    }
}
// app.get('/api/getEmployeePayslipDetails/:id/:empid',function(req,res){
//     try{
//         console.log("params",req.params)
//         con.query("CALL `get_employee_payslip_details`(?,?)",[Number(req.params.id),Number(req.params.empid)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeePaySlips',e);
//     }
// });

// get_employee_epf_details
async function getEmployeeEpfDetails(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_employee_epf_details`(?)",[Number(req.params.id)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getEmployeeEpfDetails :',e)

    }
}
// app.get('/api/getEmployeeEpfDetails/:id',function(req,res){
//     try{
//         con.query("CALL `get_employee_epf_details`(?)",[Number(req.params.id)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getEmployeeEpfDetails',e);
//     }
// });
// get_monthly_payroll_data
async function getMonthlyPayrollData(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_monthly_payroll_data`(?,?,?)",[Number(req.params.month),Number(req.params.year),null], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getMonthlyPayrollData :',e)

    }
}
// app.get('/api/getMonthlyPayrollData/:month/:year/:deptid',function(req,res){
//     try{
       
//         con.query("CALL `get_monthly_payroll_data`(?,?,?)",[Number(req.params.month),Number(req.params.year),null], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getMonthlyPayrollData',e);
//     }
// });
// get_monthly_payroll_data_for_graph
async function getMonthlyPayrollDataForGraph(req,res){
    try {
        console.log("req.params",req.params)
        var  dbName = await getDatebaseName("spryple")
        let companyName = 'spryple';

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_monthly_payroll_data_for_graph`(?,?)",[Number(req.params.month),req.params.year], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getMonthlyPayrollDataForGraph :',e)

    }
}
// app.get('/api/getMonthlyPayrollDataForGraph/:month/:year',function(req,res){
//     try{
//         con.query("CALL `get_monthly_payroll_data_for_graph`(?,?)",[Number(req.params.month),req.params.year], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getMonthlyPayrollData',e);
//     }
// });
// get_component_configured_values_for_pay_group
async function getComponentConfiguredValuesForPayGroup(req,res){
    try {
        var  dbName = await getDatebaseName(req.params.companyName)
        let companyName = req.params.companyName;

        var listOfConnections = {};
        if(dbName){
            listOfConnections= connection.checkExistingDBConnection(2,companyName)
            if(!listOfConnections.succes) {
                listOfConnections[companyName] =await connection.getNewDBConnection(companyName,dbName);
            }
            listOfConnections[companyName].query("CALL `get_component_configured_values_for_pay_group`(?,?)",[Number(req.params.pgmid),Number(req.params.flat)], function (err, result, fields) {
                if(result && result[0] && result[0].length>0){
                    res.send({status:true,data:result[0]})
                }
                else{
                    res.send({status:false})
                }
            });
        } else {
            res.send({status: false,Message:'Database Name is missed'})
        }
    }catch (e) {
        console.log('getComponentConfiguredValuesForPayGroup :',e)

    }
}
// app.get('/api/getComponentConfiguredValuesForPayGroup/:pgmid/:flat',function(req,res){
//     try{
//         con.query("CALL `get_component_configured_values_for_pay_group`(?,?)",[Number(req.params.pgmid),Number(req.params.flat)], function (err, result, fields) {
//             if(result && result[0] && result[0].length>0){
//                 res.send({status:true,data:result[0]})
//             }
//             else{
//                 res.send({status:false})
//             }
//         });
//     }catch(e){
//         console.log('getComponentConfiguredValuesForPayGroup',e);
//     }
// });
// module.exports = app;

