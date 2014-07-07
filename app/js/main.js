/**
 * Created by pierremarot on 17/06/2014.
 */
(function ($) {
    var module = mainOnline;
    var places = [];
    var pinsWrapper = $("#pins-wrapper");

    var placesSuccess = function (data) {
        if (data && data.length !== 0) {

            //Set places variable

            //get the dynamized template for each place in data

            //append this data to the pinsWrapper element
        }
    };

    var placesError = function () {
        console.log("fail");
    };

    var getPlaceTemplate = function (place) {
        if(!place.image){
            place.image = "imgs/no-image.jpg";
        }
        //Dynamize your template here
        return "";
    };

    //Get all the places
    module.getPins(placesSuccess,placesError);




    var clickOnSaveButton= function(e){
                var contentElement = $(this).prev();
                contentElement.addClass("saving");

                var id = $(this).closest('article').attr('data-id');

                var place = $.grep(places, function (item) {
                    return item.id === id;
                })[0];
                place.content = contentElement.text().split('✎').join('');

                module.updateContent(place,function (data) {

                    //remove the 'saving' class on the element 'contentElement' 

                    //Add the 'saved' class on the element 'contentElement'

                    //Remove the 'saved' class after 1 sec

                },"json");
    }





    //Events

    pinsWrapper
        .on('blur', 'p[contentEditable="true"]', function (e) {
            if(!e.relatedTarget || e.relatedTarget.nodeName !== 'BUTTON'){
                $(this).next().hide();
            }
        })
        //Call the clickOnSaveButton function
        .on('click', 'article p[contenteditable="true"]', function(e){});


})(jQuery);
