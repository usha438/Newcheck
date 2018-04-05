var chai = require('chai');
var chaiHttp = require('chai-http');
var winston=require('winston');
require('winston-daily-rotate-file');
var logger = new (winston.Logger)({
    transports: [
       new( winston.transports.File )( {
      filename: './log.log'
    } )
    ]
  });
var should = chai.should();
var json={
	'id':'',
	'jobid':'',
	'beaconid':''
};
chai.use(chaiHttp);

// FOR CHECK-IN TRAILERS
describe('For check-in trailers', function() {
it('should list ALL testing on localhost:3000/trailers POST', function(done) {
	this.timeout(20000);
  chai.request('localhost:3000')
    .post('/trailers')
	.send({
"BeaconId":1,
"TrailerNumber":"AP34111",
"TrailerTypeID":2,
"PO_STO":"147",
"Carrier":"2000",
"Dock":"2",
"LoadTypeId":1,
"TrailerStatusID":2,
"EntryTimeStamp":"2017-09-27 06:14:00.742",
"Comments":"CCBCC yard checking",
"YardId": 2
})
    .end(function(err, res){
		if(err){
			
			////console.log(err);
			logger.info('FOR CHECK-IN TRAILERS','should list ALL testing on localhost:3000/trailers POST');
			logger.info("Fial");
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR CHECK-IN TRAILERS','should list ALL testing on localhost:3000/trailers POST');
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message : '+res.text);

	  should.not.exist(err);
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  res.type.should.equal('application/json');
	  
      done();
		}
    });
});
})


//FOR LISTING ALL TRAILERS 
describe('For listing all trailers', function() {
it('should list ALL testing on localhost:3000/trailers GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/trailers')
    .end(function(err, res){
		if(err){
			////console.log(err);
			logger.info('FOR LISTING ALL TRAILERS','should list ALL testing on localhost:3000/trailers GET');
			logger.info('Fail');
			logger.info('StatusCode :'+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR LISTING ALL TRAILERS','should list ALL testing on localhost:3000/trailers GET');
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message : Test Case Success');
		//console.log(res.body[0].TrailerId);
		json.id=res.body[0].TrailerId;
		//console.log(json.id);
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('TrailerId');
	  res.body[0].TrailerId.should.be.a('Number');	  
      done();
	}
    });
});

// GET THE DETAILS FOR THE PARTICULAR TRAILER CHECK-IN OR NOT
it('should list ALL testing on localhost:3000/trailers/:trailerId GET', function(done) {
	this.timeout(5000);
	
  chai.request('localhost:3000')
    .get('/trailers/'+json.id)
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('GET THE DETAILS FOR THE PARTICULAR TRAILER CHECK-IN OR NOT','should list ALL testing on localhost:3000/trailers/:trailerId GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('GET THE DETAILS FOR THE PARTICULAR TRAILER CHECK-IN OR NOT','should list ALL testing on localhost:3000/trailers/:trailerId GET');
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message : Test Case Success');
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('TrailerId');
	  res.body[0].should.have.property('BeaconId');
	  res.body[0].TrailerId.should.be.a('Number');
	  
      done();
	}
    });
});
});

 
// FOR LISTING THE SPECIFIED TRAILER ID
describe('For listing specified Trailer', function() {
it('should list ALL testing on localhost:3000/trailers/:trailerId GET', function(done) {
	this.timeout(5000);
	  chai.request('localhost:3000')
    .get('/trailers/'+json.id)
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR LISTING THE SPECIFIED TRAILER ID','should list ALL testing on localhost:3000/trailers/:trailerId GET')
			logger.info('Fail');
			logger.info('Status Code :'+res.status);
			logger.info('Message: Test Case Failed')
		}
		else{
			logger.info('FOR LISTING THE SPECIFIED TRAILER ID','should list ALL testing on localhost:3000/trailers/:trailerId GET')
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message :  Test Case Success');
	  res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('TrailerId');
	  res.body[0].should.have.property('BeaconId');
	  res.body[0].TrailerId.should.be.a('Number');
	  
      done();
	}
    });
});

});

// FOR UPDATING TRAILER DETAILS
describe('For updating trailer details.', function() {
it('should list ALL testing on localhost:3000/trailers/:trailerId PUT', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .put('/trailers/'+json.id)
	.send({
	"TrailerTypeId":2,
	"PO_STO":"5000",
	"Carrier":"CC-Yard",
	"LoadTypeId":1,
	"TrailerStatusId":2,
	"PresentYard":2
})
    .end(function(err, res){
		if(err)
		{
			//console.log(err);
			logger.info('FOR UPDATING TRAILER DETAILS','should list ALL testing on localhost:3000/trailers/:trailerId PUT');
			logger.info('Fial');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR UPDATING TRAILER DETAILS','should list ALL testing on localhost:3000/trailers/:trailerId PUT');
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message : '+res.text);
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
      done();
	  
		}
    });
	});

// FOR GETTING THE TRAILER DETAILS BASED ON THE TRAILER ID (AFTER MODIFYING THE ABOVE DATA IN THE TRAILER)
it('should list ALL testing on localhost:3000/trailers/:trailerId GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/trailers/'+json.id)
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR GETTING THE TRAILER DETAILS BASED ON THE TRAILER ID(AFTER PUT THE DETAILS)','should list ALL testing on localhost:3000/trailers/:trailerId GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR GETTING THE TRAILER DETAILS BASED ON THE TRAILER ID(AFTER PUT THE DETAILS)','should list ALL testing on localhost:3000/trailers/:trailerId GET');
			logger.info('Success');
			logger.info('StatusCode : '+res.status);
			logger.info('Message :  Test Case Success');
			
		//console.log(res.body);
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('TrailerTypeId');
	  res.body[0].should.have.property('TrailerTypeName');
	  res.body[0].should.have.property('PO_STO');
	  res.body[0].should.have.property('Carrier');
	  res.body[0].should.have.property('LoadTypeId');
	  res.body[0].should.have.property('TrailerStatusId');
	  res.body[0].should.have.property('PresentYard');
	  res.body[0].TrailerTypeId.should.be.a('Number');
	  
      done();
		}
    });
});

});

//FOR POSTING A NEW JOB
describe('For posting New Job', function() {
it('should list ALL testing on localhost:3000/jobs POST', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .post('/jobs')
	.send({
		"TrailerId":json.id,
		"CompletedTimeStamp":"null",
		"Dock":"5",
		"JobPriorityId":"3",
		"JobStatusId":"1",
		"PublishedTimeStamp":"2017-09-0609:20:01.159",
		"SchedulerId":"1",
		"SwitcherId":1,
		"YardId":"1"
		})
	
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR POSTING A NEW JOB','should list ALL testing on localhost:3000/jobs POST');
			logger.info('Fail');
			logger.info('Status Code :'+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
		logger.info('Success');
		logger.info('FOR POSTING A NEW JOB','should list ALL testing on localhost:3000/jobs POST');
			logger.info('Status Code : '+res.status);
			logger.info('Message : '+res.text);
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  
      done();
		}
    });
});
});



// FOR LISTING ALL JOBS CREATED
describe('For listing all Jobs created', function() {
it('should list ALL testing on localhost:3000/jobs GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
  
    .get('/jobs')
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR LISTING ALL JOBS CREATED','should list ALL testing on localhost:3000/jobs GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test case Failed')
		}
		else{
			logger.info('FOR LISTING ALL JOBS CREATED','should list ALL testing on localhost:3000/jobs GET');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body[0])
		json.jobid=res.body[0].JobId;
		//console.log(json.jobid);
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('JobId');
	  
      done();
		}
    });
});
});
// FOR LISTING SPECIFIED JOB
describe('For listing specified job', function() {
it('should list ALL testing on localhost:3000/trailers/jobs/:jobId GET', function(done) {
	this.timeout(5000)
  chai.request('localhost:3000')
    .get('/jobs/'+json.jobid)
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR LISTING SPECIFIED JOB','should list ALL testing on localhost:3000/trailers/jobs/:jobId GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR LISTING SPECIFIED JOB','should list ALL testing on localhost:3000/trailers/jobs/:jobId GET');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('JobId');
	  res.body[0].should.have.property('TrailerId');
	  res.body[0].should.have.property('JobStatus_Name');
	  res.body[0].should.have.property('SwitcherId');
	  
      done();
		}
    });
});
});

// FOR UPDATING THE JOB DETAILS (PUT)
describe('For updating Job details. We can pick any payload given below and post it to API as necessary.', function() {
it('should list ALL testing on localhost:3000/trailers/jobs/:jobId PUT', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .put('/jobs/'+json.jobid)
	.send({
			"Status":"In-Progress",
			"SwitcherId":1
})
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR UPDATING THE JOB DETAILS','should list ALL testing on localhost:3000/trailers/jobs/:jobId PUT');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR UPDATING THE JOB DETAILS','should list ALL testing on localhost:3000/trailers/jobs/:jobId PUT');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : '+res.text)
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  
      done();
		}
    });
	
});
//TEST IF THE STATUS OF THE JOB IS CHANGED OR NOT SO WE ARE USING 
it('should list ALL testing on localhost:3000/trailers/jobs/:jobId GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/jobs/'+json.jobid)
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('TEST IF THE STATUS OF THE JOB','should list ALL testing on localhost:3000/trailers/jobs/:jobId GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
		////console.log(res.body)
		logger.info('TEST IF THE STATUS OF THE JOB','should list ALL testing on localhost:3000/trailers/jobs/:jobId GET');
		logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  
      done();
		}
    });
});

});
// FOR AUTHENTICATING USER DETAILS
describe('For Authenticating user details', function() {
it('should list ALL testing on localhost:3000/login POST', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .post('/login')
	.send({
"Email":"apavate@switcher.com",
"Password":"Akash@123"
})
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR AUTHENTICATING USER DETAILS','should list ALL testing on localhost:3000/login POST');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR AUTHENTICATING USER DETAILS','should list ALL testing on localhost:3000/login POST');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  res.body.should.have.property('Email');
	  res.body.should.have.property('Password');
	  res.body.Email.should.equal('apavate@switcher.com');
	  res.body.Password.should.equal('Akash@123');
	  
      done();
		}
    });
});
});
//FOR LISTING ALL BEACONS
describe('For listing all Beacons', function() {
it('should list ALL testing on localhost:3000/url/Becons GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/url/Beacons')
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR LISTING ALL BEACONS','should list ALL testing on localhost:3000/url/Becons GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failued')
		}
		else{
			logger.info('FOR LISTING ALL BEACONS','should list ALL testing on localhost:3000/url/Becons GET');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
		json.beaconid=res.body[0].Id;
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('Id');
	  res.body[0].should.have.property('Major');
	  res.body[0].should.have.property('Minor');
	  res.body[0].Id.should.be.a('Number');
	  
      done();
		}
    });
});
});
// FOR LISTING SPECIFIED BEACONS
describe('For listing specified becons', function() {
it('should list ALL testing on localhost:3000/trailers/getByBeaconId/:beaconId GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/trailers/getByBeaconId/'+json.beaconid)
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR LISTING SPECIFIED BEACONS','should list ALL testing on localhost:3000/trailers/getByBeaconId/:beaconId GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR LISTING SPECIFIED BEACONS','should list ALL testing on localhost:3000/trailers/getByBeaconId/:beaconId GET');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  res.body.should.be.a('array');
	  res.body[0].should.have.property('TrailerId');
	  res.body[0].should.have.property('BeaconId');
	  res.body[0].should.have.property('Name');
	  res.body[0].should.have.property('Id');
	  res.body[0].should.have.property('Major');
	  res.body[0].should.have.property('Minor');
	  res.body[0].Id.should.be.a('Number');
	  
      done();
		}
    });
});

});
//FOR LISTING ALL ID'S AND NAMES
describe('For listing all Id and names', function() {
it('should list ALL testing on localhost:3000/enum GET', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .get('/enum')
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR LISTING ALL IDS AND NAMES','should list ALL testing on localhost:3000/enum GET')
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR LISTING ALL IDS AND NAMES','should list ALL testing on localhost:3000/enum GET')
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  res.should.be.a.json;
	  res.body.should.have.property('loadType');
	  res.body.should.have.property('trailerType');
	  res.body.should.have.property('Yardid');
	  res.body.should.have.property('TrailerStatus');
	  res.body.should.have.property('JobPriority');
	  
      done();
		}
    });
});
});
//FOR LISTING ALL PENDING JOBS IN_PROGRESS
describe('For listing all jobs pending in_progress', function() {
it('should list ALL testing on localhost:3000/jobs/pending_inprogress GET', function(done) {
  this.timeout(5000);
  chai.request('localhost:3000')
    .get('/jobs/pending_inprogress')
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR LISTING ALL PENDING JOBS IN_PROGRESS','should list ALL testing on localhost:3000/jobs/pending_inprogress GET');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR LISTING ALL PENDING JOBS IN_PROGRESS','should list ALL testing on localhost:3000/jobs/pending_inprogress GET');
		logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  //res.should.be.a('array');
	  res.body[0].should.have.property('JobId');
	  res.body[0].should.have.property('JobStatus_Name');
	  res.body[0].should.have.property('TrailerId');
	  
      done();
		}
    });
});
});
//FOR LISTING BEACON DETAILS
describe('For listing beacon details', function() {
it('should list ALL testing on localhost:3000/ResolveBeacons POST', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .post('/ResolveBeacons')
	.send({"Major":1,
			"Minor":3
	})
    .end(function(err, res){
		if(err)
		{
			 logger.info('FOR LISTING BEACON DETAILS','should list ALL testing on localhost:3000/ResolveBeacons POST');
			//console.log(err);
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			 logger.info('FOR LISTING BEACON DETAILS','should list ALL testing on localhost:3000/ResolveBeacons POST');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Success')
		//console.log(res.body)
      res.should.have.status(200);
	  res.should.be.a.json;
	  res.body.should.have.property('Id');
	  res.body.should.have.property('Name');
	  res.body.should.have.property('Major');
	  res.body.should.have.property('Minor');
	  res.body.Major.should.equal(1);
	  res.body.Minor.should.equal(3);
	 
      done();
		}
    });
});
});

// FOR TRAILERS CHECK-OUT
describe('For Trailer check-out', function() {
it('should list ALL testing on localhost:3000/Trailers_Checkout POST', function(done) {
  this.timeout(5000);
  chai.request('localhost:3000')
    .post('/Trailers_Checkout')
	.send({
"BeaconId":json.beaconid,
"TrailerNumber":"AP 34111",
"ExitTimeStamp":"2014-07-02 06:14:00.742",
"PO_STO":"147",
"Carrier":"2000",
"TrailerStatusID":2,
"TrailerTypeID":2,
"LoadTypeId":1,
"Comments":"CCBCC yard checking"
})

	
    .end(function(err, res){
		if(err){
			//console.log(err);
			logger.info('FOR TRAILERS CHECK-OUT','should list ALL testing on localhost:3000/Trailers_Checkout POST');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR TRAILERS CHECK-OUT','should list ALL testing on localhost:3000/Trailers_Checkout POST');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : '+res.text)
		////console.log(res.body)
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  
      done();
		}
    });
});
});
//FOR DELETING PARTICULAR JOB
describe('For deleting specified JOB', function() {
it('should list ALL testing on localhost:3000/jobs/:JobId POST', function(done) {
	this.timeout(5000);
  chai.request('localhost:3000')
    .delete('/jobs/'+json.jobid)
    .end(function(err, res){
		if(err){
			//console.log(err)
			logger.info('FOR DELETING PARTICULAR JOB','should list ALL testing on localhost:3000/jobs/:JobId POST');
			logger.info('Fail');
			logger.info('Status Code : '+res.status);
			logger.info('Message : Test Case Failed')
		}
		else{
			logger.info('FOR DELETING PARTICULAR JOB','should list ALL testing on localhost:3000/jobs/:JobId POST');
			logger.info('Success');
			logger.info('Status Code : '+res.status);
			logger.info('Message : '+res.text)
		////console.log(res.body)
      res.should.have.status(200);
	  res.should.have.property('text');
	  res.text.should.be.a('String');
	  
      done();
		}
    });
});
});