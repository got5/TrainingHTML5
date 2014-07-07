/**
 * Created by pierremarot on 17/06/2014.
 */
var mainOnline = (function ($) {
  var module = {};

    //Get all the places
    module.getPins = function(placesSuccess,placesError) {

        //Make your json ajax call here, be sure to set placesSuccess and placesError
        // as success and error callbacks

    };

    module.updateContent = function(place,updatedSuccess){
        //TODO: Use ajax post request to call the /api/places rest API with the place to update
    };

    return module;

})(jQuery);
