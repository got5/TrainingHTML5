/**
 * Created by pierremarot on 17/06/2014.
 */
(function ($) {
    var module = indexedDbModule;
    var places = [];
    var pinsWrapper = $("#pins-wrapper");

    var placesSuccess = function (data) {
        if (data && data.length !== 0) {
            places = data;
            var toAppend= '';
            $.each(data, function (i, place) {
                toAppend+= getPlaceTemplate(place);
            });
            pinsWrapper.append(toAppend);
        }
    };

    var placesError = function () {
        console.log("fail");
    };

    var getPlaceTemplate = function (place) {
        place.image = place.image || 'imgs/no-image.jpg';
        return "<article data-id=\"" + place.id + "\" class=\"the-pin h-entry h-feed\">\n    <header>\n        <p class=\"k-picture\"><a href=\"#\"><img src=\"" + place.image + "\" alt=\"\"></a></p>\n        <h3>" + place.name + "</h3>\n    </header>\n    <div class=\"e-content p-summary\">\n        <p contenteditable=\"true\">&#9998;" + place.content + "</p>\n <button style=\"display:none\">save</button></div>\n    <footer>\n        <ul class=\"entry-info\">\n            <li><a class=\"p-author h-card\" href=\"#\">" + place.author + "</a></li>\n            <li><time class=\"dt-published\" datetime=\"" + dateUtils.getDateTime(place.date) + "\">" + dateUtils.getDisplayDate(place.date) + "</time></li>\n        </ul>\n        <ul class=\"k-tools-list\">\n            <li><button><img src=\"imgs/pushpin.png\" alt=\"PinIt!\" /></button></li>\n            <li><a href=\"#\"><img src=\"imgs/share.png\" alt=\"Share\" /></a></li>\n        </ul>\n    </footer>\n</article>\n<hr />";
        
    };




    var clickOnSaveButton= function(e){
                var contentElement = $(this).prev();
                contentElement.addClass("saving");

                var id = $(this).closest('article').attr('data-id');

                var place = $.grep(places, function (item) {
                    return item.id === id;
                })[0];
                place.content = contentElement.text().split('✎').join('');

                module.updateContent(place,function (data) {
                   contentElement.removeClass("saving").addClass("saved");

                   window.setTimeout(function () {
                       contentElement.removeClass("saved");
                   }, 300);

                },"json");
    }

    //Events

    pinsWrapper
        .on('blur', 'article p[contentEditable="true"]', function (e) {
            if(!e.relatedTarget || e.relatedTarget.nodeName !== 'BUTTON'){
                $(this).next().hide();
            }
        })
        //Call the clickOnSaveButton function
        .on('click', 'article p[contentEditable="true"]', function(e){
            $(this).next().show();
        })
        .on('click', 'article div button', clickOnSaveButton);



    var createJqueryPlugin= function(){

        $.fn.appendArticles= function(options){

            var settings= 
            $.extend({error: placesError}, options);

            return this.each(function(){
                pinsWrapper= $(this);
                //Get all the places
                module.getPins(placesSuccess,settings.error);
            });
        }

    }

    createJqueryPlugin();

    //Use plugin
    $("#pins-wrapper")
    .appendArticles(
        {
            error:function(){console.log('My custom error')}
        }
    );

})(jQuery);
