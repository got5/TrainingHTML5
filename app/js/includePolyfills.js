(

	function($){

		var includePromisesPolyfill= function(){

			if (!window.Promise){
				$('<script/>')
				.attr('type', 'text/javascript')
				.attr('src', 'vendor/es6-promise/promise.js')
				.insertAfter($('body > footer'));
			}
		}

		includePromisesPolyfill();


	}

)(jQuery)