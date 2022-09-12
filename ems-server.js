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
    
// in termination_id int(11),
// in termination_category varchar(64),
// in termination_status int(11), -- values: 1(Active) , 2(Inactive)
// in actionby int(11)

app.post('/api/setTerminationCategory', function (req, res) {
    try {
        con.query("CALL `set_termination_category` (?,?,?,?)", [
           req.body.termination_id, 
           req.body.termination_category, 
           req.body.termination_status, 
           req.body.actionby, 
        ], function (err, result, fields) {
            if (err) {
                res.send({ status: false, data: "unableToSave" })
            } else {
                res.send({ status: true, data:"dataSaved" });
            }
            console.log(result)
          });        
    }
    catch (e) {
        console.log('')
    }

})


module.exports = app;