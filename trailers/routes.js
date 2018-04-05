var trailerController = require( './controller' );

var trailerRoute = function( app, router ) {

  app.route( '/trailers' )
    .get( trailerController.trailerList )
    .post( trailerController.trailerCreate );

  app.route( '/trailers/:trailerID' )
    .get( trailerController.trailerListById )
	.put( trailerController.trailerUpdateById );    

  app.route( '/trailers/checkout' )
    .post( trailerController.trailerCheckout );
	
  app.route( '/trailers/stats/:groupBy' )
    .get( trailerController.trailerGraphStatus );	
	
}

module.exports = trailerRoute;