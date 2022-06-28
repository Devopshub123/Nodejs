var bodyParser = require('body-parser');
var express = require('express');
var app = new express();
var fs = require('fs');
var path = require('path');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer')
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
var connection = require('./config/databaseConnection')

connection.switchDatabase('boon_client');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(fileUpload())
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

/**verify email for forget password */
app.get('/api/forgetpassword/:email',function(req,res,next){
    let email = req.params.email;
    try{
        /*    con.query('CALL `getemployeestatus`(?)',[email],function(err,result){
                if(err){
                    console.log(err)

                }
                else{
                    let email = 'rthallapelly@sreebtech.com'
                    let id = 22
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
            var url = 'http://localhost:6060/api/Resetpassword/'+email+'/'+id
            var html = `<html>


            <head>

              <title>HRMS ResetPassword</title>

            </head>

            <body style="font-family:'Segoe UI',sans-serif; color: #7A7A7A">


              <div style="margin-left: 10%; margin-right: 10%; border: 1px solid #7A7A7A; padding: 40px; ">

                <p style="color:black">Hello,</p>

                <p style="color:black">Thank you for using HRMS&nbsp; We’re really happy to have you!<b></b></p>

                <p style="color:black"> Click the link below to Reset your password</p>

                <p style="color:black"> <a href="${url}" >${url} </a>

          </p>



                <p style="color:black">Thank You!</p>

                <p style="color:black">HRMS Team</p>


                <hr style="border: 0; border-top: 3px double #8c8c8c"/>

              </div>

            </body>

          </html> `;

            var mailOptions = {
                from: 'smattupalli@sreebtech.com',
                to: "rthallapelly@sreebtech.com",
                subject: 'Reset Password email',
                html:html
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.send({status: false, message: 'reset password successfully'})
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send({status: true, message: 'reset password successfully'})
                }
            });
                }
            }) */


    }
    catch(e){
        console.log("forgetpassword",e)
    }
})
/**password reset */
app.get('/api/resetpassword/:email/:id',function(req,res,next){
    let id = req.params.id;
    let email = req.params.email;
    console.log(id)
    console.log(email)
    res.redirect('http://localhost:4200/ResetPassword/'+email+'/'+id)


})
/**reset password */
app.post('/api/resetpassword',function(req,res,next){
    var con  =connection.switchDatabase('boon_client')

    let id = req.body.empId;
    let email = req.body.email;
    let password = req.body.newPassword;
    try{
        con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,email,password,'Active','N'],function(err,result){
            if(err){
                console.log(err)
            }
            else{
                res.send({status: true, message: 'reset password successfully'})


            }
        });

    }
    catch(e){
        console.log("resetpassword",e)
    }
})
/**Change Password */
app.post('/changePassword',function(req,res){
    var con  =connection.switchDatabase('boon_client')

    let oldpassword = req.body.oldPassword;
    let newpassword = req.body.newPassword;
    let id = req.body.empId;
    let login = req.body.email;
    try{
        con.query('CALL `validatelastpasswordmatch` (?,?,?,?)',[id,login,oldpassword,newpassword],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            console.log("result",result[0])
            if(result[0]==0){
                con.query('CALL `setemployeelogin`(?,?,?,?,?)',[id,login,newpassword,'Active','n'],function(err,result){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send({status: true, result})


                    }
                })

            }
            else if(result[0]==-1){
                res.send(result)
            }
            else{
                res.send(result)

            }

        });
        // con.end();

    }
    catch(e){
        console.log("changepassword",e)
    }

})


/**employee login */
app.get('/api/emp_login/:email/:password',function(req,res,next){
    var con  =connection.switchDatabase('boon_client')

    try{
        var email = req.params.email;
        var password = req.params.password;
        con.query('CALL `authenticateuser` (?,?)',[email,password],function(err,results,next){
            var result = Object.values(JSON.parse(JSON.stringify(results[0][0])))
            if (result[0] > 0) {
                con.query('CALL `getemployeeinformation`(?)',[email],function(err,results,next){
                    try{
                        if(results.length>0){
                            var result = JSON.parse(results[0][0].result)
                            res.send({status: true,result})

                        }
                        else{
                            res.send({status: false,result})
                        }
                    }
                    catch (e){
                        console.log("employee_login",e)
                    }

                })

            }
            else{
                res.send({status: false,message:"Invalid userName or password"})
            }

        });

    }
    catch (e){
        console.log("employee_login",e)
    }
})

/*Set comapny information*/
app.post('/api/setCompanyInformation',function(req,res) {
    var con  =connection.switchDatabase('boon_client')
    let companyInformation={}
    companyInformation.companyname=req.body.fullCompanyName;
    companyInformation.companywebsite = req.body.companyWebsite;
    companyInformation.primarycontactnumber=req.body.primaryContact;
    companyInformation.primarycontactemail=req.body.primaryContactEmail;
    companyInformation.address1=req.body.address;
    companyInformation.address2=req.body.addressOne?req.body.addressOne:'';
    companyInformation.country = req.body.countryId;
    companyInformation.state = req.body.stateId;
    companyInformation.city = req.body.cityId;
    companyInformation.pincode=req.body.pincode;
    try {
        con.query("CALL `setmastertable` (?,?,?)",['companyinformation','boon_client',JSON.stringify(companyInformation)]
            ,
            function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to add company information'});
                } else {
                    res.send({status: true, message: 'Company Information added successfully'})
                }
            });
        // con.end();

    }catch (e) {
        console.log('setCompanyInformation :',e)
    }
});

/*put comapny information*/
app.put('/api/putCompanyInformation',function(req,res) {
    var con  =connection.switchDatabase('boon_client')
    try {
        let companyInformation={}
        companyInformation.CompanyName=req.body.fullCompanyName;
        companyInformation.CompanyWebsite = req.body.companyWebsite;
        companyInformation.PrimaryContactNumber=req.body.primaryContact;
        companyInformation.PrimaryContactEmail=req.body.primaryContactEmail;
        companyInformation.Address1=req.body.address;
        companyInformation.Address2=req.body.addressOne?req.body.addressOne:" ";
        companyInformation.Country = req.body.countryId;
        companyInformation.State = req.body.stateId;
        companyInformation.City = req.body.cityId;
        companyInformation.Pincode=req.body.pincode;
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `updatemastertable` (?,?,?,?)",['companyinformation','Id',req.body.Id,JSON.stringify(companyInformation)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update company information'});
            } else {
                res.send({status: true, message: 'Company Information updated Successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('putCompanyInformation :',e)
    }
});

/*Get Department*/
app.get('/api/getDepartment',function(req,res) {
    
    try {
        var con  =connection.switchDatabase('boon_client')


        con.query("CALL `getDepartment` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end()

    }catch (e) {
        console.log('getDepartment :',e)

    }
});

/*set Department*/
app.get('/api/setDepartment',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')


        con.query("CALL `setdepartment` (?)",[req.body.departmentName], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to add department'});
            } else {
                res.send({status: true,message:'Department added successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setDepartment :',e)

    }
});

/*Get Designation*/
app.get('/api/getDesignation',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getmastertable` (?)", ['designationsmaster'],function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getDesignation :',e)

    }
});

/*set Designation*/
app.post('/api/setDesignation',function(req,res) {
    try {
        // var con  =connection.switchDatabase('boon_client')

        let infoDesignationMaster={}
        infoDesignationMaster.designation=req.body.designationName;
        infoDesignationMaster.status = 'Active';
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `setmastertable` (?,?,?)",['designationsmaster','boon_client',JSON.stringify(infoDesignationMaster)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to insert designation'});
            } else {
                res.send({status: true,message:'Designation added successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setDesignation :',e)

    }
});
/*set Designation*/
app.put('/api/putDesignation',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        let infoDesignationMaster={}
        infoDesignationMaster.designation=req.body.name;
        infoDesignationMaster.status = req.body.status;

        con.query("CALL `updatemastertable` (?,?,?,?)",['designationsmaster','id',req.body.id,JSON.stringify(infoDesignationMaster)], function (err, result, fields) {

            if (err) {
                res.send({status: false, message: 'Unable to update designation'});
            } else {
                res.send({status: true,message:'Designation updated successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setDesignation :',e)

    }
});
app.post('/api/updateStatus',checkRecord, function(req,res) {
    try {
         console.log
        if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)){
        var con  =connection.switchDatabase('boon_client')
;
        con.query("CALL `updatestatus` (?,?,?)",['departmentsmaster',req.body.id,req.body.status], function (err, result, fields) {

            if (err) {
                res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
            } else {
                res.send({status: true,message:'Department is '+req.body.status+' successfully'})
            }
        });
        con.end();
        } else if(req.body.isexists.status == false){
            res.send({status: false, message: "We are unable to "+req.body.status+" this department please try again later"});
        } else{
            res.send({status: false, message: "This department have Active employees. So we are unable to inactivate this department now. Please move those employee to another department and try again"});
        }

    }catch (e) {
        console.log('setWorkLocation :',e)

    }
});

/*set Work Location*/
app.post('/api/setWorkLocation',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
;
        console.log("work,",req.body)
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
            status:req.body.status?req.body.status:'Active'
        }
        console.log('fffff',JSON.stringify(infoLocationsMaster));
        con.query("CALL `setcompanyworklocation` (?)",[JSON.stringify(infoLocationsMaster)], function (err, result, fields) {
            console.log('err',err,result)

            if (err) {
                res.send({status: false, message: 'Unable to add work location'});
            } else {
                res.send({status: true,message:'Work Location added successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setWorkLocation :',e)

    }
});
/**getstates */
app.get('/api/getStates/:id',function(req,res){
    let id = req.params.id;
    console.log("id details",id)
    // let id = 1;
    try{
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getstatesforcountry`(?)",[id],function(error,result,fields){
            console.log("error",error)
            console.log("result",result)
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
})
/**get Cities */
app.get('/api/getCities/:id',function(req,res){
    let id = req.params.id;
    // let id = 1;
    try{
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getcitiesforstate`(?)",[id],function(error,result,fields){
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
})
/*Get Work Location*/
app.post('/api/getWorkLocation',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
;
        var id = null;
        con.query("CALL `getcompanyworklocation` (?)",[id], function (err, result, fields) {
            if (result.length > 0) {
                var data = JSON.parse((result[0][0].json))
                //    var resultdata=[];
                //    var inactive =[];
                //    for(var i=0;i<data.length;i++){
                //        if(data[i].status == "Active"){
                //            resultdata.push(data[i]);
                //        }
                //        else{
                //            inactive.push(data[i])
                //        }

                //    }
                res.send({data: data, status: true});

            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getWorkLocation :',e)

    }
});

/*Get Work Location*/
app.post('/api/getactiveWorkLocation',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
;
        var id = null;
        con.query("CALL `getcompanyworklocation` (?)",[id], function (err, result, fields) {
            if (result && result.length > 0) {
                var data = JSON.parse((result[0][0].json))
                var resultdata=[];
                var inactive =[];
                for(var i=0;i<data.length;i++){
                    if(data[i].status == "Active"){
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
        con.end();

    }catch (e) {
        console.log('getWorkLocation :',e)

    }
});


/*Set Departments*/
app.post('/api/setDepartments',function(req,res) {
    try {
        let info={}
        // info.DeptId=20,
        info.deptname=req.body.departmentName;
        info.depthead=null;
        info.headcount=null;
        info.status='Active';
        console.log("hdbjhfd",info)
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `setmastertable` (?,?,?)",['departmentsmaster','boon_client',JSON.stringify(info)], function (err, result, fields) {
            console.log("one",err)
            if (err) {
                res.send({ status: false,message:'Unable to add department'});
            } else {
                res.send({status: true,message:'Departments added successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setmastertable :',e)

    }
});

/*Set Departments*/
app.put('/api/putDepartments',function(req,res) {
    try {
        let info={}
        info.id=req.body.id;
        info.deptname=req.body.name;
        info.depthead=null
        info.headcount=0;
        info.status = req.body.status;
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `updatemastertable` (?,?,?,?)",['departmentsmaster','id',req.body.id,JSON.stringify(info)], function (err, result, fields) {
            console.log("ttt",result,err)
            if (err) {
                res.send({ status: false,message:'Unable to update departments'});
            } else {
                res.send({status: true,message:'Department updated successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('getHolidays :',e)

    }
});
/*Get Holidays*/
app.get('/api/getHolidays',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `getHolidays` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getHolidays :',e)

    }
});/*set Holidays*/

app.post('/api/setHolidays/:companyName',function(req,res) {

    try {
        var con  =connection.switchDatabase(req.params.companyName)

        // switchDatabase(req.params.companyName);
        let tname='holidaysmaster';
        let info={}
        let reqData=req.body;
        console.log(req.body)
        let k=0;
        if(req.body.holidayDate == null){

            reqData.forEach(element =>{
            info.description=element.holidayName;
            info.date=element.holidayDate;
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let hDate = (new Date(element.holidayDate));
            info.date = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
            info.day=days[hDate.getDay()];

            info.year=hDate.getFullYear();
            info.leave_cycle_year =(new Date().getFullYear())

            info.location=element.city;

            con.query("CALL `setmastertable` (?,?,?)",[tname,req.params.companyName,JSON.stringify(info)], function (err, result, fields) {
                k+=1;
                console.log("errrorrrr",err)
                if (err) {
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

});

/*set Holidays*/
app.put('/api/putHolidays/:companyShortName',function(req,res) {
    try {
        // switchDatabase(req.params.companyShortName)
        var con  =connection.switchDatabase(req.params.companyShortName);
        let tname='holidaysmaster';
        let info={};
        info.description=req.body.holidayName;
        info.date=req.body.holidayDate;
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let hDate = (new Date(req.body.holidayDate));
        info.date = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
        info.day=days[hDate.getDay()];
        info.year=hDate.getFullYear();
        info.location=req.body.city;
        con.query("CALL `updatemastertable` (?,?,?,?)",[tname,'id',req.body.hId,JSON.stringify(info)], function (err, result, fields) {
            console.log("holidays",err)
            if (err) {
                res.send({status: false, message: 'Unable to update holidays'});
            } else {

                res.send({status: true, message: 'Holiday updated successfully'});
            }
        });
        con.end();


    }catch (e) {
        console.log('putHolidays :',e)

    }
});




/*Set Holidays Status*/
app.post('/api/setHolidaysStatus/:holidaysId',function(req,res) {
    try {
        //        var con  =connection.switchDatabase('boon_client')

        var con  =connection.switchDatabase('boon_client');

        con.query("CALL `setHolidaysStatus` (?)",[req.params.holidaysId,req.body.status], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update holidays status'});
            } else {
                res.send({status: true,message:'Holidays status updated successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setHolidaysStatus :',e)

    }
});
/*Get Shift*/
app.get('/api/getShift',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getShift` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getShift :',e)

    }
});


// /*Get Master table*/
app.get('/api/getMastertable/:tableName/:status/:page/:size/:companyShortName',function(req,res) {
    try {
       
        var tName = req.params.tableName;
        if(req.params.status=="null"){

            console.log("req.params.tableName;",tName,req.params.status)
            var con  =connection.switchDatabase('boon_client')

            con.query("CALL `getmastertable` (?,?,?,?)",[tName,null,req.params.page,req.params.size], function (err, result, fields) {
                console.log("req.params.tableName;",err)

                if (result && result.length > 0) {
                    if(tName == 'holidaysmaster'){
                        for (let i=0; i<result[0].length;i++){
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                        }
                        res.send({data: result[0], status: true});


                    }else {
                        // console.log("req.params.tableName; ",result )

                        res.send({data: result[0], status: true});
                    }
                } else {
                    res.send({status: false})
                }
            });
            con.end();
        }
        else{
            var con  =connection.switchDatabase('boon_client');
            con.query("CALL `getmastertable` (?,?,?,?)",[tName,req.params.status,req.params.page,req.params.size], function (err, result, fields) {
                // console.log("ff",err,result);
                if (result && result.length > 0) {
                    if(tName == 'holidaysmaster'){
                        for (let i=0; i<result[0].length;i++){
                            let hDate = (new Date(result[0][i].Date));
                            result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                        }
                        res.send({data: result[0], status: true});


                    }else {
                        // console.log("req.params.tableName; ",result )

                        res.send({data: result[0], status: true});
                    }
                } else {
                    res.send({status: false})
                }
            });
            con.end();


        }
    }catch (e) {
        console.log('getMastertable :',e)

    }
});

/*Get Master table*/
app.get('/api/getLeaveTypes/:tableName/:page/:size',function(req,res) {
    try {
        // switchDatabase(null);
        var con  =connection.switchDatabase('boon_client');


        var tName = req.params.tableName;

        con.query("CALL `getmastertable` (?,?,?)",[tName,req.params.page,req.params.size], function (err, result, fields) {

            if (result.length > 0) {
                if(tName == 'HolidaysMaster'){
                    // console.log("req.params.tableName; ",result[0].length )
                    for (let i=0; i<result[0].length;i++){
                        let hDate = (new Date(result[0][i].Date));
                        result[0][i].Date = hDate.getFullYear() + "-" + ('0'+(hDate.getMonth() + 1)).slice(-2) + "-" + ('0'+(hDate.getDate())).slice(-2);
                    }
                    res.send({data: result[0], status: true});


                }else {
                    res.send({data: result[0], status: true});
                }
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getMastertable :',e)

    }
});



/*Set Shift*/

app.post('/api/setShift',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `setShift` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert shift'});
                } else {
                    res.send({status: false, message: 'Shift added Successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setShift :',e)
    }
});

/*put Shift*/

app.put('/api/putShift',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `putShift` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update shift'});
                } else {
                    res.send({status: false, message: 'Shift updated Successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('putShift :',e)
    }
});

/*Get Add Leave Balance*/
app.get('/api/getAddLeaveBalance',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getAddLeaveBalance` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getAddLeaveBalance :',e)

    }
});

/*Set Add Leave Balance*/

app.post('/api/setAddLeaveBalance',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `setAddLeaveBalance` (?,?,?,?,?)",
            [req.body.leaveTypeName, req.body.description, req.body.color], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert leave balance'});
                } else {
                    res.send({status: false, message: 'Leave balance added Successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setAddLeaveBalance :',e)
    }
});

/*put Add Leave Balance*/

app.put('/api/putAddLeaveBalance',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `putLeaveBalance` (?,?,?,?,?)",
            [req.body.shiftName, req.body.description, req.body.startTime,req.body.endTime,req.body.status], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update leave balance'});
                } else {
                    res.send({status: false, message: 'Leave balance updated Successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('putLeaveBalance :',e)
    }
});
/*Delete Add Leave Balance
*
* */

app.delete('/api/deleteAddLeaveBalance/:leaveBalanceId',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `deleteLeaveBalance` (?)",[req.params.leaveBalanceId], function (err, result, fields) {

            if (err) {
                res.send({status: false, message: 'Unable to delete leave balance'});
            } else {
                res.send({status: false, message: 'Leave balance deleted Successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('deleteLeaveBalance :',e)
    }
});

/*Get employee Master*/
app.post('/api/getEmployeeMaster',function(req,res) {

    var con  =connection.switchDatabase('boon_client')
;
    try {
        console.log(req.body.id);
        con.query("CALL `getemployeemaster` (?)",[req.body.id], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
                console.log(result[0])
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getEmployeeMaster :',e)

    }
});

/**getreportingmanagers */
app.get('/api/getReportingManager',function(req,res){
    try{
         var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getreportingmanagers`()",function (err, result, fields) {
            if(err){
                console.log(err)
            }
            else{
                console.log(result)
                res.send(result)
            }

        });
        con.end();

    }
    catch(e){
        console.log("getreportingmanager",e)
    }
})
/*Set Employee Master*/

app.post('/api/setEmployeeMaster',function(req,res) {
    try {
        let hDate = (new Date(req.body.dateOfBirth));
        var  dateOfBirth = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
        let JoinDate = (new Date(req.body.dateOfJoin));

        var  dateOfJoin = JoinDate.getFullYear() + "-" + (JoinDate.getMonth() + 1) + "-" + (JoinDate.getDate());
               var con  =connection.switchDatabase('boon_client')
;
   let input = {
            empid:req.body.empId,
            firstname: req.body.firstName,
            middlename: req.body.middleName,
            lastname: req.body.lastName,
            personalemail: req.body.personalEmail,
            officeemail: req.body.officeEmail,
            dateofbirth: dateOfBirth,
            gender: req.body.gender,
            maritalstatus: req.body.maritalStatus,
            usertype: req.body.userType,
            designation: req.body.designation,
            department: parseInt(req.body.department),
            employmenttype: req.body.employmentType,
            dateofjoin: dateOfJoin,
            companylocation: req.body.companyLocation,
            // reportingmanager: req.body.reportingManager,
       reportingmanager:27,

       bloodgroup: req.body.bloodGroup,
            contactnumber: req.body.contactNumber,
            emergencycontactnumber: req.body.emergencyContactNumber,
            emergencycontactrelation: req.body.emergencyContactRelation,
            emergencycontactname: req.body.emergencyContactName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            paddress: req.body.pAddress,
            pcity: req.body.pCity,
            pstate: req.body.pState,
            ppincode: req.body.pPincode,
            pcountry: req.body.pCountry,
            aadharnumber: req.body.aadharNumber,
            passport: req.body.passport,
            bankname: req.body.bankName,
            ifsccode: req.body.iFSCCode,
            nameasperbankaccount: req.body.nameAsPerBankAccount,
            branchname: req.body.branchName,
            bankaccountnumber: req.body.bankAccountNumber,
            uanumber: req.body.uANumber,
            pfaccountnumber: req.body.pFAccountNumber,
            pan: req.body.pAN,
            status: 'Active',
            esi: req.body.eSI,
            shift: req.body.shift,
            relations: {},
            education: {},
            experience:{},
            relations: req.body.relations,
            education: req.body.education,
            experience: req.body.experience
        };
        // console.log(JSON.stringify(input));
        console.log((input))
        con.query("CALL `setEmployeeMaster` (?)",
            [JSON.stringify(input)], function (err, result, fields) {
            console.log("eee",err)

                if (err) {
                    if(err.code == 'ER_DUP_ENTRY'){
                        var val
                        val = err.sqlMessage.split('entry')[1];

                        res.send({status: false, message: val.split('for')[0]+' is already exist in database'});
                    }else{
                        res.send({status: false, message: 'Unable to add employee'});
                    }
                } else {
                    res.send({status: true, message: 'Employee added successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setEmployeeMaster :',e)
    }
});

/*put Employee Master*/

app.put('/api/putEmployeeMaster',function(req,res) {


    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `putemployeemaster` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to update employee'});
                } else {
                    res.send({status: false, message: 'Employee updated Successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('putEmployeeMaster :',e)
    }
});
/*Get search employee */

app.put('/api/getSearch/:employeeName/:employeeId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getsearch` (?,?)",
            [req.params.employeeName,req.params.employeeId], function (err, result, fields) {

                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });
        con.end();

    }catch (e) {
        console.log('getSearch :',e)
    }
});


/*Get User Leave Balance*/
app.get('/api/getLeaveBalance/:empid',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        let id = req.params.empid;
        con.query("CALL `get_employee_leave_balance` (?)",[id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getLeaveBalance :',e)

    }
});


/*Get all Leaves*/
app.get('/api/getLeaves/:page/:size',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        console.log("temppp",req.params.page,req.params.size)
        con.query("CALL `getleavepolicies` (?,?)", [0],function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getLeaves :',e)

    }
});




/*Get Leave Rules*/
app.get('/api/getLeaveRules/:Id/:page/:size',function(req,res) {
    try {
        // switchDatabase(null)
               var con  =connectionwitchDatabase('boon_client')

        con.query("CALL `getleavepolicies` (?,?,?)", [req.params.Id,req.params.page,req.params.size],function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getLeaves :',e)

    }
});
/*Get Get Manager And HrDetails*/
app.get('/api/getManagerAndHrDetails/employeeId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getManagerAndHrDetails` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getManagerAndHrDetails :',e)

    }
});
/*Set Set Apply Leave */

app.post('/api/setApplyLeave',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `setApplyLeave` (?,?,?,?,?)",
            [], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable to insert leave request'});
                } else {
                    res.send({status: false, message: 'Leave apployed successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setApplyLeave :',e)
    }
});

/*Set Delete Leave Request */
app.post('/api/setDeleteLeaveRequest',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        let id = req.body.id;
        let empid = req.body.empid;
        let leavetype = req.body.leavetypeid;
        let fromDate = new Date(req.body.fromdate);
        let toDate = new Date(req.body.todate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fdate = myDateString1;
        let tdate = myDateString2;let fromhalfday = req.body.fromhalfdayleave;
        let tohalfday =  req.body.tohalfdayleave;
        let leavecount = req.body.leavecount;
        let leavereason = req.body.leavereason;
        let contactnumber = req.body.contactnumber;
        let email = req.body.contactemail;
        let address = 'test';
        let leavestatus = "Deleted"
        let actionreason = req.body.actionreason;
        let workedDate = req.body.worked_date?req.body.worked_date:null;
        con.query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [id,empid,leavetype,fdate,tdate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,workedDate], function (err, result, fields) {
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });
        con.end();

    }catch (e) {
        console.log('setDeleteLeaveRequest :',e)
    }
});
/*CancelLeave Request */
app.post('/api/cancelLeaveRequest',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        let id = req.body.id;
        let empid = req.body.empid;
        let leavetype = req.body.leavetypeid;
        let fromDate = new Date(req.body.fromdate);
        let toDate = new Date(req.body.todate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fdate = myDateString1;
        let tdate = myDateString2;let fromhalfday = req.body.fromhalfdayleave;
        let tohalfday =  req.body.tohalfdayleave;
        let leavecount = req.body.leavecount;
        let leavereason = req.body.leavereason;
        let contactnumber = req.body.contactnumber;
        let email = req.body.contactemail;
        let address = 'test';
        let leavestatus = "Cancelled"
        let actionreason = req.body.actionreason;

        con.query("CALL `set_employee_leave` (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [id,empid,leavetype,fdate,tdate,fromhalfday,tohalfday,leavecount,leavereason,leavestatus,contactnumber,email,address,actionreason,null], function (err, result, fields) {
                if (err) {
                    res.send({status: false});
                } else {
                    res.send({status: true})
                }
            });
        con.end();

    }catch (e) {
        console.log('cancelLeaveRequest :',e)
    }
});
/*Set put Leave Request */

app.put('/api/updateLeaveRequest/:Id',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `updateLeaveRequest` (?)",
            [req.params.LeaveId], function (err, result, fields) {

                if (err) {
                    res.send({status: false, message: 'Unable able to update leave request'});
                } else {
                    res.send({status: false, message: 'Leave request updated successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('updateLeaveRequest :',e)
    }
});

/*set CompOffReviewApprove*/
app.set('/api/setCompOffReviewApprove',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `setCompOffReviewApprove` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('setCompOffReviewApprove :',e)

    }
});

/*Get UserOnLeavesmpOff*/
app.get('/api/getUserOnLeaves',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getUserOnLeaves` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getUserOnLeaves :',e)

    }
});


/*Get Approvals*/
app.get('/api/getApprovals',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getApprovals` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getApprovals :',e)

    }
});

var saveImage = function(imgPath){
    fs.unlink(imgPath,function (error) {
        console.log(imgPath);
        console.log(error);
        if(error && error.code =='ENOENT'){
            console.info("file doesn't exist,won't remove it. ")
        }else if (error) {
            console.error("error occured while trying to remove  file", )
        }else{
            console.info("removed")
        }

    })

    file.mv( imgPath,function (err, result) {
        console.log(err);
        if(err)
            throw err;

    })


}
var file
app.post('/api/setUploadImage/:companyName',function (req, res) {
    // switchDatabase(Buffer.from(req.params.companyShortName,'base64').toString('ascii'))
    console.log('companyName',req.params.companyName)
    try{
        var id =1;
        file=req.files.file;
        console.log(req.files);
        console.log("fils",file)
        var folderName = './logos/Apple/'

        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)

            }else {
                file.mv(path.resolve(__dirname,folderName,id+'.png'),function(error){
                    if(error){
                        console.log(error);
                    }
                    res.send({message:'Image Uploaded Succesfully'})

                })


            }
        } catch (err) {
            console.error(err)
        }
    }catch (e) {
        console.log("setUploadImage:",e)
    }
});
/*set profilepicture */
app.post('/set_profilepicture/:companyname/:id',function(req,res){
    try{
        let id = req.params.id;
        let companyName = req.params.companyname;
        console.log(req.files)
        console.log(id)
        console.log(companyName)
        let image = req.files.image;
        let foldername = './profile_picture/'
        if(!fs.existsSync(foldername)){
            fs.mkdirSync(foldername)
        }
        image.mv(path.resolve(__dirname,foldername,companyName+'.png'),function(error){
            if(error){
                console.log(error);
            }
            res.send({message:'Image Uploaded Succesfully'})

        })

    }
    catch(e){
        console.log('set_profilepicture',e)

    }
});

/*set setLeaveConfigure*/
app.post('/api/setLeaveConfigure',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        var l=0;
        for(let i =0;i<req.body.length;i++){
            let roleValues={}
            roleValues.RuleId=req.body[i].Id;
            roleValues.Value = req.body[i].value;
            let hDate = (new Date());
            roleValues.EffectiveFromDate = hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());
            roleValues.EffectiveToDate=hDate.getFullYear() + "-" + (hDate.getMonth() + 1) + "-" + (hDate.getDate());;


            con.query("CALL `setMasterTable` (?,?,?)",['LM_RuleValues','LMTHREE',JSON.stringify(roleValues)], function (err, result, fields) {
                l+=1;
                console.log(err)
                if(l ===req.body.length){
                    if (result.length > 0) {
                        res.send({data: result, status: true});
                    } else {
                        res.send({status: false})
                    }}
            });
            con.end();

        }



    }catch (e) {
        console.log('setLeaveConfigure :',e)

    }
});

app.post('/api/setLeavePolicies',function(req,res) {

    let ruleData = req.body.ruleData;

    try{
        var con  =connection.switchDatabase('boon_client');

        con.query("CALL `setleavepolicies` (?)",[JSON.stringify(ruleData)], function (err, result, fields) {
            console.log(err);
            if(err){
                res.send({message: 'Unable to update leave policy', status: false})
            }else{
                res.send({message: "Rules updated successfully", status: true})
            }

        });
        con.end();


    }
    catch(e){
        console.log("setLeavePolicies",e)
    }
});
//get Leavepolices
app.get('/api/getLeavePolicies/:leaveCategoryId/:isCommonRule/:pageNumber/:pageSize',function(req,res) {
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

    console.log("getLeavePolicies",leaveCategoryId,isCommonRule,pageNumber,pageSize)

    var con  =connection.switchDatabase('boon_client')

    try{

        con.query("CALL `getleavepolicies` (?,?)",[leaveCategoryId,isCommonRule], function (err, result, fields) {
            console.log("temp",err)
            if (result && result.length > 0) {

                res.send({data: result[0], status: true});

            } else {
                res.send({status: false})
            }

        });
        con.end();


    }catch(e){
        console.log("getLeavePolicies",e)
    }

});

// /*Get Employee Search Information*/
app.post('/api/getEmployeeDetails',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `getemployeemasterforsearch` (?,?,?,?)", [req.body.employeeId,req.body.employeeName,req.body.page,req.body.tableSize], function (err, result, fields) {
            console.log(err)
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();
    }catch (e) {
        console.log('getCompanyInformation :',e)

    }
});
/*Delete Holiday*/

app.delete('/api/deleteHoliday/:holidayId',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client');
        console.log(req.params.holidayId);
        con.query("CALL `deleteholidays` (?)",[req.params.holidayId], function (err, result, fields) {
            console.log("deleteHolidays",err)
            if (err) {
                res.send({status: false, message: 'Unable to delete holiday'});
            } else {
                res.send({status: true, message: 'Holiday deleted successfully'})
            }
        });
        con.end();
    }catch (e) {
        console.log('deleteHoliday :',e)
    }
});
app.get('/api/getImage/:Id/:companyShortName', function (req, res, next) {

    try{
        folderName = './logos/Apple/';
        var imageData={}
        var flag=false;
        fs.readFile(folderName+'1.png',function(err,result){
            if(err){
                flag=false;
            }else{
                flag=true
                imageData.image=result;
            }
            imageData.success=flag;
            imageData.companyShortName=Buffer.from(req.params.companyShortName,'base64').toString('ascii');

            res.send(imageData)
        })
    }catch (e) {
        console.log("getImage:",e)
    }
});
/**remove/delete image */
app.delete('/api/removeImage/:Id/:companyShortName',function(req,res){
    try{
        let id = req.params.Id;
        let foldername = './logos/Apple/'
        fs.unlink(foldername+'1.png',function(err,result){
            if(err){
                console.log(err)
            }
            else{
                console.log("Image Deleted successfully")
            }
        })
    }
    catch(e){
        console.log("removeImage",e)
    }
});
app.post('/api/validatePrefix',function(req,res) {
    try {
        let input={}
        let prefix=req.body.prefix;
        var con  =connection.stchDatabase('boon_client')

// console.log('req.params.prefixreq.params.prefixreq.params.prefix',req.body.prefix)
        con.query("CALL `validate_prefix_assignment` (?)",prefix, function (err, result, fields) {
            console.log("resultresultresultresult",err,result)
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getUserOnLeaves :',e)

    }
});
app.post('/api/setNewLeaveType',function(req,res) {
    try {

        let leaveType = req.body.leaveTypeName;
        let leaveColor = req.body.leaveColor;
        let leaveDisplayName = req.body.displayName;
        var con  =connection.switchDatabase('boon_client')

console.log('req.params.prefixreq.params.prefixreq.params.prefix',leaveType,leaveColor,leaveDisplayName)
        con.query("CALL `setnewleavetype` (?,?,?)",[leaveType,leaveDisplayName,leaveColor], function (err, result, fields) {
            console.log("err",err)
            if (err) {
                res.send({status: false, message: 'Unable to add leave type'});
            } else {
                res.send({status: true, message: 'Leave Type added successfully'})
            }
        });
        con.end();
    }catch (e) {
        console.log('setNewLeaveType :',e)

    }
});
/*Get Leaves Type Info*/
app.get('/api/getLeavesTypeInfo',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `get_leavetypes_data` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        // con.end();

    }catch (e) {
        console.log('getLeavesTypeInfo :',e)

    }
});
/*setToggleLeaveType */
app.post('/api/setToggleLeaveType',function(req,res) {
    try {
        let leaveId = req.body.id;
        let leavetype_status = req.body.leavetype_status;

        var con  =connection.switchDatabase('boon_client')


        con.query("CALL `toggle_leavetype` (?,?)",
            [leaveId,leavetype_status], function (err, result, fields) {
                console.log(err);
                if (err) {
                    res.send({status: false, message: 'Unable to update leave policies status'});
                } else {
                    res.send({status: true, message: 'Leave policies status updated successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setleavepolicies :',e)
    }
});
/*Get Leave Rules*/
app.get('/api/getErrorMessages/:errorCode/:page/:size',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        console.log("Params",req.params);
        let errorCode;
        if(req.params.errorCode == 'null')
        {
            errorCode = '';
        }
        else {
            errorCode = req.params.errorCode
        }
        con.query("CALL `geterrormessages` (?,?,?)", [errorCode,req.params.page,req.params.size],function (err, result, fields) {
            console.log("getErrorMessages",err);
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('geterrormessages :',e)

    }
});
/*setErrorMessages */
app.post('/api/setErrorMessages',function(req,res) {
    try {

        var con  =connection.switchDatabase('boon_client')



        con.query("CALL `seterrormessages` (?)",
            [JSON.stringify(req.body.errorData)], function (err, result, fields) {
                console.log(err);
                if (err) {
                    res.send({status: false, message: 'Unable to update leave error messages'});
                } else {
                    res.send({status: true, message: 'Error Messages updated successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('seterrormessages :',e)
    }
});
/*Get Role Master*/
app.get('/api/getrolemaster',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getrolemaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getrolemaster :',e)
    }
});
/*Get Screen Master*/
app.get('/api/getscreensmaster',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getscreensmaster` (?)",['2'], function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getscreensmaster :',e)
    }
});
/*Get Functionalities Master*/
app.get('/api/getfunctionalitiesmaster',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getfunctionalitiesmaster :',e)
    }
});
/*Get Screen Functionalities Master*/
app.get('/api/getscreenfunctionalitiesmaster',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getscreenfunctionalitiesmaster` ()", function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
});
/*Get Role Screen Functionalities*/
app.get('/api/getrolescreenfunctionalities/:roleId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getrolescreenfunctionalities` (?,?)",[req.params.roleId,'2'], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getscreenfunctionalitiesmaster :',e)
    }
});
/*setRoleAccess */
app.post('/api/setRoleAccess',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `set_role_access` (?)",[JSON.stringify(req.body)], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update role permissions'});
                } else {
                    res.send({status: true, message: 'Role permissions updated successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setRoleAccess :',e)
    }
});
/*setRoleMaster */
app.post('/api/setRoleMaster',function(req,res) {
    try {

        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `setrolemaster` (?)",[req.body.roleName], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to add role name'});
                } else {
                    res.send({status: true, message: 'Role name successfully'})
                }
            });
        con.end();

    }catch (e) {
        console.log('setRoleMaster :',e)
    }
});

/*Get Holidays based on employeeId*/
app.get('/api/getHolidaysList/:empId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getemployeeholidays` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            }
        });
        con.end('getHolidaysList',e);

    }
    catch(e){
        console.log()
    }
})
app.get('/api/getLeaveTypesForAdvancedLeave/',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getleavetypesforadvancedleave` ()",function (err, result, fields) {
            if (result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getemployeeholidays :',e)
    }
});
/**get employe leaves */
app.get('/api/getemployeeleaves/:empid/:page/:size',function(req,res){
    try{
        var con  =connection.switchDatabase('boon_client')
        let id = req.params.empid
        let page = req.params.page;
        let size = req.params.size;
        con.query("CALL `get_employee_leaves`(?,?,?)",[id,page,size],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }

        });
        con.end();
    }
    catch(e){
        console.log('getemployeeholidays :',e)
    }
})
/*Get Employee Leave Balance*/
app.get('/api/getemployeeleavebalance/:empId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `get_employee_leave_balance` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }

        });
        con.end();



    }
    catch(e){
        console.log('getdurationforbackdatedleave :',e)
    }

});
app.post('/api/setAdvancedLeaveRuleValues',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        console.log("hello",req.body.leaveid)
        con.query("CALL `set_advanced_leave_rule_values` (?)",[req.body.leaveid],function (err, result, fields) {          
            console.log("kkkk",err,result)
            if (err) {
                res.send({message: 'Unable to update leave policy', status: false});
            } else {
                res.send({message: 'Rules updated successfully', status: true})
            }
        });
        con.end();

    }catch (e) {
        console.log('getemployeeleavebalance :',e)
    }
});
/*Get Employee Roles*/
app.get('/api/getemployeeroles/:empId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getemployeeroles` (?)",[req.params.empId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result, status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getemployeeroles :',e)
    }
});
/**Get Duration for back dated leave*/
app.get('/api/getdurationforbackdatedleave',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `getdurationforbackdatedleave` ()", function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getdurationforbackdatedleave :',e)
    }
});
/**Get Duration for back dated leave*/
app.post('/api/validateleave',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        let id = req.body.empid;
        let fromdate = req.body.fromDate;
        let todate = req.body.toDate;
        let leavetype = req.body.leaveType;
        var fromDate = new Date(fromdate);
        var toDate = new Date(todate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fdate = myDateString1;
        let tdate = myDateString2;
        var fromhalfday = req.body.fromDateHalf ? 1:0;
        var tohalfday =req.body.toDateHalf ? 1 : 0;
        var document = req.body.document ? 1 : 0;

        /*Sample Format: call validateleave(23,2,'2022-04-20','2022-04-29',0,0)*/
        con.query("CALL `validateleave` (?,?,?,?,?,?,?)",[id,leavetype,fdate,tdate,fromhalfday,tohalfday,document], function (err, result, fields) {
            if(result && result.length > 0) {
                res.send({data: result[0], status: true});
            }else {
                res.send({status: false})
            }
        });
        con.end();
    }catch (e) {
        console.log('validateleave :',e)
    }
});
/**get leave cycle for last month */
app.post('/api/getleavecyclelastmonth',function(req,res){
    try{
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_leave_cycle_last_month`()",function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });

    }
    catch(e){
        console.log('getleavecyclelastmonth :',e)
    }
})
/**set employee leave */
app.post('/api/setemployeeleave',function(req,res){
    try{
        var con  =connection.switchDatabase('boon_client');
        var id = req.body.id ? req.body.id : null;
        let empid = req.body.empid;
        let leavetype = req.body.leaveType;
        let fromdate = req.body.fromDate;
        let todate = req.body.toDate;
        var fromDate = new Date(fromdate);
        var toDate = new Date(todate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fdate = myDateString1;
        let tdate = myDateString2;
        let leavecount = req.body.leavecount
        let leavereason = req.body.reason;
        let leavestatus = "Submitted";
        let contactnumber = req.body.contact;
        let email = req.body.emergencyEmail;
        let address = 'test';
        var fromhalfdayleave=req.body.fromDateHalf?1:0;
        var tohalfdayleave =req.body.toDateHalf?1:0;
        var details = req.body.relation?req.body.relation:req.body.compOffWorkedDate?req.body.compOffWorkedDate:null;
        con.query("CALL `set_employee_leave`(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[id,empid,leavetype,fdate,tdate,fromhalfdayleave,tohalfdayleave,leavecount,leavereason,leavestatus,contactnumber,email,address,null,details],function(err,result,fields){
            console.log("heloooo1111",err,result)
            if(err){
                  res.send({status:false})
              }
              else{
                res.send({status:true,isLeaveUpdated:id?1:0})

              }
        })
    }
    catch(e){
        console.log('setemployeeleaverr',e)
    }
})
/**Get days to be disabled fromdate */
app.get('/api/getdaystobedisabledfromdate/:id/:leaveId',function(req,res){
    try{
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `getdays_to_be_disabled_for_from_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
            console.log("hello",err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        })
        con.end();
    }
    catch (e){
        console.log('getdaystobedisabledfromdate :',e)
    }
})

/**Get days to be disabled fromdate */
app.get('/api/getdaystobedisabledtodate/:id/:leaveId',function(req,res){
    try{
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `getdays_to_be_disabled_for_to_date` (?,?)",[req.params.id,req.params.leaveId == 'null'?null:req.params.leaveId],function(err,result,fields){
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        })
        con.end();

    }
    catch (e){
        console.log('getdaystobedisabletodate :',e)
    }
})
/*Get Days to be disabled*/
app.post('/api/getdaystobedisabled',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `getdaystobedisabled` (?)",[req.body.employee_id], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();
    }catch (e) {
        console.log('getdaystobedisabled :',e)
    }
});
/**Get getoffdayscount
 *
 * */
app.post('/api/getoffdayscount',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        let id = req.body.empid;
        let leavetypeid = req.body.leaveType;
        let fromDate =new Date(req.body.fromDate);
        let toDate = new Date(req.body.toDate);
        var myDateString1,myDateString2;
        myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
        myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
        let fDate = myDateString1;
        let tDate = myDateString2;
        var fromhalfday = req.body.fromDateHalf ? 1:0;
        var tohalfday =req.body.toDateHalf ? 1 : 0;
        con.query("CALL `getoffdayscount` (?,?,?,?,?,?)",[id,leavetypeid,fDate,tDate,fromhalfday,tohalfday], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();
    }catch (e) {
        console.log('getoffdayscount :',e)
    }
});

/**
 * Update designation status
 * @id
 * @status
 *
 * */
app.post('/api/designationstatus',checkRecord,function(req,res) {
    try {
        if(req.body.status === 'Active'||(!req.body.isexists.result && req.body.isexists.status)) {
            var con  =connection.switchDatabase('boon_client');
            con.query("CALL `updatestatus` (?,?,?)", ['designationsmaster', req.body.id, req.body.status], function (err, result, fields) {
                if (err) {
                    res.send({status: false, message: 'Unable to update designation status'});
                } else {
                    res.send({status: true, message: 'Designation is '+req.body.status+' successfully'})
                }
            });
            con.end();
        }else if(req.body.isexists.status == false){
            res.send({status: false, message: "We are unable to "+req.body.status+" this designation please try again later"});
        } else{
            res.send({status: false, message: "This designation have active employees. So we are unable to inactivate this designation now. Please move those employee to another designation and try again"});
        }
    }catch (e) {
        console.log('setWorkLocation :',e) }
});

/**
* getValidateExistingDetails
* @tableNaame
* @columnName
* @columnValue
*
* */
app.post('/api/getValidateExistingDetails',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `checkrecord` (?,?,?)",[req.body.tableName,req.body.columnName,req.body.columnValue], function (err, result, fields) {
            console.log("resultCheckrecords",result)
            if (result && result.length > 0) {
                res.send({data: result[1], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getValidateExistingDetails :',e)
    }
});

/*Get Holidays years for filter*/
app.get('/api/getHolidaysYears/:columnName',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')


        con.query("CALL `get_holiday_years_or_locations` (?)",[req.params.columnName], function (err, result, fields) {

            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end()

    }catch (e) {
        console.log('get_holiday_years_or_location :',e)

    }
});

/*Get Holidays filter */
app.get('/api/getHolidysFilter/:year/:locationId/:page/:size',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `getholidaysbyfilter` (?,?,?,?)", [req.params.year ==='null'?null:req.params.year,req.params.locationId ==='null'?null:req.params.locationId,req.params.page,req.params.size],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getDesignation :',e)

    }
});

function checkRecord (req, res, next){

    try{
         var con  =connection.switchDatabase('boon_client')
;
            con.query("CALL `checkrecord` (?,?,?)",[req.body.tableName,req.body.columnName,req.body.id], function (err, result, fields) {
                if (result && result.length > 0) {
                    req.body.isexists={result:result[1][0].isexists,status :true}
                    next()
                } else {
                    req.body.isexists={status:false}
                    next()

                }
            });
            con.end();


    }catch (e) {
        console.log("checkRecord in employee ",e)
    }

    // })

}

/**Set compOff*/

app.post('/api/setCompOff',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        con.query("CALL `set_compoff` (?,?,?,?,?,?,?,?,?)",
            [req.body.id,req.body.empId,req.body.workDate,parseInt(req.body.workedHours),parseInt(req.body.workedMinutes),req.body.reason,req.body.rmId,req.body.status,req.body.remarks], function (err, result, fields) {
                if(err){
                    res.send({status: false, message: 'Unable to applied comp-off'});
                }else {
                    res.send({status: true, message: 'Comp-off applied successfully'})
                }
            });
        con.end()

    }catch (e) {
        console.log('setCompOff :',e)
    }
});


/**Get compOff details*/
app.get('/api/getCompOff/:employeeId',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')

        con.query("CALL `get_compoffs` (?)",[req.params.employeeId], function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getCompOff :',e)

    }
});

/**Get calender details for compoff
 * @EmployeeId
 * @year
 * */

app.get('/api/getCompoffCalender/:calender',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        var calender = JSON.parse(req.params.calender);
        con.query("CALL `getcompoff_calendar` (?)",[calender.employeeId],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getCompoffCalender :',e)

    }
});

/**Get comp-off min working hours
 * @ no parameters
 *
 * */

app.get('/api/getCompOffMinWorkingHours',function(req,res) {
    try {
        var con=connection.switchDatabase('boon_client');
        con.query("CALL `get_compoff_min_working_hours` ()",function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getCompOffMinWorkingHours :',e)

    }
});
/** Get duration for backdated comp-off leave
 * @no parameters
 * */

app.get('/api/getDurationforBackdatedCompoffLeave',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_duration_for_backdated_compoff_leave` ()",function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getDurationforBackdatedCompoffLeave :',e)

    }
});


/** Get next leave Date for validations
 * @no parameters
 * */

app.get('/api/getNextLeaveDate/:input',function(req,res) {
    try {
        var input = JSON.parse(req.params.input)
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_next_leave_date` (?,?)",[input.id,input.date],function (err, result, fields) {
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getNextLeaveDate :',e)

    }
});
/**supportingdocument for  setleave*/
app.post('/api/setLeaveDocument/:cname/:empid',function(req,res) {
    file=(req.files.file);
    let cname = req.params.cname;
    let empid = req.params.empid;
    try {
        // if(req.body.leavetype===3){
            let foldername = './leavedocuments/'+cname+'/'+empid+"/"
            if (!fs.existsSync(foldername)) {
                fs.mkdirSync(foldername)
            }else {
                file.mv(path.resolve(__dirname,foldername,1+'.pdf'),function(error){
                    if(error){
                        console.log(error);
                    }
                    res.send({status:true})
                })   
            }
        // }

    }catch (e) {
        console.log('uploaddocument :',e)

    }
});

/**get relations for bereavement leave submit*/
app.get('/api/getEmployeeRelationsForBereavementLeave/:id',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_employee_relations_for_bereavement_leave` (?)",[req.params.id],function (err, result, fields) {
            console.log("errbee1111",err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getEmployeeRelationsForBereavementLeave :',e)

    }
});

/**Get approved compoffs dates for leave submit*/
app.get('/api/getApprovedCompoffs/:id',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_approved_compoffs` (?)",[req.params.id],function (err, result, fields) {
            console.log("get_approved_compoffs",err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getApprovedCompoffs :',e)

    }
});




/*set Designation*/
app.post('/api/updateLeaveDisplayName',function(req,res) {
    try {
        var con  =connection.switchDatabase('boon_client')
        console.log("hellllconsole.logl",req.body)

        let infoDesignationMaster={}
        infoDesignationMaster.id = req.body.leaveId;
        infoDesignationMaster.display_name = req.body.displayName;

        con.query("CALL `updatemastertable` (?,?,?,?)",['lm_leavesmaster','id',req.body.leaveId,JSON.stringify(infoDesignationMaster)], function (err, result, fields) {
            if (err) {
                res.send({status: false, message: 'Unable to update designation'});
            } else {
                res.send({status: true,message:'Designation updated successfully'})
            }
        });
        con.end();

    }catch (e) {
        console.log('setDesignation :',e)

    }
});

/**Get approved compoffs dates for leave submit*/
app.get('/api/getMaxCountPerTermValue/:id',function(req,res) {

    try {
        var con  =connection.switchDatabase('boon_client');
        con.query("CALL `get_max_count_per_term_value` (?)",[req.params.id],function (err, result, fields) {
            console.log("get_max_count_per_term_value",err,result)
            if (result && result.length > 0) {
                res.send({data: result[0], status: true});
            } else {
                res.send({status: false})
            }
        });
        con.end();

    }catch (e) {
        console.log('getMaxCountPerTermValue :',e)

    }
});

app.listen(6060,'0.0.0.0',function (err) {
    if (err)
        console.log('Server Cant Start ...Erorr....');
    else
        console.log('Server Started at : http://localhost:6060');
});

