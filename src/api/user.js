
import request from '@/utils/request'

// =========渠道商=================》
// 用户登录
export function userLogin(data) {
  return request({
    url: '/store/login',
    method: 'post',
    data
  })
}
// 查询当前登录用户的菜单
export function getMyMenus(data) {
  return request({
    url: '/store/menu/tree',
    method: 'post',
    data
  })
}
// 优惠卷管理
// 展示店铺优惠券的所有分类
export function selectVoucherTypes(data) {
  return request({
    url: '/store/storeVoucherManager/selectVoucherTypes',
    method: 'post',
    data
  })
}
// 设置店铺的营业时间
export function setStoreBusinessTime(data) {
  return request({
    url: '/store/storeSwitchManager/setStoreBusinessTime',
    method: 'post',
    data
  })
}
// 设置店铺是否打单
export function setStorePrint(data) {
  return request({
    url: '/store/storeSwitchManager/setStorePrint',
    method: 'post',
    data
  })
}
// 设置店铺是否打单
export function setStoreService(data) {
  return request({
    url: '/store/storeSwitchManager/setStoreService',
    method: 'post',
    data
  })
}
// 设置店铺的起步价
export function setStoreStartPrice(data) {
  return request({
    url: '/store/storeSwitchManager/setStoreStartPrice',
    method: 'post',
    data
  })
}
// 查询自己商店下的所有设置
export function getMySwitch(data) {
  return request({
    url: '/store/storeSwitchManager/getMySwitch',
    method: 'post',
    data
  })
}
// 展示店铺优惠券的所有分类
export function userSelectVoucherTypes(data) {
  return request({
    url: '/store/userVoucherManager/selectVoucherTypes',
    method: 'post',
    data
  })
}
// 单查渠道商满减优惠券(满减)
export function getManjianVoucherByStoreOne(data) {
  return request({
    url: '/store/storeVoucherManager/getManjianVoucherByStoreOne',
    method: 'post',
    data
  })
}

// 新增渠道商满减优惠券(满减)
export function addManjianVoucherByStore(data) {
  return request({
    url: '/store/storeVoucherManager/addManjianVoucherByStore',
    method: 'post',
    data
  })
}
// 新增用户满减优惠券(满减)
export function addManjianVoucherByUser(data) {
  return request({
    url: '/store/userVoucherManager/addManjianVoucherByUser',
    method: 'post',
    data
  })
}

// 删除用户满减优惠券(满减)
export function delManjianVoucherByUser(data) {
  return request({
    url: '/store/userVoucherManager/delManjianVoucherByUser',
    method: 'post',
    data
  })
}
// 设置是否可用渠道商满减优惠券(满减)
export function useManjianVoucherByStore(data) {
  return request({
    url: '/store/storeVoucherManager/useManjianVoucherByStore',
    method: 'post',
    data
  })
}
// 设置是否可用渠道商满减优惠券(满减)
export function usePerManjianVoucherByStore(data) {
  return request({
    url: '/store/userVoucherManager/useManjianVoucherByStore',
    method: 'post',
    data
  })
}
// 分页渠道商满减优惠券(满减)
export function pageManjianByStore(data) {
  return request({
    url: '/store/storeVoucherManager/pageManjianByStore',
    method: 'post',
    data
  })
}
// 分页用户满减优惠券(满减)
export function userPageManjianByStore(data) {
  return request({
    url: '/store/userVoucherManager/pageManjianByUser',
    method: 'post',
    data
  })
}
// (管理端)积分商城展示所有的用户红包(满减)
export function selectStoreVoucherPage(data) {
  return request({
    url: '/store/userVoucherManager/selectStoreVoucherPage',
    method: 'post',
    data
  })
}
// 为用户红包设置库存以及积分价格(满减)
export function setVoucherStock(data) {
  return request({
    url: '/store/userVoucherManager/setVoucherStock',
    method: 'post',
    data
  })
}
// 单查渠道商优惠券
export function getVoucherByStoreOne(data) {
  return request({
    url: '/store/voucherManager/getVoucherByStoreOne',
    method: 'post',
    data
  })
}

// 渠道商优惠券种类分页
export function selectVoucherByStore(data) {
  return request({
    url: '/store/voucherManager/selectVoucherByStore',
    method: 'post',
    data
  })
}
// 修改渠道商满减优惠券(满减)
export function changeManjianVoucherByStore(data) {
  return request({
    url: '/store/storeVoucherManager/changeManjianVoucherByStore',
    method: 'post',
    data
  })
}
// 修改用户满减优惠券(满减)
export function changeManjianVoucherByUser(data) {
  return request({
    url: '/store/userVoucherManager/changeManjianVoucherByUser',
    method: 'post',
    data
  })
}

// =======================

// 分页渠道管理端商品
export function selectGoodsByStore(data) {
  return request({
    url: '/store/storeGoodsManager/selectGoodsByStore',
    method: 'post',
    data
  })
}
// 分页平台管理端商品
export function selectGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/selectGoodsByAdmin',
    method: 'post',
    data
  })
}
// 渠道商设置商品库存
export function setGoodsNumByStore(data) {
  return request({
    url: '/store/storeGoodsManager/setGoodsNumByStore',
    method: 'post',
    data
  })
}
// 渠道商通过商品id查询商品sku
export function selectSKUByStore(data) {
  return request({
    url: '/store/storeGoodsManager/selectSKUByStore',
    method: 'post',
    data
  })
}

// 渠道商新增商品类别展示
export function addStoreTypeByStore(data) {
  return request({
    url: '/store/storeGoodsTypeManager/addStoreTypeByStore',
    method: 'post',
    data
  })
}
// 渠道商的商品类别展示
export function selectStoreTypeByStore(data) {
  return request({
    url: '/store/storeGoodsTypeManager/selectStoreTypeByStore',
    method: 'post',
    data
  })
}
// 渠道商删除自己的商品类别展示
export function delStoreTypeByStore(data) {
  return request({
    url: '/store/storeGoodsTypeManager/delStoreTypeByStore',
    method: 'post',
    data
  })
}
// 渠道商修改自己的商品类别展示
export function updateStoreTypeByStore(data) {
  return request({
    url: '/store/storeGoodsTypeManager/updateStoreTypeByStore',
    method: 'post',
    data
  })
}
// 渠道商商品类别展示(级联)
export function getTypeList(data) {
  return request({
    url: '/store/storeGoodsTypeManager/getTypeList',
    method: 'post',
    data
  })
}
// 渠道商类别绑定商品(类别里面选商品)
export function setTypeToGoodsByStore(data) {
  return request({
    url: '/store/storeGoodsManager/setTypeToGoodsByStore',
    method: 'post',
    data
  })
}
// 渠道商绑定商品类别
export function setGoodsTypeByStore(data) {
  return request({
    url: '/store/storeGoodsManager/setGoodsTypeByStore',
    method: 'post',
    data
  })
}

// 渠道商查询自己的商品详情
export function getStoreGoodsToStore(data) {
  return request({
    url: '/store/storeGoodsManager/getStoreGoodsToStore',
    method: 'post',
    data
  })
}
// 渠道商修改自己的商品
export function updateGoodsToStore(data) {
  return request({
    url: '/store/storeGoodsManager/updateGoodsToStore',
    method: 'post',
    data
  })
}

// 渠道商新增自己的商品
export function addStoreGoodsToStore(data) {
  return request({
    url: '/store/storeGoodsManager/addStoreGoodsToStore',
    method: 'post',
    data
  })
}
// 渠道商设置商品价格以及库存同时上架
export function setGoodsPriceByStore(data) {
  return request({
    url: '/store/storeGoodsManager/setGoodsPriceByStore',
    method: 'post',
    data
  })
}
// 渠道商下架SKU
export function downSkuByStore(data) {
  return request({
    url: '/store/storeGoodsManager/downSkuByStore',
    method: 'post',
    data
  })
}
// 获取行业类别下拉
export function getTradeList(data) {
  return request({
    url: '/admin/tradeManager/getTradeList',
    method: 'post',
    data
  })
}

// 获取行业类别下拉
export function pullGoodsToStore(data) {
  return request({
    url: '/store/storeGoodsManager/pullGoodsToStore',
    method: 'post',
    data
  })
}

// ================================
// 新增渠道商
export function addStore(data) {
  return request({
    url: '/admin/storeManager/addStore',
    method: 'post',
    data
  })
}

// 新增渠道商判断某些信息是否重复
export function checkAddStore(data) {
  return request({
    url: '/admin/storeManager/checkAddStore',
    method: 'post',
    data
  })
}
// 渠道商列表
export function selectStoreList(data) {
  return request({
    url: '/admin/storeManager/selectStore',
    method: 'post',
    data
  })
}
// 禁用或解禁渠道商
export function disableStoreOne(data) {
  return request({
    url: '/admin/storeManager/disableStoreOne',
    method: 'post',
    data
  })
}
// 单查渠道商
export function getStoreOne(data) {
  return request({
    url: '/admin/storeManager/getStoreOne',
    method: 'post',
    data
  })
}
// 修改渠道商
export function updateStoreOne(data) {
  return request({
    url: '/admin/storeManager/updateStoreOne',
    method: 'post',
    data
  })
}

// 管理端查询指定行业商品分类
export function getGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/getGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增管理端指定行业商品分类
export function addGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/addGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 修改管理端指定行业商品分类
export function updateGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/updateGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增行业类别
export function addTrade(data) {
  return request({
    url: '/admin/tradeManager/addTrade',
    method: 'post',
    data
  })
}
// 修改行业类别
export function updateTrade(data) {
  return request({
    url: '/admin/tradeManager/updateTrade',
    method: 'post',
    data
  })
}
// 验证行业类别同名(true:可用,false:不可用)
export function checkTrade(data) {
  return request({
    url: '/admin/tradeManager/checkTrade',
    method: 'post',
    data
  })
}
// 删除行业类别
export function delTrade(data) {
  return request({
    url: '/admin/tradeManager/delTrade',
    method: 'post',
    data
  })
}
// ======商品板块========
// 删除行业类别
export function addGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/addGoodsByAdmin',
    method: 'post',
    data
  })
}

// 修改管理端商品
export function updateGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/updateGoodsByAdmin',
    method: 'post',
    data
  })
}

// 上架管理端商品SKU
export function upGoodsSKUAdmin(data) {
  return request({
    url: '/admin/goodsManager/upGoodsSKUAdmin',
    method: 'post',
    data
  })
}
// 下架管理端商品SKU
export function downGoodsSKUAdmin(data) {
  return request({
    url: '/admin/goodsManager/downGoodsSKUAdmin',
    method: 'post',
    data
  })
}
// 下架管理端商品
export function disableGoodsAdmin(data) {
  return request({
    url: '/admin/goodsManager/disableGoodsAdmin',
    method: 'post',
    data
  })
}

// (修改前)单查管理端商品
export function getGoodsOneByAdmin(data) {
  return request({
    url: '/admin/goodsManager/getGoodsOneByAdmin',
    method: 'post',
    data
  })
}

// 将商品导入渠道商商品库
export function issueGoodsToStore(data) {
  return request({
    url: '/admin/goodsManager/issueGoodsToStore',
    method: 'post',
    data
  })
}

