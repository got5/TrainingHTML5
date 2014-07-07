/**
 * Created by pierremarot on 17/06/2014.
 */
var mainOnline = (function ($) {
  var module = {};

    //Get all the places
    module.getPins = function(placesSuccess,placesError) {
        $.ajax({
            dataType: "json",
            url: "/api/places",
            type: "GET",
            cache: false,
            contentType: "application/json",
            success: placesSuccess,
            error: placesError
        });
    };

    module.updateContent = function(place,updatedSuccess){
        $.post('/api/places', place, updatedSuccess,"json");
    };

    return module;

})(jQuery);
