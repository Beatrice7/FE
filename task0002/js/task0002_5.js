
var leftWrap = $(".left")
var rightWrap = $(".right")


var rightWrapX = rightWrap.offsetLeft // 330
console.log(rightWrapX)
var z = 1;

init();
function init(){
	initPosition(leftWrap)
	initPosition(rightWrap)

	//delegate, 给容器添加拖拽事件
	$.delegate(".left", "div", "mousedown", drag)
	$.delegate(".right", "div", "mousedown", drag)
}

function initPosition(wrap){
	console.log(wrap.children.length)
	for (var i = 0; i < wrap.children.length; i++){
		wrap.children[i].style.top = 39 * i + 'px'
	}
}

function drag(e){
	var e = e || window.event
	var target = e.target || e.srcElement;
	if (target.className.toLowerCase() != "drag"){
		console.log("className != drag")
		return ;
	}
	//鼠标位置
	var mouseX = e.clientX
	var mouseY = e.clientY
	console.log("mouseX:"+mouseX+ " " + "mouseY:"+mouseY)
	//当前方块的位置
	var divLeft = target.offsetLeft
	var divTop = target.offsetTop
	console.log("divLeft:"+divLeft+ " " + "divTop:"+divTop)


	//addClass
	//target.style.border = "1px solid red"
	target.style.opacity = 0.5
	target.style.zIndex = z++;

	var parent = target.parentNode;
	// console.log("parent.className:"+parent.className);
	var firstMove = true;

	document.onmousemove = function(e){
		if(firstMove){
			parent.removeChild(target)
			$(".dragwrap").appendChild(target)
		}
		firstMove = false
		var e = e || window.event

		if(outOfScreen(e.clientX, e.clientY, e)){
			target.parentNode.removeChild(target)
			parent.appendChild(target) //???
			if(parent.className.search("left") != -1){
				target.style.left = 0 + 'px' //???
			}else if(parent.className.search("right") != -1){
				target.style.left = rightWrapX + 0 + 'px'
				console.log(mouseX+" "+mouseY)
			}
			initPosition(parent);
			document.onmousemove = null;
		}else{			
			target.style.left = divLeft + (e.clientX - mouseX) + 'px' //原始坐标+移动了的距离
			target.style.top = divTop + (e.clientY - mouseY) + 'px'
			initPosition(parent)
		}
	}

	document.onmouseup = function(e){
		document.onmousemove = null
		document.onmouseup = null
		target.style.opacity = 1

		var e = e || window.event
		target.parentNode.removeChild(target)
		if(judgeInBlock(e.clientX, e.clientY, leftWrap)){
			leftWrap.appendChild(target)
			target.style.left = 0 + 'px'
			initPosition(leftWrap)
		}else if(judgeInBlock(e.clientX, e.clientY, rightWrap)){
			rightWrap.appendChild(target)
			target.style.left = rightWrapX + 'px'
			initPosition(rightWrap)
		}else{
			parent.appendChild(target)
			if(parent.className.search("left") != -1){
				target.style.left = 0 + 'px' 
			}else if(parent.className.search("right") != -1){
				target.style.left = rightWrapX + 'px'
			}
			initPosition(parent)
		}
	}
	return false
}




function outOfScreen(x, y, e){
	var maxW = document.documentElement.clientWidth;
	var maxH = document.documentElement.clientHeight;
	return e.clientX <= 0 || e.clientX >= maxW || e.clientY <= 0 || e.clientY >= maxH
}

function judgeInBlock(x, y, block){
	var x0 = getPosition(block).x
	var x1 = getPosition(block).x + block.offsetWidth;
	var y0 = getPosition(block).y
	var y1 = getPosition(block).y + block.offsetHeight;

	return x > x0 && x < x1 && y > y0 && y < y1;
}


// var startX, startY;     //点滑块时候鼠标的位置
// var startLeft, startTop;//拖动前滑块中心的位置
// var wrap = $(".drag-wrap")

// //获取下一个滑块
// function nextDrag (element) {
// 	var brother = element.nextSibling;
// 	while (brother && brother.nodeName === "#text"){
// 		brother = nextDrag(brother);
// 	}
// 	return brother
// }

// //将滑块以及其下面的滑块移动move个元素
// function moveDrag(element, move){
// 	while(element){
// 		element.style.top = parseInt(element.style.top) + move + 'px'
// 		element = nextDrag(element)
// 	}
// }

// //计算滑块降落的容器编号
// function getLocation(event){
// 	var location = [];
// 	//移动距离
// 	var moveX = event.clientX - startX;
// 	var moveY = event.clientY - startY;

// 	//重新计算滑块中心
// 	var x = startLeft + moveX;
// 	var y = startTop + moveY;

// 	//容器的序号location[0]
// 	if(x <= 225){
// 		location[0] = 0;
// 	}else if(x > 225 && x < 535){
// 		location[0] = 1;
// 	}else{
// 		location[0] = 2;
// 	}
// 	//滑块在容器中的序号location[1]
// 	location[1] = Math.floor((y + 50 + 10) / 40)
// 	var dragNum = wrap[location[0]].getElementsByClassName('drag').length; //容器中滑块的数量
// 	location[1] = Math.max(location[1], 0)
// 	location[1] = Math.min(location[1], dragNum)

// 	return location;
// }


// function dragStart(e){
// 	e = e || window.event;
// 	var wrapLeft = $('.drag-container').offsetLeft;
// 	var parent = this.parentNode;
// 	startX = e.clientX;
// 	startY = e.clientY;
// 	startTop = parseInt(this.style.top) + 60;
// 	startLeft = parent.offsetLeft - wrapLeft + 75;
// 	moveDrag(nextDrag(this), -40); //-40? -41?
// }

// //使滑块在原容器消失
// function draging(event){
//     if(this.className !== 'draging'){
//     	this.className = 'dragging'
//     }
// }

// function dragOver(event){
// 	//拖动中避免浏览器对容器的默认处理（默认无法将元素放置到其他元素中）
// 	if(event.preventDefault){
//       event.preventDefault();
//     }else{
//       event.returnValue=false;
//     }
// }


// //拖动结束
// function drop(e){
// 	e = e || window.event
// 	e.preventDefault();
// 	var location = getLocation(e);
// 	var myWrap = wrap[location[0]]
// 	var myDrag = myWrap.getElementsByClassName('drag')[location[1]];
// 	if(myDrag){
// 		var myTop = myDrag.style.top;
// 	}else{
// 		var beforeDrag = myWrap.getElementsByClassName("drag")[location[1] -1]
// 		if(beforeDrag){
// 			var beforeTop = parseInt(beforeDrag.style.top);
// 		}else{
// 			beforeTop = -41
// 		}
// 		var myTop = beforeTop + 41 +'px'
// 	}
// 	moveDrag(myDrag, 41)

// 	var block = document.getElementsByClassName('dragging')[0];//放到新容器中
// 	block.style.top = myTop
// 	block.style.zIndex = 0
// 	block.className = "drag";
// 	myWrap.insertBefore(block, myDrag)

// }


// window.onload = function(){
// 	var drag = document.getElementsByClassName('drag')
// 	for(var i = 0, len = drag.length; i < len; i++){
// 		drag[i].draggable = true;
// 		console.log(drag[i].style.top)
// 		drag[i].style.top = (i % 6 * 41) + "px"

// 		addEvent(drag[i], 'dragstart', dragOver);
// 		addEvent(drag[i], 'drag', draging);
// 	}

// 	addEvent(document.body, 'dragover', dragOver)
// 	addEvent(document.body, 'drop', drop)
// }












































