/**
 * Created by pierremarot on 24/06/2014.
 */
var addPinOnline = (function($){
    var module = {};

    module.addPinInfo = function(pin,successCallback){
        $.post("/api/places",pin,successCallback,"json");
    };

    module.addPinImage = function (formData,successCallback,errorCallback,progressHandlingCallback) {
        $.ajax({
            url: '/api/images',  //Server script to process data
            type: 'POST',
            xhr: function() {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // Check if upload property exists
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

    return module;


})(jQuery);