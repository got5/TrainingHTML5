var webWorkers= 
(
	function($){


		var getEmptyCanvas= function(realWidth, realHeight, clientWidth, clientHeight){
			var res= 
				$('<canvas width="' + realWidth+ '" height="' + realHeight + '"></canvas>')
				.css('width', clientWidth)
				.css('height', clientHeight);

			return res;
		}

		var getInitialImageData= function(imgElement, realWidth, realHeight, clientWidth, clientHeight){

			var canvas= getEmptyCanvas(realWidth, realHeight, clientWidth, clientHeight);
			var context= canvas[0].getContext('2d');
			context.drawImage(imgElement, 0, 0);
			var imageData= context.getImageData(0, 0, realWidth, realHeight);

			return {
				tmpCanvas: canvas,
				data: imageData.data
			};
		}

		var setImageToCanvas= function(jQcanvas, data, realWidth, realHeight){
			var canvas= jQcanvas[0];
			var width= realWidth;
			var height= realHeight;
			var context= canvas.getContext('2d');
			var imageData= context.createImageData(width, height);
			imageData.data.set(data);
			context.putImageData(imageData, 0, 0, 0, 0, width, height);	

			return jQcanvas;
		}


		var applyTreatments= function(operation){

			//TODO: Create a new worker instance which will load 'ww.js'
			var worker= new Worker('js/ww.js');

			$('#pins-wrapper .k-picture img')
			.each(function(index){
				var current= $(this);
				var realWidth= current.prop('naturalWidth') || current.width();
				var realHeight= current.prop('naturalHeight') || current.height();
				var clientWidth= current.width();
				var clientHeight= current.height();

				//create canvas with initial image to get its data
				var initialData= getInitialImageData(current[0], realWidth, realHeight, clientWidth, clientHeight);

				var onWorkerResponse= function(result){
					var dataOut= result.data;
					if (dataOut.index == index){
						current.hide();
						var canvas= getEmptyCanvas(realWidth, realHeight, clientWidth, clientHeight);
						current.after(setImageToCanvas(canvas, dataOut.out, realWidth, realHeight));

						//we can delete the temp canvas
						initialData.tmpCanvas.remove();
					}					
				}

				var workerData= {
						index: index,
						dataFrom:initialData.data,
						width: realWidth, 
						height:realHeight,
						operation: operation
				}

				//TODO: Listen the worker answer to call the onWorkerResponse
				//      with the data result
				worker.addEventListener('message', onWorkerResponse, false);

				//TODO: Start the worker and by passing it the workerData
				worker.postMessage(workerData);
			});
		}


		var cancelTreatments= function(){
			$('#pins-wrapper .k-picture img')
			.show()
			.next()
			.remove();	
		}


		$(document).ready(function(){

			$('ul.k-actions li:last-child a')
			//Make the transform link available
			.removeClass('to-hide')
			.on('click', function(e){
				e.preventDefault();

				$( '#dialog' ).dialog({
				  dialogClass: "no-close",
				  buttons: [
				    {
				      text: "rotate",
				      click: function() {
						applyTreatments('rotate');
				        $( this ).dialog( "close" );
				      }
				    },
				    {
				      text: 'wave',
				      click: function() {
						applyTreatments('wave');
				        $( this ).dialog( "close" );
				      }
				    },
				    {
				      text: 'reset',
				      click: function() {
						cancelTreatments();
				        $( this ).dialog( "close" );
				      }
				    }
				  ]
				});
				
			});

		});
	}

)(jQuery)