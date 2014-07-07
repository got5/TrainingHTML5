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
    // var extractInfo = function(form){
    //     var pin = {};
    //     pin.name = form.find('#pin-title').val();
    //     pin.category = form.find('#pin-cat').val();
    //     pin.content = form.find('#pin-desc').val();
    //     pin.date = form.find('#pin-date').val();
    //     pin.rate = form.find('#pin-rate').val();
    //     pin.share = form.find('[type="radio"][name="comms"]:checked').val() || "no";
    //     pin.public = form.find(':checkbox:checked').val() || "no";
    //     return pin;
    // };


    form.submit(function (e) {
        e.preventDefault();

        var progress = $('progress').show();
        var formData = new FormData(form[0]);
        if (form[0].fileToUpload){
            formData.append('uploadedfile', form[0].fileToUpload);
        }
        module.addPinImage(formData,function successIUCallback(e){
            progress.hide();
            console.log('finished');
            window.location = './index.html';
        },function errorIUCallback(e){
            progress.hide();
            console.log('error occured while submitting form');

        },function progressHandlingCallback(e){
            progress.attr({value: e.loaded,max: e.total});
        });
    })
})(jQuery);
