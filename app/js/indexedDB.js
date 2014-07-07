
var indexedDbModule=
(

	function($){

		var currentModule= {};

		var dbInitialized= false;
		var placesDB;


		var initDb= function(){

			var createAndInsertData= function(data){

				var promise= new Promise(function(resolve, reject){

					console.log('DB opened for the first time, or whith a higher version than the current one');

				    //Property which gurantee the unicity of the object
				    var keyPath= 'id';

				    var objectStore= placesDB.createObjectStore('places', {keyPath: keyPath});
				    objectStore.createIndex('author', 'author', {unique: false});

				    //Store the data 
				    for (var i in data){
				    	objectStore.add(data[i]);
				    }

				    var transaction= objectStore.transaction;
				    transaction.oncomplete= resolve;
				    transaction.onerror= function(e){
				    	theErr= e.target.error || transaction.error;
				    	if (theErr){
				    		theErr= theErr.message;
				    	}
				    	else{
				    		theErr= e;
				    	}
				    	reject(theErr);
				    }
				});

				return promise;
			}

			var deleteDB= function(){
					//Delete db
					return indexedDB.deleteDatabase('placesDB');
			}


			var promise= new Promise(function(resolve, reject){

				if (!dbInitialized){
					mainOnline.getPins(
						function(data){

							var deleteRequest= deleteDB();
							deleteRequest.onsuccess= function(event){

								console.log('DB deleted');

								var createRequest= indexedDB.open("placesDB");
								createRequest.onsuccess= function(event){
									placesDB= createRequest.result;
									dbInitialized= true;
									resolve('dbready');		
								}
								createRequest.onerror= function(e){
									console.log('Error while creating/opening DB: ' + e);
									reject(createRequest.error);
								}
								createRequest.onupgradeneeded= function(){
									placesDB= createRequest.result;
									createAndInsertData(data)
									.then(function(successData){
										dbInitialized= true;
										resolve('dbready');
									}, function(failureData){
										reject(failureData);
									});
								}

							}
							deleteRequest.onerror= function(event){
								console.log('An error occured while deleting DB');
								console.log(event);
								reject(deleteRequest.error);
							}	
						}
					);
				}
				else{
					resolve('dbready');
				}			
			});

			return promise;
		}


		currentModule.getPins= function(successCallback, failureCallback){

			var retrieveData= function(){

				var places= [];

				//read-only transaction by default
				//list of object stores concerned by the transaction
				var transaction= placesDB.transaction(['places']);


				transaction.onerror= function(event){
					console.log('If I dont call event.preventDefault(), an error implies a rollback');
					failureCallback(event);
				}

				//Get the objectstore
				var objectStore= transaction.objectStore('places')

				//Iterate over the places
				objectStore.openCursor().onsuccess= function(event){

					var cursor= event.target.result;
					if(cursor){
						places.push(cursor.value);
						cursor.continue();
					}else{
						console.log('Iteration over places ended');
						successCallback(places);
					}
				}
			}

			initDb()
			.then(
				function(successMessage){
					retrieveData();
				},
				function(failureMessage){
					console.log('Error: ' + failureMessage);
				}
			);
		}

		currentModule.updateContent= function(place, updatedSuccess){
			var transaction= placesDB.transaction(['places'], 'readwrite');
			var objectStore= transaction.objectStore('places');
			//Using the keypath
			var request = objectStore.put(place);
			request.onsuccess= updatedSuccess;
		}

		return currentModule;
	}

)(jQuery)