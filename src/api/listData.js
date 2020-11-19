import request from '@/utils/request'

export function getQueryInjuredCase(data) {
  return request({
    url: '/injuredCase/queryInjuredCase',
    method: 'post',
    data
  })
}

// 查询对比度

export function getCaseInfoByCaseId(data) {
  return request({
    url: '/injuredCase/getCaseInfoByCaseId',
    method: 'post',
    data
  })
}

// 修改ai定损
export function getCheckPartInfo(data) {
  return request({
    url: '/injuredCase/getCheckPartInfo',
    method: 'post',
    data
  })
}

// 修改完成
export function modifyCheckPartInfo(data) {
  return request({
    url: '/injuredCase/modifyCheckPartInfo',
    method: 'post',
    data
  })
}

// 暂存:
export function tempSave(data) {
  return request({
    url: '/injuredCase/tempSave',
    method: 'post',
    data
  })
}

// 完成并查看下一条记录
export function finishedNext(data) {
  return request({
    url: '/injuredCase/finishedNext',
    method: 'post',
    data
  })
}
//

// 完成并查看下一条记录
export function PartPriceByType(data) {
  return request({
    url: '/injuredCase/queryPartPriceByType',
    method: 'post',
    data
  })
}

// 获取配件名称
export function getPartNames(data) {
  return request({
    url: '/injuredCase/getPartNames',
    method: 'post',
    data
  })
}

// AI 识别
export function aiImageReco(data) {
  return request({
    url: '/image/reco',
    method: 'post',
    data
  })
}
