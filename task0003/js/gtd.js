/**
 * Created by Ruotong 
 */

/**
 * @param category = cate
 * @param child-category = childCate
 * @param task
 */

var curCateId = 0; //curCateId == -1表示所有任务
var curChildCateId = 0;
var curTaskId = 0;
//这个变量标识当前的在左栏区域，是在allTasks or Cate or childCate
var curArea = "All" //

initAll();

function initAll() {
	 initDateBase(); //初始化数据表
	 initModal();
	 updateCates(); //初始化分类
	 updateTaskList(queryAllTasks());
	 updateTaskContent();
}

//*************JSON数据库设计****************
 /**
 * cateJson 分类
 * childCateJson 子分类
 * taskJson 任务
 *
 * cate 分类表
 * -------------------------
 * id | name | child
 * -------------------------
 *
 * childCate 子分类表
 * -------------------------
 * id | pid | name | child
 * -------------------------
 *
 * task 任务表
 * -----------------------------------------
 * id | pid | finish | name | date | content
 * -----------------------------------------
 * 
 */

function initDateBase(){
	if(!localStorage.cate || !localStorage.childCate || !localStorage.task){
		//分类表
		var cateJson = [
			{
				"id": 0,
				"name": "默认分类",
				"child": []
			},
			{
				"id": 1,
				"name": "百度IEF",
				"child": [0, 1]
			},
			{				
				"id": 2,
				"name": "我的碎碎碎念",
				"child": []
			}
		];
		//子分类表
		var childCateJson = [
			{				
				"id": 0,
				"pid": 1,
				"name": "task0001",
				"child": [0, 1, 2, 3]
			},
			{
				"id": 1,
				"pid": 1,
				"name": "task0002",
				"child": []
			}
		];
		//task列表
		var taskJson = [
			{
				"id": 0,
				"pid": 0,
				"finish": true,
				"name": "task0001",
				"date": "2015-12-31",
				"content": "2015书单巴拉巴拉balabala"
			},
			{
				"id": 1,
				"pid": 0,
				"finish": false,
				"name": "task0002",
				"date": "2015-12-30",
				"content": "2015书单巴拉巴拉balabala"
			},
			{
				"id": 2,
				"pid": 0,
				"finish": true,
				"name": "task0003",
				"date": "2015-12-11",
				"content": "2015书单巴拉巴拉balabala"
			},
			{
				"id": 3,
				"pid": 0,
				"finish": true,
				"name": "task0004",
				"date": "2015-12-11",
				"content": "2015书单巴拉巴拉balabala"
			},
		];

		//database init
		localStorage.cate = JSON.stringify(cateJson);
		localStorage.childCate = JSON.stringify(childCateJson);
		localStorage.task = JSON.stringify(taskJson);
	}
}

//*************query****************
/*
 * 查询所有分类
 * @return {Array} 返回键值对
 */
function queryCates(){
	return JSON.parse(localStorage.cate);
}
/*
 * 查询所有子分类
 * @return {Array} 返回键值对
 */
function queryChildCates(){
	return JSON.parse(localStorage.childCate);
}
/*
 * 查询所有task
 * @return {Array} 返回键值对
 */
function queryAllTasks() {
	return JSON.parse(localStorage.task);
}

/**
 * 根据task的id返回指定的task
 * @param  {[type]} curtaskId [description]
 * @return {[Object]}         [description]
 */
function queryTaskById(curtaskId) {
	var tasks = queryAllTasks();
	for (var i = 0; i < tasks.length; i++) {
		if(tasks[i].id == curtaskId) {
			return tasks[i];
		}
	}
}

/*
 * 查询所有task(satus)
 * @param {status} 状态为status的task
 * @return {Array} 返回键值对
 */
function queryAllTasksByStatus(status){
	var tasksArr = JSON.parse(localStorage.task);
	var resultArr = [];
	for (var i = 0; i < tasksArr.length; i++){
		if(status == null){
			resultArr.push(tasksArr[i]);
		}else if(status == "true" && tasksArr[i].finish === true) {
			resultArr.push(tasksArr[i]);
		}else if(status == "false" && tasksArr[i].finish === false){
			resultArr.push(tasksArr[i]);
		}
	}
	return resultArr;
}

/*
 * 查询所有父类为 pid 的 task（pid）
 * @param {pid} 父类pid
 * @return {Array} 返回键值对
 */
function queryAllTasksByPid(pid, status){
	var tasksArr = JSON.parse(localStorage.task);
	var resultArr = [];
	for (var i = 0; i < tasksArr.length; i++) {
		if(tasksArr[i].pid == pid) {
			if(status == null) {
				resultArr.push(tasksArr[i]);
			}else if (status == "true" && tasksArr[i].finish === true) { //status判断要加引号！
				resultArr.push(tasksArr[i])
			}else if (status == "false" && tasksArr[i].finish === false){
				resultArr.push(tasksArr[i])
			}
			
		}
			
	}
	return resultArr;
}

/**
 * 通过cate查找task 
 * 就要先查找childcate,再查找它下面的tasks
 */
function queryAllTasksByPPid(ppid, status) {
	if(ppid === -1) {
		return queryAllTasksByStatus(status);
	}
	var tasksArr = queryAllTasks();
	var resultArr = [];
	var childCatesArr = queryAllChildCatesByPid(ppid);
	for(var i = 0; i < childCatesArr.length; i++) {
		var tmpArr = childCatesArr[i].child;
		for(var j = 0; j < tmpArr.length; j++){
			if(status == null){
				resultArr.push(tasksArr[tmpArr[j]]);
			}else if(status == "true" && tasksArr[tmpArr[j]].finish === true) {
				resultArr.push(tasksArr[tmpArr[j]]);
			}else if(status == "false" && tasksArr[tmpArr[j]].finish === false){
				resultArr.push(tasksArr[tmpArr[j]]);
			}
		}
	}
	return resultArr;
}

/*
 * 查询特定id的cate
 * @return {Object} 返回对象
 */
function queryCateById(id){
	var cate = JSON.parse(localStorage.cate);
	for (var i = cate.length - 1; i >= 0; i--) {
		if(cate[i].id === id){
			return cate[i];
		}
	}
}

/*
 * 根据cate的id查询task个数
 * @param {cateId} cate的id
 * @return {length} 返回任务个数
 */
function queryTasksLengthByCateId(id){
	var cate = queryCateById(id);
	var len = 0;
	for (var i = cate.child.length - 1; i >= 0; i--) {
		var childCate = queryChildCatesById(cate.child[i]);
	    len += childCate.child.length;
	};
	return len;
}

/*
 * 查询特定id的childCate
 * @return {Object} 返回对象
 */
function queryChildCatesById(id){
	var childCate = JSON.parse(localStorage.childCate);
	for (var i = childCate.length - 1; i >= 0; i--) {
	 	if(childCate[i].id == id){
	 		return childCate[i];
	 	}
	 }
}

function queryAllChildCatesByPid(pid) {
	var childCatesArr = queryChildCates();
	var resultArr = [];
	for (var i = 0; i < childCatesArr.length; i++) {
		if(childCatesArr[i].pid == pid){
			resultArr.push(childCatesArr[i]);
		}
	}
	return resultArr;
}



/*
 * 根据childCate id查询task个数
 * @param {childCateId} cate的id
 * @return {length} 返回任务个数
 */
function queryTasksLengthByChildCateId(id){
	// console.log(queryChildCatesById(id).child);
	return queryChildCatesById(id).child.length;
}

//*************add****************
/**
 * 新增分类
 * @param {string} name 类别名称
 */
function addCate(name){
	if(!name){
		console.log("name undefined!!")
	}else{
		var cateJsonTemp = queryCates();
		var newCate = {};
		newCate.id = cateJsonTemp.length;
		newCate.name = name;
		newCate.child = [];
		cateJsonTemp.push(newCate);
		localStorage.cate = JSON.stringify(cateJsonTemp);
	}
}

/**
 * 新增子分类
 * @param {number} pid 父类id
 * @param {string} childname 子类别名称
 */
function addChildCate(pid, name) {
	if(!name || pid < 0) {
		console.log("pid or name is undefined!")
	}else {
		var childCateJsonTemp = queryChildCates();
		var newChildCate = {};
		newChildCate.id = childCateJsonTemp.length;
		newChildCate.pid = pid;
		newChildCate.name = name;
		newChildCate.child = [];
		childCateJsonTemp.push(newChildCate);
		localStorage.childCate = JSON.stringify(childCateJsonTemp);
		//写入父类的child列表中
		updateLocalCate(newChildCate);
	}
}

/**
 * 新增一个任务
 * @param {number} pid 父类id
 * @param {Object} 任务对象
 */

function addTask(taskObject) {
	var tasksArr = queryAllTasks();
	taskObject.id = tasksArr.length;
	//更改当前taskId为刚添加的task的ID
	curTaskId = taskObject.id;
	tasksArr.push(taskObject);
	//更新本地task集合
	updateLocalStorageTasks(tasksArr);
	//更新本地task的父类childCate
	updateLocalChildCate(taskObject);
}

//*************updateLocal****************
function updateLocalStorageCate(cateArr) {
	localStorage.cate = JSON.stringify(cateArr);
}
function updateLocalStorageChildCate(childcateArr) {
	localStorage.childCate = JSON.stringify(childcateArr);
}
function updateLocalStorageTasks(taskArr) {
	localStorage.task = JSON.stringify(taskArr);
}




function updateLocalCate(childCateObject) {
	var cate = queryCates();
	for (var i = 0; i < cate.length; i++) {
		// 如果用===是不对的， 因为那要求是同一个对象， 这里cate[i]与childCateObject显然不同
		if(cate[i].id == childCateObject.pid) {
			cate[i].child.push(childCateObject.id);
		}
	}
	localStorage.cate = JSON.stringify(cate);
}

function updateLocalChildCate(taskObject){
	var childCate = queryChildCates();
	for (var i = 0; i < childCate.length; i++) {
		if(childCate[i].id == taskObject.pid) {
			childCate[i].child.push(taskObject.id);
		}
	}
	localStorage.childCate = JSON.stringify(childCate);
}




// ***************************控制页面****************************

// *************************左栏的一些功能***************************
/**
 * 更新分类列表
 */
function updateCates() {
	$("#alltask").innerHTML = ''
	+ '<h2 >所有任务<span class="tasknum">('
	+  queryAllTasks().length
	+ ')</span></h2>';

	var cate = queryCates();
	var cateItems = '';
	for (var i = 0; i < cate.length; i++) {
		var cateItemli = ''
		+ '<li>'
		+ 	'<h2 cateid=' + cate[i].id + ' onclick="clickCate(this)">'
		+		'<i class="fa fa-folder-open-o"></i>'
		+		cate[i].name 
		+       '<span class="tasknum">(' + queryTasksLengthByCateId(cate[i].id) + ')</span>'
		+		'<i class="fa fa-trash-o" onclick="del(event, this)"></i>'
		+	'</h2>'
		+   updateChildCates(cate[i].id);
		+ '</li>';
		cateItems += cateItemli;
	}
	// 写入分类列表
	$(".catalog-item").innerHTML = cateItems;
}

/**
 * 更新子分类列表
 * 返回一大串父类对应的子类字符串
 * @param  {[number]} pid             [pid]
 * @return {[string]} subCateItems    [class="sub-catalog-item"]
 */
function updateChildCates(pid) {
	var childCate = queryChildCates();
	var subCateItems = '';
	for (var i = 0; i < childCate.length; i++) {
		if(pid == childCate[i].pid) {
			var subCateItemsli = '<li>'
			+ '<h3 childCateid=' + childCate[i].id + ' onclick="clickChildCate(this)">'
			+ 	'<i class="fa fa-file-o"></i>'
			+   childCate[i].name
			+   '<span class="subtask-num">(' + childCate[i].child.length + ')</span>'
			+	'<i class="fa fa-trash-o" onclick="del(event, this)"></i>'
			+ '</h3>'
			+ '</li>';
			subCateItems += subCateItemsli;
		}
	}
	return subCateItems;
}


/**
 * 新增分类的弹窗
 * @return {[type]} [description]
 */
function initModal() {
	var cate = queryCates();
	var selectOptions = '<option value="-1">新增主分类</option>';
	for (var i = 0; i < cate.length; i++) {
		selectOptions += '<option value=" ' 
					   + cate[i].id
					   + ' ">'
					   + cate[i].name
					   + '</option>';
	};
	$("#modal-select").innerHTML = selectOptions;
	$("#newCateName").value = "";
}


/**
 * 点击cate列表项时，显示所有的属于这个主类下的tasks
 * 
 */
function updateTaskList(tasksArr){
	var reslutStr = "";
	var dateTasksArr = TasksSortedByDate(tasksArr);
	if(dateTasksArr.length && dateTasksArr[0].tasks.length) {
		curTaskId = dateTasksArr[0].tasks[0].id;
	}
	for (var i = 0; i < dateTasksArr.length; i++) {
		var objStr = ''
		+ '<div class="task-date">'
		+	'<h3>' + dateTasksArr[i].date + '</h3>'
		+ '</div>'
		+  classifyTasksByStatus(dateTasksArr[i].tasks);
		reslutStr += objStr;
	}
	$(".status-list").innerHTML = reslutStr;
}


/**
 * 根据status分类显示任务名称
 * <div class="status-list">中ul下的所有li
 * @param  {[Objects]} dateTasksArrItems 
 * 也就是[{date,tasks{ob,ob....}}, {date, tasks{ob,ob....}}]里面的ob们
 * return {String} 显示在 updateTaskStatusList 函数的多个<li>的HTML
 */
function classifyTasksByStatus(dateTasksArrItems){
	var ulStr = '';
	for(var i = 0; i < dateTasksArrItems.length; i++){
		ulStr += classBytasksStatus(dateTasksArrItems[i])
	} 
	return '<ul>' + ulStr + '</ul>';
}

/**
 * ul下的一个li
 * 供classifyTasksByStatus调用的
 * @param  {[Object]} dateTasksArrItem 
 * @return {[String]} 一个<li>标签里的HTML
 */
function classBytasksStatus(dateTasksArrItem) {
	var tasknameStr = '';
	if(dateTasksArrItem.finish) {
		tasknameStr += '' 
		+ '<li><h3 taskid=' + dateTasksArrItem.id + ' onclick="clickTask(this)">'
		+	'<i class="fa fa-check-square-o"></i>'
		+	dateTasksArrItem.name
		+ '</h3></li>' ;
	}else{
		tasknameStr += '' 
		+ '<li><h3 class="unfinished" taskid=' + dateTasksArrItem.id + ' onclick="clickTask(this)">'
		+	dateTasksArrItem.name
		+ '</h3></li>' ; 
	}
	return tasknameStr;
}

/**
 * 按照时间归档任务列表
 * @param {Array} [taskArr] [包含一些任务对象的一个数组]
 * @return { ObjectsArr } [{date,ob,ob....}, {date, ob,ob...}]
 */
function TasksSortedByDate(taskArr) {
	var dateArr = [];
	var resultArr = [];
	//取出所有出现了的taskObject.date， 放入dateArr这个数组
	//date 是字符串类型诶 “2015-1-1”
	for (var i = 0; i < taskArr.length; i++){
		if(dateArr.indexOf(taskArr[i].date) == -1){
			dateArr.push(taskArr[i].date);
		}
	}
	//对日期排序-----arrayObj.sort():对数组元素排序，返回数组地址
	dateArr = dateArr.sort();
	//根据date查找任务对象
	for (var j = 0; j < dateArr.length; j++) {
		var tmpObject = {};
		tmpObject.date = dateArr[j];
		tmpObject.tasks = [];
		for(var k = 0; k < taskArr.length; k++){
			if(taskArr[k].date == dateArr[j]){
				tmpObject.tasks.push(taskArr[k]);
			}
		}
		resultArr.push(tmpObject);
	}
	return resultArr;
}

// console.log(TasksSortedByDate(queryAllTasksByPid(0)));


// ****************************用来测试作用域的******************
// function test1111(){
// 	console.log("in test1111");
// 	var arr = [1,2,3,4,5,6,7];
// 	del(arr);
// 	console.log(arr);//
// }

// function del(arr) {
// 	arr.pop();
// 	arr.pop();
// 	console.log(arr);
// }

// test1111();
// *****************所以不能轻易删除传进来的参数呀******************
// ****************测试在循环体中每次都var*************
// function test2222(){
// 	var j='';
// 	for (var i = 0; i < 10; i++){
// 		j += '' + "string" +' ';
// 	}
// 	return j;
// }

// console.log(test2222());
//****************会被刷新，所以要在for外面定义变量*************





//*********************click****addButton*******************
/**
 * 新增分类
 */
function clickAddCate() {
	var cover = $(".cover");
	cover.style.display = "block";
}

/**
 * 取消按钮
 * @return {[type]} [description]
 */
function cancel() {
	$(".cover").style.display = "none";
}

/**
 * 确认按钮
 */
function ok() {
	//注意这里要加parseInt
	var selectValue = parseInt($("#modal-select").value);
	var newCateName = $("#newCateName").value;
	if(!newCateName) {
		alert("你还没有输入分类名称哦~");
	}else{
		if(selectValue == -1) {
			// 新增主分类
			addCate(newCateName);
		}else {
			// 新增子分类
			addChildCate(selectValue, newCateName);
		}
		// updateCates(); //重新初始化分类列表
		$(".cover").style.display = "none";
	}
	updateCates();
}

/**
 * 新增任务
 */
function clickAddTask() {
	console.log("clickAddTask")

	$(".task-banner").innerHTML = ''
	+ '<div class="title-name">'
	+		'<input type="text" class="input-title" placeholder="请输入标题">'
	+ '</div>'
	+ '<div class="manipulate">'
	+	'<a href="#" onclick="clickFinished()"><i class="fa fa-check-square-o"></i></a>'
	+	'<a href="#" onclick="clickEdit()"><i class="fa fa-pencil-square-o"></i></a>'
	+ '</div>';

	$(".article-date").innerHTML = ''
	+	'<h3><i class="fa fa-calendar"></i>'
	+		'<input type="date" class="input-date">'
	+	'</h3>';

	$(".content-wrap").innerHTML = ''
	+  '<textarea class="content-area" placeholder="请输入任务内容"></textarea>';

	$(".button-area").innerHTML = ''
	+ '<span class="info"></span>'
	+ 	'<button class="save">' + '保存' + '</button>'
	+   '<button class="cancel-save">' + '取消' + '</button>';
	$(".button-area").style.display = "block";

	clickSaveOrCancel();
}

/**
 * 当前显示的任务内容
 * 为了“取消”按钮，从而恢复原来内容
 */
function updateTaskContent(){
	var task = queryTaskById(curTaskId);
	$(".title-name").innerHTML = task.name;
	$(".article-date").innerHTML = '<h3><i class="fa fa-calendar"></i>' + task.date + '</h3>';
	$('.content-area').innerHTML = task.content;
	$(".button-area").style.display = "none";
	if(task.finish === true || task.finish == "true") {
		$(".manipulate").style.display = "none";
	}else { //这里的else要加上，不然上一次设为none了下一次就还是显示none了！
		$(".manipulate").style.display = "block";
	}
}

/**
 * 点击了新增任务的保存按钮
 * @return {[type]} [description]
 */
function clickSaveOrCancel() {
	console.log("clickSaveOrCancel");
	addClickEvent($(".save"), saveTask);
	addClickEvent($(".cancel-save"), cancelTask);
}

function cancelTask() {
	updateTask(curTaskId);
}

/**
 * clickSave时调用的函数
 * @return {[type]} [description]
 */
function saveTask(){
	var title = $(".input-title");
	var date = $(".input-date");
	var content = $(".content-area");
	var info = $(".info");
	//各种判断
	// console.log(title.value);
	// console.log(date.value);
	// console.log(content.value);
	//这里注意 ‘’与null是不同的， 用title.value===null就不会进入if了
	
	if(!title.value){
		info.innerHTML = "你还没有输入标题哦"
	}else if(!date.value){
		info.innerHTML = "你还没有输入日期哦"
	}else if(!content.value){
		info.innerHTML = "你还没有输入内容哦"
	}else {
		var taskObject = {};
		taskObject.name = title.value;
		taskObject.date = date.value;
		taskObject.content = content.value;
		taskObject.finish = false;
		//task 的 pid 
		taskObject.pid = curChildCateId;
		addTask(taskObject);
	}
	//更新分类列表
	updateCates();
	updateTaskList(queryAllTasksByPid(curChildCateId));
	updateTaskContent();

}


//*****************************click**cate**childcate**task*****************

/**
 * 设置点击项为高亮
 */
function setActive(element) {
	cleanAllActives($(".catalog-item"));
	addClass(element, "active");
}

/**
 * [cleanAllActives]
 * @param {element} scope 清除高亮的范围
 */
function cleanAllActives(scope) {
	var cateItems = scope.getElementsByTagName("h2");
	var childCateItems = scope.getElementsByTagName("h3");
	for(var i = 0; i < cateItems.length; i++) {
		removeClass(cateItems[i], "active");
	}
	for(var j = 0; j < childCateItems.length; j++) {
		removeClass(childCateItems[j], "active");
	}

}

/**
 * 清除状态分类那三个按键的样式
 */
function cleanStatusActive(){
	var items = $(".status").getElementsByTagName("li");
	for (var i = 0; i < items.length; i++) {
		removeClass(items[i], "active-status");
	}
}

/**
 * 点击cate主分类列表项时
 * 注意：getAttribute返回的是字符串，要用parseInt将其转换为number
 */
function clickCate(element) {
	cleanAllActives($(".catalog-item"));
	removeClass($(".all-task"), "active");
	addClass(element, "active");
	setDefaultStatus();
	curChildCateId = -1;
	var cateId = parseInt(element.getAttribute("cateid"));
	// var taskList = $(".status-list");
	if(cateId == -1){ //点击所有任务
		updateTaskList(queryAllTasks());
		curCateId = -1;
		curArea = "All";
	}else { 
		//主分类
		if(element.tagName.toLowerCase() == "h2"){
			updateTaskList(queryAllTasksByPPid(cateId));
			curCateId = cateId;
			curArea = "Cates"
		}
	}
	updateTaskContent();
}


/**
 * 点击childcate子分类列表项时
 */
function clickChildCate(element) {
	cleanAllActives($(".catalog-item"));
	addClass(element, "active");
	curChildCateId = parseInt(element.getAttribute("childCateid"));
	setDefaultStatus();
	updateTaskList(queryAllTasksByPid(curChildCateId));
	curArea = "childCates"
	updateTaskContent();
}

/**
 * 点击task时在最右侧的内容区显示对应内容
 */
function clickTask(element) {
	cleanAllActives($(".status-list"));
	addClass(element, "active");
	curTaskId = parseInt(element.getAttribute("taskid"));
	updateTaskContent();
}


/**
 * 点击中间栏的任务状态分栏时
 */
function clickStatus(element) {
	cleanStatusActive();
	addClass(element, "active-status");
	curStatus = element.getAttribute("statusid");
	if(curChildCateId == -1) {
		if(curStatus === "") { //all-task
			updateTaskList(queryAllTasksByPPid(curCateId));
		}else {
			updateTaskList(queryAllTasksByPPid(curCateId, curStatus));
		}
	}else {
		if(curStatus === "") { //all-task
			updateTaskList(queryAllTasksByPid(curChildCateId));
		}else {
			updateTaskList(queryAllTasksByPid(curChildCateId, curStatus));
		}
	}
	updateTaskContent();
}

function setDefaultStatus(){
	statusid = "";
	var statusItems = $(".status").getElementsByTagName("li");
	var allStatusItem = statusItems[0];
	cleanStatusActive();
	addClass(allStatusItem, "active-status");
}


//*************banner 上面的edit & finished
function clickFinished() {
	// 单独取出并且赋值的做法并不会更改本地存储，所以这样不对
	// curTask = queryTaskById(curTaskId);
	// curTask.finish = true;
	var allTasks = queryAllTasks();
	for (var i = 0; i < allTasks.length; i++){
		if(allTasks[i].id == curTaskId){
			allTasks[i].finish = true;
		}
	}
	localStorage.task = JSON.stringify(allTasks);
	// updateTaskList(queryAllTasksByPid(curChildCateId));
	updateTaskContent();

	if(curArea === "All"){
		updateTaskList(queryAllTasks());
	}else if(curArea === "Cates"){
		updateTaskList(queryAllTasksByPPid(curCateId));
	}else {
		updateTaskList(queryAllTasksByPid(curChildCateId));
	}

}

function clickEdit(){
	console.log("clickEdit");
	var task = queryTaskById(curTaskId);
	$(".task-banner").innerHTML = ''
	+ '<div class="title-name">'
	+		'<input type="text" class="input-title" placeholder="请输入标题" value="' + task.name + '">'
	+ '</div>'
	+ '<div class="manipulate">'
	+	'<a href="#" onclick="clickFinished()"><i class="fa fa-check-square-o"></i></a>'
	+	'<a href="#" onclick="clickEdit()"><i class="fa fa-pencil-square-o"></i></a>'
	+ '</div>';

	$(".article-date").innerHTML = ''
	+	'<h3><i class="fa fa-calendar"></i>'
	+		'<input type="date" class="input-date" value="' + task.date + '">';
	+	'</h3>';

	$(".content-wrap").innerHTML = ''
	+  '<textarea class="content-area" placeholder="请输入任务内容">'
	+		task.content
	+  '</textarea>';

	$(".button-area").innerHTML = ''
	+ '<span class="info"></span>'
	+ 	'<button class="save">' + '保存修改' + '</button>'
	+   '<button class="cancel-save">' + '取消' + '</button>';

	$(".button-area").style.display = "block";

	changeSaveOrCancel();
}

function changeSaveOrCancel(){
	console.log("changeSaveOrCancel");
	addClickEvent($(".save"), changeTask);
	// addClickEvent($(".cancel-save"), cancelChangeTask);
}

function changeTask(){
	var title = $(".input-title");
	var date = $(".input-date");
	var content = $(".content-area");
	var info = $(".info");
	//各种判断
	// console.log(title.value);
	// console.log(date.value);
	// console.log(content.value);
	//这里注意 ‘’与null是不同的， 用title.value===null就不会进入if了
	
	if(!title.value){
		info.innerHTML = "你还没有输入标题哦"
	}else if(!date.value){
		info.innerHTML = "你还没有输入日期哦"
	}else if(!content.value){
		info.innerHTML = "你还没有输入内容哦"
	}else {
		tasks = queryAllTasks();
		for(var i = 0; i < tasks.length; i++){
			if(tasks[i].id == curTaskId){
				tasks[i].name = title.value;
				tasks[i].date = date.value;
				tasks[i].content = content.value;
			}
		}
		updateLocalStorageTasks(tasks);
	}
	updateTaskContent();

	if(curArea === "All"){
		updateTaskList(queryAllTasks());
	}else if(curArea === "Cates"){
		updateTaskList(queryAllTasksByPPid(curCateId));
	}else {
		updateTaskList(queryAllTasksByPid(curChildCateId));
	}
}


//******************delete********

/** 
 * 点击垃圾桶小图标
 */
function del(event, element) {
	//阻止冒泡行为，
	//不然点击子类的时候，那这个Mousevent就会在父级中触发
	//也就是会触发父级的del()
	//那样都删了！！！
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	var tobeDeleted = element.parentNode;
	if(tobeDeleted.tagName.toLowerCase() === "h2"){ //删除主分类
	console.log(tobeDeleted.tagName.toLowerCase);	
		if(confirm("确定删除该主分类吗？")){
			deleteCate(tobeDeleted.getAttribute("cateid"));
		}
	}
	else if(tobeDeleted.tagName.toLowerCase() === "h3"){
		if(confirm("确定删除该子分类吗？")){
			deleteChildCate(tobeDeleted.getAttribute("childcateid"));
		}
	}
	updateCates();
	updateTaskList(queryAllTasks());
	//curTaskId在updateTaskList函数中已经确定了
	updateTaskContent();

}


/**
 * 根据id删除分类
 */
function deleteCate(cateid) {
	cateArr = queryCates();
	for (var i = 0; i < cateArr.length; i++) {
		if(cateArr[i].id == cateid){			
			//删除其拥有的childCates
			for(var j = 0; j < cateArr[i].child.length; j++){
				deleteChildCate(cateArr[i].child[j]);
			}
			//从cate列表删除
			updateLocalStorageCate(deleteInArray(cateArr, i));
		}
	}
}

function deleteChildCate(childCateid) {
	childCateArr = queryChildCates();
	for(var i = 0; i < childCateArr.length; i++) {
		if(childCateArr[i].id == childCateid){
			//更新父节点的child数组, 先查找pid
			var pid = findChildCatePid(childCateid);
			updateChildArrayInCate(pid ,childCateid);
			//删除其拥有的task
			for(var j = 0; j < childCateArr[i].child.length; j++){
				deleteTaskById(childCateArr[i].child[j]);
			}			
			//从childcate列表删除
			updateLocalStorageChildCate(deleteInArray(childCateArr, i));
		}
	}
}

function deleteTaskById(taskid) {
	var taskArr = queryAllTasks();
	for (var i = 0; i < taskArr.length; i++){
		if(taskArr[i].id == taskid){
			updateLocalStorageTasks(deleteInArray(taskArr, i));
		}
	}
}

/**
 * 删除子类的时候更新主类的child数组
 * @param  {[type]} pid 
 * @param  {[type]} id  [description]
 * @return {[type]}     [description]
 */
function updateChildArrayInCate(pid, id) {
	var cate = queryCates();
	for(var i = 0; i< cate.length; i++){
		if(cate[i].id == pid) {
			for (var j = 0; j < cate[i].child.length; j++){
				if(cate[i].child[j] == id){
					cate[i].child = deleteInArray(cate[i].child, j);
				}	
			}
			
		}
	}
	updateLocalStorageCate(cate);
}

/**
 * 根据id找pid
 * @param  {[type]} taskid [description]
 * @return {[type]}        [description]
 */
function findTaskPid(taskid) {
	var taskArr = queryAllTasks();
	for (var i = 0; i < taskArr.length; i++){
		if(taskArr[i].id == taskid){
			return taskArr[i].pid;
		}
	}
}

function findChildCatePid(childCateid){
	childCateArr = queryChildCates();
	for(var i = 0; i < childCateArr.length; i++) {
		if(childCateArr[i].id == childCateid){
			return childCateArr[i].pid;
		}
	}
}





















