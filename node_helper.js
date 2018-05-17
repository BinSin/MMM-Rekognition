/*
*
*/
'use strict';

var NodeHelper = require("node_helper");
var NodeWebcam = require("node-webcam");
var opts = {};
var Webcam = null;

var Rekognition = require('node-rekognition');
var rekognition = null;
var s3_folder = null; 

module.exports = NodeHelper.create({

  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  initCamera: function(payload) {
    var self = this;
    self.Webcam = NodeWebcam.create( {
      width: payload.opts.width,
      height: payload.opts.height,
      quality: payload.opts.quality,
      delay: payload.opts.delay,
      saveShots: payload.opts.saveShots,
      output: payload.opts.output,
      device: payload.opts.device,
      callbackReturn: payload.opts.callbackReturn,
      verbose: payload.opts.verbose
    } );

    self.rekognition = new Rekognition( {
	    accessKeyId: payload.aws.accessKeyId,
	    secretAccessKey: payload.aws.secretAccessKey,
	    region: payload.aws.region,
	    bucket: payload.aws.bucket,
    } );
    self.s3_folder = payload.s3_folder;

  },

  socketNotificationReceived: function(notification, payload) {
    if(notification == "INIT_CAMERA") {
      this.initCamera(payload);
    }
    else if (notification == "TAKE_A_PICTURE") {
      var self = this;
      
      var picture_path = "~/Pictures/%y%m%d_%H%M%S";
      self.Webcam.capture( picture_path, function( err, data ) {} );
      
      var s3Images = rekognition.uploadToS3(picture_path, self.aws_folder);
    }
  },

});
