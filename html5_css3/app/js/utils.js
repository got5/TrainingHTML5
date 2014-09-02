var moduleUtils=
    (
        function(){

            var runCallbacks= function(callbacks){
              for(var i in callbacks){
                callbacks[i].apply(this);
              }
            }

            return {

                displayList: function(list, message){

                  console.log(message);
                  for (var i in list){
                    console.log(list[i]);
                  }

                },

                beSureScriptNodeExistBeforeRun: function(theId, callbacks){

                    var observer = new MutationObserver(
                        function(mutations) {
                            mutations.forEach(
                                function(mutation) {
                                    if (mutation.addedNodes){
                                        //console.log('All mutations: ' + mutation.addedNodes);
                                        for(var idx in mutation.addedNodes){
                                            var currentNode= mutation.addedNodes[idx];
                                            //check that node is an element
                                            if (currentNode && currentNode.nodeType == 1){
                                                //console.log(currentNode);
                                                var searchedNode= $(currentNode).find(theId);
                                                if (searchedNode.length == 1){
                                                    runCallbacks(callbacks);                                                    
                                                    observer.disconnect();
                                                }
                                            }
                                        }
                                    }
                                }
                            );
                        }
                    );

                    var scriptNode= $(theId);
                    if (scriptNode[0]){
                        runCallbacks(callbacks);
                    }else{
                        observer.observe(document.body, {
                            childList: true
                          , subtree: true
                          , attributes: true
                          , characterData: false
                        });
                    }            
                }
            };
        }
    )();