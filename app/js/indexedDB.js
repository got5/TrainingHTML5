
(

	function($){


		indexedDBModule={}

		indexedDBModule.placesModule=
		(
			function(){
				var placesModule= {};
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


				placesModule.getPins= function(successCallback, failureCallback){

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

				placesModule.updateContent= function(place, updatedSuccess){
					var transaction= placesDB.transaction(['places'], 'readwrite');
					var objectStore= transaction.objectStore('places');
					//Using the keypath
					var request = objectStore.put(place);
					request.onsuccess= updatedSuccess;
				}

				return placesModule;
			}
		)();


		indexedDBModule.queueRequestModule=
		(

			function(){

				var queueRequestModule={}

			    var AjaxRequestInfo= function(formData, successCallback, errorCallback){
			    	this.id= 0; //Auto increment...
			        this.formData= formData;
			        this.successCallback= successCallback && ('var custSuccessCallback= ' + successCallback.toString());
			        this.errorCallback= errorCallback && ('var custErrorCallback= ' + errorCallback.toString());
			    }

			    queueRequestModule.queueRequest= function(data, successCallbackToStore, errorCallbackToStore, successCallback, errorCallback){
			        var theRequest= new AjaxRequestInfo(data, successCallbackToStore, errorCallbackToStore);

			        var createRequest= indexedDB.open("queueRequests");
			        var queueRequestsDB;
			        createRequest.onsuccess= function(e){
			            queueRequestsDB= createRequest.result;
			            var transaction= queueRequestsDB.transaction(['queueRequestsStore'], 'readwrite');
			            transaction.oncomplete= transaction.oncomplete || function(e){console.log('Request added');}
			            var objectStore= transaction.objectStore('queueRequestsStore');
			            objectStore.add(theRequest);
			            successCallback();
			        }
			        createRequest.onerror= function(e){
			            console.log('Error while creating/opening DB: ' + e);
			            errorCallback();
			        }
			        createRequest.onupgradeneeded= function(){
			            queueRequestsDB= createRequest.result;
			            var objectStore= queueRequestsDB.createObjectStore('queueRequestsStore', {keyPath: 'id', autoincrement: true});
			            var transaction= objectStore.transaction;
			            transaction.onerror= function(e){
			                console.log('error:' + e);
			            }
			            transaction.oncomplete=function(e){
			                console.log('DB creation -> Transaction complete');
			            }
			        }
			    }


			    queueRequestModule.unqueueRequests= function(dataCallback){

			    	var data= [];

			       var queueRequests= indexedDB.open("queueRequests");
			        queueRequests.onsuccess= function(event){
			            var queueRequestsDB= queueRequests.result;
			            var transaction= queueRequestsDB.transaction(['queueRequestsStore']);
			            var objectStore= transaction.objectStore('queueRequestsStore');

			            //Iterate over the places
			            objectStore.openCursor().onsuccess= function(event){

			                var cursor= event.target.result;
			                if(cursor){
			                	data.push(cursor.value);
			                    cursor.continue();
			                }else{
			                    console.log('Iteration over queued request ended');
			                    console.log('drop db');
			                    var dropRequest= indexedDB.deleteDatabase('placesDB');
			                    dropRequest.onsuccess= function(event){
			                        console.log('db droped successfully');
			                    }
			                    dropRequest.onerror= function(event){
			                        console.log('Unable to drop db: ' + event);
			                    }

			                    dataCallback(data);
			                }
			            }
			        }
			        queueRequests.onerror= function(e){
			            console.log('Error while creating/opening DB: ' + e);
			        }
			        queueRequests.onupgradeneeded= function(){
			            console.log('Nothing to do');
			        }

			    }

			    return queueRequestModule;
			}
		)()



		$.indexedDB= indexedDBModule;

	}

)(jQuery)