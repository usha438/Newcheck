const JoiBase = require( 'joi' );
const Extension = require( 'joi-date-extensions' );
const Joi = JoiBase.extend( Extension );

module.exports.trailerCreate = {
  beaconId: Joi.number().integer().positive().required(),
  trailerNumber: Joi.string().trim().min( 1 ).max( 10 ).required(),
  trailerTypeId: Joi.number().positive().required(),
  PO_STO: Joi.string().trim().min( 1 ).max( 10 ).required(),
  carrier: Joi.string().trim().min( 1 ).max( 30 ).required(),
  dock: Joi.string().trim().min( 1 ).max( 3 ),
  loadTypeId: Joi.number().integer().positive().required(),
  trailerStatusId: Joi.number().integer().positive().required(),
  comment: Joi.string().trim(),
  sectionId_CheckIn: Joi.number().integer().positive().required(),
  userId_CheckInGuard: Joi.number().integer().positive().required()
}

module.exports.trailerCheckout = {
  beaconId: Joi.number().integer().positive().required()
}

module.exports.queryDataBaseListById = {
  trailerID: Joi.number().integer().positive().required()
}

module.exports.queryDataBaseBeaconsId = {
  beaconID: Joi.number().integer().positive().required()
}

module.exports.queryDataBaseJobsListById = {
  jobID: Joi.number().integer().positive().required()
}

module.exports.jobsCreate = {
  visitId: Joi.number().integer().positive().required(),
  dock: Joi.string().trim().min(1).max(3),
  jobPriorityId: Joi.number().integer().positive().required(),
  jobStatusId: Joi.number().integer().positive().required(),
  sectionId_To: Joi.number().integer().positive().required(),
  userId_Scheduler: Joi.number().integer().positive().required()
}

module.exports.updateJob = {
  status: Joi.string().trim().valid( "PENDING", "IN-PROGRESS", "COMPLETED" ),
  switcherId: Joi.number().integer().positive(),
  jobPriorityId: Joi.number().integer().positive(),
  sectionId_To: Joi.number().integer().positive(),
  dock: Joi.string().trim().min( 1 ).max( 3 )
}

module.exports.updateTrailerById = {
  trailerTypeId: Joi.number().positive().required(),
  PO_STO: Joi.string().trim().min( 1 ).required(),
  carrier: Joi.string().trim().min( 1 ).max( 50 ).required(),
  loadTypeId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  trailerStatusId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  sectionId: Joi.number().integer().min( 1 ).max( 4000 ).required()
}

module.exports.resolveBeacons = {
  Major: Joi.number().integer().valid( 1 ).required(),
  Minor: Joi.number().integer().positive().required()
}

module.exports.trailerGraphStatus = {
  groupBy: Joi.number().integer().valid( 0 , 1 ).required()
}

module.exports.trailerGraphLocation = {
  groupBy: Joi.string().trim().valid( "0","1","location" ).required()
}

module.exports.jobGraphStatus = {
  groupBy: Joi.string().trim().valid( "switcher").required()
}