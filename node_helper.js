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
    console.log("Starting node helper for: " + this.name);
  },

  loadAWS: function(payload) {
    var self = this;

    var param = {
	    Bucket: payload.Bucket,
	    Key: "Pictures/recognition.jpg",
	    ACL: payload.ACL,
	    Body: fs.createReadStream(path.resolve("../Pictures/" + payload.filename))
    };
    s3.upload(param, function(err, data) {
	if(err) {
		self.sendSocketNotification("FAIL_LOAD_AWS", err);
	}
	else {
    		self.sendSocketNotification("SUCCESS_LOAD_AWS", data);
	}
    });
  },

  rekognitionAWS: function(payload) {
	  var self = this;

	  var params = {
		  Image: {
			S3Object: {
				Bucket: payload.Bucket,
				Name: "Pictures/recognition.jpg"
			}
		  }
	  };

	  rekognition.detectFaces(params, function(err, data) {
		  if(err) {
			  self.sendSocketNotification("FAIL_REKOGNITION", err);
		  }
		  else {
			  self.sendSocketNotification("SUCCESS_REKOGNITION", data);
		  }
	  });
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;
	
	if (notification == "LOAD_AWS") {
		setTimeout(function() {
			self.loadAWS(payload);
		}, 3000);
	}
	else if (notification == "RECOMMEND_MUSIC") {
		setTimeout(function() {
			self.rekognitionAWS(payload);	
		}, 1000);
	}
  },

});
