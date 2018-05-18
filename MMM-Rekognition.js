
Module.register("MMM-webCamera", {
	defaults: {
		opts: [
			{
    	  			width: 1280,
				height: 720,
				quality: 100,
				delay: 0,
				saveShots: true,
				output: "jpg",
				device: false,
				callbackReturn: "location",
      				verbose: false
			},
		],
		aws: [
			{
				accessKeyId: 'YOUR_ACCESSKEY_ID',
				secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
				region: "YOUR_REGION",
				bucket: "YOUR_BUCKET_NAME",
			},
		],
		s3_folder: "YOUR_S3_FOLDER",
	},

  start: function() {
		var self = this;
	  Log.log("Starting module: " + this.name);
		this.sendSocketNotification("INIT_CAMERA", self.config);
  },

  notificationReceived: function(notification, payload, sender) {
	  var self = this;
	  if(sender) {
			if (notification == "COMMAND") {
				if (payload == " take a picture") {
					console.log("take a picture");
					self.sendSocketNotification("TAKE_A_PICTURE", payload);
				}
			}
	  }
  },

});
