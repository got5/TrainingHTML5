(

	function($){


		var locOpts= {
			defaultLocation:{x:-22.271282, y:166.424459},
			watchPositionId: undefined, //The id returned by the geolocation API
			map: undefined, // the map to initialize through gmap api
			divInfoClass: 'locationInfos', //div id used to display messages related to errors
			divMapId: 'map'
		}

		var initGmaps= function(divMap){

			//default position
			var gmPos = new google.maps.LatLng(locOpts.defaultLocation.x, locOpts.defaultLocation.y);

			//Options
			var optionsGmaps = {
			    center:gmPos,
			    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    zoom: 15
			};

			// Init the map
			locOpts.map = new google.maps.Map(divMap, optionsGmaps);

			//Use a marker in gmap for this position
		    var marker = new google.maps.Marker({
		      position: gmPos,
		      map: locOpts.map,
		      title:"You are here"
		    });

		    //And center on this position
		    locOpts.map.panTo(gmPos);			
		}

		var initData= function(){

			var divMap= $('<div/>').attr('id', locOpts.divMapId);

			$('main[role="main"]')
			.append( divMap );

			initGmaps(divMap[0]);
		}

		var updateDataFromPosition= function(position){
			
			//Get gmap position from standard position
			var gmPos= new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			//Use a marker in gmap for this position
		    var marker = new google.maps.Marker({
		      position: gmPos,
		      map: locOpts.map,
		      title:"You are here"
		    });

		    //And center on this position
		    locOpts.map.panTo(gmPos);
		}

		//TODO: 
		// * Create a new div element
		// * append it to the end of the element <main role="main" />
		// * Assign it the class locOpts.divInfoClass
		// * Set the text in parameter to this div
		var setMessage= function(message){
			$('main[role="main"]')
			.append( 
				$('<div/>').attr('class', locOpts.divInfoClass)
				.text(message)
			);
		}

		//TODO:
		// * Define a message depending on the error code
		// * display this message using the setMessage function
		// * cancel the geolocation API process if possible (note:
		//   maybe that the API was working at the begining an that 
		//   an error occured later, in which case we want to stop 
		//   the geolocation feature)
		var positionError= function(error){

			var message;

			switch(error.code){
				case error.TIMEOUT:
					message= "A timeout occured";
					break;
				case error.PERMISSION_DENIED:
					message= "Unable to get the position without your permission";
					break;
				case error.POSITION_UNAVAILABLE:
					message= "Your position cannot be determined";
					break;
				case error.UNKNOWN:
					message= "An unknown error occured";
					break;
			}


			//Set a message with the current error
			setMessage('Geolocation failed: ' + message);

			//Cancel geolocation watch
			locOpts.watchPositionId && navigator.geolocation.clearWatch(locOpts.watchPositionId);
		}



		initData();

		//TODO:
		// -> If the geolocation API is available, use it to:
		// * Call the updateDataFromPosition callback
		// * Make this call every 6 seconds
		// * Call the positionError callback if an error occured
		// -> Otherwise display a message 

		if (navigator.geolocation){
			locOpts.watchPositionId= navigator.geolocation.watchPosition(
				updateDataFromPosition, 
				positionError,
				{maximumAge:6000}
			);
		}else{
			setMessage('Your browser does not support the geolocation API.');
		}



	}

)(jQuery)