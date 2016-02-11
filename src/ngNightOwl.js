angular.module('emComponents.NightOwl', [])
	.config(function($provide) {

		$provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
			return function(exception, cause) {
				$delegate(exception, cause);

				if (StackTrace && NightOwl) {
					StackTrace.fromError(exception).then(function (stackFrames) {
						NightOwl.whenError(stackFrames, 'Angular', exception.toString())
					}).catch(NightOwl.whenErrorLogFails);
				}
			};
		}]);

	});
