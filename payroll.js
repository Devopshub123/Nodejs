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




module.exports = app;