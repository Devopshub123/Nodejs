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
/**Employee professional tax */
app.post('/api/employeeprofessionaltax', function (req, res) {
    try {
        con.query("CALL `get_employee_professional_tax_details` ()", [], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });
    } 
    catch (e) {
        console.log('employeeprofessionaltax :', e)
    }
});
/**Employer Professional tax */
app.post('/api/employerprofessionaltax', function (req, res) {
    try {
        con.query("CALL `get_employer_professional_tax_details` ()", [], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });
    } 
    catch (e) {
        console.log('employerprofessionaltax :', e)
    }
});
/**Get Esi Details */
app.post('/api/getesidetails', function (req, res) {
    try {
        con.query("CALL `get_esi_details` ()", [], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });
    } 
    catch (e) {
        console.log('employerprofessionaltax :', e)
    }

})
app.post('/api/getpayrollsections',function(req,res){
    try{
        con.query("CALL `get_payroll_sections` ()", [], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });

    }
    catch(e){
        console.log('getpayrollsections :', e)
    }
})
/** getearningsalarycomponent*/
app.post('/api/getearningsalarycomponent/:id',function(req,res){
    try {
        con.query("CALL `get_salary_components` (?)", [req.params.id], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });
    } 
    catch (e) {
        console.log('getearningsalarycomponent :', e)
    }

})
/** getdeductionsalarycomponent*/
app.post('/api/getdeductionsalarycomponent/:id',function(req,res){
    try {
        con.query("CALL `get_salary_components` (?)", [req.params.id], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });
    } 
    catch (e) {
        console.log('getdeductionsalarycomponent :', e)
    }

})
/**getpayroll incomegroups */
app.post('/api/getpayrollincomegroups',function(req,res){
    try{
        con.query("CALL `get_payroll_income_groups` ()", [], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });

    }
    catch(e){
        console.log('getpayrollincomegroups :', e)
    }
})
/**get salary components of a pay group */
app.post('/api/getsalarycomponentsforpaygroup',function(req,res){
    try{
        con.query("CALL `get_salary_components_for_pay_group` (?)", [req.body.id], function (err, result, fields) {
            if(result && result.length){
                res.send({data: result[0], status: true});
            }
            else{
                res.send({status: false});
            }
        });

    }
    catch(e){
        console.log('getsalarycomponentsforpaygroup :', e)
    }
})
/**set income group */
app.post('/api/setincomegroup',function(req,res){
    try {
        console.log(req.body)
        console.log(req.body.from)
        console.log(req.body.to)
        console.log(req.body.component)
        let data =JSON.stringify(req.body.component)
        console.log(data)

        con.query("CALL `set_income_group` (?,?,?,?,?,?)", [req.body.group,req.body.from,req.body.to,req.body.status,req.body.description,JSON.stringify(req.body.component)], function (err, result, fields) {
           console.log(result)
           console.log(err)
            if (err) {
                res.send({ status: false });
            } else {
                res.send({ status: true })
            }
        });
        // res.send({ status: true })
        
    } 
    catch (e) {
        console.log('setincomegroup :', e)
    }

})




module.exports = app;