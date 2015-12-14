function showHobby () {
    var text = $(".hobbies").value;
    //console.log(text);
    text = text.replace(/[\s,;，、；]+/g, ' '); //用空格替换各种分隔符号，全角半角即中文英文情况下的标点。
    var hobbyArr = text.split(" ");
    //console.log(text);
    hobbyArr = uniqArray(hobbyArr);
    
    console.log(hobbyArr)
    //为什么什么都不输入的情况下长度为1呢？
    //因为hobbyArr中还有个空串，即[""],所以长度为1
    //故，需要以下代码
    if(hobbyArr[0] === ""){
    	hobbyArr = [];
    }
   

    if(hobbyArr.length == 0 || hobbyArr.length > 10){
    	$('.show').style.display = "none"
    	$('.warn').style.display = "block"
        $('.warn').innerHTML = "至少输入一个爱好, 且不能超过10个爱好"

    }else{
    	 console.log(hobbyArr.length);
    	$('.warn').style.display = "none"
        var checkboxStr = "";
        for(var i = 0; i < hobbyArr.length; i++){
        	checkboxStr += '<br><input type="checkbox" id='+hobbyArr[i]+'><label for='+hobbyArr[i]+'>'+hobbyArr[i]+'</label>';
        }
        $('.show').style.display = "block"
        $('.show').innerHTML = checkboxStr.substr(4); //为了去掉<br>换行符

    }
    
}


function reset(){
	$('textarea').value = "";
	$('.show').innerHTML = "";
}