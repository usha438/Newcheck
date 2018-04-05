module.exports.trailerList = "select * from YM_TrailersInSections"

module.exports.queryDataBaseBeacons = "SELECT * from YM_Beacons"

module.exports.jobsList = "select * from YM_AllJobs where CompletedTimeStamp IS NULL"

module.exports.enumValues = "select LoadTypeId,Name from YM_LoadTypes select TrailerTypeId,Name from YM_TrailerTypes select SectionId,Name from YM_Sections select TrailerStatusId,Name,InboundOutbound from YM_TrailerStatuses select JobPriorityId,Name from YM_JobPriorities"

module.exports.users = "select Email,Role from YM_Users where Role = 'SWITCHER' OR Role = 'GUARD'"

module.exports.graphLocation = "select Name,Capacity from YM_Sections"

module.exports.graphSwitcher = "select Name,jobDuration from YM_AllJobs where UserId_Switcher in (select UserId from YM_Users where Role = 'SWITCHER')"

module.exports.queryGraphLocationCheck = "select (select Name from YM_Sections where SectionId = SectionId_Present) from YM_TrailersInSections"

module.exports.queryGraphLocation = function(stale,callback){
	var res = "select (select Name from YM_Sections where SectionId = SectionId_Present) from YM_TrailersInSections where IsStale ="+stale
	callback(res)
}

module.exports.trailerCreate = function( val, beaconId, sectionId, callback ) {
  var res = "INSERT INTO YM_TrailerVisits( BeaconId, TrailerNumber, TrailerTypeId, PO_STO, Carrier, Dock, LoadTypeId, TrailerStatusId, Comment, SectionId_CheckIn, UserId_CheckInGuard, SectionId_Present, Stale, CheckInTimeStamp, Section_LastUpdated) values(" + val + ") update [YM_Beacons] set [LOC_Latitude] = (select LOC_Latitude from YM_Sections where SectionId=" + sectionId + "), [LOC_Longitude] =(select LOC_Longitude from YM_Sections where SectionId=" + sectionId + ") where BeaconId=" + beaconId;
  callback( res );
}

module.exports.trailerCreateCheck = function( beaconId, callback ) {
  var res = "select BeaconId from YM_TrailersInSections where BeaconId=" + beaconId;
  callback( res );
}

module.exports.queryDataBaseListById = function( VisitId, callback ) {
  var res = "SELECT * FROM YM_TrailersInSections WHERE VisitId = " + VisitId;
  callback( res );
}

module.exports.queryDataBaseBeaconsId = function( beaconId, callback ) {
  var res = "SELECT * FROM YM_TrailersInSections WHERE BeaconId =" + beaconId;
  callback( res );
}

module.exports.queryDataBaseCheckout = function( CheckoutTrailer, callback ) {
  var res = "update [YM_TrailersInSections] set CheckOutTimeStamp = CURRENT_TIMESTAMP,Section_LastUpdated = CURRENT_TIMESTAMP, BeaconId=NULL where BeaconId=" + CheckoutTrailer.beaconId
  callback( res );
}

module.exports.queryDataBaseCheckoutCheck = function( beaconId, callback ) {
  var res = "select BeaconId from YM_TrailersInSections where BeaconId = " + beaconId;
  callback( res );
}

module.exports.queryDataBaseJobsListById = function( jobID, callback ) {
  var res = "select * from YM_AllJobs where JobId=" + jobID;
  callback( res );
}

module.exports.queryDataBaseJobsCreate = function( JobPayload, callback ) {
  var res = "INSERT INTO YM_Jobs(VisitId,JobPriorityId,SectionId_From,SectionId_To,Dock,JobStatusId,UserId_Scheduler,PublishedTimeStamp,LastModified) VALUES(" + JobPayload.visitId + "," + JobPayload.jobPriorityId + "," + "(select SectionId_Present from YM_TrailerVisits where VisitId =" + JobPayload.visitId + ")," + JobPayload.sectionId_To + ",'" + JobPayload.dock + "'," + JobPayload.jobStatusId + "," + JobPayload.userId_Scheduler + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)"
  callback( res );
}

module.exports.queryDataBaseJobsCreateCheck = function( visitId, callback ) {
  var res = "select VisitId from YM_AllJobs where VisitId=" + visitId + " and CompletedTimeStamp is NULL";
  callback( res );
}

module.exports.queryDataBaseSwitcherUpdate = function( payload, jobID, callback ) {
  var res = "update [YM_Jobs] set [JobStatusId] = (select JobStatusId from YM_JobStatuses where Name =" + "'" + payload.status + "'" + "),[UserId_Switcher] = " + payload.switcherId + ",LastModified = CURRENT_TIMESTAMP,AcceptedTimeStamp = CURRENT_TIMESTAMP where JobId=" + jobID
  callback( res )
}

module.exports.switcherCheck = function( jobID, callback ) {
  var res = "select Name from YM_JobStatuses where JobStatusId = (select JobStatusId from YM_AllJobs where JobId = " + jobID + ") select UserId_Switcher from YM_AllJobs where JobId = " + jobID
  callback( res );
}

module.exports.statusCheck = function( jobID, callback ) {
  var res = "select Name from YM_JobStatuses where JobStatusId = (select JobStatusId from YM_AllJobs where JobId = " + jobID + ")"
  callback( res );
}

module.exports.queryDataBaseStatUpdate = function( Status, jobID, callback ) {
  var res = "update [YM_Jobs] set [JobStatusId] = (select JobStatusId from YM_JobStatuses where Name =" + "'" + Status + "'" + "),LastModified = CURRENT_TIMESTAMP where JobId=" + jobID
  callback( res );
}

module.exports.queryDataBaseStatComplete = function( jobID, callback ) {
  var res = "update [YM_Jobs] set [JobStatusId] = (select [JobStatusId] from YM_JobStatuses where Name = 'COMPLETED'),[CompletedTimeStamp]=CURRENT_TIMESTAMP where JobId=" + jobID + " UPDATE YM_TrailerVisits Set SectionId_Present = (Select SectionId_To from YM_Jobs where JobId =" + jobID + ") where VisitId = (Select VisitId from YM_Jobs where JobId =" + jobID + ")"
  callback( res );
}

module.exports.checkYard = function( jobID, callback ) {
  var res = "select Dock,SectionId_From,SectionId_To,JobPriorityId from YM_AllJobs where JobId = " + jobID
  callback( res );
}

module.exports.updateYardData = function( msg, jobID, callback ) {
  var res = "update [YM_Jobs] set JobPriorityId = " + msg.jobPriorityId + ",[SectionId_From]= (select SectionId_Present from YM_TrailerVisits where VisitId = (select VisitId from YM_AllJobs where JobId = " + jobID + ")),[SectionId_To]=" + msg.sectionId_To + ",Dock =" + "'" + msg.dock + "'" + " where JobId=" + jobID
  callback( res );
}

module.exports.updateTrailer = function( msg, visitId, callback ) {
  var res = "UPDATE YM_TrailerVisits SET TrailerTypeId=" + msg.trailerTypeId + ",PO_STO=" + "'" + msg.PO_STO + "'" + ",Carrier=" + "'" + msg.carrier + "'" + ",LoadTypeId=" + msg.loadTypeId + ",TrailerStatusId=" + msg.trailerStatusId + ",SectionId_Present=" + msg.sectionId + ",Section_LastUpdated = CURRENT_TIMESTAMP  where VisitId=" + visitId
  callback( res );
}

module.exports.checkTrailerById = function( visitId, callback ) {
  var res = "select TrailerTypeId,PO_STO,Carrier,LoadTypeId,TrailerStatusId,PresentSectionName from YM_TrailersInSections where VisitId =" + visitId
  callback( res );
}

module.exports.deleteJob = function( jobID, callback ) {
  var res = "delete from YM_Jobs where JobId=" + jobID
  callback( res );
}

module.exports.queryResolveBeaconsCheck = function( Major, Minor, callback ) {
  var res = "select BeaconId from YM_TrailersInSections where BeaconId=(select BeaconId from YM_Beacons where Major=" + Major + " and Minor=" + Minor + ")"
  callback( res );
}
module.exports.queryResolveBeacons = function( Major, Minor, callback ) {
  var res = "select * from YM_Beacons where Major=" + Major + " and Minor=" + Minor
  callback( res );
}