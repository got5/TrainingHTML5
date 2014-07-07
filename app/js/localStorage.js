(
    function($){

        var layouts= ['horizontal', 'vertical'];


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
        }

        var initLayout= function(){

            var currentLayout= getCurrentLayout();
            if (!currentLayout){
                currentLayout= layouts[0];
                updateLayout(currentLayout);
            }

            $(this).addClass(currentLayout);
            $(this).text(currentLayout);
        }


        //Change the layout on a click event
        $('#navigation-status')
        .each(initLayout)
        .on('click', changeLayout);
    }


)(jQuery)