const Joi = require( 'joi' );
var statusCode = require( './statusCodes' );

module.exports = function( value, schema, callback ) {
  Joi.validate( value, schema, function( err, value ) {
    if ( err === null ) {
      callback( statusCode.success, value );
    } else {
      var response = {
        "ErrorType": err.name,
        "ErrorMessage": err.details[ 0 ].message
      }
      callback( statusCode.clientError, response );
    }
  } )
}