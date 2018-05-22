/*
 * Author : BinSin
 * https://github.com/BinSin/MMM-webCamera
 */

Module.register("MMM-Rekognition", {
  defaults: {
	Bucket: 'YOUR_BUCKET_NAME',
	ACL: 'ACCESS_CONTROL_LIST',
  },

  start: function() {
	var self = this;
	Log.log("Starting module: " + this.name);
  },

  notificationReceived: function(notification, payload, sender) {
	var self = this;
	if(sender) {
		if (notification == "SEND_AWS") {
			console.log("send picture to AWS");
			self.config.filename = payload;
			self.sendSocketNotification("LOAD_AWS", self.config);
		}
		if (notification == "COMMAND") {
			if(payload == " recommend music") {
				console.log("recommend music");
				self.sendSocketNotification("RECOMMEND_MUSIC", self.config);
			}
		}
	}
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;
	if(notification == "SUCCESS_LOAD_AWS") {
		console.log("success aws load");
	}
	else if(notification == "FAIL_LOAD_AWS") {
		console.log("fail aws load");
	}
	else if(notification == "SUCCESS_REKOGNITION") {
		console.log("success rekognition" + payload.Emotions);
	}
	else if(notification == "FAIL_REKOGNITION") {
		console.log("fail rekognition : " + payload);
	}
  },

});
