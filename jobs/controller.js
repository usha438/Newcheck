var jobsDb = require( './database' );
var statusCode = require( '../validation/statusCodes' );
var logger = require( '../loggers/log' );

module.exports.jobsList = function( req, res ) {
  try {
    jobsDb.queryDataBaseJobsList( function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}


module.exports.jobsListById = function( req, res ) {

  try {
    jobsDb.queryDataBaseListById( req.params, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.enumValues = function( req, res ) {
  try {
    jobsDb.queryDataBaseListValues( function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.jobsCreate = function( req, res ) {

  try {
    jobsDb.queryDataBaseJobsCreate( req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.jobUpdateById = function( req, res ) {

  try {
    jobsDb.queryDataBaseJobUpdate( req.params, req.body, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.deleteJob = function( req, res ) {

  try {
    jobsDb.deleteJobById( req.params, function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}

module.exports.switcherGraph = function( req, res ) {

  try {
    jobsDb.switcherGraphDb(req.params,function( stat, resp ) {
      res.status( stat ).send( resp );
    } )
  } catch ( e ) {
    res.status( statusCode.serverError ).json( {
      "status": "Error Occured"
    } );
  }
}
