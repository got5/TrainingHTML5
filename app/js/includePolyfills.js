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


		var includeFlexboxCallback= function(){

			$(document).ready(
				//TODO: here
				function(){
					//Include css fallback
					if ($('html').hasClass('no-flexbox')){
						$('<link/>')
						.attr('rel','stylesheet')
						.attr('href', 'css/noFlexbox.css')
						.appendTo($('html > head'));
					}

				}

			);

		}


		includePromisesPolyfill();
		includeFlexboxCallback();


	}

)(jQuery)