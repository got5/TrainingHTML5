

(
	function($){


		var dAndDmodule= {};


		var retrieveFile= function(element, files){

			if (!files || !files.length){
				console.log('No file selected');
				return;
			}
			if (files.length>1){
				console.log('too much files selected');
				return;
			}

			var file= files[0];

			var imageReader= new FileReader();
			imageReader.onload= function(e){
				var size= Math.min(element.width(), element.height());
				var toAdd= 
					$('<img />')
					.attr('src', e.target.result)
					.attr('title', file.name)
					.width(size)
					.height(size);

				element.html($('<div></div>').html(toAdd).html());
			}
			imageReader.readAsDataURL(file);
			$('#add-pin-form')[0].fileToUpload= file;

		}


		dAndDmodule.addDropFunctiunality= function(){

			$('.image-zone')
			.on('dragenter', function(e){
				e.preventDefault();
				e.stopPropagation();
			})
			.on('dragover', function(e){
				e.preventDefault();
				e.stopPropagation();
			})
			.on('drop', function(e){
				e.preventDefault();
				e.stopPropagation();
				retrieveFile($(this), e.originalEvent.dataTransfer.files);
			})
		}

		dAndDmodule.captureInputFiles= function(){

			$('input[type="file"]')
			.on('change', function(e){
				retrieveFile($('.image-zone'), this.files);
			});


		}


		dAndDmodule.addDropFunctiunality();
		dAndDmodule.captureInputFiles();
	}

)(jQuery)