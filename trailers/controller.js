var trailerDb = require( './dataBase' );
var statusCode = require( '../validation/statusCodes' );
var logger = require( '../loggers/log' );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );


module.exports.trailerList = function( req, res ) {
  try {
    trailerDb.queryDataBaseList( function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}


module.exports.trailerCreate = function( req, res ) {

  try {
    trailerDb.queryDataBaseCreate( req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.trailerUpdateById = function( req, res ) {

  try {
    trailerDb.updateDataBaseTrailerById( req.params, req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
	  console.log(e)
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.trailerListById = function( req, res ) {

  try {
    trailerDb.queryDataBaseListById( req.params, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.trailerCheckout = function( req, res ) {

  try {
    trailerDb.queryDataBaseCheckout( req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.trailerGraphStatus = function( req, res ) {

  try {

    reqValidation( req.params, joiSchemas.trailerGraphLocation, function( sts, msg ) {
      if ( sts == statusCode.success ) {

        if ( msg.groupBy == "0" || msg.groupBy == "1" ) {
          trailerDb.queryDataBaseGraphStatus( msg.groupBy, function( stat, resp ) {
            res.status( stat ).send( resp );
          } )
        } else if ( msg.groupBy == "location" ) {
          trailerDb.queryDataBaseGraphLocation( req.params, function( stat, resp ) {
            res.status( stat ).send( resp );
          } )
        }
      } else {
        res.status( sts ).send( msg );
      }

    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}