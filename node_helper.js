/*
*
*/
'use strict';

var NodeHelper = require("node_helper");

var path = require("path");

var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.region = 'ap-northeast-1';
var s3 = new AWS.S3();

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

module.exports = NodeHelper.create({

  start: function() {
	var self = this;
	console.log("Starting node helper for: " + this.name);
  },

  initAWS: function() {
	var self = this;
	self.sendSocketNotification("HIDE_PICTURE", "hide");
  },

  loadAWS: function(payload) {
	var self = this;
	fs.readFile(path.resolve(global.root_path + "/imageLocation.js"), 'utf8', function(err, data) {
	var image = data;
 	var param = {
		Bucket: payload.Bucket,
		Key: image,
		ACL: payload.ACL,
		Body: fs.createReadStream(path.resolve("../Pictures/" + image))
    	};
	
	s3.upload(param, function(err, data) {
		if(err) {
			self.sendSocketNotification("FAIL_LOAD_AWS", err);
		}
		else {
    			self.sendSocketNotification("SUCCESS_LOAD_AWS", image);
		}
   	});
    });

  },

  rekognitionAWS: function(payload) {
	var self = this;

    	fs.readFile(path.resolve(global.root_path + "/imageLocation.js"), 'utf8', function(err, data) {
		var image = data;
		var params = {
			Image: {
				S3Object: {
					Bucket: payload.Bucket,
					Name: image 
				}
			},
			Attributes: [ "DEFAULT", "ALL" ]
		};
		rekognition.detectFaces(params, function(err, data) {
			if(err) {
				  self.sendSocketNotification("FAIL_REKOGNITION", err);
			}
			else {
				  var emotion = data.FaceDetails[0].Emotions[0].Type;
				  self.sendSocketNotification("SUCCESS_REKOGNITION", emotion);
			}
		});
   	 });
  },


  loadAWSMaster: function(payload) {
	var self = this;

 	var param = {
		Bucket: "hellomirror4",
		Key: "person.jpg",
		ACL: payload.ACL,
		Body: fs.createReadStream(path.resolve("../Pictures/Master/person.jpg"))
    	};
	
	s3.upload(param, function(err, data) {
		if(err) {
			self.sendSocketNotification("FAIL_LOAD_AWS_MASTER", err);
		}
		else {
    			self.sendSocketNotification("SUCCESS_LOAD_AWS_MASTER", data);
		}
   	});
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;
	
	if (notification == "LOAD_AWS") {
		self.loadAWS(payload);
	}
	else if (notification == "INIT_AWS") {
		self.initAWS();
	}
	else if (notification == "RECOMMEND_MUSIC") {
		self.rekognitionAWS(payload);	
	}
	else if (notification == "LOAD_AWS_MASTER") {
		self.loadAWSMaster(payload);
	}
  },

});
