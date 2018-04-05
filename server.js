var express = require( "express" );
var helmet = require( "helmet" );
var methodOverride = require('method-override')
var bodyparser = require( "body-parser" );
var cors = require( "cors" );
var logger = require( "./loggers/log" );

var app = express();
var router = express.Router();

var port = process.env.PORT || 3000;


app.use( '*', cors(), function( req, res, next ) {
  next();
} );


app.use( bodyparser.urlencoded( {
  extended: true
} ) );

app.use( bodyparser.json() );

app.use( express.static( __dirname + '/' ) );

app.use( helmet() );

app.use(methodOverride('X-HTTP-Method-Override'))

var gategaurd = require( './trailers/routes' )( app, router );
var schduler = require( './jobs/routes' )( app, router );
var switcher = require( './misc/routes' )( app, router );
var users = require('./users/routes')( app, router );

app.get( '/', function( req, res ) {
  res.status( 200 ).send( "App is Running" );
} );


app.listen( port, function() {
  logger.info( "server started at: " + port );
} );