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

  getScripts: function() {
	return ["https://code.responsivevoice.org/responsivevoice.js"];
  },

   getDom: function() {
	Log.log('Selfie image');
	var wrapper = document.createElement("div");
	var img = document.createElement("img");
 	img.width = '320';
	img.height = '180';
	img.src = 'https://s3-ap-northeast-1.amazonaws.com/hellomirror3/' + this.image;
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
		else if (notification == "SEND_AWS_MASTER") {
			console.log("send picture to AWS MASTER : " + payload);
			self.sendSocketNotification("LOAD_AWS_MASTER", self.config);
		}
		else if (notification == "COMMAND") {
			if(payload == " recommend music" || payload == " recommended music" || payload == " recommend the music") {
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
		self.show(500);
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
		if(payload == "HAPPY") {
			responsiveVoice.speak("You look happy");
		}
		else if(payload == "SAD") {
			responsiveVoice.speak("You look sad");
		}
		else if(payload == "ANGRY") {
			responsiveVoice.speak("You look angry");
		}
		else if(payload == "CONFUSED") {
			responsiveVoice.speak("You look confused");
		}
		else if(payload == "DISGUSTED") {
			responsiveVoice.speak("You look disgusted");
		}
		else if(payload == "SURPRISED") {
			responsiveVoice.speak("You look surprised");
		}
		else {
			responsiveVoice.speak("I don't know how you feel");
		}
		self.sendNotification("PLAY_MUSIC_RECOGNITION", payload);
	}
	else if(notification == "FAIL_REKOGNITION") {
		console.log("fail rekognition : " + payload);
	}
	else if(notification == "SUCCESS_LOAD_AWS_MASTER") {
		console.log("success load aws master");
		setTimeout(function() {
			self.sendNotification("RECOGNITION_FACE", payload);
		}, 3000);
	}
	else if(notification == "FAIL_LOAD_AWS_MASTER") {
		console.log("fail load aws master");
	}
  },

});
