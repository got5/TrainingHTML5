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

		var setFromToStatus= function(oldStatus, newStatus){
			visualElement
			.removeClass(oldStatus)
			.addClass(newStatus)
			.text(newStatus);
		}

		//Init display
		visualElement.each(function(){
			var newStatus= module.isOnline() && 'online' || 'offline';
			var oldStatus= !module.isOnline() && 'offline' || 'online';
			setFromToStatus(oldStatus,newStatus);
		});

		//Updata display when online
		module.addOnlineListener(function(){
			setFromToStatus('offline', 'online');
		});

		//Update display when offline
		module.addOfflineListener(function(){
			setFromToStatus('online', 'offline');
		});

		$.offLineModule= module;
	}

)(jQuery)