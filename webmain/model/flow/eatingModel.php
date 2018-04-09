<?php
/**
 * 2018年3月25日17:09:29
 * squid 新增一个模型类用于测试操作菜单的
 * @author Administrator
 *
 */
class flow_eatingClassModel extends flowModel
{
	/**
	 * 模型里面$this->id是指本模型的主键，打开已有记录便会有该id，如果新建为0
	 */
	
    protected function flowoptmenu($ors, $crs){
        $num = $ors['num'];
        $odata = m('eating')->getone('`id` = ' . "'$this->id'");
        var_dump($odata);
        
        switch ($num) {
            case 'complete_eat':
                // 这里可以做一点数据库的增删改查操作
                // var_dump($this->rs);
                if ($odata['status'] !== 1) {
                    $this->update(['status' => 1], $this->id);
                } else {
                    return '状态已完成';
                }
                break;
        }
        
    }
    
    /**
     * 复写方法
     * {@inheritDoc}
     * @see flowModel::flowbillwhere()
     */
    protected function flowbillwhere($uid, $lx)
    {
    	$table = '';
    	$month	= $this->rock->post('month');
    	$where 	= '';
    	if($month!=''){
    		$where.=" and `stime` like '$month%'";
    	}
    	
    	return array(
    			'where' => $where
    	);
    }
    
    // 判断是否有权限查看模块，如果有需要就在这里实现方法
//     protected function flowisreadqx() {
//         $result = isAdmin($this->adminid);
//         var_dump($result);
//     }

    /**
     * @squid 2018年4月2日15:03:52 移动端报餐的动作
     * @param string $menuNum 操作的动作，例如next_week，就是操作下星期的
     * @param string $str 操作的条件，例如lunch，就是下星期的lunch
     * @return array
     */
    public function declareEating($menuNum, $str) {
    	$now = date('Y-m-d');
    	$strName = $str == 'lunch' ? '午餐' : ($str == 'dinner' ? '晚餐' : '全天');
    	
    	$subTableDate = array();
    	switch ($menuNum) {
    		case 'next_week':
    			$msgTip = '下周';
    			$week = $this->getWeek(time() + 60*60*24*7, 'Y-m-d', false); // 下一周的话需要加上7天的时间
    			break;
    		case 'current_week':
    			$msgTip = '本周';
    			$week = $this->getWeek(time(), 'Y-m-d', false); // 本周
    			break;
    		case 'tomorrow':
    			$msgTip = '明天';
    			$week[] = date("Y-m-d", strtotime("+1 day")); // 明天的日期
    			break;
    	}
    	
    	if ($menuNum == 'current_week' && $now == end($week)) { // 判断今天是否为本周最后一天
    		return ['success' => true, 'msg' => '今天已是本周最后一天，不能再报本周！'];
    	} 
    	
    	$dateArr = $this->getUserEatingDate($now, $menuNum); // 获得原有的报餐日期
    	$dbDate  = array(); // 数据库原有用户的报餐日期
    	foreach ($dateArr as $item) { // 去除重复的日期
    		if(!in_array($item['eating_date'], $dbDate)) {
    			$dbDate[] = $item['eating_date'];
    		}
    	}
    	// subTableDate 是应该新增的子表数据
    	$subTableDate = array_diff($week, $dbDate); // 获得将要写入数据库日期和数据库日期的差集，因为数据库已有的只需要更新，差集则需要插入
    	
    	// @squid 2018年4月8日16:16:36 如果类型是明天的话，并且dbDate已经有明天，则提示用户明天已经报餐
    	if (isempt($subTableDate) && $menuNum == 'tomorrow') {
    		$tomorrowEat = count($dateArr) > 1 ? $dateArr[1] : $dateArr[0];
    		if (($str == 'lunch' && $tomorrowEat['lunch'] == 1) || ($str == 'dinner' && $tomorrowEat['dinner'] == 1) || ($str == 'all' && $tomorrowEat['lunch'] == 1 && $tomorrowEat['dinner'] == 1)) {
    			return ['success' => true, 'msg' => '明天' . $strName . '已经报餐，不能重复报！'];
    		}
    	}
    	
    	// 判断是否大于今天21:00，如果是的话，不能报明天的餐
    	$nowTime = time();
    	$todayNine = strtotime($now) + (60 * 60 * 21);
    	$canTomorrow = ($nowTime < $todayNine) ? true : false; // 是否可以报明天的餐
    	if (!$canTomorrow) { // 如果明天不能报，unset明天的
    		unset($subTableDate[1]);
    	}
    	foreach ($subTableDate as $dateK => $dateV) {
    		if (strtotime($dateV) < $nowTime) { // 不含当天
    			unset($subTableDate[$dateK]);
    		}
    	}
    	
    	$updateSubId  = array();
    	foreach ($week as $k => $v) {
    		foreach ($dateArr as $subK => $subV) {
    			if ($v == $subV['eating_date']) {
    				$updateSubId[] = $subV['sub_id'];
    			}
    		}
    	}
    	$updateSubId = implode(',', $updateSubId);
    	
    	switch ($str) { // 设置更新午餐晚餐的详情
    		case 'lunch':
    			$subTableArr = [ // 子表应该保存的字段
		    			'lunch'  => 1
    			];
    			break;
    		case 'dinner':
    			$subTableArr = [ // 子表应该保存的字段
		    			'dinner' => 1
    			];
    			break;
    		default:
    			$subTableArr = [ // 子表应该保存的字段
	    			'lunch'  => 1,
	    			'dinner' => 1
    			];
    			break;
    	}
    	
    	if (!isempt($subTableDate)) { // 如果有子表新增数组的话，新增主表，并附上子表
    		$saveArr = [
    				'uid'          => $this->adminid,
    				'optdt'        => date('Y-m-d H:i:s', $nowTime),
    				'optid'        => $this->adminid,
    				'optname'      => $this->adminname,
    				'applydt'      => $now,
    				'bill_type'    => '标准报餐单',
    				'bill_no'      => $this->getBillNo(),
    				'trustee_name' => $this->adminname
    		];
    		$success = $this->insert($saveArr);
    		if (!$success) return ['success' => false, 'msg' => $this->db->error()]; // 如果新增记录失败，直接返回
    		
    		foreach ($subTableDate as $index => $subItem) {
    			$subTableArr['mid'] = $success;
    			$subTableArr['eatingdate'] = $subItem;
    			$subTableArr['sort'] = $index;
    			$this->sqRecord('xinhu_eatingitem', $subTableArr);
    		}
    		
    		$this->initdata('eating', $success); 
	    	$this->loaddata($success, false); // 新增单据，bill
	    	$this->submit('提交'); // 这个可以保存单据的操作记录
// 	    	return ['success' => true, 'msg' => '您' . $msgTip . '已经成功报餐'];
    	} else { // 更新子表数据
    		// @squid 2018年4月3日17:10:57  这里应该加入更新子表lunch和dinner字段的逻辑
    		if ($updateSubId) {
    			$where = 'id IN (' . $updateSubId .')';
    			$this->sqRecord('xinhu_eatingitem', $subTableArr, $where);
    			
    			$eatingId = $this->sqGetAll($where . ' GROUP BY `mid` ', 'xinhu_eatingitem', 'mid'); // 获得子表对应的主表id
    			foreach ($eatingId as $idItem) {
    				$this->initdata('eating', $idItem['mid']);
    				$this->loaddata($idItem['mid'], false);
    				$this->submit('提交'); // 这个可以保存单据的操作记录
    			}
    		}
    		$this->submit('修改');
    		// return ['success' => true, 'msg' => '您' . $msgTip . '已经报餐，不需重复报'];
    	}
   		return ['success' => true, 'msg' => '您' . $msgTip . '已经成功报餐'];
    	
    	// 具体操作，先生成eating的主表数据，然后根据生成id再loaddata（在model/flow/flow.php)
    	// 要使用flow里面的多数方法，得先初始化表单flow
    	// 下面的initdata是在flow.php里面的父类继承而来，如果需要自己添加bill，需要把增加的insert_id传进去，下面的21是个例子而已
    	// $this->initdata('eating', 21); // 要使用flow里面的多数方法，得先初始化表单flow
    	// $this->savebill(); 
    	
//     	return ['success' => true, 'msg' => 'ojbk'];
//     	return ['success' => true, 'msg' => '', 'dateArr' => $dateArr, 'week' => $week, 'updateSubId' => $updateSubId, 'subTableDate' => $subTableDate, 'dbDate' => $dbDate];
//     	return ['menuNum' => $menuNum, 'str' => $str, 'now' => $now, 'eating_date' => $dateArr, 'week' => $week];
    }
    
    /**
     * @squid 2018年4月4日10:49:57 根据id跟新子表报餐的情况
     * @param unknown $cancleId
     */
    public function cancelEating($cancleId, $type) {
    	$typeStr = ($type == 'lunch' ? '午餐' : ($type == 'dinner' ? '晚餐' : '全天'));
    	
    	$where = "id IN ($cancleId)";
    	
    	// @squid 2018年4月9日09:05:11 判断是否为取消报餐日期的前一天21:00
    	$leastDay = $this->sqGetAll($where, 'xinhu_eatingitem', 'eatingdate', 'eatingdate ASC', '1'); // 这个是一个数组，然后取得第一行的数据
    	$yesterdayNinePm = strtotime($leastDay[0]['eatingdate']) - 60 * 60 * 3; // 减少3个小时，当天
    	if (time() > $yesterdayNinePm) return ['success' => false, 'msg' => '已经超过21:00，不能取消明天的报餐！'];
    	
    	switch ($type) {
    		case 'lunch':
    			$updateColumns = [
    					'lunch' => 0
    			];
    			break;
    		case 'dinner':
    			$updateColumns = [
    					'dinner' => 0
    			];
    			break;
    		default:
    			$updateColumns = [
		    			'lunch'  => 0,
		    			'dinner' => 0,
    			];
    			break;
    	}
    	
    	$table = 'xinhu_eatingitem';
    	$success = $this->sqRecord($table, $updateColumns, $where);
    	if ($success) {
    		return ['success' => true, 'msg' => '您已经取消了你选取日期的' . $typeStr . '报餐'];
    	} else {
    		return ['success' => false, 'msg' => $this->db->error()];
    	}
    }
    
    /**
     * @squid 2018年4月2日16:17:17 获得周日期
     * @param unknown $time 时间戳
     * @param string $format 格式
     * @return array
     */
    private function getWeek($time, $format = 'Y-m-d', $returnName = true) {
    	$week = date('w',$time);
    	$weekname=array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
    	// $weekname=array('星期一','星期二','星期三','星期四','星期五','星期六','星期日');
    	//星期日排到末位 // squid 星期日排到首位
    	if(empty($week)){
    		// $week=7;
    		$week = 7;
    	}
    	if ($returnName) {
    		for ($i=0;$i<=6;$i++){
    			$data[$i]['date'] = date($format,strtotime( '+'. $i-$week .' days',$time)); // $i+1为星期1开始，如果$i不加1，直接为星期日开始
    			$data[$i]['week'] = $weekname[$i];
    		}
    	} else {
    		for ($i=0;$i<=6;$i++){
    			$data[] = date($format,strtotime( '+'. $i-$week .' days',$time));
    		}
    	}
    	
    	return $data;
    }
    
    /**
     * @squid 2018年4月3日09:40:00 获得当前用户的所有报餐日期(子表eatingdate)
     * @param date $now 日期，格式为2018-04-04
     * @param string $menuNum 类型
     */
    public function getUserEatingDate($now, $menuNum = '') {
    	switch ($menuNum) {
    		case 'next_week':
    			$maxDate = date("Y-m-d", (time() + (14 - (date('w') == 0 ? 7 : date('w'))) * 24 * 3600)); // 下周日
    			break;
    		case 'current_week':
    			$maxDate = date('Y-m-d', (time() + (7 - (date('w') == 0 ? 7 : date('w'))) * 24 * 3600)); // 本周周日
    			break;
    		case 'tomorrow':
    			$maxDate = date("Y-m-d", strtotime(" +1 day")); // 明天
    			break;
    		default:
    			break;
    	}
    	$table = "`xinhu_flow_bill` a LEFT JOIN `xinhu_eating` b ON a.mid = b.id LEFT JOIN `xinhu_eatingitem` c ON b.id = c.mid";;
    	// 下面的modeid 写死了，如果到时模块的id变更，这里要注意返回
    	if ($menuNum !== '') {
    		$where = 'b.optid = ' . $this->adminid . ' AND a.modeid = 78 AND c.eatingdate >= \'' . $now . '\' AND c.eatingdate <= \'' . $maxDate . '\'';
    	} else {
    		$where = 'b.optid = ' . $this->adminid . ' AND a.modeid = 78 AND c.eatingdate >= \'' . $now . '\'';
    	}
    	$field = "c.id AS sub_id, c.eatingdate AS eating_date, c.lunch AS lunch, c.dinner AS dinner";
    	$order = 'c.eatingdate';
    	return $this->sqGetAll($where, $table, $field, $order);
    }
    
    /**
     * @squid 2018年4月8日09:48:04 检查用户的报餐是否和数据库的报餐有重复
     * @param array $userData
     * @param array $dbData
     */
    public function checkLunchOrDinner($userData, $dbData) {
    	foreach ($userData as $userKey => $userValue) {
    		foreach ($dbData as $dbKey => $dbValue) {
    			if ($userValue['eatingdate'] == $dbValue['eating_date']) {
    				if ($userValue['lunch'] == $dbValue['lunch'] && $userValue['lunch'] == 1) { // 判断是否和数据库记录一样并且为1
    					return $userValue['eatingdate'] . '已报午餐！'; 
    				} else if ($userValue['dinner'] == $dbValue['dinner'] && $userValue['dinner'] == 1) {
    					return $userValue['eatingdate'] . '已报晚餐！';
    				}
    			}
    		}
    	}
    }
    
    /**
     * @squid 2018年4月8日14:22:51 处理子表的更新问题
     * @param unknown $arr 保存的数组
     * @param unknown $where 条件
     * @return unknown
     */
    public function updateSub($arr, $where) {
    	$table = 'xinhu_eatingitem';
    	return $this->sqRecord($table, $arr, $where);
    }
    
    /**
     * @squid 2018年4月3日10:03:22 获得一个新的bill_no
     * @return string
     */
    private function getBillNo() {
    	$row = $this->getone('1 = 1', 'bill_no', 'id DESC');
    	if ($row) {
    		$tempArr = explode('-', $row['bill_no']);
    		$no = (string)((int)$tempArr[1] + 1);
    		if(strlen($no) < 3) {
    			$prev = '';
    			for ($i = 0; $i < 3-strlen($no); $i++){
    				$prev .= '0';
    			}
    		}
    		return $tempArr[0] . '-' . $prev . $no;
    	} else {
    		return 'eating-001';
    	}
    }
    
}
