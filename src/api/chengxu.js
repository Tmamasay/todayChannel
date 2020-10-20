import request from '@/utils/request'

// T+===========T+新版本（不能删除）============》
// 上传
export function fileUpload(data) {
  return request({
    url: '/file/fileUpload',
    method: 'post',
    data
  })
}
// ===============================

// 根据系统代码查询该系统所有菜单
export function getSysMenus(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/getSysMenus',
    method: 'post',
    data
  })
}
// 网站table统计
export function getTable(data) {
  return request({
    url: '/th-manager-biz/auth-login/getTable',
    method: 'post',
    data
  })
}
// 当日真实IP统计
export function getRealIP(data) {
  return request({
    url: '/th-manager-biz/auth-login/getRealIP',
    method: 'post',
    data
  })
}

// 当日真实IP分页
export function getRealIpPage(data) {
  return request({
    url: '/th-manager-biz/auth-login/getRealIpPage',
    method: 'post',
    data
  })
}
// 私有化信息分页
export function selectCustomerPage(data) {
  return request({
    url: '/th-manager-biz/private-product/selectCustomerPage',
    method: 'post',
    data
  })
}
// 订单分页列表
export function selectOrder(data) {
  return request({
    url: '/th-manager-biz/orderManager/selectOrder',
    method: 'post',
    data
  })
}
// 去收款接口
export function orderCollection(data) {
  return request({
    url: '/th-manager-biz/orderManager/orderCollection',
    method: 'post',
    data
  })
}
// 订单详情
export function getOrderOne(data) {
  return request({
    url: '/th-manager-biz/orderManager/getOrderOne',
    method: 'post',
    data
  })
}
// 企业角色管理分页
export function selectRolePage(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/selectRolePage',
    method: 'post',
    data
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/addRole',
    method: 'post',
    data
  })
}
// 更新角色
export function updateRole(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/updateRole',
    method: 'post',
    data
  })
}
// 删除角色
export function delRole(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/delRole',
    method: 'post',
    data
  })
}
// 会员管理列表
export function getUsersPage(data) {
  return request({
    url: '/th-manager-biz/userManager/getUsersPage',
    method: 'post',
    data
  })
}

// 通过customer_id查询实名信息
export function getCompanyByCustomerId(data) {
  return request({
    url: '/th-manager-biz/userManager/getCompanyByCustomerId',
    method: 'post',
    data
  })
}
// 资讯管理分页
export function selectPageNotice(data) {
  return request({
    url: '/th-manager-biz/private-product/selectPageNotice',
    method: 'post',
    data
  })
}

// 新增资讯
export function addNotice(data) {
  return request({
    url: '/th-manager-biz/private-product/addNotice',
    method: 'post',
    data
  })
}
// 修改资讯
export function updateNotice(data) {
  return request({
    url: '/th-manager-biz/private-product/updateNotice',
    method: 'post',
    data
  })
}
// 删除资讯
export function delNotice(data) {
  return request({
    url: '/th-manager-biz/private-product/delNotice',
    method: 'post',
    data
  })
}
// 全部管理员分页
export function selectUserManagerList(data) {
  return request({
    url: '/th-manager-biz/login/selectUserManagerList',
    method: 'post',
    data
  })
}
// 修改管理员
export function updateUserManager(data) {
  return request({
    url: '/th-manager-biz/login/updateUserManager',
    method: 'post',
    data
  })
}
// 删除管理员
export function deleteUserManager(data) {
  return request({
    url: '/th-manager-biz/login/deleteUserManager',
    method: 'post',
    data
  })
}
// 全部角色下拉列表
export function selectRoleList(data) {
  return request({
    url: '/th-manager-biz/rolePowerManager/selectRoleList',
    method: 'post',
    data
  })
}

// 新增管理员
export function addUserManager(data) {
  return request({
    url: '/th-manager-biz/login/addUserManager',
    method: 'post',
    data
  })
}

// 审核实名信息
export function updateCompanyStatus(data) {
  return request({
    url: '/th-manager-biz/userManager/updateCompanyStatus',
    method: 'post',
    data
  })
}
// 话单总览
export function selectAllCallLogPage(data) {
  return request({
    url: '/kl-call-boss-biz/call-out/selectAllCallLogPage',
    method: 'post',
    data
  })
}
// 忘记密码-验证账号，发送验证码
export function forgetToSend(data) {
  return request({
    url: '/kl-customer-biz/password/forgetToSend',
    method: 'post',
    data
  })
}
// 忘记密码-校验验证码，随机重置
export function forgetToUpdate(data) {
  return request({
    url: '/kl-customer-biz/password/forgetToUpdate',
    method: 'post',
    data
  })
}
export function selectLogAnalysis(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/selectLogAnalysis',
    method: 'post',
    data
  })
}
