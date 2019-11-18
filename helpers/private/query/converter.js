//  ╔═╗╔═╗╔╗╔╦  ╦╔═╗╦═╗╔╦╗  ┌┬┐┌─┐  ┌─┐┌┬┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐
//  ║  ║ ║║║║╚╗╔╝║╣ ╠╦╝ ║    │ │ │  └─┐ │ ├─┤ │ ├┤ │││├┤ │││ │
//  ╚═╝╚═╝╝╚╝ ╚╝ ╚═╝╩╚═ ╩    ┴ └─┘  └─┘ ┴ ┴ ┴ ┴ └─┘┴ ┴└─┘┘└┘ ┴
// Convert the Waterline criteria into a Waterline Query Statement. This
// turns it into something that is declarative and can be easily used to
// build a SQL query.
// See: https://github.com/treelinehq/waterline-query-docs for more info
// on Waterline Query Statements.

var WLUtils = require('waterline-utils');

module.exports = function converter(options) {
    var Converter = WLUtils.query.converter;

    var statement = Converter(options);
    // This is important because SQL Server can't handle a limit bigger than 2147483647
    if(statement.limit > 2147483647 || statement.limit < -2147483647) {
        delete statement.limit
        delete statement.skip
    }

    return statement

}