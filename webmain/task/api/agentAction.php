<?php 
class agentClassAction extends apiAction
{
	/**
	*	手机app读取应用
	*/
	public function dataAction()
	{
		$agentarr			= m('reim')->getappagent($this->adminid);
		$arr['agentjson']	= json_encode($agentarr['rows']);
		$this->showreturn($arr);
	}
	
	/**
	*	app上读取数组的
	*/
	public function dataappAction()
	{
		$agentarr			= m('reim')->getappagent($this->adminid);
		$arr['agentarr']	= $agentarr;
		$this->showreturn($arr);
	}
	
	public function getoptnumAction()
	{
		$num  	= $this->post('num');
		$mid  	= (int)$this->post('mid');
		
		$arr 	= m('flow')->opt('getoptmenu', $num, $mid);
		$this->showreturn($arr);
	}
	
	/**
	 * @squid 2018年4月2日14:39:01 报餐类的ajax报餐action
	 */
	public function eatingAction() {
		$sqAction = $this->request('sqAction', 'declare');
		
		switch ($sqAction) {
			case 'cancel':
				$cancelId = $this->request('cancelId', '');
				$type     = $this->request('type');
				$arr = m('flow:eating')->cancelEating($cancelId, $type);
				break;
			default:
				$menuNum = $this->request('menuNum', '');
				$str = $this->request('str', '');
				$arr = m('flow:eating')->declareEating($menuNum, $str);
				break;
		}
		
		if ($arr['success']) {
			$this->showreturn($arr, $arr['msg']);
		} else {
			$this->showreturn($arr, $arr['msg'], 201);
		}
		
		
	}
}