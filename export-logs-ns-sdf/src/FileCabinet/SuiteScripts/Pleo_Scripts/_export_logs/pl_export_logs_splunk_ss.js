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

            sendLogsToSplunk(systemNotesJson, loginAuditTrailJson);
        }

        function sendLogsToSplunk(systemNotesJson, loginAuditTrailJson) {

            // This function will send the logs to Splunk

            // Define your Splunk HEC endpoint and token
            var splunkEndpoint = 'https://your-splunk-hec-url';
            var splunkToken = 'your-splunk-hec-token';

            // Convert JSON objects to string
            var systemNotesString = JSON.stringify(systemNotesJson);
            var loginAuditTrailString = JSON.stringify(loginAuditTrailJson);

            // Define headers for the HTTP request
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Splunk ' + splunkToken
            };

            // Create a payload for system notes
            var systemNotesPayload = {
                event: systemNotesString
            };

            // Create a payload for login audit trail
            var loginAuditTrailPayload = {
                event: loginAuditTrailString
            };

            // Send system notes to Splunk
            var systemNotesResponse = https.post({
                url: splunkEndpoint,
                headers: headers,
                body: JSON.stringify(systemNotesPayload)
            });

            // Send login audit trail to Splunk
            var loginAuditTrailResponse = https.post({
                url: splunkEndpoint,
                headers: headers,
                body: JSON.stringify(loginAuditTrailPayload)
            });

            // Check if both requests were successful
            if (systemNotesResponse.code === 200 && loginAuditTrailResponse.code === 200) {
                // Logs sent successfully
                return true;
            } else {
                // Logs failed to send
                return false;
            }

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
