<?php
if(!defined('HOST'))die('not access');
//[管理员]在2018-03-22 15:00:35通过[系统→系统工具→系统设置]，保存修改了配置文件
return array(
	'url'	=> 'http://192.168.1.193/newxinhu/',	//系统URL
	'localurl'	=> '',	//本地系统URL，用于服务器上浏览地址
	'title'	=> '信呼协同办公系统',	//系统默认标题
	'apptitle'	=> '信呼OA',	//APP上和手机网页版上的标题
	'db_host'	=> 'localhost',	//数据库地址
	'db_user'	=> 'root',	//数据库用户名
	'db_pass'	=> 'root',	//数据库密码
	'db_base'	=> 'newxinhu',	//数据库名称
	'db_engine'	=> 'MyISAM',
	'perfix'	=> 'xinhu_',	//数据库表名前缀
	'qom'	=> 'xinhu_',	//session、cookie前缀
	'highpass'	=> '',	//超级管理员密码，可用于登录任何帐号
	'db_drive'	=> 'mysqli',	//操作数据库驱动有mysql,mysqli,pdo三种
	'randkey'	=> 'ifunzcavkxmtrbeqdlsgowhpyj',	//系统随机字符串密钥
	'asynkey'	=> 'd3c7542d02a9eb7bc4d9a2a25ac6fd87',	//这是异步任务key
	'openkey'	=> '6ff592ecb0ef221b71f7641da0cb478f',	//对外接口openkey
	'updir'	=> 'upload',
	'sqllog'	=> false,	//是否记录sql日志保存upload/sqllog下
	'asynsend'	=> '0',	//是否异步发送提醒消息，0同步，1自己服务端异步，2官网VIP用户异步
	'install'	=> true,	//已安装，不要去掉啊
	'reimtitle'	=> '',	//REIM即时通信上标题
	'xinhukey'	=> '',	//信呼官网key，用于在线升级使用
	'bcolorxiang'	=> '',	//单据详情页面上默认展示线条的颜色
	'officeyl'	=> '0',	//文档Excel.Doc预览类型,0自己部署插件，1使用官网支持任何平台
	'debug'	=> true,	//为true调试开发模式,false上线模式
	'reim_show'	=> true,	//首页是否显示REIM
	'mobile_show'	=> true,	//首页是否显示手机版

);