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

        })
        //Make the validation here, don't forget to
        //cancel the change if the validation fails
        .on('change', function(e){
            var file = this.files[0];
            var name = file.name;
            var size = file.size;
            var type = file.type;

            //Do some validation here;
        });
        
    }
    
    inputFileValidation();


    var extractInfo = function(form){
        var pin = {};

        //TODO: fulfill with form values

        return pin;
    };


    var form= $('#add-pin-form');
    form.submit(function (e) {

        e.preventDefault();

        var formData = extractInfo(form);
        //TODO call to module.addPinInfo
        module.addPinInfo(formData,
            function success(e){
            },
            function failure(e){
            }
        );

    });

})(jQuery);
