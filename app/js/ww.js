
(
	function(){


		var Transformation= function(data, width, height){

			this.data= data;
			this.dataTo=  new Uint8ClampedArray(data.length);
			this.width= width;
			this.height= height;			


			var getPixel= function(imageWidth, data, x, y){
				var rgba= []
				var index= (y*imageWidth + x)*4;
				for (var i = 0; i< 4; i++){
					rgba.push(data[index+i]);
				}

				return rgba;
			}

			var setPixel= function(imageWidth, data, x, y, pixel){
				var index= (y*imageWidth + x) * 4;
				for (var i = 0; i< pixel.length; i++){
					data[index + i]= pixel[i];
				}
			}

			this.getDataTo= function(){
				return this.dataTo;
			}

			this.rotate= function(){

				for (var y= 0; y< this.height; y++){
					for(var x= 0; x< this.width; x++){
						var newX= this.width - x;
						var newY= this.height - y;
						var currentPix= getPixel(this.width, this.data, x, y);
						setPixel(this.width, this.dataTo, newX, newY, currentPix);
					}
				}

			}


			this.wave= function(){

				for (var y= 0; y < this.height; y++){
					for(var x= 0; x< this.width; x++){
						var newX= x;
						var newY= y + Math.floor( Math.cos(x*2*Math.PI/30) * 10) % this.height;
						var currentPix= getPixel(this.width, this.data, x, y);
						setPixel(this.width, this.dataTo, newX, newY, currentPix);
					}
				}

			}

		}




		var applyTreatments= function(dataIn){

			//Get needed params
			var index= dataIn.index;
			var operation= dataIn.operation;

			var transformation= new Transformation(dataIn.dataFrom, dataIn.width, dataIn.height);

			var dataTo= undefined;
			switch(operation){
				case 'rotate':
					transformation.rotate();
					break;
				case 'wave':
					transformation.wave();
					break;
				default:
					transformation.wave();
					break;
			}

			dataTo= transformation.getDataTo();
			return {out:dataTo, index:index};
		}


		self.onmessage= function(message){
			var dataOut= applyTreatments(message.data);
			self.postMessage(dataOut);
		}
	}
)()



