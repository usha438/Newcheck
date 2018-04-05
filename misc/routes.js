var miscController = require( './controller.js' );

var miscRoute = function( app, router ) {

  app.route( '/ResolveBeacons' )
    .post( miscController.beaconsResolve );
	
  app.route( '/Beacons' )
    .get( miscController.beaconsList );

  app.route( '/trailers/getByBeaconId/:beaconID' )
    .get( miscController.beaconsListById );
}

module.exports = miscRoute;