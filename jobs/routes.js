var jobsController = require( './controller.js' );

var jobsRoute = function( app, router ) {

  app.route( '/jobs' )
    .get( jobsController.jobsList )
    .post( jobsController.jobsCreate );

  app.route( '/jobs/:jobID' )
    .get( jobsController.jobsListById )
    .delete( jobsController.deleteJob )
    .put( jobsController.jobUpdateById );

  app.route( '/enum' )
    .get( jobsController.enumValues );
	
  app.route( '/jobs/stats/:groupBy' )
    .get( jobsController.switcherGraph );

}

module.exports = jobsRoute;
