var async = require( 'async' );
var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );


module.exports.queryDataBaseList = function( callback ) {
  connection.GetDBData( sqlQuery.trailerList, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }

  } )
}

module.exports.queryDataBaseCreate = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.trailerCreate, function( sts, msg ) {
    if ( sts == statusCode.success ) {
      var col = msg.beaconId + ",'" + msg.trailerNumber + "'," + msg.trailerTypeId + ",'" + msg.PO_STO + "','" + msg.carrier + "','" + msg.dock + "'," + msg.loadTypeId + "," + msg.trailerStatusId + ",'" + msg.comment + "'," + msg.sectionId_CheckIn + "," + msg.userId_CheckInGuard + "," + msg.sectionId_CheckIn + ",1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP"

      function testBeaconAttached( Beacon ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.trailerCreateCheck( Beacon, function( response ) {
            connection.GetDBData( response, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                resolve( resp )
              } else {
                reject( resp );
              }
            } )
          } )
        } )
      }


      testBeaconAttached( msg.beaconId ).then( function( data ) {
          if ( data[ 0 ].length == 0 ) {
            sqlQuery.trailerCreate( col, msg.beaconId, msg.sectionId_CheckIn, function( sqlEx ) {

              connection.GetDBData( sqlEx, function( stat, resp ) {
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Inserted Successfully"
                  } )
                } else {
                  callback( stat, {
                    "status": "Unable to Process Given Body Data, Check the Body Data that you are trying to send"
                  } )
                }
              } )
            } )
          } else {
            callback( statusCode.clientError, {
              "status": "Beacon already associated with another Trailer,Choose another beacon to add"
            } )
          }
        } )
        .catch( function( err ) {
          callback( statusCode.clientError, {
            "status": "Unable to parse Req Body"
          } )
        } )
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}

module.exports.queryDataBaseListById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseListById, function( sts, msg ) {
    if ( sts == statusCode.success ) {
      sqlQuery.queryDataBaseListById( msg.trailerID, function( response ) {
        connection.GetDBData( response, function( stat, resp ) {
          if ( stat == statusCode.success ) {
            callback( stat, resp[ 0 ] )
          } else {
            callback( stat, {
              "status": "Unable to Process the Data"
            } )
          }
        } )
      } )
    } else {
      callback( statusCode.clientError, msg )
    }
  } )
}


module.exports.updateDataBaseTrailerById = function( reqParams, reqBody, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseListById, function( stat, message ) {

    if ( stat == statusCode.success ) {

      reqValidation( reqBody, joiSchemas.updateTrailerById, function( sts, msg ) {
        if ( sts == statusCode.success ) {

          function checkTrailer( trailerId ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.checkTrailerById( trailerId, function( response ) {
                connection.GetDBData( response, function( stat, resp ) {
					console.log(resp)
                  if ( stat == statusCode.success ) {
                    resolve( resp )
                  } else {
                    reject( resp );
                  }
                } )
              } )
            } )
          }


          checkTrailer( message.trailerID ).then( function( data ) {

            if ( data[ 0 ].length != 0 ) {

              if ( data[ 0 ][ 0 ].TrailerTypeId != msg.TrailerTypeId || data[ 0 ][ 0 ].PO_STO != msg.PO_STO || data[ 0 ][ 0 ].Carrier != msg.Carrier || data[ 0 ][ 0 ].LoadTypeId != msg.LoadTypeId || data[ 0 ][ 0 ].TrailerStatusId != msg.TrailerStatusId || data[ 0 ][ 0 ].PresentYard != msg.PresentYard ) {

                sqlQuery.updateTrailer( msg, message.trailerID, function( sqlEx ) {
                  connection.GetDBData( sqlEx, function( stat, resp ) {
                    if ( stat == statusCode.success ) {
                      callback( stat, {
                        "status": "Record updated Successfully"
                      } );
                    } else {
                      callback( stat, resp );
                    }

                  } )
                } )


              } else {
                callback( statusCode.clientError, {
                  "status": "The Trailer is already associated with same data that you are trying to send, Try with different details"
                } )
              }

            } else {
              callback( statusCode.clientError, {
                "status": "Trailer Number Not Found"
              } )
            }

          } )
        }
      } )
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}


module.exports.queryDataBaseCheckout = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.trailerCheckout, function( sts, msg ) {
    if ( sts == statusCode.success ) {

      function testBeaconAttached( Beacon ) {

        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseCheckoutCheck( Beacon, function( response ) {
            connection.GetDBData( response, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                resolve( resp )
              } else {
                reject( resp )
              }
            } )
          } )
        } )
      }

      testBeaconAttached( msg.beaconId ).then( function( data ) {
          if ( data[ 0 ].length != 0 ) {
            sqlQuery.queryDataBaseCheckout( msg, function( sqlEx ) {

              connection.GetDBData( sqlEx, function( stat, resp ) {
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Updated Successfully"
                  } );
                } else {
                  callback( stat, {
                    "status": "Unable to Process Given Body Data, Check the Body Data that you are trying to send"
                  } )
                }

              } )
            } )
          } else {
            callback( statusCode.clientError, {
              "status": "Beacon is already checked out, Choose another beacon to checked out"
            } )
          }
        } )
        .catch( function( err ) {
          callback( statusCode.clientError, {
            "status": "Unable to parse Req Body"
          } )
        } )

    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}


module.exports.queryDataBaseGraphStatus = function( reqParams, callback ) {
    

		sqlQuery.queryGraphLocation( reqParams, function( sqlEx ) {
      connection.GetDBData( sqlEx, function( stat, resp ) {
        if ( stat == statusCode.success ) {


          function countBy( data, keyGetter ) {

            var keyResolver = {
              'function': function( d ) {
                return keyGetter( d );
              },
              'string': function( d ) {
                return d[ keyGetter ];
              },
              'undefined': function( d ) {
                return d;
              }
            };

            var resultStat = {};

            data.forEach( function( d ) {
              var keyGetterType = typeof keyGetter;

              var key = keyResolver[ keyGetterType ]( d );

              if ( resultStat.hasOwnProperty( key ) ) {
                resultStat[ key ] += 1;
              } else {
                resultStat[ key ] = 1;
              }
            } );

            return resultStat;
          }

		var arrStatus = [],
			pair = [];
          for ( var x in resp[ 0 ] ) {
            arrStatus.push( resp[ 0 ][ x ][ "" ] )
          }

          var count_var = countBy( arrStatus )
          Object.keys( count_var ).forEach( function( key ) {

            pair.push( {
              "Status": key,
              "Count": count_var[ key ]
            } )

          } )

          callback( stat, pair )
        } else {
          callback( stat, {
            "status": "Unable to Process the Data"
          } )
        }
      } )
	  
	  })
	  


}


module.exports.queryDataBaseGraphLocation = function( reqParams, callback ) {
      connection.GetDBData( sqlQuery.queryGraphLocationCheck, function( stat, resp ) {
		  
        if ( stat == statusCode.success ) {

          connection.GetDBData( sqlQuery.graphLocation, function( loc, locResp ) {
            if ( loc == statusCode.success ) {

              function countBy( data, keyGetter ) {

                var keyResolver = {
                  'function': function( d ) {
                    return keyGetter( d );
                  },
                  'string': function( d ) {
                    return d[ keyGetter ];
                  },
                  'undefined': function( d ) {
                    return d;
                  }
                };

                var resultLoc = {};

                data.forEach( function( d ) {
                  var keyGetterType = typeof keyGetter;

                  var key = keyResolver[ keyGetterType ]( d );

                  if ( resultLoc.hasOwnProperty( key ) ) {
                    resultLoc[ key ] += 1;
                  } else {
                    resultLoc[ key ] = 1;
                  }
                } );

                return resultLoc;
              }
				
			var arrLoc = [];	
              for ( var x in resp[ 0 ] ) {
                arrLoc.push( resp[ 0 ][ x ][ "" ] )
              }

              var syncData = countBy( arrLoc );


              count = 0;
			  var dataGraph = [];
              async.each( locResp[ 0 ], function( res, callback ) {
                if ( syncData[ res.Name ] == undefined ) {
                  res[ "Occupied" ] = 0
                  dataGraph.push( res )
                } else {
                  res[ "Occupied" ] = syncData[ res.Name ]
                  dataGraph.push( res )
                }

              } )
              callback( statusCode.success, dataGraph )


            } else {
              callback( stat, {
                "status": "Unable to Process the Data"
              } )
            }
          } )
        } else {
          callback( stat, {
            "status": "Unable to Process the Data"
          } )
	  }})
}