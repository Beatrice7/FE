var clock
var future
var dateArr
//如果没有下面这句，则刷新页面后框框内的日期还在
$('#txt').value = ""

function showDate(){
	clearInterval(clock); //不写的话，每次点击都会开启一个计时器
	var inputdate = $('#txt').value;
	var pattern = /^\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2][0-9])|(3[0-1]))$/;

	clock = setInterval("count()", 1000)
	if(!pattern.test(inputdate)){
		$('.showdate').innerHTML = "请检查输入格式"
	}else{
		var today = new Date();
	    dateArr = inputdate.split('-');
		//不可以这样写吧？
		//var future = new Date(inputdate.replace("-", "/"))
		future = new Date()
		future.setFullYear(dateArr[0], dateArr[1]-1, dateArr[2]) //月份从0开始计算
		future.setHours(0,0,0,0)
		//console.log(future)

		var diff= future - today //时间差以millionsec计算的

		if(diff < 0){
			clearInterval(clock)
			$('.showdate').innerHTML = "请输入未来的某一天"
			return
		}else if(diff == 0){
			clearInterval(clock)
			$('.showdate').innerHTML = "距离"+dateArr[0]+"年"+dateArr[1]+"月"+dateArr[2]+"日还有0天0小时0分0秒"
			return
		}else{	
			var newdate = count()				
		}
	}

}


//如果自己调用自己也就是每次都调用showDate(),那么当输入框里的内容更新时，
//下面的输出就会自动更新了，不等到click
//所以我们要把每秒更新的功能写到一个函数count()里，然后用showDate调用setInterval(count, 1000)
function count(){
	var now = new Date()
	var diff = future - now

	var tmp_day = diff / 1000 / 3600 / 24
	var day = Math.floor(tmp_day)
	//console.log(day)
	var tmp_hour = (tmp_day - day) * 24
	var hour = Math.floor(tmp_hour)

	var tmp_minute = (tmp_hour - hour) * 60
	var minute = Math.floor(tmp_minute)

	var tmp_second = (tmp_minute - minute) * 60
	var second = Math.floor(tmp_second)

	$('.showdate').innerHTML = "距离"+dateArr[0]+"年"+dateArr[1]+"月"+dateArr[2]+"日还有"+day+"天"+hour+"小时"+minute+"分"+second+"秒"
	//当函数无明确返回值时，返回的值就是undefined。
	//
	//js 可以同时返回多个值
	//如：return [day, hour, minute, second]
	//则：
	//var Arr = count()
	//访问Arr[0] 
}




