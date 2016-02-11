# NightOwl - Ionic / Angular / JavaScript Offline Error Logger

There are many services out there which will handle exceptions in JavaScript. But how do you know if there's an error when the app is offline?

This script will look for errors, and save it to localStorage, and then submit it to a server later.

## Install

Install via bower
```
bower install nightowl
```

For just JavaScript error logging
```
    <script src="lib/stackframe/dist/stackframe.js"></script>
    <script src="lib/error-stack-parser/dist/error-stack-parser.js"></script>
    <script src="lib/stacktrace-gps/dist/stacktrace-gps.js"></script>
    <script src="lib/stacktrace-js/dist/stacktrace.js"></script>
    <script src="lib/nightowl/src/LocalStorage.js"></script>
    <script src="lib/nightowl/src/NightOwl.js"></script>

	<script src="js/nightowl-init.js"></script>

```

Alternatively, if you want to log errors with Angular or Ionic, use the files below.
```
    <script src="lib/stackframe/dist/stackframe.js"></script>
    <script src="lib/error-stack-parser/dist/error-stack-parser.js"></script>
    <script src="lib/stacktrace-gps/dist/stacktrace-gps.js"></script>
    <script src="lib/stacktrace-js/dist/stacktrace.js"></script>
    <script src="lib/nightowl/src/LocalStorage.js"></script>
    <script src="lib/nightowl/src/NightOwl.js"></script>

    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    <script src="lib/nightowl/src/ngNightOwl.js"></script> 

    <script src="js/nightowl-init.js"></script>
```

Then, in your Angular start file, add the dependency.
```
angular.module(app, ['ionic', 'emComponents.NightOwl']);
```


Create a new file called `js/nightowl-init.js`, and add the lines below.

```
// NightOwl.maxStoredLogs = 10;     	// max offline stored logs; default = 10
// NightOwl.apiKey = '1122334455';		// API Key (optional)
NightOwl.serverUrl = 'http://nightowlserver.com/api/v1/report';		// URL to submit errors
```


That's it. It should save all the JS errors, save them, and you can submit them later to a server when you're online.
