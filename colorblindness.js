

var numberCanvas = document.getElementById("numberCanvas");
var numberContext = numberCanvas.getContext("2d");
var prerenderCanvas = document.getElementById("prerenderCanvas");
var prerenderContext = prerenderCanvas.getContext("2d");

var Config = {
	 numberPixelSize: 10
	,numberPixelMargin: 5
}

var test = new Test();

function Test(){
	var Results = {
		 protanopiaCorrect: 0
		,protanopiaTotal: 0
		,deuteranopiaCorrect: 0
		,deuteranopiaTotal: 0
		,tritanopiaCorrect: 0
		,tritanopiaTotal: 0
		,allCorrect: 0
		,allTotal: 0

	}
	
	var testsTaken = 0;
	
	var renderer = new Renderer();
	
	var number = 0;
	var mode = 0;
	// 0 = protanopia
	// 1 = deuteranopia
	// 3 = tritanopia
		
	
	next();
	
	function next(){
		mode = testsTaken % 3;
		number = Math.round(Math.random()*99);
		renderer.render(number);
		testsTaken++;
	}
	
	function evaluate(inputNumber){
		Results.allTotal++;
		if(inputNumber == number){
			Results.allCorrect++;
			switch(mode){
				case 0:
					Results.protanopiaCorrect++;
				break;
				case 1:
					Results.deuteranopiaCorrect++;
				break;
				case 2:
					Results.tritanopiaCorrect++;
				break;
			}
		}
		switch(mode){
			case 0:
				Results.protanopiaTotal++;
			break;
			case 1:
				Results.deuteranopiaTotal++;
			break;
			case 2:
				Results.tritanopiaTotal++;
			break;
		}
		updateResults();
		next();
	}
	
	function skip(){
		evaluate(101); // Yeah, that's cheap
	}
	
	function updateResults(){
		if(Results.protanopiaTotal != 0){
			var percentage = Math.round((Results.protanopiaCorrect / Results.protanopiaTotal) * 100);
			document.getElementById("protanopiaText").innerHTML = Results.protanopiaCorrect +" of "+ Results.protanopiaTotal +" correct ("+percentage+"%).";
			document.getElementById("protanopiaBar").style.width = (percentage*1.01) + "%";
		}
		if(Results.deuteranopiaTotal != 0){
			var percentage = Math.round((Results.deuteranopiaCorrect / Results.deuteranopiaTotal) * 100);
			document.getElementById("deuteranopiaText").innerHTML = Results.deuteranopiaCorrect +" of "+ Results.deuteranopiaTotal +" correct ("+percentage+"%).";
			document.getElementById("deuteranopiaBar").style.width = (percentage*1.01) + "%";
		}
		if(Results.tritanopiaTotal != 0){
			var percentage = Math.round((Results.tritanopiaCorrect / Results.tritanopiaTotal) * 100);
			document.getElementById("tritanopiaText").innerHTML = Results.tritanopiaCorrect +" of "+ Results.tritanopiaTotal +" correct ("+percentage+"%).";
			document.getElementById("tritanopiaBar").style.width = (percentage*1.01) + "%";
		}
		
		var percentage = Math.round((Results.allCorrect / Results.allTotal) * 100);
		document.getElementById("overallText").innerHTML = Results.allCorrect +" of "+ Results.allTotal +" correct ("+percentage+"%).";
		document.getElementById("overallBar").style.width = (percentage*1.01) + "%";
	}
	
	return {
		 next: next
		,skip: skip
		,evaluate: evaluate
	}
}

function Renderer(){
	
	function render(number){
		prerender(number);
	
		numberCanvas.width = (Config.numberPixelSize + Config.numberPixelMargin) * prerenderCanvas.width + Config.numberPixelMargin;
		numberCanvas.height = (Config.numberPixelSize + Config.numberPixelMargin) * prerenderCanvas.height + Config.numberPixelMargin;
	
	
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

	/*
	*	Render text to hidden canvas.
	*/
	function prerender(number){
		prerenderContext.fillStyle = "rgb(255, 255, 255)";
		prerenderContext.fillRect(0, 0, prerenderCanvas.width, prerenderCanvas.height);
		prerenderContext.fillStyle = "rgb(0, 0, 0)";
		prerenderContext.font = "15px sans-serif";
		var xOffset = Math.round(Math.random()*15);
		var yOffset = Math.round(Math.random()*10);
		prerenderContext.fillText(number+"", 0+xOffset, 20-yOffset);
	}
	
	return {
		 render: render
	}
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


document.getElementById("numberInput").onkeydown = function(e){
	var inputField = document.getElementById("numberInput");
	setTimeout(filterInputField);
	
	if(e.which == 13){ // Enter
		if(inputField.value == ""){
			test.skip();
		} else {
			var number = inputField.value;
			inputField.value = "";
			
			number = number.replace(/[^0-9]*/g, "");
			number = Math.round(number);
			test.evaluate(number);
		}
	} else if(e.which == 88){ // X
		inputField.value = "";
		test.skip();
	}
}

function filterInputField(){
	var inputField = document.getElementById("numberInput");
	var value = inputField.value;
	value = value.replace(/[^0-9]*/g, ""); // Filter out anything that isn't a number
	inputField.value = value;
}







