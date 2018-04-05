var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );

module.exports.queryUsers = function( callback ) {
  connection.GetDBData( sqlQuery.users, function( stat, rasp ) {
    if ( stat == statusCode.success ) {
      callback( stat, rasp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }

  } )
}