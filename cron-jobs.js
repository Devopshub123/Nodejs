"use strict";
var cron = require('node-cron');
const _ = require('underscore');
const async = require('async');

class Cronjobs {

    constructor(core) {
        this.core = core;

    }

    init(done) {
       // this.authorizeAccountLib = this.core.get('authorize-account');
       
        /*To run cronjob please uncomment below line and  run*/
         
        let manageCards = this.manageCardsActivity();
       

        setImmediate(done);
    }
    async manageCardsActivity() {
        let _this = this;
        try {
            cron.schedule('30 0 1 * *', async function () {       // first day of every month at 12 am
                if (DEBUG) console.log('cron job- manage Cards Activity - expiries');
                let response = (await (_this.storagesql.execProcedureOnPayments('manageCardsActivity', {}))).recordset;
            });
        }
        catch (e) {
            _this.storagesql.logError(errorLogServiceName, 'manageCardsActivity', null, null, e.message);
        }
    }

}

module.exports = Cronjobs;