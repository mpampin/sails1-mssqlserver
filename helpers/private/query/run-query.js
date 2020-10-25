//  ██████╗ ██╗   ██╗███╗   ██╗     ██████╗ ██╗   ██╗███████╗██████╗ ██╗   ██╗
//  ██╔══██╗██║   ██║████╗  ██║    ██╔═══██╗██║   ██║██╔════╝██╔══██╗╚██╗ ██╔╝
//  ██████╔╝██║   ██║██╔██╗ ██║    ██║   ██║██║   ██║█████╗  ██████╔╝ ╚████╔╝
//  ██╔══██╗██║   ██║██║╚██╗██║    ██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗  ╚██╔╝
//  ██║  ██║╚██████╔╝██║ ╚████║    ╚██████╔╝╚██████╔╝███████╗██║  ██║   ██║
//  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝     ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝
//
// Send a Native Query to the datastore and gracefully handle errors.

var _ = require('@sailshq/lodash');
var mssql = require('@mpampin/machinepack-mssql');

module.exports = function runQuery(options, cb) {
  //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
  //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   │ │├─┘ │ ││ ││││└─┐
  //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  └─┘┴   ┴ ┴└─┘┘└┘└─┘
  if (_.isUndefined(options) || !_.isPlainObject(options)) {
    throw new Error('Invalid options argument. Options must contain: connection, nativeQuery, and leased.');
  }

  if (!_.has(options, 'connection') || !_.isObject(options.connection)) {
    throw new Error('Invalid option used in options argument. Missing or invalid connection.');
  }

  if (!_.has(options, 'nativeQuery')) {
    throw new Error('Invalid option used in options argument. Missing or invalid nativeQuery.');
  }
  
  //  ╦═╗╦ ╦╔╗╔  ┌┐┌┌─┐┌┬┐┬┬  ┬┌─┐  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
  //  ╠╦╝║ ║║║║  │││├─┤ │ │└┐┌┘├┤   │─┼┐│ │├┤ ├┬┘└┬┘
  //  ╩╚═╚═╝╝╚╝  ┘└┘┴ ┴ ┴ ┴ └┘ └─┘  └─┘└└─┘└─┘┴└─ ┴
  mssql.sendNativeQuery({
    connection: options.connection,
    nativeQuery: options.nativeQuery,
    valuesToEscape: _.mapKeys(options.valuesToEscape, (_,k) => `p${k}`), // TODO: This should be in query compiler, not here
    meta: options.meta
  })
  .switch({
    // If there was an error, check if the connection should be
    // released back into the pool automatically.
    error: function error(err) {
      if (!options.disconnectOnError) {
        return cb(err);
      }

    },
    // If the query failed, try and parse it into a normalized format and
    // release the connection if needed.
    queryFailed: function queryFailed(report) {
      // Parse the native query error into a normalized format
      var parsedError;
      try {
        parsedError = mssql.parseNativeQueryError({
          nativeQueryError: report.error
        }).execSync();
      } catch (e) {
        if (!options.disconnectOnError) {
          return cb(e);
        }

        return;
      }

      // If the catch all error was used, return an error instance instead of
      // the footprint.
      var catchAllError = false;

      if (parsedError.footprint.identity === 'catchall') {
        catchAllError = true;
      }

      // If this shouldn't disconnect the connection, just return the normalized
      // error with the footprint.
      if (!options.disconnectOnError) {
        if (catchAllError) {
          return cb(report.error);
        }

        return cb(parsedError);
      }
      
      if (catchAllError) {
        return cb(report.error);
      }

      return cb(parsedError);
    },
    success: function success(report) {
      // If a custom primary key was used and the record has an `insert` query
      // type, build a manual insert report because we don't have the actual
      // value that was used.
      if (options.customPrimaryKey) {
        return cb(null, {
          result: {
            inserted: options.customPrimaryKey
          }
        });
      }

      //  ╔═╗╔═╗╦═╗╔═╗╔═╗  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬  ┬─┐┌─┐┌─┐┬ ┬┬ ┌┬┐┌─┐
      //  ╠═╝╠═╣╠╦╝╚═╗║╣   │─┼┐│ │├┤ ├┬┘└┬┘  ├┬┘├┤ └─┐│ ││  │ └─┐
      //  ╩  ╩ ╩╩╚═╚═╝╚═╝  └─┘└└─┘└─┘┴└─ ┴   ┴└─└─┘└─┘└─┘┴─┘┴ └─┘
      // If there was a query type given, parse the results.
      var queryResults = report.result;

      if (options.queryType) {
        try {
          // FIXME: Apparently, @mpampin/machinepack-mssql uses recordset for some queryTypes and rows for count, avg and sum
          var nativeQueryResult = {
            ...queryResults,
            rows: queryResults.recordset
          }
          queryResults = mssql.parseNativeQueryResult({
            queryType: options.queryType,
            nativeQueryResult: nativeQueryResult
          }).execSync();
        } catch (e) {
          return cb(e);
        }
      }

      return cb(null, queryResults);
    }
  });
};
