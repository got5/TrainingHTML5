/**
 * Created by pierremarot on 24/06/2014.
 */
var addPinOnline = (function($){
    var module = {};
    var restWithImage= '/api/images';


    module.addPinInfo = function(pin,successCallback){
        $.post("/api/places",pin,successCallback,"json");
    }


    module.queueRequest= function(data, successCallback, errorCallback){

        $.indexedDB.queueRequestModule.queueRequest(
            data, successCallback, errorCallback,
            function(){
                alert('You are offline, your data is saved and will be sent when network access will be available');
                window.location='./add-pin.html';
            },
            function(){
                alert('An error occured and your data has probably not been correctly saved');
                window.location='./add-pin.html';
            }

        );
     }

    module.getFormDataFromData= function(data){

        var formData= new FormData();
        for(var prop in data){
            formData.append(prop, data[prop]);
        }

        return formData;
    }    


    module.addPinImage = function (formData,successCallback,errorCallback,progressHandlingCallback) {

        $.ajax({
            url: restWithImage,  //Server script to process data
            type: 'POST',
            xhr: function() {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if(progressHandlingCallback && myXhr.upload){ // Check if upload property exists
                    myXhr.upload.addEventListener('progress',progressHandlingCallback, false); // For handling the progress of the upload
                }
                return myXhr;
            },
            //Ajax events
            success: successCallback,
            error: errorCallback,
            // Form data
            data: formData,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    };

    module.addPinImages= function(){

        $.indexedDB.queueRequestModule.unqueueRequests(
            function(requests){

                for(var currentRequest in requests){

                   var successCallback= cursor.value.successCallback;
                    var errorCallback= cursor.value.errorCallback;
                    module.addPinImage(
                        module.getFormDataFromData(cursor.value.formData),
                        function(){
                            if (successCallback){
                                eval(successCallback);
                                custSuccessCallback();
                            }else{
                                console.log('Default successCallback does nothing');
                            }
                        },
                        function(){
                            if (errorCallback){
                                eval(errorCallback);
                                custErrorCallback();
                            }else{
                                console.log('Default errorCallback does nothing');
                            }
                        }
                    ); 
                }
            }
        );
    }



    return module;


})(jQuery);