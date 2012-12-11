// https://github.com/JoernBerkefeld/iOSvideoSeekOnLoad / MIT License 

// seekToInitially (float) : video-time in seconds
function loadingSeek(seekToInitially, callback) {
	if("undefined"==typeof callback) {
		callback = function() {};
	}
	var video = $("video"),
		video0 = video[0],
		isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/) !== null,
		iOSVersion = 0,
		test;
	if(isiOS) { // get the iOS Version
		test =navigator.userAgent.match("OS ([0-9]{1})_([0-9]{1})"),
		iOSVersion = 1*(test[1]+"."+test[2]);

		// you could add a loading spinner and a black layer onPlay HERE to hide the video as it starts at 0:00 before seeking
		// don't add it before or ppl will not click on the play button, thinking the player still needs to load
	}
	video.one("playing",function() { 
		if(seekToInitially > 0) {
			//log("seekToInitially: "+seekToInitially);
			if(isiOS) {
				// iOS devices fire an error if currentTime is set before the video started playing
				// this will only set the time on the first timeupdate after canplaythrough... everything else fails
				if(iOSVersion >= 6) {
					video.one("canplaythrough",function() { 
						video.one("progress",function() { 
							video0.currentTime = seekToInitially;
							video.one("seeked.nlvBlackOut",function() {
								// hide the loading spinner and the black layer HERE if you added one before

								// optionally execute a callback function once seeking is done
								callback();
							});
						});
					});
				} else {
					// iOS 5 and earlier
					// TODO
				}
			} else {
				// seek directly after play was executed for all other devices
				video0.currentTime = seekToInitially; 
				
				// optionally execute a callback function once seeking is done
				callback();
			}
		} else {
			// seek not necessary

			// optionally execute a callback function once seeking is done
			callback();
		}
	});
}
