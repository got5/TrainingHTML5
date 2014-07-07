
var indexedDbModule=
(

	function($){

		var currentModule= {};

		var dbInitialized= false;
		var placesDB;


		var initDb= function(){

			var createAndInsertData= function(data){

				var promise= new Promise(function(resolve, reject){

				    //Property which gurantee the unicity of the object
				    var keyPath= 'id';

				    //TODO: Create the object store called 'places' 
				    // (placesDB is already instanciated at this time)
				    // For your object store, remember to specify the keypass, ie the property
				    // of your object which contains the primary key


				    // TODO: Create an index on the 'author' property, this will give the possibility to find
				    // places by author (no functionalities implemented for this in the PW)

				    //Store the data 


				    // TODO: wait end of the transaction before continue:
				    // Use the transaction field on your object store to retrieve the current transaction
				    // Use the oncomplete/onerror triggers on the transaction to resolve/reject your promise
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

				//TODO: Create an array in which let's add places
				

				//TODO: Create a new transaction which will hold the 'places' table


				//TODO: Add a callback to the transaction object to call the 'failureCallback' in parameter
				// in case of failure (remember that bubbling events will make this error available
				// at request level).
				

				//TODO: Get the 'places' objectstore through the transaction object
				

				//TODO: open a cursor on the 'places' objectStore to iterate
				// over this table and add each place on the array created at begining
				//Be sure to call the successCallback in parameter when iteration complete

			}

			//TODO: Call the initDB function, and use promises mechanism
			// to call the retrieveData function in case of success and
			// log an error message in the console in case of failure
			
		}

		currentModule.updateContent= function(place, updatedSuccess){
			//TODO: Open a readwrite transaction on the DB

			//TODO: Get the 'places' objectStore 

			//TODO: Update it with the current place

			//Assign the 'updatedSuccess' parameter callback in case
			// the request completes successfully
		}

		return currentModule;
	}

)(jQuery)