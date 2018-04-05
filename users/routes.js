var authUsers = require( './controller' );

var usersRoute = function( app, router ) {
  app.route( '/users' )
    .get( authUsers.usersList );
}

module.exports = usersRoute;
