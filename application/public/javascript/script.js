(function($){
	$(document).ready(function(){

		getAjax("/pins", function(data){
			var d; 
			
			jQuery.each(data, function(index, d){
				var article = jQuery("<article>");
				article.append("<header><h1>"+d.title+"</h1></header>")
				article.appendTo("ul");
			});
			
		});
		
		function getAjax(url, callback){
			$.get(url, callback);	
		}
		


	});
}) (jQuery)
