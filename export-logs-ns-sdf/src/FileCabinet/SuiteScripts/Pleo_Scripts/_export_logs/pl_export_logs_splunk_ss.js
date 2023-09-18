/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/https', 'N/url', 'N/encode', 'N/search'],
    
        (log, https, url, encode, search) => {

        const execute = (context) => {

            const stLogTitle = 'pl_export_logs_splunk_ss.js -';

            try {
                log.debug(stLogTitle, 'context: ' + JSON.stringify(context));
                exportLogsLogic(context);
            } catch (e) {
               log.error(stLogTitle, e);
               throw stLogTitle + 'Error: ' + e.message + ' - Contact NetSuite Administrator'
            }

        }


        function exportLogsLogic(context) {

            var systemNotesJson = getSystemNotesLogsFromNS(context);
            var loginAuditTrailJson = getLoginAuditTrailFromNS(context);
        }


        function getLoginAuditTrailFromNS(context) {

            var employeeSearchObj = search.create({
                type: "employee",
                filters:
                    [
                        ["loginaudittrail.date","within","today"] //yesterday
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "emailaddress",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "date",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "detail",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "ipaddress",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "requesturi",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "role",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "secchallenge",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "status",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "oauthaccesstokenname",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "oauthappname",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "user",
                            join: "loginAuditTrail"
                        }),
                        search.createColumn({
                            name: "useragent",
                            join: "loginAuditTrail"
                        })
                    ]
            });

            var arrColumns = employeeSearchObj.columns;
            arrColumns = JSON.parse(JSON.stringify(arrColumns));
            log.debug("arrColumns arrColumns", arrColumns);


            var loginAuditTrailLogs = [];

            employeeSearchObj.run().each(function(result) {

                var objTemp = {
                    emailaddress : result.getValue({name: "emailaddress",join: "loginAuditTrail"}),
                    date : result.getValue({name: "date",join: "loginAuditTrail"}),
                    detail : result.getValue({name: "detail",join: "loginAuditTrail"}),
                    ipaddress : result.getValue({name: "ipaddress",join: "loginAuditTrail"}),
                    requesturi : result.getValue({name: "requesturi",join: "loginAuditTrail"}),
                    role : result.getValue({name: "role",join: "loginAuditTrail"}),
                    secchallenge : result.getValue({name: "secchallenge",join: "loginAuditTrail"}),
                    status : result.getValue({name: "status",join: "loginAuditTrail"}),
                    oauthaccesstokenname : result.getValue({name: "oauthaccesstokenname",join: "loginAuditTrail"}),
                    oauthappname : result.getValue({name: "oauthappname",join: "loginAuditTrail"}),
                    user : result.getValue({name: "user",join: "loginAuditTrail"}),
                    useragent : result.getValue({name: "useragent",join: "loginAuditTrail"})
                }

                loginAuditTrailLogs.push(objTemp)

                return true;
            });

                log.debug("loginAuditTrail logs", loginAuditTrailLogs);

                return loginAuditTrailLogs;
        }


        function getSystemNotesLogsFromNS(context) {

            // System Notes
            var systemnoteSearchObj = search.create({
                type: "systemnote",
                filters:
                    [
                        ["date","within","today"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "record",
                            sort: search.Sort.ASC
                        }),
                        "name",
                        "date",
                        "context",
                        "type",
                        "field",
                        "oldvalue",
                        "newvalue",
                        "role",
                        "recordid",
                        "recordtype"
                    ]
            });

            var arrColumns = systemnoteSearchObj.columns;
            arrColumns = JSON.parse(JSON.stringify(arrColumns));


            var systemNotelogs = [];

            systemnoteSearchObj.run().each(function(result){

                var objTemp = {};

                for (var c = 0; c < arrColumns.length; c++) {

                    objTemp[arrColumns[c].name] = result.getValue(arrColumns[c].name);
                }
                systemNotelogs.push(objTemp)

                return true;
            });

            log.debug("system Note logs", systemNotelogs);

            return systemNotelogs;
        }


            return {execute};
});
