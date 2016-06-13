
var slides = $('.slides'),
	icons = $('.icons'),
	iconsArr = $('.icons').getElementsByTagName('span'),
	timeInterval = 2000, //多久执行一次
	timeOneImg = 200, //执行一次所需时间的
	intervalOneImg = 20,
	activeID = 0,
	nextID = 0,
	timer = null,
	timerID = null,
	imgWidth = $('img').offsetWidth
	
// console.log("style.left" + slides.style.left)   //返回字符串，空的
// console.log(slides.offsetLeft)          // 0
// console.log(slides.offsetWidth)         // 2000
 console.log("imgWidth" + imgWidth)
 //console.log(imgNum)

//图片切换
function animate (endPos) {
	clearInterval(timerID);
	//console.log(endPos)
	timerID = setInterval(function(){

		var speed = -imgWidth / (timeOneImg / intervalOneImg)
		if(endPos - slides.offsetLeft == 0){ //必须保证speed的整数倍能达到endPos的大小才能执行这步，即speed不能是一个无法整除的数
			speed = 0;
		}
		slides.style.left = slides.offsetLeft + speed + "px";
		//var speed = (endPos - slides.offsetLeft) / 10;
		//speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
		if(parseInt(slides.style.left) > -500){
			slides.style.left = -2000 + "px"
			console.log("in >-500")
		}
		if(parseInt(slides.style.left) < -2500){
			slides.style.left = -500 + "px"
			console.log("in < -2500")
		}
	}, intervalOneImg);
}

function showIcon(index) {
	console.log("index:"+index)
    for (var i = 0; i < iconsArr.length ; i++) {
        if( iconsArr[i].className == 'active'){
            iconsArr[i].className = '';
            break;
        }
    }
    iconsArr[index].className = 'active';
}

function rotate(clickID) {
	if(clickID || clickID == 0){
		nextID = clickID
		showIcon(nextID)
		if(nextID == 0) nextID = 4
		
	}else{
		console.log(clickID)
		if(activeID == 4) activeID = 0;
		nextID = activeID + 1
		showIcon(nextID%4)
	}

	// removeClass(iconsArr[activeID % 4], "active");
	// addClass(iconsArr[nextID % 4], "active");
	//console.log(nextID)
	animate("-" + imgWidth * (nextID+1));
	activeID = nextID;

}

timer = setInterval(rotate, timeInterval);

$.delegate(".icons", "span", "click", function(){
	clearInterval(timer);
	var clickID = parseInt(this.getAttribute('index'))
	rotate(clickID-1);
	
	timer = setInterval(rotate, timeInterval);
});















