/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/https', 'N/url', 'N/encode'],
    
        (log, https, url, encode) => {

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




        }

            return {execute};
});
