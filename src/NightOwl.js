var NightOwl = (function () {

	return {
		maxStoredLogs: 10,

		serverUrl: null,
		apiKey: null,

		whenError: function (stackFrames, errorLabel, msg, file, line, col) {
			var errorObject = {};
			errorObject.stack_trace = stackFrames.map(function (sf) {
				return sf.toString();
			}).join('\n');

			errorObject.time = new Date();
			if (msg) errorObject.msg = msg;
			if (file) errorObject.file = file;
			if (line) errorObject.line = line;
			if (col)  errorObject.col  = col;
			if (errorLabel) errorObject.error_label = errorLabel;
			
			this.logError(errorObject);
		},
		
		whenErrorLogFails: function (error) {
			if (NightOwl.isEmpty(error)) {
				// nothing to log
			} else {
				// logging failed
				// TODO: handle failed logins
			}
		},
		
		logError: function (errorObject) {
			// insert to storage
			if (LocalStorage.isSupported) {
				// get any existing logs or create a new one
				var newLogs = this.getStoredLogs();

				// don't go over the allowed local limit
				if (newLogs.length >= this.maxStoredLogs) {
					newLogs.shift(); // remove the first element
				}
				newLogs.push(errorObject);  // add new object to the end

				// try to store the new log
				try {
					localStorage.setItem('NightOwlLog', JSON.stringify(newLogs));
				} catch (e) {
					// most likely out of localStorage space
					// TODO: try to directly send a server request
					// TODO: or try to delete existing data and try again
				}

				this.sendLogToServer();
			}
		},

		isEmpty: function (obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop))
					return false;
			}

			return true;
		},

		getStoredLogs: function () {
			if (LocalStorage.isSupported) {
				var existingLogs = localStorage.getItem('NightOwlLog');
				if (existingLogs.length) {
					return JSON.parse(existingLogs);
				}
			}
			return [];
		},

		resetLocalLogs: function () {
			if (LocalStorage.isSupported) localStorage.setItem('NightOwlLog', '[]');
		},

		sendLogToServer: function () {
			var _this = this;
			// get the log
			// see if we can connect
			// send the log
			// if successful, delete the log

			try {
				if (LocalStorage.isSupported && this.serverUrl && this.serverUrl.length) {
					var existingLogs = this.getStoredLogs();
					var xmlhttp;

					if (existingLogs.length > 0) {
						if (window.XMLHttpRequest) {
							// code for IE7+, Firefox, Chrome, Opera, Safari
							xmlhttp = new XMLHttpRequest();
						} else {
							// code for IE6, IE5
							xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						}

						xmlhttp.onreadystatechange = function () {
							if (xmlhttp.readyState == XMLHttpRequest.DONE) {
								if (xmlhttp.status == 200) {
									// success
									_this.resetLocalLogs();
								} else if (xmlhttp.status == 400) {
									// There was an error 400
								} else {
									// something else other than 200 was returned
								}
							}
						};

						xmlhttp.open('POST', this.serverUrl, true);
						if (this.apiKey.length) xmlhttp.setRequestHeader('X-Api-Key', this.apiKey);
						xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
						xmlhttp.setRequestHeader("Accept", "application/json");
						xmlhttp.send(JSON.stringify({logs: existingLogs}));
					}
				}
			} catch (e) {
				// TODO: hadle post to server failiures
			}
		}
	}
	
})();


/*
 |--------------------------------------------------------------------------
 | Attach the error logger to the 'window`
 |--------------------------------------------------------------------------
 |
 |
 |
 */
window.onerror = function (msg, file, line, col, error) {
	try {
		if (StackTrace && NightOwl) {
			StackTrace.fromError(error).then(function (stackFrames) {
				NightOwl.whenError(stackFrames, 'JS', msg, file, line, col)
			}).catch(NightOwl.whenErrorLogFails);
		}
	} catch (e) {
		// TODO: handle if something goes wrong in the error logger,
		// so that you don't get into an infinite loop, then sorry.
	}
};