/**
 * Created by pierremarot on 17/06/2014.
 */

var dbModel = (function(){
    var model = {
        name: 'pinit',
        version: 1,
        stores: {
            homes: {
                name: 'homes',
                key: {keyPath: 'clientId'},
                indexes:{
                    city: {
                        name: 'city',
                        definition: {unique: false}
                    }
                }
            }
        },
        upgrade: function(e){
            var
                newVersion = e.target.result,
                storeModel = dbModel.stores.homes,
                indexModel = storeModel.indexes.city,
                store;

            if(!newVersion.objectStoreNames.contains(storeModel.name)){
                store = newVersion.createObjectStore(storeModel.name,storeModel.key);

                store.createIndex(indexModel.name,indexModel.name,indexModel.definition);
            }
        }
    };
    return model;
})();