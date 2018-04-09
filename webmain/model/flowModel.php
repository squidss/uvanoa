<?php
class flowClassModel extends Model
{
	public $flow = null;
    
	/**
	 * 2018年3月25日09:46:48 @squid
	 * 用于生成$this->flow是那个模型类，"flow:'模型名'"这种方式的话，如果后面的模型不存在于目录webmain/model/flow/'模型名'Model.php的话，flow为flowModel.php里面的模型
	 * @param unknown $num 模型名
	 * @param unknown $mid 该表单在模块下面的id，例如eating的话，这是主键id
	 * @param boolean $isqx
	 * @return NULL|sModel|unknown
	 */
	public function initflow($num,$mid=null, $isqx=true)
	{
		$this->flow = m('flow:'.$num.'');
		$this->flow->initdata($num);
		if($mid != null)$this->flow->loaddata($mid, $isqx);
		return $this->flow;
	}
	
	
	public function opt($act,$num,$mid,$cs1='',$cs2='',$cs3='',$cs4='')
	{
		$this->initflow($num, $mid);
		return $this->flow->$act($cs1, $cs2, $cs3, $cs4);
	}
	
	public function getdatalog($num, $mid, $lx)
	{
		return $this->opt('getdatalog', $num, $mid, $lx);
	}
	
	public function submit($num, $mid, $na='', $sm='')
	{
		$this->initflow($num,$mid, false);
		return $this->flow->submit($na, $sm);
	}
	
	public function deletebill($num, $mid, $sm='', $dlqx=true)
	{
		$this->initflow($num,$mid, false);
		return $this->flow->deletebill($sm, $dlqx);
	}
	
	public function zuofeibill($num, $mid, $sm='')
	{
		$this->initflow($num,$mid, false);
		return $this->flow->zuofeibill($sm);
	}
	
	public function getoptmenu($num, $mid, $lx=0)
	{
		$this->initflow($num,$mid, false);
		return $this->flow->getoptmenu($lx);
	}
	
	public function optmenu($num, $mid, $optid, $zt, $sm)
	{
		$this->initflow($num,$mid, false);
		return $this->flow->optmenu($optid, $zt, $sm);
	}
	
	public function getdataedit($num, $mid)
	{
		return $this->opt('getdataedit', $num, $mid);
	}
	
	public function addlog($num, $mid,$na,$barr=array())
	{
		$darr = array(
			'name' 			=> $na
		);
		foreach($barr as $k=>$v)$darr[$k]=$v;
		return $this->opt('addlog', $num, $mid, $darr);
	}
	
	public function printexecl($num, $event)
	{
		return $this->opt('printexecl', $num, null, $event);
	}
	
	public function repipei($whe='')
	{
		$srows 	= $this->db->getrows('[Q]flow_set','status=1 and isflow=1 '.$whe.'','`num`,`name`,`table`,id,`where`','sort');
		$str 	= '';
		$dbs 	= m('flow_bill');
		foreach($srows as $k=>$rs){
			$where = $rs['where'];
			if(!isempt($where)){
				$where = $this->rock->covexec($where);
				$where = "and $where";
			}
			$flow = $this->initflow($rs['num']);
			$rows = $this->db->getrows('[Q]'.$rs['table'].'','status not in(1,5) and isturn=1 '.$where.'');
			$hshu = 0;
			$yics = 0;
			foreach($rows as $k1=>$rs1){
				$flow->loaddata($rs1['id'], false);
				$bar 	= $flow->getflow(true);
				$hshu+=$this->db->row_count();
				if(isempt($bar['nowcheckid']))$yics++;
			}
			if($hshu>0)$str.=''.$rs['name'].'匹配('.$hshu.')条;';
			if($yics>0)$str.=''.$rs['name'].'<font color=red>('.$yics.')条没审核人</font>;';
		}
		if($str=='')$str = '无从新匹配记录';
		
		$rows	= $this->db->getall("select a.`id`,b.`name`,b.`deptname` from `[Q]flow_bill` a left join `[Q]admin` b on a.`uid`=b.`id` where b.`id` is not null and (ifnull(a.uname,'')='' or ifnull(a.udeptname,'')='')");
		foreach($rows as $k=>$rs){
			$dbs->update(array(
				'uname' => $rs['name'],
				'udeptname' => $rs['deptname'],
			), $rs['id']);
		}
		$dbs->update('`isturn`=1','`status`=1');
		return $str;
	}
}