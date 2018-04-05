var sql = require( 'mssql/msnodesqlv8' )
var credentials = require( './credentials' );
var logger = require( "../loggers/log" );
var statusCode = require( '../validation/statusCodes' );

var dbConfig = {
  server: credentials.server,
  database: credentials.database,
  user: credentials.user,
  password: credentials.password,
  port: credentials.port,
  options: {
    encrypt: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};


var conn = new sql.ConnectionPool( dbConfig );

var reqs = new sql.Request( conn );

conn.connect( function( err ) {
  if ( err ) {
    logger.error( "Unable to connect database" );
  } else {
    logger.info( "Database Connected" );
  }
} )


module.exports.GetDBData = function( field, callback ) {
  reqs.query( field, function( err, recordset ) {
    if ( err ) {
      callback( statusCode.clientError, {
        "Error": "Unable to execute Query"
      } )
    } else {
      if ( recordset.rowsAffected.length != 0 ) {
        callback( statusCode.success, {
          "status": "Record Updated Successfully"
        } )
      } else {
        callback( statusCode.success, recordset.recordsets )
      }
    }
  } )
}