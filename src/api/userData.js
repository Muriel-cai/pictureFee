import request from '@/utils/request'

// 获取用户信息
export function sysUserList(data) {
  return request({
    url: 'sysUser/list',
    method: 'post',
    data
  })
}
// 获取用户信息
export function sysUserAdd(data) {
  return request({
    url: 'sysUser/add',
    method: 'post',
    data
  })
}

