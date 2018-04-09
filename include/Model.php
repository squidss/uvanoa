<?php 
/**
	*****************************************************************
	* 联系QQ： 290802026											*
	* 版  本： V2.0													*
	* 开发者：雨中磐石工作室										*
	* 邮  箱： admin@rockoa.com										*
	* 网  址： http://www.rockoa.com/								*
	* 说  明: 数据模型												*
	* 备  注: 未经允许不得商业出售，代码欢迎参考纠正				*
	*****************************************************************
*/

abstract class Model{
	
	public 	$perfix		= PREFIX;
	public	$rock;
	public 	$db;
	public  $table;
	public 	$adminname;
	public 	$adminid;
	
	public function __construct($table='')
	{
		$this->rock			= $GLOBALS['rock'];
		$this->db			= $GLOBALS['db'];
		$this->adminid		= $this->rock->adminid;
		$this->adminname	= $this->rock->adminname;
		$this->settable($table);
		$this->initModel();
	}
	
	public function settable($table, $qzbo=true)
	{
		$this->table	= ''.$this->perfix.''.$table.'';
		if(!$qzbo)$this->table = $table;
	}
	
	public function initModel(){}
	

	public function getmou($fields, $where, $order='')
	{
		return $this->db->getmou($this->table, $fields, $where, $order);
	}

	public function getone($where, $fields='*', $order='')
	{
		return $this->db->getone($this->table, $where, $fields, $order);
	}
	
	public function getrows($where, $fields='*', $order='', $limit='')
	{
		return $this->db->getrows($this->table, $where, $fields, $order, $limit);
	}
	
	public function getall($where, $fields='*', $order='', $limit='')
	{
		$sql	= $this->db->getsql(array(
			'fields'	=> $fields,
			'table'		=> $this->table,
			'where'		=> $where,
			'order'		=> $order,
			'limit'		=> $limit
		));
		return $this->db->getall($sql);
	}
	
	/**
	 * @squid 2018年4月3日09:05:48 另外写的查询数据库getall
	 * @param string $where 条件
	 * @param string $table 表，多表查询的话需要写好 left join 等链接
	 * @param string $fields 返回的字段
	 * @param string $order 排序条件
	 * @param string $limit limit
	 */
	public function sqGetAll($where, $table, $fields = '*', $order = '', $limit = '')
	{
		$sql	= $this->db->getsql(array(
				'fields'	=> $fields,
				'table'		=> $table,
				'where'		=> $where,
				'order'		=> $order,
				'limit'		=> $limit
		));
		return $this->db->getall($sql);
	}
	
	public function getarr($where, $fields='*', $kfied='id')
	{
		return $this->db->getarr($this->table, $where, $fields, $kfied);
	}
	public function rows($where)
	{
		return $this->db->rows($this->table, $where);
	}

	public function query($where, $fields='*', $order='', $limit='')
	{
		$sql	= $this->db->getsql(array(
			'fields'	=> $fields,
			'table'		=> $this->table,
			'where'		=> $where,
			'order'		=> $order,
			'limit'		=> $limit
		));
		return $this->db->query($sql);
	}
	
	public function record($arr, $where='')
	{
		return $this->db->record($this->table, $arr, $where);
	}
	
	/**
	 * @squid 2018年4月3日11:37:11 新增的insert方法，可以自定义表
	 * @param unknown $table 指定表
	 * @param unknown $arr
	 * @param string $where
	 * @return unknown
	 */
	public function sqRecord($table, $arr, $where = '') {
		return $this->db->record($table, $arr, $where);
	}
	
	public function update($arr,$where)
	{
		return $this->record($arr, $where);
	}
	
	public function insert($arr)
	{
		$nid = 0;
		if($this->record($arr, ''))$nid = $this->db->insert_id();
		return $nid;
	}
	
	/**
	 * @squid 2018年4月3日11:39:05 对应上面的sqRecode方法
	 * @param unknown $table
	 * @param unknown $arr
	 * @return number
	 */
	public function sqInsert($table, $arr) {
		$nid = 0;
		if($this->sqRecord($table, $arr, ''))$nid = $this->db->insert_id();
		return $nid;
	}
	
	public function getwhere($where='')
	{
		return $this->db->getwhere($where);
	}
	
	public function getfields()
	{
		return $this->db->getallfields($this->table);
	}
	
	public function delete($where)
	{
		return  $this->db->delete($this->table, $where);
	}
	
	public function getlimit($where, $page=1, $fields='*', $order='', $limit=20, $table='')
	{
		if($order != '')$order = 'order by '.$order.'';
		$where  	= $this->getwhere($where);
		if($table == '')$table = $this->table;
		$sql 		= "select $fields from $table where $where $order ";
		$count 		= $this->db->rows($table, $where);
		if($page <= 0)$page=1;
		$sql	.= "limit ".($page-1)*$limit.",$limit";
		$rows	 = $this->db->getall($sql);
		$maxpage = ceil($count/$limit);
		return array(
			'rows'		=> $rows,
			'count'		=> $count,
			'maxpage'  	=> $maxpage,
			'page'		=> $page,
			'limit'		=> $limit,
			'prevpage'	=> $page-1,
			'nextpage'	=> $page+1,
			'url'		=> ''
		);
	}
	
	public function isempt($str)
	{
		return $this->rock->isempt($str);
	}
	
	public function contain($str, $s1)
	{
		return $this->rock->contain($str, $s1);
	}
	
	public function getLastSql()
	{
		return $this->db->getLastSql();
	}
}

class sModel extends Model{}