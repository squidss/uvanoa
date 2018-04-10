var myScroll=false,yy={
	sousoukey:'',
	resizehei:function(){
		var hei= this.getheight();
		if(agentlx==0){
			var ob = this.showobj.css({'height':''+hei+'px'});
			return ob;
		}
	},
	getheight:function(ss){
		var hei = 0;if(!ss)ss=0;
		if(get('searsearch_bar'))hei+=45;
		if(get('header_title'))hei+=50;
		if(get('footerdiv'))hei+=50;
		return $(window).height()-hei+ss;
	},
	initScroll:function(){
		if(get('searsearch_bar') && agentlx==0){
			this.touchobj = $('#mainbody').rockdoupull({
				upbool:true,
				onupbefore:function(){
					return yy.onupbefore();
				},
				upmsgdiv:'showblank',
				onupsuccess:function(){
					yy.scrollEndevent();
				}
			});
		}
	},
	
	init:function(){
		this.num = json.num;
		this.showobj = $('#mainbody');
		$('.weui_navbar').click(function(){return false;});
		$('body').click(function(){
			$("div[id^='menushoess']").remove();
		});
		this.initScroll();
		this.resizehei();
		$(window).resize(function(){
			yy.resizehei();
		});
		if(agentlx==1){
			window.onhashchange=function(){
				//var has = location.hash;
				//yy.loadshow();
			}
			$(window).scroll(function(){
				yy.scrollnew();
			});
		}
	},
	
	//显示
	scrollnew:function(){
		var top = $(document).scrollTop();
		if(top>50){
			if(!get('backtuodiv')){
				var s = '<div id="backtuodiv" onclick="js.backtop()" style="position:fixed;right:5px;bottom:10px;width:30px;height:30px; background:rgba(0,0,0,0.4);z-index:9;border-radius:50%;font-size:14px;color:white;text-align:center;line-height:30px"><i class="icon-angle-up"></i></div>';
				$('body').append(s);
			}
		}else{
			$('#backtuodiv').remove();
		}
	},
	
	loadshow:function(){
		var url = location.href,arr = json.menu;
		var urla= url.split('#'),darr = this.getfirstnum(arr);
		var dkey= darr[0];
		if(urla[1])dkey = urla[1];
		this.getdata(dkey,1);
		if(darr[1]>-1){
			var tit = arr[darr[1]].name;
			if(darr[2]>-1)tit = arr[darr[1]].submenu[darr[2]].name;
			this.showtabstr(darr[1], tit);
		}
	},
	
	//第一个条件编号
	getfirstnum:function(d){
		var dbh = 'def',bh='',a = d[0],i,len,lens,subs;
		if(a){
			bh = a.url;
			// @squid 判断a.submenu[0]的类型是否为2，如果是的话，不以url为条件进行查询数据接口的调用，加入了一句【 && a.submenu[0].type !== '2' 】
			if(a.submenu[0] && a.submenu[0].type !== '2')bh=a.submenu[0].url;
		}
		try{
			var site = sessionStorage.getItem(''+json.num+'_event');
			// @squid 2018年3月29日09:57:12 判断site是否一个toast，如果是的话，bh不为site
			let splitSite = site.split(','),
				isToastMenu = Object.prototype.toString.call(splitSite) == '[object Array]';
			// @squid 如果isToastMenu是true的话，不应该拿sessionStorage里面的数据，所以下面用一个反来验证
			if(site && !isToastMenu)bh = site;
		}catch(e){}
		
		if(isempt(bh))bh=dbh;
		len = d.length;
		var goi = -1,goj=-1;
		for(i=0;i<len;i++){
			subs = d[i].submenu;
			lens = subs.length;
			if(goi>-1)break;
			if(lens>0){
				for(var j=0;j<lens;j++){
					if(subs[j].url==bh){
						goi = i;
						goj = j;
						break;
					}
				}
			}else{
				if(d[i].url==bh){
					goi = i;
					break;
				}
			}
		}
		return [bh,goi,goj];
	},
	showtabstr:function(oi, tit){
		$('[temp="tablx"]').removeClass('active');
		$('[temp="tablx"]:eq('+oi+')').addClass('active');
		$('[temp="tabying"]').css({'color':'','border-top':''});
		$('[temp="tabying"]:eq('+oi+')').css({'color':'#1389D3','border-top':'1px #1389D3 solid'});
		$('[temp="tabying"]:eq('+oi+')').find('font').html(tit);
		this.settitle(tit);
	},
	clickmenu:function(oi,o1){
		if(o1.className.indexOf('disabled')>0)return;
		var sid='menushoess_'+oi+'';
		if(get(sid)){
			$('#'+sid+'').remove();
			return;
		}
		$("div[id^='menushoess']").remove();
		var a = json.menu[oi],slen=a.submenu.length,i,a1;
		this.menuname1 = a.name;
		this.menuname2 = '';
		if(slen<=0){
			this.clickmenus(a,oi);
		}else{
			if(agentlx==0){
				var o=$(o1),w=1/json.menu.length*100;
				var s='<div id="'+sid+'" style="position:fixed;z-index:5;left:'+(o.offset().left)+'px;bottom:50px; background:white;width:'+w+'%" class="menulist r-border-r r-border-l">';
				for(i=0;i<slen;i++){
					a1=a.submenu[i];
					s+='<div onclick="yy.clickmenua('+oi+','+i+')" class="r-border-t" style="color:'+a1.color+';">'+a1.name+'</div>';
				}
				s+='</div>';
				$('body').append(s);
			}
			if(agentlx==1){
				var da = [];
				for(i=0;i<slen;i++){
					a1=a.submenu[i];
					a1.oi = oi;
					a1.i = i;
					da.push(a1);
				}
				js.showmenu({
					data:da,
					width:150,
					onclick:function(d){
						yy.clickmenua(d.oi,d.i);
					}
				});
			}
		}
	},
	searchuser:function(){
		$('#searsearch_bar').addClass('weui_search_focusing');
		$('#search_input').focus();
	},
	searchcancel:function(){
		$('#search_input').blur();
		$('#searsearch_bar').removeClass('weui_search_focusing');
	},
	souclear:function(){
		$('#search_input').val('').focus();
	},
	sousousou:function(){
		var key = $('#search_input').blur().val();
		this.keysou(key);
	},
	clickmenua:function(i,j){
		var a = json.menu[i].submenu[j];
		this.menuname2 = a.name;
		this.clickmenus(a,i);
	},
	onclickmenu:function(a){
		return true;
	},
	
	settitle:function(tit){
		document.title = tit;
		$('#header_title').html(tit);
	},
	
	//点击菜单了
	clickmenus:function(a,oi){
		$("div[id^='menushoess']").remove();
		if(!this.onclickmenu(a))return;
		var tit = this.menuname1;
		//if(this.menuname2!='')tit+='→'+this.menuname2+'';
		if(this.menuname2!='')tit=this.menuname2;
		if(a.type==0){
			this.searchcancel();
			this.sousoukey='';
			this.clickevent(a);
			this.showtabstr(oi, tit);
		}
		if(a.type==1){
			var url=a.url,amod=this.num;
			if(url.substr(0,3)=='add'){
				if(url!='add')amod=url.replace('add_','');
				url='index.php?a=lum&m=input&d=flow&num='+amod+'&show=we';
			}
			/** @squid 2018年4月10日10:32:57 这里增加一个加载中的效果，用于减轻用户等待的焦躁心情 */
			js.wx.load('努力加载中...');
			js.location(url);
		}
		/** @squid 加入菜单类型为2的打开toast操作 */
		if(a.type==2) {
			this.openToast(a);
		}
		/** @squid 2018年4月4日10:24:29 加入菜单类型为3的ajax操作 */
		if(a.type==3) {
			let selectId = yy.getSelect();
			if (selectId == '') {
				js.msg('msg', '不能没有勾选项');
			} else {
				js.ajax('agent', 'eating', {'sqAction': 'cancle', 'cancleId': selectId, 'type': a.url}, function(data){
					if (data.msg) {
						js.msg('ok', data.msg, 3);
					}
					yy.reload();
				}, 'mode', false, false, 'post');
			}
		}
	},
	clickevent:function(a){
		this.getdata(a.url, 1);return;
		if(agentlx==1){
			js.location('#'+a.url+'');
		}else{
			this.getdata(a.url, 1);
		}
	},
	data:[],
	_showstotal:function(d){
		var d1,v,s,o1;
		for(d1 in d){
			v=d[d1];
			if(v==0)v='';
			o1= $('#'+d1+'_stotal');
			o1.html(v);
		}
	},
	regetdata:function(o,p){
		var mo = 'mode';
		if(o){
			o.innerHTML='<img src="images/loading.gif" align="absmiddle">';
			mo = 'none';
		}
		this.getdata(this.nowevent,p, mo);
	},
	getdata:function(st,p, mo){
		this.nowevent=st;
		try{sessionStorage.setItem(''+json.num+'_event', st);}catch(e){}
		this.nowpage = p;
		if(!mo)mo='mode';
		var key = ''+this.sousoukey;
		if(key)key='basejm_'+jm.base64encode(key)+'';
		js.ajax('index','getyydata',{'page':p,'event':st,'num':this.num,'key':key},function(ret){
			/** @squid 2018年4月2日09:33:47 如果ret的num是eating的话，改变他的显示形式，调用其他方法 */
			if (ret.num == 'eating') {
				yy.eatShowData(ret);
			} else {
				yy.showdata(ret);
			}
		},mo, false,false, 'get');
	},
	reload:function(){
		this.getdata(this.nowevent,this.nowpage);
	},
	keysou:function(key){
		if(this.sousoukey == key)return;
		this.sousoukey = key;
		this.regetdata(false,1);
	},
	xiang:function(oi){
		var d = this.data[oi-1];
		var ids = d.id,nus=d.modenum,modne=d.modename;
		if(!ids)return;
		if(!nus||nus=='undefined')nus = this.num;
		var url='task.php?a=x&num='+nus+'&mid='+ids+'&show=we';
		js.location(url);
	},
	suboptmenu:{},
	showmenu:function(oi){
		var a = this.data[oi-1],ids = a.id,i;
		var nus=a.modenum;if(!nus||nus=='undefined')nus = this.num;
		if(a.type=='applybill' && nus){
			var url='index.php?a=lum&m=input&d=flow&num='+nus+'&show=we';
			js.location(url);return;
		}
		if(!ids)return;
		this.tempid 	= ids;
		this.tempnum 	= nus;
		this.temparr 	= {oi:oi};
		var da = [{name:'详情',lx:998,oi:oi}];
		var subdata = this.suboptmenu[''+nus+'_'+ids+''];
		if(typeof(subdata)=='object'){
			for(i=0;i<subdata.length;i++)da.push(subdata[i]);
		}else{
			da.push({name:'<img src="images/loadings.gif" align="absmiddle"> 加载菜单中...',lx:999});
			this.loadoptnum(nus,ids);
		}
		js.showmenu({
			data:da,
			width:150,
			onclick:function(d){
				yy.showmenuclick(d);
			}
		});
	},
	loadoptnum:function(nus,id){
		js.ajax('agent','getoptnum',{num:nus,mid:id},function(ret){
			yy.suboptmenu[''+nus+'_'+id+'']=ret;
			yy.showmenu(yy.temparr.oi);
		},'none',false,function(estr){
			yy.suboptmenu[''+nus+'_'+id+'']=[];
			yy.showmenu(yy.temparr.oi);
		});
	},
	showmenuclick:function(d){
		d.num=this.num;d.mid=this.tempid;
		d.modenum = this.tempnum;
		var lx = d.lx;if(!lx)lx=0;
		if(lx==999)return;
		if(lx==998){this.xiang(d.oi);return;}
		if(lx==996){this.xiang(this.temparr.oi);return;}
		this.changdatsss = d;
		if(lx==2 || lx==3){
			var clx='changeuser';if(lx==3)clx='changeusercheck';
			$('body').chnageuser({
				'changetype':clx,
				'titlebool':get('header_title'),
				'onselect':function(sna,sid){
					yy.xuanuserok(sna,sid);
				}
			});
			return;
		}
		if(lx==1 || lx==9 || lx==10 || lx==13 || lx==15 || lx==16 || lx==17){
			var bts = (d.issm==1)?'必填':'选填';
			js.wx.prompt(d.name,'请输入['+d.name+']说明('+bts+')：',function(text){
				if(!text && d.issm==1){
					js.msg('msg','没有输入['+d.name+']说明');
				}else{
					yy.showmenuclicks(d, text);
				}
			});
			return;
		}
		//添加提醒设置
		if(lx==14){
			var url='index.php?a=lum&m=input&d=flow&num=remind&mid='+d.djmid+'&def_modenum='+d.modenum+'&def_mid='+d.mid+'&def_explain=basejm_'+jm.base64encode(d.smcont)+'&show=we';
			js.location(url);
			return;
		}
		if(lx==11){
			var url='index.php?a=lum&m=input&d=flow&num='+d.modenum+'&mid='+d.mid+'&show=we';
			js.location(url);
			return;
		}
		this.showmenuclicks(d,'');
	},
	xuanuserok:function(nas,sid){
		if(!sid)return;
		var d = this.changdatsss,sm='';
		d.changename 	= nas; 
		d.changenameid  = sid; 
		this.showmenuclicks(d,sm);
	},
	showmenuclicks:function(d, sm){
		if(!sm)sm='';
		d.sm = sm;
		for(var i in d)if(d[i]==null)d[i]='';
		js.ajax('index','yyoptmenu',d,function(ret){
			yy.suboptmenu[''+d.modenum+'_'+d.mid+'']=false;
			yy.getdata(yy.nowevent, 1);
		});	
	},
	showdata:function(a){
		this.overend = true;
		var s='',i,len=a.rows.length,d,st='',oi;
		$('#showblank').remove();
		$('#notrecord').remove();
		if(typeof(a.stotal)=='object')this._showstotal(a.stotal);
		if(a.page==1){
			this.showobj.html('');
			this.data=[];
		}
		for(i=0;i<len;i++){
			d=a.rows[i];
			oi=this.data.push(d);
			if(d.showtype=='line' && d.title){
				s='<div class="contline">'+d.title+'</div>';
			}else{
				if(!d.statuscolor)d.statuscolor='';
				st='';
				if(d.ishui==1)st='color:#aaaaaa;';
				s='<div style="'+st+'" class="r-border contlist">';
				if(d.title){
					if(d.face){
						s+='<div onclick="yy.showmenu('+oi+')" class="face"><img src="'+d.face+'" align="absmiddle">'+d.title+'</div>';
					}else{
						s+='<div onclick="yy.showmenu('+oi+')" class="tit">'+d.title+'</div>';
					}
				}
				if(d.optdt)s+='<div class="dt">'+d.optdt+'</div>';
				if(d.picurl)s+='<div onclick="yy.showmenu('+oi+')" class="imgs"><img src="'+d.picurl+'" width="100%"></div>';
				if(d.cont)s+='<div  onclick="yy.showmenu('+oi+')" class="cont">'+d.cont.replace(/\n/g,'<br>')+'</div>';
				if(d.id && d.modenum){
					s+='<div class="xq r-border-t"><font onclick="yy.showmenu('+oi+')">操作<i class="icon-angle-down"></i></font><span onclick="yy.xiang('+oi+')">详情&gt;&gt;</span>';
					s+='</div>';
				}
				if(d.statustext)s+='<div style="background-color:'+d.statuscolor+';opacity:0.7" class="zt">'+d.statustext+'</div>';
				s+='</div>';
			}
			this.showobj.append(s);
		}
		var count=a.count;
		if(count==0)count=len;
		if(count>0){
			this.nowpage = a.page;
			s = '<div class="showblank" id="showblank">共'+count+'条记录';
			if(a.maxpage>1)s+=',当前'+a.maxpage+'/'+a.page+'页';
			if(a.page<a.maxpage){
				s+=', <a id="showblankss" onclick="yy.regetdata(this,'+(a.page+1)+')" href="javascript:;">点击加载</a>';
				this.overend = false;
			}
			s+= '</div>';
			this.showobj.append(s);
			if(a.count==0)$('#showblank').html('');
		}else{
			this.showobj.html('<div class="notrecord" id="notrecord">暂无记录</div>');
		}
		if(this.touchobj)this.touchobj.onupok();
	},
	onupbefore:function(){
		if(this.overend)return false;
		var a={
			'msg':'↑ 继续上拉加载第'+(this.nowpage+1)+'页',
			'msgok' : '<a id="showblankss">↓ 释放后</a>加载第'+(yy.nowpage+1)+'页...'
		};
		return a;
	},
	scrollEndevent:function(){
		yy.regetdata(get('showblankss'),yy.nowpage+1);
	},

	hasOpenToast: false, // @squid 2018年4月10日09:10:21 对象yy的属性，用于管理是否有打开过sq_toast

	/**
	 * @squid 2018年3月28日16:33:46
	 * 点击菜单之后打开toast
	 */
	openToast: function(menu) {
		var winSize = {width: window.innerWidth, height: window.innerHeight},
			toastWidth = winSize.width * 0.9,
			left = (winSize.width - toastWidth) / 2,
			top  = (winSize.height / 2) - 60,
			liContent = '';  // li的内容，在这里先定义了

		if (menu.url.indexOf(',') > 0) {
			var toastUrl = menu.url.split(','),
				liWidth = toastWidth / (toastUrl.length + 1); // 1是关闭按钮的位置
			// console.log(liWidth);
			for(let i = 0; i < toastUrl.length; i++) {
				let item = toastUrl[i];
				if (item.indexOf('|') > 0) {
					let splitItem = item.split('|');
					liContent += '<li style="width: ' + (liWidth - 1) + 'px; border-right: 1px solid #ccc;" onclick="yy.clickToastMenu(\'' + menu.num + '\', \'' + splitItem[0] + '\')">' + splitItem[1] + '</li>';
				}
			}
			// console.log(toastUrl);
		}
		
		// toastStyle 放到css 里面方便统一管理吧
		var toastStyle    =  '<style>\n' +
							'	.sq_toast_mask {position: absolute; width: 100%; height: 100%; left: 0; top: 0; background: #7b7979b8; z-index: 998;}\n' +
							'	.sq_toast {position: absolute; width: 90%; border-radius: 5px; margin: auto; left: ' + left + 'px; top: ' + top + 'px; background: #337ab7;}\n' +
							'	.sq_toast_title {text-align: center; letter-space: 1px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom: 1px solid #ccc; height: 30px; line-height: 30px; color: white;}\n' +
							'	ul {margin: 0 0; padding: 0 0;}\n' +
							'	ul>li {list-style-type: none; float: left; text-align: center;height: 40px; line-height: 40px; color: white;}\n' +
							'	ul>li:first-child {border-bottom-left-radius: 5px;}\n' +
							'	ul>li:last-child {border-bottom-right-radius: 5px;}\n' +
							'</style>',
			toastMask     = '<div class="sq_toast_mask">',
			toastMaskEnd  = '</div>',
			toastStartDiv = '<div class="sq_toast">',
			toastEndDiv   = '</end>',
			ulStart       = '<ul style="width: 100%;">',
			ulEnd         = '</ul>',
			closeLi       = '<li style="width: ' + liWidth + 'px;" onclick="yy.closeToast();">关闭</li>'
		
		var toastTitle = '<div class="sq_toast_title">请选择' + menu.name + '的类型</div>';

		var toast = '';
		if (!yy.hasOpenToast) {
			toast = toastStyle + toastMask + toastStartDiv + toastTitle + ulStart + liContent + closeLi + ulEnd + toastEndDiv + toastMaskEnd;
			yy.hasOpenToast = true; // 改变属性，已经打开过toast
		} else {
			toast = toastMask + toastStartDiv + toastTitle + ulStart + liContent + closeLi + ulEnd + toastEndDiv + toastMaskEnd;
		}
		$('body').append(toast);

	},
	closeToast: function() {
		$('.sq_toast_mask').remove();
	},
	clickToastMenu: function(menuNum, str) {
		if(menuNum == '') {
			// 这里应该弄一个如果im_menu里面没有设置动作的话，提示用户本菜单参数有误
			return;
		} else {
			// @squid 这里应该改为ajax方式进行保存
			js.ajax('agent', 'eating', {'menuNum': menuNum, 'str': str}, function(data){
				yy.closeToast();
				if (data.msg) {
					js.msg('ok', data.msg, 3);
				}
				yy.reload();
			}, 'mode', false, false, 'post');
			// url = 'index.php?a=lum&m=input&d=flow&num=' + this.num + '&show=we&menunum=' + menuNum + '&param=' + str;
			// js.location(url);
		}
	},
	/** @squid end */

	/** @squid 2018年4月2日10:28:21 显示报餐的列表 */
	eatShowData: function(ret) {
		this.overend = true;
		var s='',i,len=ret.rows.length,d,st='',oi;
		$('#showblank').remove();
		$('#notrecord').remove();
		if(typeof(ret.stotal)=='object')this._showstotal(ret.stotal);
		if(ret.page==1){
			this.showobj.html('');
			this.data=[];
		}
		s += '<table id="eating"><thead><tr>' +
			'<th style="width: 20%;"><input type="checkbox" id="selectAll" class="mui-checkbox" onclick="yy.selectAll(this);"/><label for="selectAll">全选</label></th>' +
			'<th style="display: none;">表单id</th>' +
			'<th style="display: none;">表单类型</th>' +
			'<th style="display: none;">表单编号</th>' +
			'<th style="display: none;">用户名</th>' +
			'<th style="display: none;">主表编号</th>' +
			'<th style="display: none;">操作时间</th>' +
			'<th style="display: none;">子表编号</th>' +
			'<th style="width: 50%;">就餐时间</th>' +
			'<th style="width: 15%;">午餐</th>' +
			'<th style="width: 15%;">晚餐</th></tr>' +
			'</thead><tbody>';
		
		var rows = ''; // 这个用来保存遍历得出的列

		for(i=0;i<len;i++){
			d=ret.rows[i];
			
			rows += '<tr onclick="yy.selectThis(this);">';
			rows += '<td><input type="checkbox" id=""  class="mui-checkbox" onclick="event.stopPropagation();" subid="' + d.sub_id + '"/></td>'
			rows += '<td style="display: none;">' + d.bill_id + '</td>';
			rows += '<td style="display: none;">' + d.bill_type + '</td>';
			rows += '<td style="display: none;">' + d.sericnum + '</td>';
			rows += '<td style="display: none;">' + d.user_name + '</td>';
			rows += '<td style="display: none;">' + d.eating_id + '</td>';
			rows += '<td style="display: none;">' + d.optdt + '</td>';
			rows += '<td style="display: none;">' + d.sub_id + '</td>';
			rows += '<td>' + d.eating_date + '&nbsp;(' + d.weekname + ')' + '</td>';
			rows += d.lunch  == '1' ? '<td style="color: green;">是</td>' : '<td style="color: red;">否</td>';
			rows += d.dinner == '1' ? '<td style="color: green;">是</td>' : '<td style="color: red;">否</td>';
			rows += '</tr>';
		}
		s += rows + '</tbody></table>';
		if (ret.page == 1) {
			this.showobj.append(s);
		} else {
			$('#eating').append(rows);
		}
		

		var count=ret.count;
		if(count==0)count=len;
		if(count>0){
			this.nowpage = ret.page;
			s = '<div class="showblank" id="showblank">共'+count+'条记录';
			if(ret.maxpage>1)s+=',当前'+ret.page+'/'+ret.maxpage+'页';
			if(ret.page<ret.maxpage){
				s+=', <a id="showblankss" onclick="yy.regetdata(this,'+(ret.page+1)+')" href="javascript:;">点击加载</a>';
				this.overend = false;
			}
			s+= '</div>';
			this.showobj.append(s);
			if(ret.count==0)$('#showblank').html('');
		}else{
			this.showobj.html('<div class="notrecord" id="notrecord">暂无记录</div>');
		}
		if(this.touchobj)this.touchobj.onupok();
	},
	selectThis: function(node) {
		let checkbox = $(node).find('td>input');
		checkbox.attr('checked') ? checkbox.attr('checked', false) : checkbox.attr('checked', true) ;
	},
	selectAll: function(node) {
		let isChecked = $(node).attr('checked');
		$('#eating>tbody>tr>td:first-child>input').each(function(index, item){
			if (isChecked) {
				$(item).attr('checked', true);
			} else {
				$(item).attr('checked', false);
			}
		});
	},
	/** @squid 2018年4月4日10:44:26 获得已经选择的记录，返回一个id字符串 */
	getSelect: function() {
		let selectId = [];
		$('#eating>tbody>tr>td:first-child>input').each(function(index, item){
			if ($(item).attr('checked')) { // 如果是选择状态，返回的id要算上这一个
				selectId.push($(item).attr('subid'));
			}
		});
		return selectId.join(',');
	}
}