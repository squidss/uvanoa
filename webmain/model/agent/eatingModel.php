<?php
/**
	@squid 2018年4月2日9:23:28 报餐的移动端代理
*/
class agent_eatingClassModel extends agentModel
{
	/* 
	 * lx 是前端的event参数，用|分开
	 */
	protected function agentdata($uid, $lx){
		$table  = "`xinhu_flow_bill` a LEFT JOIN `xinhu_eating` b ON a.mid = b.id LEFT JOIN `xinhu_eatingitem` c ON b.id = c.mid";
		$where  = "a.modeid = 78 AND a.uid = $uid AND (c.lunch = 1 OR c.dinner = 1)"; // 只显示当前用户，并且中餐和晚餐不为0的
		$fields = "a.id AS bill_id, a.sericnum AS sericnum, a.uname AS user_name, a.optdt AS optdt, b.id AS eating_id, b.bill_type AS bill_type, c.id AS sub_id, c.eatingdate AS eating_date, c.lunch AS lunch, c.dinner AS dinner";
		$order = "eatingdate ASC";
		$rows = $this->getlimit($where, $this->page, $fields, $order, $limit = 20, $table);
		
		// $weekname = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		$weekname = ['日', '一', '二', '三', '四', '五', '六'];
		foreach ($rows['rows'] as $key => $value) {
			$weeknameIndex = date('w', strtotime($value['eating_date']));
			$rows['rows'][$key]['weekname'] = $weekname[$weeknameIndex];
		}
		
		// $sql = "SELECT $fields FROM $table WHERE $where";
		// $rows = $this->db->getall($sql);
// 		echo $sql;
// 		if ($this->db) {
// 			var_dump($this->db);
// 		} else {
// 			echo '没有flow';
// 		}
		
		return $rows;
	}

}