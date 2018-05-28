/*
 * Author : BinSin
 * https://github.com/BinSin/MMM-Rekognition
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
	if(notification == "HIDE_PICTURE") {
		console.log("hide picture");
		self.hide();
	}
	else if(notification == "SUCCESS_LOAD_AWS") {
		console.log("success aws load : " + payload);
		this.image = payload;
		this.emotion = payload;
		self.show(1000);
		self.updateDom(500);
		setTimeout(function() {
			self.hide(1000);
		}, 5000);
	}
	else if(notification == "FAIL_LOAD_AWS") {
		console.log("fail aws load");
	}
	else if(notification == "SUCCESS_REKOGNITION") {
		console.log("success rekognition : " + payload);
		self.sendNotification("PLAY_MUSIC_RECOGNITION", payload);
	}
	else if(notification == "FAIL_REKOGNITION") {
		console.log("fail rekognition : " + payload);
	}
  },

});
