var indexedDbModule=
(
	function($){

		var module={

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

				//TODO: Be sure to manage errors

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

					//TODO: Be sure to resolve the promise in case of success
					//      And to reject it otherwise (take into accounts all
					//      possible callbacks)
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

					openDbRequest.onsuccess= function(e){
						// TODO: Initialize the dbInstance field and resolve the promise
					}
					openDbRequest.onupgradeneeded= function(e){
						//TODO: Create object stores, don't forget the keyPath
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

							//TODO: Get the objectstore and add the data in parameter.
							//      In case of error on adding an object, don't reject
							//      the promise but log the error instead
							
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
				});
			}

			/* END :: UTILITIES */
		}

		//Then return the module
		return module;
	}

)(jQuery)