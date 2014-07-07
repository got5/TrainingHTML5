

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

			//Retrieve the element whose class is image-zone
			$('.image-zone')
			.on('dragenter', function(e){
			// TODO: Disable the default behaviour for the dragenter event
			})
			.on('dragover', function(e){
			// TODO: Disable the default behaviour for the dragover event
			})
			.on('drop', function(e){
			// TODO: Disable the default behaviour for the dragover event

			// TODO: call the retrieveFile method.
			// First parameter is the element on which the image will be displayed
			// -> The element must be 'jQueryfied'
			// Second parameter is the list of files to treat
			// -> To get the original event from the jquery one, use e.originalEvent attribute
			});
		}

		dAndDmodule.captureInputFiles= function(){

			//Get the input file element
			$('input[type="file"]')
			.on('change', function(e){
				//TODO: Call the retrieve file function as needed
				// (the input file object has an attribute named files...)
			});


		}


		dAndDmodule.addDropFunctiunality();
		dAndDmodule.captureInputFiles();
	}

)(jQuery)