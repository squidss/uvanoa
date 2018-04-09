<?php
/**
 *	此文件是流程模块【eating.报餐单】对应控制器接口文件。
 */
class mode_eatingClassAction extends inputAction{
	private $sqFlow = '';
	
	/**
	 *	重写函数：保存前处理，主要用于判断是否可以保存
	 *	$table String 对应表名
	 *	$arr Array 表单参数 // @squid 更新的数据，是组合新旧数据得出的
	 *	$id Int 对应表上记录Id 0添加时，大于0修改时
	 *	$addbo Boolean 是否添加时
	 *	return array('msg'=>'错误提示内容','rows'=> array()) 可返回空字符串，或者数组 rows 是可同时保存到数据库上数组
	 */
	protected function savebefore($table, $arr, $id, $addbo){
		$data = $this->getsubtabledata(0);
		
		/** @squid 先获取用户自己选择的日期 */
		$now = date('Y-m-d');
		$ninePm = strtotime($now) + 60 * 60 * 21;
		$nowTime = time();
		if ($nowTime> $ninePm) {
			$canTomorrow = false;
		} else {
			$canTomorrow = true;
		}
		
		$userDate = [];
		foreach ($data as $item) {
			if ($now >= $item['eatingdate']) { // 如果报餐日期小于今天
				return '报餐日期必须大于今天' . $item['eatingdate'];
			}
			if ($item['lunch'] == '0' && $item['dinner'] == '0') { // 如果日期没有选择午餐和晚餐
				return $item['eatingdate'] . '【午餐】、【晚餐】至少选择一项！';
			}
			if (!$canTomorrow && date("Y-m-d",strtotime("+1 day")) == $item['eatingdate']) { // 如果时间已经大于9点并且明天的日期存在于子表中
				return '已经超过21:00，不能报明天' . $item['eatingdate'] . '的餐';
			}
			$userDate[] = $item['eatingdate']; 
		}
		
		$this->sqFlow = m('flow:eating');
		$dbData = $this->sqFlow->getUserEatingDate($now); // 获得数据库当中今天和比今天晚的报餐信息
		
		$hasLunchOrDinner = $this->sqFlow->checkLunchOrDinner($data, $dbData);
		if (!isempt($hasLunchOrDinner)) return $hasLunchOrDinner;
		
		/** 检查完之后先保存子表的信息，并且将子表已经保存的信息删除，unset($_POST[''])，让之后的保存子表没有该行 */
		$updateDbData = $this->getUpdateData(0, $dbData);
		
		if (!isempt($updateDbData)) { // 如果有需要更新的
			foreach ($updateDbData as &$item) {
				foreach ($dbData as $dbItem) {
					if($dbItem['eating_date'] == $item['eatingdate']) {
						if (!$item['lunch'])   unset($item['lunch']);
						if (!$item['dinner'])  unset($item['dinner']);
						$this->sqFlow->updateSub($item, "`id` = ". $dbItem['sub_id']);
					}
				}
			}
		}
		
		/** squid 2018年4月8日15:29:17 检查是否需要新加单据，如果不用，直接在这里返回一个成功信息，不让他走下面的保存单据流程 */
		$dbDate = [];
		foreach ($dbData as $item) {
			$dbDate[] = $item['eating_date'];
		}
		$diffArr = array_diff($userDate, $dbDate); // 判断是否需要新建单据的差集，如果有差集，则要建一张新的单据
		if (isempt($diffArr)) backmsg('', '新增成功');
		
		return ''; // @squid test
		/** squid end */
		
		if(count($data)==0)return '至少要有一行记录';
		$this->sssaid = '0';
		
		//判断明细行中是否有重复的天数
		/*
		 for ($i=0; $i <count($data) ; $i++) {
		 $ReportDinnerDate = $rs["eatingdate"];
		 for($j=0; $j < count($data); $j++) {
		 if($data[i]["eatingdate"]==$data[j]["eatingdate"]){
		 return '明细行,'.$ReportDinnerDate.'该天不能出现重复的报餐';
		 }
		 }
		 }*/
		
		
		
		foreach($data as $k=>$rs){
			$ReportDinnerDate= $rs["eatingdate"];
			$id -> $rs["id"];
			$ReportDinnerDate = date('Y-m-d',strtotime($ReportDinnerDate));
			$currentDate = date('Y-m-d',time());
			
			$tomorrow = date("Y-m-d",strtotime("+1 day"));
			$house = date( 'H');
			
			//新增校验
			if($id<=0){
				if($tomorrow == $ReportDinnerDate && $house>=21){
					
					return '明细行,报餐失败'.$ReportDinnerDate.':报餐超时，21：00不能报明天饭餐！';
				}
				
				if($ReportDinnerDate<=$currentDate){
					return '明细行,报餐失败'.$ReportDinnerDate.'就餐日期必须大于今天！';
				}
				
				if($rs["lunch"] == 0 && $rs["dinner"] == 0){
					return '明细行,报餐失败'.$ReportDinnerDate.'该天必须报中餐或者晚餐';
				}
				
				//判断明细行中当天的中餐是否已经报餐了
				if($rs["lunch"] == 1){
					$resultRowsCount = m('eatingitem')->rows("`Lunch`=1 and `eatingdate`='".$rs["eatingdate"]."'");
					if($resultRowsCount>0){
						return '明细行,'.$ReportDinnerDate.'该天已报中餐';
					}
				}
				
				//判断明细行中当天的晚餐是否已经报餐了
				if($rs["dinner"] == 1){
					$DinnerCount = m('eatingitem')->rows("`dinner`=1 and `eatingdate`='".$rs["eatingdate"]."'");
					if($DinnerCount>0)
						return '明细行,'.$ReportDinnerDate.'该天已报晚餐';
				}
			}else{
				
			}
			
			$this->sssaid.=','.$rs['aid'].'';
		}
		
	}
	
	/**
	 *	重写函数：保存后处理，主要保存其他表数据
	 *	$table String 对应表名
	 *	$arr Array 表单参数
	 *	$id Int 对应表上记录Id
	 *	$addbo Boolean 是否添加时
	 */
	protected function saveafter($table, $arr, $id, $addbo){
		
	}
	
	///取消报餐
	private function CancelDining(){
		
	}
	
	/**
	 * @squid 2018年4月8日11:19:45 处理子表数据(仿照getsubtabledata的方法)
	 * @param int $xu 子表序号
	 * @return array|number[]
	 */
	private function getUpdateData($xu, $dbEatingData) {
		$dbEatingStr = []; // 生成一个数据库已有报餐日期的字符串
		foreach ($dbEatingData as $item) {
			$dbEatingStr[] = $item['eating_date'];
		}
		$dbEatingStr = implode(',', $dbEatingStr);
		
		$arr 	= array();
		$oi 	= (int)$this->post('sub_totals'.$xu.'');
		if($oi<=0)return $arr;
		$modeid		= 78; // 定义的eating模块id，flow_set里面可以查看
		$iszb		= $xu+1;
		$farr		= m('flow_element')->getrows("`mid`='$modeid' and `islu`=1 and `iszb`=$iszb",'`name`,`fields`,`isbt`,`savewhere`,`dev`','`sort`');
		
		$needToHandleI = []; // 将需要处理的i序号放到数组里
		for($i=0; $i<$oi; $i++){
			foreach($farr as $k=>$rs){
				$fid= $rs['fields'];
				$na = ''.$fid.''.$xu.'_'.$i.'';
				$val= $this->post($na);
				$uaarr[$fid] = $val;
				if ($fid == 'eatingdate' && $uaarr[$fid] && strpos($dbEatingStr, $uaarr[$fid]) !== false) { // 如果该日期存在于用户已报餐日期中，那么应该对本日期的报餐先进行处理
					$needToHandleI[] = $i;
				}
			}
		}
		
		$updateArr = $tempArr = [];
		foreach ($needToHandleI as $iItem) {
			foreach ($farr as $item) {
				$fid = $item['fields'];
				$sid = 'sid'.$xu.'_'.$iItem.'';
				$na  = ''.$fid.''.$xu.'_'.$iItem.'';
				$tempArr[$fid] = $this->post($na);
				unset($_POST[$na], $_POST[$sid]);
			}
			if (!isempt($tempArr)) $updateArr[] = $tempArr;
		}
		return $updateArr;
	}
}
