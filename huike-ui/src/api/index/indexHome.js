// 首页相关接口
import request from '@/utils/request'

export function indexBase (params) {
  return request({
    url: '/index/getBaseInfo',
    method: 'get',
    params: { ...params }
  })
}

// 今日简报
export function getTodayInfo () {
  return request({
    url: '/index/getTodayInfo',
    method: 'get'
  })
}

// 获取待办数据
export function getTodoInfo (params) {
  return request({
    url: '/index/getTodoInfo',
    method: 'get',
    params: { ...params }
  })
}


// 商机转换龙虎榜
export function getBusinessChangeStatistics (params) {
  return request({
    url: '/index/businessChangeStatistics',
    method: 'get',
    params: { ...params }
  })
}

// 销售龙虎榜
export function getSalesStatistic (params) {
  return request({
    url: '/index/salesStatistic',
    method: 'get',
    params: { ...params }
  })
}

// 漏斗图数据
export function reportGetVulnerabilityMapChart (params) {
  return request({
    url: `/report/getVulnerabilityMap/${params.beginCreateTime}/${params.endCreateTime}`,
    method: 'get'
  })
}