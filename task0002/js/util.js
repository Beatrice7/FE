function type(obj){
    if(obj == null || obj === undefined){
        return obj + '';
    }else{
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
}


// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return type(arr) === "array";
    
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return type(fn) === "function";
}

/**************************/
//了解值类型和引用类型的区别，了解各种对象的读取、遍历方式，并在util.js中实现以下方法：
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(obj) {
    var result = obj.constructor === Array ? [] : {}; 
    for (var i in obj){
        if(obj.hasOwnProperty(i)){
            result[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
        }
    }
    return result;
}

// // 测试用例：
// var srcObj = {
//     a: 1,
//     b: {
//         b1: ["hello", "hi"],
//         b2: "JavaScript"
//     }
// };
// var abObj = srcObj;
// var tarObj = cloneObject(srcObj);

// srcObj.a = 2;
// srcObj.b.b1[0] = "Hello";

// console.log(abObj.a);
// console.log(abObj.b.b1[0]);

// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"



/*************学习数组、字符串、数字等相关方法，在util.js中实现以下函数***************/
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    // your implement
    var res = [];
    for(var i in arr){
        if(res.indexOf(arr[i]) == -1){
            res.push(arr[i]);
        }
    }
    //console.log(res.length+"  uniqArray");
    return res;
}

// 使用示例
// var a = [1, 3, 5, 7, 5, 3];
// var b = uniqArray(a);
// console.log(b); // [1, 3, 5, 7]

// 中级班同学跳过此题
// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    // your implement
    var end = str.length;
    var begin = 0;
    if(end == 0) return;

    while(str[begin] == " " || str[begin] == "\t") begin++;
    while(str[end] == " " || str[end] == "\t") end--;

    return str.substring(begin, end);

}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    //console.log(str.match(/^\s+|\s+$/g));
    console.log(str.replace(/^\s+|\s+$/g), '');
    return str;
}

// 使用示例
// var str = '   hi!  ';
// //str = simpleTrim(str);
// str = trim(str);
// console.log(str); // 'hi!'



// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    // your implement
    for(var i in arr){
        fn(arr[i], i);
    }
}

// 其中fn函数可以接受两个参数：item和index
// 只需要将可以省略的参数放在第二的位置即可

// 使用示例
// var arr = ['java', 'c', 'php', 'html'];
// function output(item) {
//     console.log(item)
// }
// each(arr, output);  // java, c, php, html

// // 使用示例
// var arr = ['java', 'c', 'php', 'html'];
// function output(item, index) {
//     console.log(index + ': ' + item)
// }
// each(arr, output);  // 0:java, 1:c, 2:php, 3:html


// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    return Object.keys(obj).length;
}

// 使用示例
// var obj = {
//     a: 1,
//     b: 2,
//     c: {
//         c1: 3,
//         c2: 4
//     }
// };
// console.log(getObjectLength(obj)); // 3



/************************学习正则表达式，在util.js完成以下代码*********************/
// 判断是否为邮箱地址
function isEmail(emailStr) {
    // your implement
    var pattern = /^(\w+)-?\w*@\w*\.\w*\.?\w+$/
    return pattern.test(emailStr);
    //return emailStr.test(pattern)
    
}

//console.log(isEmail("aizun777@163.com.dsf"));
// 判断是否为手机号
// +86 开头
function isMobilePhone(phone) {
    // your implement
    var pattern = /^(\+)?\d{2}\d{11}$/
    return pattern.test(phone);
}

//console.log(isMobilePhone("+8618837861883"));


/*********************************************************/
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var oldClassName = element.className; //获取旧的样式类
    element.className = oldClassName === "" ? newClassName : oldClassName + " " + newClassName;
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var originClassName = element.className; //获取原先的样式类
    var pattern = new RegExp("\\b" + oldClassName + "\\b"); //使用构造函数构造动态的正则表达式
    element.className = originClassName.replace(pattern, '');
}

function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

//获取element相对于浏览器窗口的位置，返回{x, y}
function getPosition(element) {
    var pos={};
    pos.x = element.getBoundingClientRect().left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft); 
    pos.y = element.getBoundingClientRect().top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    return pos;
}


// ******************************************************* 
function $(selector) {

    if (!selector) {
        return null;
    }

    if (selector == document) {
        return document;
    }

    selector = selector.trim();
    if (selector.indexOf(" ") !== -1) { //若存在空格
        var selectorArr = selector.split(/\s+/); //拆成数组

        var rootScope = myQuery(selectorArr[0]); //第一次的查找范围
        var i = null;
        var j = null;
        var result = [];
        //循环选择器中的每一个元素
        for (i = 1; i < selectorArr.length; i++) {
            for (j = 0; j < rootScope.length; j++) {
                result.push(myQuery(selectorArr[i], rootScope[j]));
            }
            // rootScope = result;
            // 目前这个方法还有bug
        }
        return result[0][0];
    } else { //只有一个，直接查询
        return myQuery(selector, document)[0];
    }
}

/**
 * 针对一个内容查找结果 success
 * @param  {String} selector 选择器内容
 * @param  {Element} root    根节点元素
 * @return {NodeList数组}    节点列表，可能是多个节点也可能是一个
 */
function myQuery(selector, root) {
    var signal = selector[0]; //
    var allChildren = null;
    var content = selector.substr(1);
    var currAttr = null;
    var result = [];
    root = root || document; //若没有给root，赋值document
    switch (signal) {
        case "#":
            result.push(document.getElementById(content));
            break;
        case ".":
            allChildren = root.getElementsByTagName("*");
            // var pattern0 = new RegExp("\\b" + content + "\\b");
            for (i = 0; i < allChildren.length; i++) {
                currAttr = allChildren[i].getAttribute("class");
                if (currAttr !== null) {
                    var currAttrsArr = currAttr.split(/\s+/);
                    //console.log(currAttr);
                    for (j = 0; j < currAttrsArr.length; j++) {
                        if (content === currAttrsArr[j]) {
                            result.push(allChildren[i]);
                           // console.log(result);
                        }
                    }
                }
            }
            break;
        case "[": //属性选择
            if (content.search("=") == -1) { //只有属性，没有值
                allChildren = root.getElementsByTagName("*");
                for (i = 0; i < allChildren.length; i++) {
                    if (allChildren[i].getAttribute(selector.slice(1, -1)) !== null) {
                        result.push(allChildren[i]);
                    }
                }
            } else { //既有属性，又有值
                allChildren = root.getElementsByTagName("*");
                var pattern = /\[(\w+)\s*\=\s*(\w+)\]/; //为了分离等号前后的内容
                var cut = selector.match(pattern); //分离后的结果，为数组
                var key = cut[1]; //键
                var value = cut[2]; //值
                for (i = 0; i < allChildren.length; i++) {
                    if (allChildren[i].getAttribute(key) == value) {
                        result.push(allChildren[i]);
                    }
                }
            }
            break;
        default: //tag
            result = root.getElementsByTagName(selector);
            break;
    }
    return result;
}


//IE浏览器不支持getElementsByClassName,所以自己写一个方法得到Class
function getByClass(clsName, parent){
    var oParent = parent ? document.getElementById(parent) : document, //如果没有传入parent则document
        eles = [],
        elements = oParent.getElementsByTagName("*");
    for(var i = 0; i < elements.length; i++){
        if(elements[i].className == clsName){
            eles.push(elements[i]);
        }
    }
    return eles;
}



// // 实现一个简单的Query
// function $(selector) {
//     selector = selector.trim();  //???
//     var selectorArr = selector.split(/\s+/);
//     var res = document;

//     for(var i = 0; i < selectorArr.length; i++){
//         switch(selectorArr[i][0]){
//             case "#":
//                 console.log(selectorArr[i].substring(1));
//                 res = res.getElementById(selectorArr[i].substring(1));
//                 break;
//             case ".":
//                 res = res.getElementsByClassName(selectorArr[i].substring(1))[0];
//                 break;
//             case "[":
//                 var eles = res.getElementsByTagName("*");
//                 var index = selectorArr[i].indexOf("=");
//                 if(index == -1){ //只有属性，没有值
//                     var key = selectorArr[i].slice(1,-1);
//                     //var key = selectorArr[i].substring(1, selectorArr[i].length - 1);
//                     for (var i = 0; i < eles.length; i++){
//                         if(eles[i].getAttribute(key) !== null){
//                             res = eles[i];
//                             break;
//                         }
//                     }
//                 }else{//既有属性，又有值
//                     //substring() 方法返回的子串包括 start 处的字符，但不包括 stop 处的字符。
//                     //结尾还有一个 ']' 别忘了
//                     var key = selectorArr[i].substring(1, index-1);
//                     var value = selectorArr[i].substring(index + 1, selectorArr[i].length - 1);
//                     for(var i = 0; i < eles.length; i++){
//                         if(eles[i].getAttribute(key) === value){
//                             res = eles[i];
//                             break;
//                         }
//                     }
//                 }
//                 break;
//             default:
//                 res = res.getElementsByTagName(selectorArr[i])[0];
//                 break;
//         }
//     }

//     return res;
// }




// 可以通过id获取DOM对象，通过#标示，例如
//$("#adom"); // 返回id为adom的DOM对象

// 可以通过tagName获取DOM对象，例如
// $("a"); // 返回第一个<a>对象

// // 可以通过样式名称获取DOM对象，例如
// $(".classa"); // 返回第一个样式定义包含classa的对象

// // 可以通过attribute匹配获取DOM对象，例如
// $("[data-log]"); // 返回第一个包含属性data-log的对象

// $("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

// // 可以通过简单的组合提高查询便利性，例如
// $("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象

// *******************************************************

function addEvent(element, event, listener){
    if(element.addEventListener){
        element.addEventListener(event, listener, false)
    }else if(element.attachEvent){
        element.attachEvent('on'+event, listener)
    }else{
        element['on'+event] = listener;
    }
}

function removeEvent(element, event, listener){
    if(element.removeEventListener){
        element.removeEventListener(event, listener, false)
    }else if(element.detachElement){
        element.detachElement('on'+event, listener)
    }else{
        element['on'+event] = listener
    }
}


function addClickEvent(element, listener){
    if(element.addEventListener){
        element.addEventListener('click', listener, false)
    }else if(element.attachElement){
        element.attachElement('onclick', listener)
    }else{
        element['onclick'] = listener
    }    
}

function addEnterEvent(element, listener){
    if(element.addEventListener){
        element.addEventListener('keypress', listener, false)
    }else if(element.attachElement){
        element.attachElement('onkeypress', listener)
    }else{
        element['onkeypress'] = listener
    }       
}

//????
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;



function clickListener(event){
    console.log(event);
}


//事件代理
function delegateEvent (element, tag, eventName, listener){
    addEvent(element, eventName, function(e){
        e = e || window.event;
<<<<<<< HEAD
        var target = e.target || e.srcElement;
=======
        var target = e.targer || e.srcElement;
>>>>>>> 1c8757dad86c53086212f8d281d1f44d1acab9bd
        if(target.nodeName.toLowerCase() == tag.toLowerCase()){
            listener.call(target, e)
        }
    })   
}

$.delegate = function(selector, tag, event, listener){
    delegateEvent($(selector), tag, event, listener);
};


// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    var s = navigator.userAgent.toLowerCase();
    console.log(s);
    //ie10的信息：
    //mozilla/5.0 (compatible; msie 10.0; windows nt 6.2; trident/6.0)
    //ie11的信息：
    //mozilla/5.0 (windows nt 6.1; trident/7.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729; .net clr 3.0.30729; media center pc 6.0; .net4.0c; .net4.0e; infopath.2; rv:11.0) like gecko
    var ie = s.match(/rv:([\d.]+)/) || s.match(/msie ([\d.]+)/);
    if(ie) {
        return ie[1];
    } else {
        return -1;
    }
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    var cookie = cookieName + "=" + encodeURIComponent(cookieValue);
    if (typeof expiredays === "number") {
        cookie += ";max-age=" + (expiredays * 60 * 60 * 24);
    }
    document.cookie = cookie;
}

// 获取cookie值
function getCookie(cookieName) {
    var cookie = {};
    var all = document.cookie;
    if (all==="") {
        return cookie;
    }
    var list = all.split("; ");
    for (var i = 0; i < list.length; i++) {
        var p = list[i].indexOf("=");
        var name = list[i].substr(0, p);
        var value = list[i].substr(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}


function ajax(url, options) {

    var dataResult; //结果data

    // 处理data
    if (typeof(options.data) === 'object') {
        var str = '';
        for (var c in options.data) {
            str = str + c + '=' + options.data[c] + '&';
        }
        dataResult = str.substring(0, str.length - 1);
    }

    // 处理type
    options.type = options.type || 'GET';

    //获取XMLHttpRequest对象
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    // 发送请求
    oXhr.open(options.type, url, true);
    if (options.type == 'GET') {
        oXhr.send(null);
    } else {
        oXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        oXhr.send(dataResult);
    }

    // readyState
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (options.onsuccess) {
                    options.onsuccess(xhr.responseText, xhr.responseXML);
                }
            } else {
                if (options.onfail) {
                    options.onfail();
                }
            }
        }
    }
}













