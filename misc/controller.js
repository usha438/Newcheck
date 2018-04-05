var miscDb = require( './dataBase.js' );
var statusCode = require( '../validation/statusCodes' );
var logger = require( '../loggers/log' );


module.exports.beaconsResolve = function( req, res ) {

  try {
    miscDb.queryResolveBeacons( req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.beaconsList = function( req, res ) {

  try {
    miscDb.queryDataBaseBeacons( function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.beaconsListById = function( req, res ) {

  try {
    miscDb.queryDataBaseBeaconsId( req.params, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}