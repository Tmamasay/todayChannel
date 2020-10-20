<template>
  <div class="xfjl_box shaowAll">
    <div>
      <div class="toolS">
        <p class="Ptitle">基本信息</p>
      </div>
      <div v-if="companyAuth&&companyAuth.order" class="isTrue">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单号：" style="width:350px">
            <el-input v-model="companyAuth.order.orderId" :readonly="true" />
          </el-form-item>
          <el-form-item label="公司名称：" style="width:350px">
            <el-input v-model="companyAuth.companyName" :readonly="true" />
          </el-form-item>
          <el-form-item label="用户名：" style="width:350px">
            <el-input v-model="companyAuth.username" :readonly="true" />
          </el-form-item>
          <el-form-item label="购买年限：" style="width:350px">
            <el-input v-model="companyAuth.order.years" :readonly="true" />
          </el-form-item>
          <el-form-item label="订购版本：" style="width:350px">
            <el-input v-model="companyAuth.order.productName" :readonly="true" />
          </el-form-item>
          <el-form-item label="使用人数：" style="width:350px">
            <el-input v-model="companyAuth.order.maxNum" :readonly="true" />
          </el-form-item>
          <el-form-item label="服务器容量：" style="width:350px">
            <el-input v-model="companyAuth.order.capacity" :readonly="true" />
          </el-form-item>
          <el-form-item label="到期时间：" style="width:350px">
            <el-input v-model="companyAuth.order.endTime" :readonly="true" />
          </el-form-item>
          <el-form-item label="支付时间：" style="width:350px">
            <el-input v-model="companyAuth.order.payTime" :readonly="true" />
          </el-form-item>
          <el-form-item label="支付金额：" style="width:350px">
            <el-input v-model="companyAuth.order.price" :readonly="true" />
          </el-form-item>
          <el-form-item label="支付方式：" style="width:350px">
            <el-input v-model="companyAuth.order.payType" :readonly="true" />
          </el-form-item>
          <el-form-item label="状态：" style="width:350px">
            <el-input v-model="companyAuth.order.payStatus" :readonly="true" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="companyAuth&&companyAuth.order&&companyAuth.order.payType==='银行卡'">
      <div class="toolS">
        <p class="Ptitle">转账信息</p>
      </div>
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="转账信息：" style="width:350px">
            <el-input v-model="companyAuth.order.payOrderCode" :readonly="true" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="companyAuth&&companyAuth.bill">
      <div class="toolS">
        <p class="Ptitle">开票信息</p>
      </div>
      <div class="isTrue">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="发票类型：" style="width:500px">
            <el-input value="普票" :readonly="true" />
          </el-form-item>
          <el-form-item label="发票抬头：" style="width:500px">
            <el-input v-model="companyAuth.bill.billTitle" :readonly="true" />
          </el-form-item>
          <el-form-item label="纳税人识别号：" style="width:500px">
            <el-input v-model="companyAuth.bill.billCode" :readonly="true" />
          </el-form-item>
          <el-form-item label="注册地址：" style="width:500px">
            <el-input v-model="companyAuth.bill.registerAddress" :readonly="true" />
          </el-form-item>
          <el-form-item label="注册电话：" style="width:500px">
            <el-input v-model="companyAuth.bill.registerPhone" :readonly="true" />
          </el-form-item>
          <el-form-item label="开户银行：" style="width:500px">
            <el-input v-model="companyAuth.bill.bankName" :readonly="true" />
          </el-form-item>
          <el-form-item label="银行账号：" style="width:500px">
            <el-input v-model="companyAuth.bill.bankCode" :readonly="true" />
          </el-form-item>
          <el-form-item label="开票金额：" style="width:500px">
            <el-input v-model="companyAuth.order.price" :readonly="true" />
          </el-form-item>

          <el-form-item label="收货电话：" style="width:500px">
            <el-input v-model="companyAuth.bill.sendPhone" :readonly="true" />
          </el-form-item>
          <el-form-item label="收货地址：" style="width:500px">
            <el-input v-model="companyAuth.bill.sendAddress" :readonly="true" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="companyAuth&&companyAuth.order&&companyAuth.order.payStatus==='待收款'" slot="footer" class="dialog-footer" style="margin-left:45%;margin-top:40px">
      <el-button size="medium" type="danger" @click="checkAuth(0)">未到账</el-button>
      <el-button size="medium" type="primary" @click="checkAuth(1)">已到账</el-button>
    </div>

  </div>
</template>

<script>
import { getOrderOne, orderCollection } from '@/api/chengxu'
export default {
  data() {
    return {
      reason: null,
      companyAuth: null,
      companySgin: null,
      query: {
        callerNum: ''
      },
      datalist: [],
      yueNum: 0,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      time: null,
      type: null,
      loading: false // loading加载
    }
  },
  mounted() {
    this.companySgin = this.$route.query.companyStatus
    this.getlist()
  },
  methods: {
    payTypeFor(payType) {
      return payType === 0 ? '支付宝' : payType === 1 ? '微信' : payType === 2 ? '银行卡' : payType === 3 ? '试用' : '未知'
    },
    payStatusFor(payStatus, payType) {
      return +payStatus === 0 ? '未支付' : +payStatus === 1 ? '已支付' : +payStatus === 2 && +payType === 2 ? '待收款' : +payStatus === 3 ? '试用' : '未知'
    },
    async checkAuth(e) {
      await orderCollection({
        param: {
          orderId: this.companyAuth.order.id,
          isCollection: e
        }
      }).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.$router.go(-1)// 返回上一层
        }
      })
    },
    async  getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          orderId: this.$route.query.orderId
        }
      }
      await getOrderOne(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          console.log(res.data)
          _this.companyAuth = res.data
          console.log(_this.companyAuth)
          _this.companyAuth.order.payStatus = this.payStatusFor(_this.companyAuth.order.payStatus, _this.companyAuth.order.payType)
          _this.companyAuth.order.payType = this.payTypeFor(_this.companyAuth.order.payType)
        }
      })
    },
    // 搜索
    sousuo() {
      this.Current = 1
      this.getlist()
    },
    // 时间戳转换
    formatDate(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    toNum(value) {
      if (!value) return 0
      return value.toFixed(2)
    },
    // 分页
    handleSizeChange(val) {
      this.total = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.Current = val
      this.getlist()
    }
  }
}
</script>

<style scoped>
.el-input>>>.el-input__inner {
    border: 0 !important;
}
.toolS{
  display: flex;
  justify-content: space-between;
   padding-bottom: 10px;
    align-items:center;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;

}
.xfjl_box{
  margin:20px;
}
.el-button{
    padding: 8px 12px !important;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.yue{
  width:100%;
  height:50px;
  font-size: 18px;
    color: #606266;
    line-height: 50px;
    padding-left: 10px;
    font-weight: 600;
  background: #fff;
  float:left;
  margin-bottom: 20px;
  /* margin-left:122px; */
  box-shadow: 0px 0px 5px #d2d2d2;
  border-radius: 5px;
  /* margin-top:20px; */
}
</style>
