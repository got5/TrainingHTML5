
(
    function($){

        var layouts= ['horizontal', 'vertical'];


        var updateLayout= function(layout){
            //set layout in parameter
        }

        var getCurrentLayout= function(){
            //return the current layout
        }

        var getOpposedLayout= function(layout){
            //return the "opposed" layout based on the current one
        }

        //Change layout impl
        var changeLayout=function(e){

            //replace the current layout with the opposed one

            //Update the css class of the element: the name of the class is
            // the name of the layout

            //Update the text of the element: the tewt is the layout name

        }

        var initLayout= function(){

            //Check if the current layout exist:

            //If yes, use it -> add the class and set the text for this layout

            //Else, initialise it with layouts[0]

        }


        //Change the layout on a click event
        $('#navigation-status')
        .each(initLayout)
        .on('click', changeLayout);
    }


)(jQuery)