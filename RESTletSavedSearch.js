/**
* @NApiVersion 2.1
* @NScriptType Restlet
* @NModuleScope Public
*/

define(['N/log', 'N/search'], function(log, search) {
    function postProcess(request) {
        var response = {};
        try {
            if (!request.searchID) {
                throw {
                    type: 'error.SavedSearchAPIError',
                    name: 'INVALID_REQUEST',
                    message: 'No searchID was specified.'
                };
            }

            var pageSize = request.pageSize ? parseInt(request.pageSize, 10) : 1000; 
            var pageNumber = request.pageNumber ? parseInt(request.pageNumber, 10) : 1; 

            // Enforce pageSize between 5 and 1000 as per runPaged limitations.
            if (isNaN(pageSize) || pageSize < 5 || pageSize > 1000) {
                throw {
                    type: 'error.SavedSearchAPIError',
                    name: 'INVALID_PAGE_SIZE',
                    message: 'Page size must be between 5 and 1000.'
                };
            }

            if (isNaN(pageNumber) || pageNumber <= 0) {
                pageNumber = 1;
            }

            var searchObj = search.load({ id: request.searchID });
          
            log.debug('Fetching results', `Saved Search ID: ${request.searchID}, Page Number: ${pageNumber}, Page Size: ${pageSize}`);

            response.results = [];

            var pagedData = searchObj.runPaged({ pageSize: pageSize });

            if (pageNumber > pagedData.pageRanges.length) {
                throw {
                    type: 'error.SavedSearchAPIError',
                    name: 'PAGE_OUT_OF_RANGE',
                    message: `Requested page number ${pageNumber} exceeds the total number of pages ${pagedData.pageRanges.length}.`
                };
            }

            var page = pagedData.fetch({ index: pageNumber - 1 });

            page.data.forEach(function(result) {
                var resultObj = {};
                var values = {};

                result.columns.forEach(function(column, index) {
                    var columnLabel = column.label || column.name || `unnamed_column_${index}`;
                    var columnValue = result.getValue(column);
                    var columnText = result.getText(column);

                    var key = `${column.summary ? column.summary + '(' : ''}${columnLabel}${column.summary ? ')' : ''}`;

                    if (columnLabel in values) {
                        key = `${key}_${index}`;
                    }

                    if (columnText && columnText !== columnValue) {
                        values[key] = { value: columnValue, text: columnText };
                    } else {
                        values[key] = columnValue !== null ? columnValue : 'null';
                    }
                });

                resultObj.values = values;
                response.results.push(resultObj);
            });

            return response;

        } catch (e) {
            log.error({ title: 'Error Occurred', details: JSON.stringify(e) });
            return { error: { type: e.type, name: e.name, message: e.message } };
        }
    }

    return { post: postProcess };
});