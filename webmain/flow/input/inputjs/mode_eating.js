//流程模块【eating.报餐单】下录入页面自定义js页面,初始函数
function initbodys(){
	var username = $("input[name='optname']").val();	
	//给受托人赋值
	$("input[name='trusteename']").val(username);

	var rowindex = 1;
	$("#tablesub0").find("tr").each(function(){
		if(rowindex>1){
			var tdNewArr = $(this).children();
			var lunchchk = tdNewArr.eq(2).find("input[type='checkbox']").val();
			var dinnerchk = tdNewArr.eq(3).find("input[type='checkbox']").val();
			if(lunchchk == 1){
				tdNewArr.eq(2).find("input[type='checkbox']").attr("checked",true);
			}

			if(dinnerchk == 1){
				tdNewArr.eq(3).find("input[type='checkbox']").attr("checked",true);	
			}
		}
		rowindex++;
	});


	var id =  $("input[name='id']").attr("value");
	/** @squid 2018年4月8日17:58:39 设置不可编辑 */
	$('input[name=applydt]').attr('onclick', '');
	$('input[name=begin_date]').attr('onclick', '');
	$('input[name=end_date]').attr('onclick', '');

	/** @squid 2018年4月9日11:49:29 初始化第一个子表报餐日期的数值，默认为明天 */
	// 当全局变量ismobile 为true的时候才初始化
	if (ismobile) {
		let tomorrow = getDateStr(1);
		$('#tablesub0>tbody>tr:eq(1)>td:eq(1)>input').val(tomorrow);
		$('input[name=begin_date]').val(tomorrow);
		$('input[name=end_date]').val(tomorrow);
	}

    //新增
    if(id<=0){    	
    	$("input[id='cancellunnch']").attr("disabled",true);
    	$("#canceldinner").attr("disabled",true);
    }else{    	
		$("input[id='cancellunnch']").attr("disabled",false);
		$("#canceldinner").attr("disabled",false);

		$("#add").attr("disabled",true);
		$("#copy").attr("disabled",true);
		$("#currentweek").attr("disabled",true);
		$("#nextweek").attr("disabled",true);

		$("#tablesub0").find("tr").each(function(){
			if(rowindex>1){
				var tdNewArr = $(this).children();
				tdNewArr.eq(1).find("input").attr("disabled",true)
				if (!isEditable(tdNewArr.eq(1).find("input"))) { // 如果不可编辑，才设置不可用
					tdNewArr.eq(2).find("input[type='checkbox']").attr("disabled",true)					
					tdNewArr.eq(3).find("input[type='checkbox']").attr("disabled",true)	
				}
			}
		});


		//<input type="text" name="input1" value="中国" disabled="true">
	}
	
	$("#tablesub0 > tbody > tr").click(function(){		
		if(this.rowIndex>0){	
			var tdArr = $(this).children();

			var serial_number = tdArr.eq(0).find("input").val();//序号
			var eatingdate = tdArr.eq(1).find("input").val();//报餐日期	
			var myDate = new Date();
			var eatingdateNew = new Date(eatingdate);

			/*
			if(eatingdateNew.toLocaleDateString < myDate.toLocaleDateString){
				alert("就餐日期必须大于今天！");
				return;
			}else if (eatingdateNew.toLocaleDateString == myDate.toLocaleDateString && myDate.getHours>21){
				alert("就餐日期必须大于今天！");
				return;
			}
			*/

			$("#tablesub0").find("tr").each(function(){
				if(rowindex>1){
					var tdNewArr = $(this).children();
					tdNewArr.eq(0).find("input[type='checkbox']").attr("checked",false)	
				}
		
				rowindex++;
			});

			tdArr.eq(0).find("input[type='checkbox']").attr("checked",true);	
		}
	}); 

	/** @squid 2018年3月28日17:23:42 加载页面的时候根据传递的参数完成表单的初始化  */
	// 先获得url里面的参数 //
	var sqMenuNum = getQueryString('menunum'),
		sqParam = getQueryString('param');
	if (sqMenuNum) {
		switch (sqMenuNum) {
			case 'next_week':
				nextWeek('tablesub0', sqParam);
				break;
			case 'current_week':
				CurrentWeek('tablesub0', sqParam);
				break;
			case 'tomorrow':
				tomorrow(sqParam);
				break;
		}
	}

}

/** @squid 2018年3月30日10:36:00 类似一个接口方法，用于自定义保存成功之后的操作 */
function savesuccess() {
	js.back(); // 返回列表(保存后)
}

//获取最后一行
function last(ele){  
	return ele[ele.length-1];  
}  

//复制新增
function copyRow(ele){  
	var temp=document.getElementById(ele).getElementsByTagName("tbody")[0];  
    $("#tablesub0").find("tr:last").each(function(){
        var tdArr = $(this).children();
    	var serial_number = tdArr.eq(0).find("input").val();//序号
    	var eatingdate = tdArr.eq(1).find("input").val();//报餐日期

    	var numbername = tdArr.eq(0).find("input").attr("name");
    	
    	var sidevalue = tdArr.eq(0).find("input[type='hidden']").attr("name");
    	var sideindex = sidevalue.substring(sidevalue.lastIndexOf("_")+1,sidevalue.length);

    	var numberindex =  numbername.lastIndexOf("_");  
    	var serialindex = numbername.substring(numberindex+1,numbername.length);

    	var riqi = tdArr.eq(1).find("input").attr("name");
    	var riqiindexx = riqi.substring(riqi.lastIndexOf("_")+1,riqi.length);

    	var zc = tdArr.eq(2).find("input").attr("name");
    	var zcindex = zc.substring(zc.lastIndexOf("_")+1,zc.length);

    	var wc = tdArr.eq(2).find("input").attr("name");
    	var wcindex = wc.substring(wc.lastIndexOf("_")+1,wc.length);

        if(eatingdate == null || eatingdate == undefined || eatingdate == ''){
        	alert('上一行没有填写报餐日期，不能递增复制');
        	return;
        }else{
    		temp.appendChild(last(temp.rows).cloneNode(true));    

			$("#tablesub0").find("tr:last").each(function(){
		        var tdNewArr = $(this).children();
				
	    		tdNewArr.eq(0).find("input").val(parseInt(serial_number)+1);	    		
	    		tdNewArr.eq(1).find("input").val(change_date(eatingdate));	
	    		
	    		//给name赋值
	    		tdNewArr.eq(0).find("input").attr("name","xuhao0_"+(parseInt(serialindex)+1));
	    		tdNewArr.eq(1).find("input").attr("name","eatingdate0_"+(parseInt(riqiindexx)+1))
    			tdNewArr.eq(2).find("input").attr("name","lunch0_"+(parseInt(zcindex)+1))
    			tdNewArr.eq(3).find("input").attr("name","dinner0_"+(parseInt(wcindex)+1))

				tdNewArr.eq(0).find("input[type='hidden']").attr("name","sid0_"+(parseInt(sideindex)+1));
				//console.log(tdNewArr.eq(0).find("input[type='hidden']").val(0));

				//给finput 统计值
				form('sub_totals0').value=parseInt(serial_number)+1;
		    });
        }        
    });    
}  


//给传入的日期参数加一天
function change_date (eatingdate) {  
    // 参数表示在当前日期下要增加的天数  
    var now = new Date(eatingdate);  
    // + 1 代表日期加，- 1代表日期减  
    now.setDate((now.getDate() + 1) );  
    var year = now.getFullYear();  
    var month = now.getMonth() + 1;  
    var day = now.getDate();  
    if (month < 10) {  
        month = '0' + month;  
    }  
    if (day < 10) {  
        day = '0' + day;  
    }  

    return year + '-' + month + '-' + day;  
};  


var sideindex;
var serialindex;
var riqiindexx;
var zcindex;
var wcindex;


//报本周
function CurrentWeek(tabname, sqParam){

	var rowsinfo =  $("#tablesub0").find("tr");
	//console.log(rowsinfo);
	if(rowsinfo.length>2){
		alert('单据体为空，才能报本周');
		return;
	}


	var j = 1;
	$("#tablesub0").find("tr").each(function(){

		if(j>1){
			var tdArr2 = $(this).children();
	    	var eatingdate = tdArr2.eq(1).find("input").val();//报餐日期

	        if(eatingdate!= ''){
	        	alert('单据体为空，才能报本周');
	        	return;
	        }
	    }
        j++;
	});


	$("#tablesub0").find("tr:last").each(function(){
        var tdArr = $(this).children();
    	var serial_number = tdArr.eq(0).find("input").val();//序号
    	var eatingdate = tdArr.eq(1).find("input").val();//报餐日期

    	var numbername = tdArr.eq(0).find("input").attr("name");
    	
    	var sidevalue = tdArr.eq(0).find("input[type='hidden']").attr("name");
    	sideindex = sidevalue.substring(sidevalue.lastIndexOf("_")+1,sidevalue.length);

    	var numberindex =  numbername.lastIndexOf("_");  
    	serialindex = numbername.substring(numberindex+1,numbername.length);

    	var riqi = tdArr.eq(1).find("input").attr("name");
    	riqiindexx = riqi.substring(riqi.lastIndexOf("_")+1,riqi.length);

    	var zc = tdArr.eq(2).find("input").attr("name");
    	zcindex = zc.substring(zc.lastIndexOf("_")+1,zc.length);

    	var wc = tdArr.eq(2).find("input").attr("name");
    	wcindex = wc.substring(wc.lastIndexOf("_")+1,wc.length);
    });



	var day = new Date();   
	var today = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');  
	var week = today[day.getDay()];  
	var days = 0;
	

	//周日是一周的第一天,周六为最后一天

	if(week == "星期六"){
		alert('当天为星期六，本周不允许报餐');
		return;
	}

	switch (week)
	{
		case ("星期日"):
			days = 6;
			break;
		case ("星期一"):
			days = 5;
			break;
		case ("星期二"):
			days = 4;
			break;
		case ("星期三"):
			days = 3;
			break;
		case ("星期四"):
			days = 2;
			break;
		case ("星期五"):
			days = 1;
			break;
		case ("星期六"):
			break;		
	}

	for (var i = days - 1; i >= 1; i--) {
		var temp=document.getElementById(tabname).getElementsByTagName("tbody")[0];  
		temp.appendChild(last(temp.rows).cloneNode(true));    
	}

	var serial_number_new =1;
	var rowindex = 1;
	//循环tab 的行数
	$("#tablesub0").find("tr").each(function(){
		if(rowindex>1)
		{
	        var tdNewArr = $(this).children();
			tdNewArr.eq(0).find("input").val(parseInt(serial_number_new));
			tdNewArr.eq(1).find("input").val(change_date(day));	 


			//给name赋值
    		tdNewArr.eq(0).find("input").attr("name","xuhao0_"+(parseInt(serialindex)+(serial_number_new-1) ));
    		tdNewArr.eq(1).find("input").attr("name","eatingdate0_"+(parseInt(riqiindexx)+(serial_number_new-1)))
			tdNewArr.eq(2).find("input").attr("name","lunch0_"+(parseInt(zcindex)+(serial_number_new-1)))
			tdNewArr.eq(3).find("input").attr("name","dinner0_"+(parseInt(wcindex)+(serial_number_new-1)))

			tdNewArr.eq(0).find("input[type='hidden']").attr("name","sid0_"+(parseInt(sideindex)+(serial_number_new-1)));

			// @squid 2018年3月28日17:23:42 给午餐或者晚餐的checkbox打勾
			switch(sqParam) {
				case 'lunch': // 如果只报午餐，需要把晚餐的checkbox取消
					checkboxStatus(tdNewArr.eq(3).find('input'), false); // eq(3)是晚餐的checkbox
					break;
				case 'dinner': // 如果只报晚餐，需要把午餐的checkbox取消
					checkboxStatus(tdNewArr.eq(2).find('input'), false); // eq(2)是午餐的checkbox
					break;
				case 'all':
					break;
			}
			// squid end

			form('sub_totals0').value=parseInt(serial_number_new)+1;

			tdNewArr.eq(0).find("input[type='hidden']").val(0);

			serial_number_new++;	
			days --;
			day = change_date(day);
		}
		rowindex++;
    });
}

//报下周
function nextWeek(tabname, sqParam){
	var rowsinfo =  $("#tablesub0").find("tr");
	//console.log(rowsinfo);
	if(rowsinfo.length>2){
		alert('单据体为空，才能报下周');
		return;
	}


	var j = 1;
	$("#tablesub0").find("tr").each(function(){

		if(j>1){
			var tdArr2 = $(this).children();
	    	var eatingdate = tdArr2.eq(1).find("input").val();//报餐日期

	        if(eatingdate!= ''){
	        	alert('单据体为空，才能报下周');
	        	return;
	        }
	    }
        j++;
	});

	//复制行
	for (var i = 7 - 1; i >= 1; i--) {
		var temp=document.getElementById(tabname).getElementsByTagName("tbody")[0];  
		temp.appendChild(last(temp.rows).cloneNode(true));    
	}

	var serial_number_new =1;
	var rowindex = 1;

	var week = getWeek();
	var days = week[0];
	//循环tab 的行数
	$("#tablesub0").find("tr").each(function(){
		if(rowindex>1)
		{
			var tdNewArr = $(this).children();
			tdNewArr.eq(0).find("input").val(parseInt(serial_number_new));
			if(rowindex==2)
			{
				var now = new Date(days);  
			    // + 1 代表日期加，- 1代表日期减  
			    now.setDate((now.getDate() ) );  
			    var year = now.getFullYear();  
			    var month = now.getMonth() + 1;  
			    var day = now.getDate();  

			    if (month < 10) {  
			        month = '0' + month;  
			    }  
			    if (day < 10) {  
			        day = '0' + day;  
			    }  

				tdNewArr.eq(1).find("input").val(year + '-' + month + '-' + day);	 
			}else{
				//console.log(days);
				days = change_date(days);
				tdNewArr.eq(1).find("input").val(days);	 
			}

			//tdNewArr.eq(2).find("input").var(1);
			//tdNewArr.eq(3).find("input").var(1);

			// @squid 2018年3月28日17:23:42 给午餐或者晚餐的checkbox打勾
			switch(sqParam) {
				case 'lunch': // 如果只报午餐，需要把晚餐的checkbox取消
					checkboxStatus(tdNewArr.eq(3).find('input'), false); // eq(3)是晚餐的checkbox
					break;
				case 'dinner': // 如果只报晚餐，需要把午餐的checkbox取消
					checkboxStatus(tdNewArr.eq(2).find('input'), false); // eq(2)是午餐的checkbox
					break;
				case 'all':
					break;
			}
			// squid end

			//给name赋值
    		tdNewArr.eq(0).find("input").attr("name","xuhao0_"+((serial_number_new-1) ));
    		tdNewArr.eq(1).find("input").attr("name","eatingdate0_"+((serial_number_new-1)))
			tdNewArr.eq(2).find("input").attr("name","lunch0_"+((serial_number_new-1)))
			tdNewArr.eq(3).find("input").attr("name","dinner0_"+((serial_number_new-1)))

			tdNewArr.eq(0).find("input[type='hidden']").attr("name","sid0_"+((serial_number_new-1)));

			tdNewArr.eq(0).find("input[type='hidden']").val(0);

			form('sub_totals0').value=parseInt(serial_number_new)+1;
			
			serial_number_new++;	
			
		}
		rowindex++;
    });

	
}


 function getWeek() {  
    const week = [];  
    for (let i = 0; i < 7; i++) {  
      let Stamp = new Date();  
      let num = 7-Stamp.getDay()  + i;  
      Stamp.setDate(Stamp.getDate() + num);  
      week[i] = Stamp.getFullYear()+(Stamp.getMonth() + 1) +  Stamp.getDate() ;  
      //console.log(week[i]);  
      week[i] = Stamp;
    }  
    return week;  
  }  
//格式化日期
var formatDate = function(date){
    var year = date.getFullYear()+'年';
    var month = (date.getMonth()+1)+'月';
    var day = date.getDate()+'日';
    var week = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')';  
    return year+month+day+' '+week;
};


//取消午餐
function CancelLunch(){
	var rowindex = 1;
	var isselect = false;
	$("#tablesub0").find("tr").each(function(){
		if(rowindex>1){
			var tdNewArr = $(this).children();

			var ischeck = tdNewArr.eq(0).find("input[type='checkbox']").attr("checked");
			if(ischeck == true){
				var eatingdate = tdNewArr.eq(1).find("input").val();//报餐日期	
				var myDate = new Date();
				var eatingdateNew = new Date(eatingdate);
								
				if(eatingdateNew <= myDate){
					alert("就餐日期必须大于今天！");
					return;
				}
				
				/*else if (eatingdateNew.toLocaleDateString == myDate.toLocaleDateString && myDate.getHours>21){
					alert("就餐日期必须大于今天！");
					return;
				}*/
				isselect = true;
				tdNewArr.eq(2).find("input[type='checkbox']").attr("checked",false)	

				c.save();
			}			
		}

		rowindex++;
	});

	if(isselect == false){
		alert('请选择一行要取消报午餐的数据');
		return;
	}
}

//取消晚餐
function CancelDinner(){
	var rowindex = 1;
	var isselect = false;
	$("#tablesub0").find("tr").each(function(){
		if(rowindex>1){
			var tdNewArr = $(this).children();
			
			var ischeck = tdNewArr.eq(0).find("input[type='checkbox']").attr("checked");
			if(ischeck == true){
				var eatingdate = tdNewArr.eq(1).find("input").val();//报餐日期	
				var myDate = new Date();
				var eatingdateNew = new Date(eatingdate);
								
				if(eatingdateNew <= myDate){
					alert("就餐日期必须大于今天！");
					return;
				}		
				
				isselect = true;

				tdNewArr.eq(3).find("input[type='checkbox']").attr("checked",false)	

				c.save();
			}
		}	

		if(isselect ==true){
			alert('请选择一行要取消报晚餐的数据');
			return;
		}

		rowindex++;
	});
}

// @squid 2018年3月29日11:18:56 明天的报餐
function tomorrow(sqParam) {
	var subTableDateInput = $("#tablesub0").find("tr");

	// 获得明天的文字日期
	var tomorrowDate = new Date();
	tomorrowDate.setTime(tomorrowDate.getTime()+24*60*60*1000);
	var tomorrowStr = tomorrowDate.getFullYear()+"-" + (tomorrowDate.getMonth()+1) + "-" + tomorrowDate.getDate(); 

	var trNode = $('#tablesub0>tbody>tr:eq(1)');
	trNode.find('td:eq(1)>input').val(tomorrowStr);
	switch(sqParam) {
		case 'lunch':
			checkboxStatus(trNode.find('td:eq(2)>input'), true);
			checkboxStatus(trNode.find('td:eq(3)>input'), false);
			break;
		case 'dinner':
			checkboxStatus(trNode.find('td:eq(2)>input'), false);
			checkboxStatus(trNode.find('td:eq(3)>input'), true);
			break;
	}
	
}

// @squid 2018年3月28日17:23:42 设置checkbox状态
function checkboxStatus(checkbox, checked) {
	if(checked) {
		checkbox.val(1);
	} else {
		checkbox.val(0);
	}
	checkbox.attr('checked', checked);
}

/** @squid 获得url传递的参数 */
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

/** @squid 2018年4月9日11:48:22 根据今天获得日期 */
function getDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth() + 1;//获取当前月份的日期
	if (m < 10) m = '0' + '' + m; // 如果小于10月，那么月份前面加0，保持格式
	var d = dd.getDate(); 
	if (d.length < 10) d = '0' + '' + d;  // 如果小于10日，那么前面加0，保持格式
	return y + "-" + m + "-" + d; 
}

/** @squid 2018年4月9日09:41:09 为子表的报餐日期加上一个改变事件，发生改变的时候改变主表的开始和结束日期 */
function changeStartAndEnd() {
	let valArr = [];
	$('#tablesub0>tbody>tr').each(function(index, item){
		if(index > 0) {
			let inputNode = $(item).find('td:eq(1)>input'),
				val = inputNode.val();
			if(isInArray(valArr, val)) { // @squid 增加其是否可以重复填值的问题
				js.msg('msg', '报餐日期重复【' + val + '】');
				inputNode.val(''); // 清空
			} else {
				valArr.push(val);
			}
		}
	});
	valArr.sort(); // 排序大小
	let min = valArr[0],
		max = valArr[valArr.length - 1];
	
	$('input[name=begin_date]').val(min);
	$('input[name=end_date]').val(max);
}

/** @squid 2018年4月9日13:45:08 检查数组中是否有重复值 */
function isInArray(arr, val) {
	var tempStr = ',' + arr.join(',') + ',';
	return tempStr.indexOf(',' + val + ',') != -1;
}

/** @squid 2018年4月11日10:07:27 判断子表是否可以编辑 */
function isEditable(inputNode) {
	let today       = getDateStr(0), // 今天
		tomorrow    = getDateStr(1), // 明天
		date        = new Date(),
		localOffset = date.getTimezoneOffset() * 60, // 时区偏差
		now         = (Date.parse(date) / 1000), // 当前时间戳
		todayNinePm = (Date.parse(today) / 1000) + localOffset + (60 * 60 * 21); // 当天晚上9点
	
	if (today >= inputNode.val()) {
		return false; // 今天或者之前的不可修改
	}
	if (tomorrow == inputNode.val() && now > todayNinePm) { // 如果输入框日期等于明天,判断当前时间是否已经超过9点
		return false; // 明天的不可修改
	}

	return true; // 如果上面两个条件都不满足，那么可以编辑
}