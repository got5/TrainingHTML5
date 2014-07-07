(

	function($){

		var isOfflineSupported= (navigator.onLine != undefined);
		//Functions which listen the online event
		var onlineActions= [];
		//Functions which listen the online event
		var offlineActions= [];	


		var module={

			isOnline: function(){
				return !isOfflineSupported || navigator.onLine;
			},

			addOnlineListener: function(listener){
				if(isOfflineSupported){
					$(window).on('online', listener);
				}
			},

			addOfflineListener: function(listener){
				if (isOfflineSupported){
					$(window).on('offline', listener);
				}
			}

		};

		var visualElement= $('p[class~="connection-status"]');


		//Init display

		//Updata display when online

		//Update display when offline

		$.offLineModule= module;
	}

)(jQuery)