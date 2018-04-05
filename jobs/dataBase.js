var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );

module.exports.queryDataBaseJobsList = function( callback ) {
  connection.GetDBData( sqlQuery.jobsList, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }

  } )
}

module.exports.queryDataBaseListById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( sts, msg ) {

    if ( sts == statusCode.success ) {
      sqlQuery.queryDataBaseJobsListById( msg.jobID, function( response ) {
        connection.GetDBData( response, function( stat, resp ) {
          if ( stat == statusCode.success ) {
            callback( stat, resp[ 0 ] );
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

module.exports.queryDataBaseListValues = function( callback ) {
  connection.GetDBData( sqlQuery.enumValues, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }
  } )
}

module.exports.queryDataBaseJobsCreate = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.jobsCreate, function( sts, msg ) {
    if ( sts == statusCode.success ) {

      function checkJobAssigned( visitId ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseJobsCreateCheck( visitId, function( response ) {
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


      checkJobAssigned( msg.visitId ).then( function( data ) {
          if ( data[ 0 ].length == 0 ) {
            sqlQuery.queryDataBaseJobsCreate( msg, function( sqlEx ) {
              connection.GetDBData( sqlEx, function( stat, resp ) {
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Inserted Successfully"
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
              "status": "Job already created By this visitId, Choose another visitId to add"
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


module.exports.queryDataBaseJobUpdate = function( reqParams, reqBody, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( statusParam, paramMsg ) {
    if ( statusParam == statusCode.success ) {
      reqValidation( reqBody, joiSchemas.updateJob, function( sts, msg ) {

        if ( sts == statusCode.success ) {


          function checkJobCreatedOrNot( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.queryDataBaseJobsListById( jobID, function( response ) {
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

          function checkSwitcher( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.switcherCheck( jobID, function( response ) {
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

          function checkStatus( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.statusCheck( jobID, function( response ) {
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

          function checkYardId( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.checkYard( jobID, function( response ) {
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

          checkJobCreatedOrNot( paramMsg.jobID ).then( function( data ) {

              if ( data[ 0 ].length != 0 ) {

                if ( msg.switcherId && msg.status ) {

                  checkSwitcher( paramMsg.jobID ).then( function( data ) {
                      if ( data[ 0 ][ 0 ][ "Name" ] != "COMPLETED" ) {
                        if ( data[ 0 ][ 0 ][ "Name" ] != msg.status || data[ 1 ][ 0 ][ "UserId_Switcher" ] != msg.switcherId ) {


                          if ( msg.status == "COMPLETED" ) {
                            callback( statusCode.clientError, {
                              "status": "You Can't assign Job as Completed by Sending Switcher Id"
                            } )
                          } else if ( msg.status == "PENDING" ) {
                            callback( statusCode.clientError, {
                              "status": "You Can't assign Job as Pending by Sending Switcher Id"
                            } )
                          } else {
                            sqlQuery.queryDataBaseSwitcherUpdate( msg, paramMsg.jobID, function( sqlEx ) {
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
                          }
                        } else {
                          callback( statusCode.clientError, {
                            "status": "The Job is already associated with same switcherId and Status that you are trying to send, Try with different details"
                          } )
                        }
                      } else {
                        callback( statusCode.clientError, {
                          "status": "This Job is Already Completed"
                        } )
                      }
                    } )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )

                } else if ( !msg.switcherId && msg.status ) {

                  checkStatus( paramMsg.jobID ).then( function( data ) {
                        if ( data[ 0 ][ 0 ][ "Name" ] != msg.status ) {
                          if ( data[ 0 ][ 0 ][ "Name" ] == "PENDING" && msg.status == "COMPLETED" ) {
                            callback( statusCode.clientError, {
                              "status": "The Job cann't be assigned as completed,Because no switcher accepted this Job"
                            } )
                          } else if ( data[ 0 ][ 0 ][ "Name" ] == "IN-PROGRESS" && msg.status == "PENDING" ) {
                            callback( statusCode.clientError, {
                              "status": "The Job cann't be assigned as pending, Because Job is already in In-Progress"
                            } )
                          } else {
                            if ( msg.status == "COMPLETED" ) {
                              sqlQuery.queryDataBaseStatComplete( paramMsg.jobID, function( sqlEx ) {

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
                              sqlQuery.queryDataBaseStatUpdate( msg.status, paramMsg.jobID, function( sqlEx ) {
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
                            }
                          }
                        } else if ( data[ 0 ][ 0 ][ "Name" ] == "Completed" ) {
                          callback( statusCode.clientError, {
                            "status": "The Job is already Completed, You cann't perform twice"
                          } )
                        } else {
                          callback( statusCode.clientError, {
                            "status": "The Job is already associated with the same Status that you are trying to send, Try with different details"
                          } )
                        }
                      }

                    )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )
                } else if ( msg.sectionId_To && msg.jobPriorityId && msg.dock ) {


                  checkYardId( paramMsg.jobID ).then( function( data ) {
                        if ( data[ 0 ][ 0 ][ "Dock" ] != msg.dock || data[ 0 ][ 0 ][ "SectionId_To" ] != msg.sectionId_To || data[ 0 ][ 0 ][ "JobPriorityId" ] != msg.jobPriorityId ) {

                          sqlQuery.updateYardData( msg, paramMsg.jobID, function( sqlEx ) {
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
                            "status": "The Job is already associated with same Dock,Yard and Priority that you are trying to send, Try with different details"
                          } )
                        }
                      }

                    )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )

                } else {
                  callback( statusCode.clientError, {
                    "status": "Unable to parse Req Body"
                  } )
                }


              } else {
                callback( statusCode.clientError, {
                  "status": "JobID is not present in Table"
                } );
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
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}

module.exports.deleteJobById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( stat, message ) {
    if ( stat == statusCode.success ) {

      function deleteJob( jobID ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseJobsListById( jobID, function( response ) {
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

      deleteJob( message.jobID ).then( function( data ) {
        if ( data[ 0 ].length != 0 ) {

          sqlQuery.deleteJob( message.jobID, function( sqlEx ) {
            connection.GetDBData( sqlEx, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                callback( stat, {
                  "status": "Record Deleted Successfully"
                } );
              } else {
                callback( stat, resp );
              }
            } )
          } )
        } else {
          callback( statusCode.clientError, {
            "status": "JobID is already deleted, Try with some other JobID"
          } )
        }
      } )


    }
  } )
}

module.exports.switcherGraphDb = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.jobGraphStatus, function( stat, message ) {
    if ( stat == statusCode.success ) {
      connection.GetDBData( sqlQuery.graphSwitcher, function( stat, resp ) {
        if ( stat == statusCode.success ) {

          var arrLoc = []

          for ( var x in resp[ 0 ] ) {

            arrLoc.push( resp[ 0 ][ x ][ "Name" ] )
          }

          var syncData = countBy( arrLoc );

          var switcherName = [];
          var percentage = [];
          var switcherData = [];

          resp[ 0 ].forEach( function( obj ) {
            if ( switcherName.indexOf( obj.Name ) == -1 )
              switcherName.push( obj.Name );

            var lastIndex = switcherName.length - 1;
            if ( typeof percentage[ lastIndex ] == "undefined" )
              percentage.push( obj.jobDuration );
            else
              percentage[ lastIndex ] += obj.jobDuration;
          } );

          for ( var i = 0; i < switcherName.length; i++ ) {
            var x = {
              "Name": switcherName[ i ],
              "count": syncData[ switcherName[ i ] ],
              "avgTime": percentage[ i ] / syncData[ switcherName[ i ] ]
            }
            switcherData.push( x )
          }


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

          callback( stat, switcherData );
        } else {
          callback( stat, {
            "status": "Unable to Process the Data"
          } )
        }

      } )
    } else {
      callback( stat, message )
    }

  } )
}