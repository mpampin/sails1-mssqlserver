//   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗██╗     ███████╗
//  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║██║     ██╔════╝
//  ██║     ██║   ██║██╔████╔██║██████╔╝██║██║     █████╗
//  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║██║     ██╔══╝
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ██║███████╗███████╗
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝
//
//  ███████╗████████╗ █████╗ ████████╗███████╗███╗   ███╗███████╗███╗   ██╗████████╗
//  ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
//  ███████╗   ██║   ███████║   ██║   █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║
//  ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
//  ███████║   ██║   ██║  ██║   ██║   ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
//  ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Transform a Waterline Query Statement into a SQL query.

var mssql = require('@mpampin/machinepack-mssql');

module.exports = function compileStatement(statement, meta) {
  var report = mssql.compileStatement({
    statement: statement,
    meta: meta
  }).execSync();

  return report;
};
