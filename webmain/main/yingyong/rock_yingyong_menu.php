<?php if(!defined('HOST'))die('not access');?>
<script >
$(document).ready(function(){
	{params}
	var mid = params.mid,wherearr=[];
	var a = $('#menu_{rand}').bootstable({
		tablename:'im_menu',modenum:'yymenu',
		url:js.getajaxurl('menudata','{mode}','{dir}',{mid:mid}),
		tree:true,celleditor:true,
		columns:[{
			text:'名称',dataIndex:'name',align:'left',renderer:function(v,a){
				return '<font color="'+a.color+'">'+v+'</font>';
			}
		},{
			text:'编号',dataIndex:'num',editor:true
		},{
			text:'URL/条件编号',dataIndex:'url',editor:true
		},{
			text:'类型',dataIndex:'type',renderer:function(v){
				var s='条件编号';
				if(v==1)s='URL';
				// @squid 2018年3月28日16:33:46 加入判断v(类型)是否等于2，如果是显示提示框
				if(v==2)s='提示框';
				// @squid 2018年4月4日10:26:28 加入判断v(类型)是否等于3，如果是，显示AJAX
				if(v==3)s='AJAX';
				return s;
			}
		},{
			text:'排序号',dataIndex:'sort',editor:true
		},{
			text:'PID',dataIndex:'pid'
		},{
			text:'颜色',dataIndex:'color',editor:true
		},{
			text:'ID',dataIndex:'id'	
		}],
		itemclick:function(){
			btn(false);
		},
		load:function(d){
			wherearr=d.wherearr;
		}
	});
	
	function btn(bo){
		get('del_{rand}').disabled = bo;
		get('edit_{rand}').disabled = bo;
		get('down_{rand}').disabled = bo;
	}
	
	var c = {
		del:function(){
			a.del({check:function(lx){if(lx=='yes')btn(true)}});
		},
		reload:function(){
			a.reload();
		},
		clickwin:function(o1,lx){
			var h = $.bootsform({
				title:'应用菜单',height:300,width:400,
				tablename:'im_menu',isedit:lx,
				params:{int_filestype:'sort,type,mid,pid'},
				submitfields:'num,name,url,sort,type,mid,pid,color',
				items:[{
					labelText:'编号',name:'num'
				},{
					labelText:'菜单名称',name:'name',required:true
				},{
					// @squid 2018年3月28日16:33:46 下面一行加入了 【,{id:'2',name:'提示框'}】 这一段
					// @squid 2018年4月4日10:26:28 下面一行再加入了 【,{id:'3',name:'AJAX'}】这一段
					labelText:'类型',name:'type',type:'select',store:[{id:'0',name:'条件编号'},{id:'1',name:'URL'},{id:'2',name:'提示框'},{id:'3',name:'AJAX'}],valuefields:'id',displayfields:'name'
				},{
					labelText:'条件编号',name:'typesele',type:'select',store:wherearr,valuefields:'num',displayfields:'name'
				},{
					labelText:'URL/条件编号',name:'url'
				},{
					labelText:'上级ＩＤ',name:'pid',required:true,value:'0',type:'number'
				},{
					labelText:'序号',name:'sort',type:'number',value:'0'
				},{
					labelText:'颜色',name:'color'
				},{
					labelText:'mid',name:'mid',type:'hidden',value:'0'
				}],
				success:function(){
					a.reload();
				}
			});
			if(lx==1)h.setValues(a.changedata);
			h.getField('name').focus();
			if(lx==2)h.setValue('pid', a.changedata.id);
			h.setValue('mid',mid);
			$(h.form.type).change(function(){
				h.form.typesele.disabled=(this.value!='0');
			});
			$(h.form.typesele).change(function(){
				h.form.url.value = this.value;
			});
		}
	};
	js.initbtn(c);
});

</script>

<div>
<ul class="floats">
	<li class="floats50">
		<button class="btn btn-primary" click="clickwin,0" type="button"><i class="icon-plus"></i> 新增顶级</button> &nbsp; 
		<button class="btn btn-success" click="clickwin,2" id="down_{rand}" disabled type="button"><i class="icon-plus"></i> 新增下级</button> &nbsp; 
		<button class="btn btn-default" click="reload" type="button">刷新</button>
	</li>
	<li class="floats50" style="text-align:right">
		<button class="btn btn-danger" id="del_{rand}" click="del" disabled type="button"><i class="icon-trash"></i> 删除</button> &nbsp; 
		<button class="btn btn-info" id="edit_{rand}" click="clickwin,1" disabled type="button"><i class="icon-edit"></i> 编辑 </button>
	</li>
</ul>
</div>
<div class="blank10"></div>
<div id="menu_{rand}"></div>
<div style="padding:5px;color:#888888">顶级菜单最多只能3个，多建将不会显示，条件编号是在[流程模块条件]下设置的编号，用于读取数据条件过滤的。</div>
