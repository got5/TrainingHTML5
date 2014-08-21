(
    function($){

        var layouts= ['horizontal', 'vertical'];


        var forceReflow= function(element){
            element.style.display= 'none';
            element.offsetHeight;
            element.style.display= 'flex';
        }


        var updateLayout= function(layout){
            localStorage.setItem('currentLayout', layout);
        }

        var getCurrentLayout= function(){
            return localStorage.getItem('currentLayout');
        }

        var getOpposedLayout= function(layout){
            var res= null;
            if (layout == layouts[0]){
                res= layouts[1];
            }else{
                res= layouts[0];
            }         

            return res;
        }

        //Change layout impl
        var changeLayout=function(e){


            var currentLayout= getCurrentLayout();
            var opposedLayout= getOpposedLayout(currentLayout);
            updateLayout(opposedLayout);

            $(this).removeClass(currentLayout).addClass(opposedLayout);
            $(this).text(opposedLayout);

            $('#pins-wrapper').removeClass(currentLayout).addClass(opposedLayout);

            //workarround for chrome bug
            forceReflow($('#pins-wrapper')[0]);
        }

        var initLayout= function(){

            var currentLayout= getCurrentLayout();
            if (!currentLayout){
                currentLayout= layouts[0];
                updateLayout(currentLayout);
            }

            $(this).addClass(currentLayout);
            $(this).text(currentLayout);

            $('#pins-wrapper')
            .removeClass('horizontal')
            .removeClass('vertical')
            .addClass(currentLayout);
        }


        //Change the layout on a click event
        $('#navigation-status')
        .each(initLayout)
        .on('click', changeLayout);
    }


)(jQuery)