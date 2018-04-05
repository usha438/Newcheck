var usersDb = require( './dataBase' );
var statusCode = require( '../validation/statusCodes' );
var logger = require( '../loggers/log' );


module.exports.usersList = function( req, res ) {

  try {
    usersDb.queryUsers( function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}
