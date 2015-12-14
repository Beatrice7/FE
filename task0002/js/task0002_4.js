
var data = ['a', 'abandon', 'abdomen', 'abide', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'abound', 'about', 'above', 
'block', 'bend','blood', 'fiction', 'field', 'fierce', 'fight', 'test2', 'test3'];
//监听
var inputArea = $("input")
var ulArea = $("ul")

addInputListener();//监听input
clickLi();
keydownLi();

function addInputListener () {
	if(inputArea.addEventListener){
		inputArea.addEventListener("input", onInput) //except IE 
	}else{
		inputArea.attachEvent("onpropertychange", onPropertyChange) //IE
	}
}

//excpet IE
function onInput(event){
	var e = event || window.event
	var inputValue = e.target.value
	handleInput(inputValue)
}
//IE
function onPropertyChange(event){
	var e = event || window.event
	var inputValue = ""
	if(e.propertyName.toLowerCase() == "value"){
		inputValue = e.srcElement.value
		handleInput(inputValue)
	}
}

//handle inputvalue
function handleInput(inputValue){
	var liString = ""
	var pattern = new RegExp("^"+inputValue,"i")

	if(inputValue == ""){
		ulArea.style.display = "none"
	}else{
		for (var i = 0; i < data.length; i++) {
			if(data[i].match(pattern)){
				console.log(data[i])
				liString += "<li><span>"+inputValue+"</span>"+data[i].substr(inputValue.length)+"</li>";
			}
			ulArea.innerHTML = liString
			ulArea.style.display = "block";
		}
	}
}


function clickLi(){
	delegateEvent(ulArea, "li", "mouseover", function(){
		addClass(this, "pointed")
	});
	delegateEvent(ulArea, "li", "mouseout", function(){
		removeClass(this, "pointed")
	});
	delegateEvent(ulArea, "li", "click", function(){
		inputArea.value = deletespan(this.innerHTML);
		ulArea.style.display = "none"
	});
}

function keydownLi(){

}



function deletespan(string){
	var pattern = /^<span>(\w+)<\/span>(\w+)$/;
	var stringArr = string.match(pattern);
	//console.log(stringArr[0]);
	console.log(stringArr[1]);
	return stringArr[1]+stringArr[2];
}




















