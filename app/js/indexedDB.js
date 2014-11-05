
(
	function($){

		var indexedDBModule={}

		indexedDBModule.placesModule={

			dbName: 'placesDB',
			dbVersion: 1,
			dbStores:[{name:'places', keyPath:'id'}],
			dbInstance: undefined,

			/* START :: DEFINE MAINONLINE INTERFACE FUNCTIONS */

			getPins: function(success, failure){

				var that= this;

				//If the DB is already initialized, 
				// we just retrieve data from it
				if (that.dbInstance){
					that.getDataFromDb()
					.then(success, failure);
				}
				//First time, we create it
				else{
					this.deleteDB()
					.then(function(e){return that.createEmptyDB(e);})
					.then(function(e){return that.populateDB(e);})
					.then(function(e){return that.getDataFromDb(e);})
					.then(function(places){success(places);})
					.catch(function(error){
						that.logError(error);
						failure();
					});
				}
			},

			/**
			* Update DB content based on the place parameter.
			* Then call the updatedSuccess callback.
			*/
			updateContent: function(place,updatedSuccess){
				var transaction= this.dbInstance.transaction([this.dbStores[0].name], 'readwrite');
				transaction.onerror= this.logError;
				//oncomplete is called when the transaction is auto commit
				transaction.oncomplete= updatedSuccess;
				//TODO: replace the place in DB with the one in parameter
				var objectStore= transaction.objectStore('places');
				var request = objectStore.put(place);
				//TODO: Be sure to manage errors
				request.onerror= this.logError;
			},

			/* END :: REPRODUCE MAINONLINE INTERFACE FUNCTIONS */


			/* START :: UTILITIES */

			logError: function(e){
				console.log('An error occured');
				if (e.target && e.target.errorCode){
					console.log('errorCode = ' + e.target.errorCode);
				}else{
					console.log(e);
				}
			},

			/**
			* Delete the database
			*/
			deleteDB: function(){
				//TIP: Use that instead of this everywhere in the function
				var that= this;
				return new Promise(function(resolve, reject){
					//TODO: delete the database (its name is in the fields)
					var deleteDbRequest= indexedDB.deleteDatabase(that.dbName);
					//TODO: Be sure to resolve the promise in case of success
					//      And to reject it otherwise (take into accounts all
					//      possible callbacks)
					deleteDbRequest.onsuccess= function(e){
						console.log('deleteDbRequest success');
						resolve(e);
					}
					deleteDbRequest.onerror= function(e){
						console.log('deleteDbRequest error');
						reject(e);
					}
					deleteDbRequest.onblocked= function(e){
						console.log('deleteDbRequest error');
						reject(e);
					}
				});
			},

			/**
			* Create an empty database.
			* Also defines the DB model (creates objectStores)
			*/
			createEmptyDB: function(event){
				//TIP: Use that instead of this everywhere in the function
				var that= this;
				return new Promise(function(resolve, reject){
					var openDbRequest= indexedDB.open(that.dbName, that.dbVersion);

					//TODO: Handle 'error' and 'blocked' event to reject
					//      the promise in that case 
					openDbRequest.onerror= openDbRequest.onblocked= reject;
					openDbRequest.onsuccess= function(e){
						// TODO: Initialize the dbInstance field and resolve the promise
						console.log('onsuccess');
						that.dbInstance= e.target.result;
						resolve(e);
					}
					openDbRequest.onupgradeneeded= function(e){
						//TODO: Create object stores, don't forget the keyPath
						console.log('onupgradeneeded');
						var db= e.target.result;
						$.each(that.dbStores, function(index, currentStore){
							db.createObjectStore(
								currentStore.name, 
								{keyPath:currentStore.keyPath}
							);
						});
					}
				});
			},

			populateDB: function(event){
				//TIP: Use that instead of this everywhere in the function
				var that= this;
				return new Promise(function(resolve, reject){
					mainOnline.getPins(
						function(places){
							var transaction= that.dbInstance.transaction([that.dbStores[0].name], 'readwrite');
							transaction.onerror=reject;
							//TODO: resolve the promise when the transaction is commit 
							//      (look for updateContent() to get a sample)
							transaction.oncomplete= resolve;
							//TODO: Get the objectstore and add the data in parameter.
							//      In case of error on adding an object, don't reject
							//      the promise but log the error instead
							var placesStore= transaction.objectStore(that.dbStores[0].name);
							$.each(places, function(index, currentPlace){
								placesStore.add(currentPlace).onerror= function(e){
									console.log('Unable to add place ' + currentPlace.id);
									that.logError(e);
								}
							});
						}, reject
					);
				});
			},

			getDataFromDb: function(e){
				//TIP: Use that instead of this everywhere in the function
				var that= this;
				return new Promise(function(resolve, reject){
					var res=[];
					var transaction= that.dbInstance.transaction([that.dbStores[0].name], 'readonly');
					transaction.onerror= reject;
					//oncomplete is called when the transaction is auto commit
					transaction.oncomplete= function(e){resolve(res)};
					var placesStore= transaction.objectStore(that.dbStores[0].name);

					//TODO: Create a cursor to retrieve all objects in the store. 
					//      Append these data in the 'res' array
					var cursorRequest= placesStore.openCursor();
					cursorRequest.onerror= reject;
					cursorRequest.onsuccess= function(event){
						var cursor= event.target.result;
						if(cursor){
							res.push(cursor.value);
							cursor.continue();
						}else{
							console.log('Iteration over places ended');
						}
					}					
				});
			}

			/* END :: UTILITIES */
		}

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

		//Then make the module available
		$.indexedDB= indexedDBModule;
	}

)(jQuery)