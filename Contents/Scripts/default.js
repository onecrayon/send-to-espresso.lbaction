/**
 * Send To Espresso.lbaction
 * 
 * @author: Ian Beck <ian@onecrayon.com>
 */

function run() {
	// Show error to aler the user how to properly use the action
	LaunchBar.alert('URL required'.localize(), 'Send To Espresso requires a local file path or URL.'.localize());
}

function toEspressoURL(path) {
	return 'x-espresso://open?filepath=' + path;
}

function runWithString(str) {
	var url = null;
	// Make sure the string is a URL that starts with HTTP
	if (/^https?:\/\//.test(str)) {
		url = str;
	} else if (/^(?:file:\/\/|~)?\/\S/.test(str)) {
		// Appears to be a filepath
		str = str.replace(/^file:\/\//, '');
		if (/^~/.test(str)) {
			// We have to expand to the full path for Espresso to open the file
			// FIXME: this is not a great solution, because it is possible for people to change their home folder; need to find a way to expand their home folder with LaunchBar.execute()
			str = str.replace(/^~/, '/Users/' + LaunchBar.userName);
		}
		if (File.exists(str)) {
			url = toEspressoURL(str);
		} else {
			LaunchBar.alert('File does not exist'.localize(), 'The path you tried to send to Espresso does not exist.'.localize());
			return;
		}
	} else if (/^(?:[wW]{3}\d{0,3}[.]|[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,4}\/)(?:[^\s()<>]+|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/.test(str)) {
		// Recognizable URL without the HTTP
		url = 'http://' + str;
	}
	if (url) {
		LaunchBar.debugLog('opening URL: ' + url);
		LaunchBar.openURL(url, 'Espresso');
	} else {
		run();
	}
}

function runWithPaths(paths) {
	for (var i = 0, path; i < paths.length; i++) {
		path = toEspressoURL(paths[i]);
		LaunchBar.debugLog('opening path: ' + path);
		LaunchBar.openURL(path, 'Espresso');
	}
}
