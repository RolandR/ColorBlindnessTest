

var numberCanvas = document.getElementById("numberCanvas");
var numberContext = numberCanvas.getContext("2d");
var prerenderCanvas = document.getElementById("prerenderCanvas");
var prerenderContext = prerenderCanvas.getContext("2d");

var Config = {
	 numberPixelSize: 10
	,numberPixelMargin: 5
}

render(Math.round(Math.random()*99));

function render(number){
	prerender(number);
	
	numberCanvas.width = (Config.numberPixelSize + Config.numberPixelMargin) * prerenderCanvas.width + Config.numberPixelMargin;
	numberCanvas.height = (Config.numberPixelSize + Config.numberPixelMargin) * prerenderCanvas.height + Config.numberPixelMargin;
	
	numberContext.fillStyle = "#000000";
	numberContext.fillRect(0, 0, numberCanvas.width, numberCanvas.height);
	
	var imageData = prerenderContext.getImageData(0, 0, prerenderCanvas.width, prerenderCanvas.height).data;
	
	for(var i = 0; i < imageData.length; i += 4){
		//var r = 0;
		//var g = 0;
		//var b = 255;
		
		var r = 255;
		var g = 255;
		var b = 0;
		
		if(imageData[i] < 200){
			r -= Math.round(Math.random()*50 + 30);
		} else {
			g -= Math.round(Math.random()*50 + 30);
		}
		
		r -= Math.round(Math.random()*20);
		g -= Math.round(Math.random()*20);
		b -= Math.round(Math.random()*50);
		
		r = minmax(r, 0, 255);
		g = minmax(g, 0, 255);
		b = minmax(b, 0, 255);
		
		var tileX = ((i/4) % prerenderCanvas.width)*(Config.numberPixelMargin+Config.numberPixelSize);
		var tileY = (Math.floor((i/4) / prerenderCanvas.width))*(Config.numberPixelMargin+Config.numberPixelSize);
		
		tileX += Config.numberPixelMargin;
		tileY += Config.numberPixelMargin;
		
		numberContext.fillStyle = "rgb("+r+", "+g+", "+b+")";
		numberContext.fillRect(tileX, tileY, Config.numberPixelSize, Config.numberPixelSize);
	}
}

function prerender(number){
	prerenderContext.fillStyle = "rgb(255, 255, 255)";
	prerenderContext.fillRect(0, 0, prerenderCanvas.width, prerenderCanvas.height);
	prerenderContext.fillStyle = "rgb(0, 0, 0)";
	prerenderContext.font = "15px sans-serif";
	var xOffset = Math.round(Math.random()*15);
	var yOffset = Math.round(Math.random()*10);
	prerenderContext.fillText(number+"", 0+xOffset, 20-yOffset);
}

function minmax(number, min, max){
	if(number < min){
		number = min;
	}
	if(number > max){
		number = max;
	}
	return number;
}
