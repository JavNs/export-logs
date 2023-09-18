/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/https', 'N/url', 'N/encode', 'N/search'],
    
        (log, https, url, encode, search) => {

        const execute = (context) => {
            const stLogTitle = 'pl_export_logs_splunk_ss.js -';

            //try {
                log.debug(stLogTitle, 'context: ' + JSON.stringify(context));

                exportLogsLogic(context);

            //} catch (e) {
              //  log.error(stLogTitle, e);
                //throw stLogTitle + 'Error: ' + e.message + ' - Contact NetSuite Administrator'
            //}

        }


        function exportLogsLogic(context) {

            getLogsFromNetSuite(context);

        }


        function getLogsFromNetSuite(context) {

            // System Notes

            var systemnoteSearchObj = search.create({
                type: "systemnote",
                filters:
                    [
                        ["date","within","lastbusinessweek"]
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
                //systemNotelogs = systemNotelogs + result;

                var objTemp = {};

                for (var c = 0; c < arrColumns.length; c++) {

                    objTemp[arrColumns[c].name] = result.getValue(arrColumns[c].name);
                }
                systemNotelogs.push(objTemp)

                return true;
            });

            log.debug("system Note logs", systemNotelogs);

        }

            return {execute};
});
