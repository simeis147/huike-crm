export const whiteList = [
  {
    id: 1,
    name: '线索管理-伪线索',
    url: '/clues/clue/false',
    method: 'put',
    isReg: true
  },
  {
    id: 2,
    name: '线索管理-转商机',
    url: '/clues/clue/changeBusiness',
    method: 'put',
    isReg: true
  },
  {
    id: 3,
    name: '线索池-捞取',
    url: '/clues/clue/gain',
    method: 'put',
    isReg: false
  },
  {
    id: 4,
    name: '商机管理-退回公海',
    url: '/business/back',
    method: 'put',
    isReg: true
  },
  {
    id: 5,
    name: '商机管理-转交成客户',
    url: '/contract/changeContract',
    method: 'put',
    isReg: true
  },
  {
    id: 6,
    name: '线索管理-分配',
    url: '/clues/clue/assignment',
    method: 'put',
    isReg: false
  },
  {
    id: 7,
    name: '商机管理-分配',
    url: '/business/assignment',
    method: 'put',
    isReg: false
  },
  {
    id: 8,
    name: '转派管理-处理',
    url: '/transfer/assignment',
    method: 'put',
    isReg: true
  },
  {
    id: 9,
    name: '活动管理-通过',
    url: '/clues/activity/pass',
    method: 'put',
    isReg: true
  },
  {
    id: 10,
    name: '活动管理-驳回',
    url: '/clues/activity/reject',
    method: 'put',
    isReg: true
  }
]