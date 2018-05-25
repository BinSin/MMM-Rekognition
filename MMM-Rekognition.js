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
	self.sendSocketNotification("INIT_AWS", self.config);
  },

  getDom: function() {
	Log.log('Change Image');
	var wrapper = document.createElement("div");
	var img = document.createElement("img");
	img.width = '320';
	img.height = '180';
	img.src = 'https://s3-ap-northeast-1.amazonaws.com/hellomirror3/Pictures/' + this.image;
	wrapper.appendChild(img);
	return wrapper;
  },

  notificationReceived: function(notification, payload, sender) {
	var self = this;
	if(sender) {
		if (notification == "SEND_AWS") {
			console.log("send picture to AWS : " + payload);
			self.sendSocketNotification("LOAD_AWS", self.config);
		}
		else if (notification == "COMMAND") {
			if(payload == " recommend music") {
				console.log("recommend music");
				self.sendSocketNotification("RECOMMEND_MUSIC", self.config);
			}
		}
	}
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;
	if(notification == "SUCCESS_SEND_LOCATION") {
		console.log("success send location : " +  payload);
		this.image = payload;
		this.updateDom(500);
	}
	else if(notification == "FAIL_SEND_LOCATION") {
		console.log("fail send location : " + payload);
	}
	else if(notification == "SUCCESS_LOAD_AWS") {
		console.log("success aws load : " + payload);
		this.image = payload;
		self.updateDom(500);
	}
	else if(notification == "FAIL_LOAD_AWS") {
		console.log("fail aws load");
	}
	else if(notification == "SUCCESS_REKOGNITION") {
		console.log("success rekognition : " + payload);
	}
	else if(notification == "FAIL_REKOGNITION") {
		console.log("fail rekognition : " + payload);
	}
  },

});
