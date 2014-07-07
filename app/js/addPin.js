/**
 * Created by pierremarot on 18/06/2014.
 */
(function($){

    //We are online
    var module = addPinOnline;
    var form= $('#add-pin-form');

    //File validation
    var inputFileValidation= function(){

        var previousValue, previousFile;

        //Store current values in order to use
        //them in case the validation fails
        $(':file')
        .on('focus', function(e){
            previousValue= $(this).val();
            previousFile= this.files;
        })
        //Make the validation here, don't forget to
        //cancel the change if the validation fails
        .on('change', function(e){
            var file = this.files[0];
            var name = file.name;
            var size = file.size;
            var type = file.type;

            //Do some validation here;
            var errorMessage;
            var maxLength= 50;
            if (name.length > maxLength){
                errorMessage= 'File name "' + name + '" is too long, max length is ' + maxLength;
            }
            var maxSize= 1024*1024;
            if (size>maxSize){
                errorMessage= 'Your file is too large, max size is ' + maxSize;
            }
            var neededType= 'image/jpeg';
            if (type != neededType){
                errorMessage= 'Jpeg images only are accepted, you are trying to use ' + type;
            }
            
            if (errorMessage){
                alert(errorMessage);
                $(this).val(previousValue);
                this.files= previousFile;
            }


        });
        
    }
    
    inputFileValidation();

    //Not needed anymore !
    var extractInfoFromForm = function(form){
        return {
            'pin-title' : form.find('#pin-title').val(),
            'pin-cat' : form.find('#pin-cat').val(),
            'pin-desc' : form.find('#pin-desc').val(),
            'date' : form.find('#pin-date').val(),
            'pin-rate' : form.find('#pin-rate').val(),
            'share' : form.find('[type="radio"][name="comms"]:checked').val() || "no",
            'public' : form.find(':checkbox:checked').val() || "no",
            'uploadedfile' : form[0].fileToUpload 
        }
    };


    /*
     * If online -> post data 
     * Otherwise -> cache it
    **/
    form.submit(function (e) {
        e.preventDefault();

        var progress = $('progress').show();
        var data= extractInfoFromForm(form);
        var formData = module.getFormDataFromData(data);

        var callBacks={
            //Offline callbacks should be 'general' and not
            // based on the current context variables because
            // they will be eval in another context.
            success:{
                online:function redirect(e){
                    window.location = './index.html';
                },
                offline:function inform(e){
                    console.log('New request ssuccessfully sent');
                }
            },
            error:{
                online: function errorIUCallback(e){
                    console.log('error occured while submitting form');
                },
                offline: this.online
            },
            progress: {
                online: function(e){
                    progress.attr({value: e.loaded,max: e.total});
                },
            }
        }

        var online= $.offLineModule.isOnline();
        var data= (online && formData) || data;
        var stateStr= (online && 'online') || 'offline';
        var func= (online && module.addPinImage) || module.queueRequest;

        func.apply(this, [data, callBacks.success[stateStr], callBacks.error[stateStr], callBacks.progress[stateStr]]);
    });

    //Apply form submits when online is available
    $.offLineModule.addOnlineListener(addPinOnline.addPinImages);


})(jQuery);
