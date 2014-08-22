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
					Modernizr.load({
						test:Modernizr.flexbox,
						nope:'css/noFlexbox.css'
					});

				}

			);

		}


		includePromisesPolyfill();
		includeFlexboxCallback();


	}

)(jQuery)