<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <p class="Ptitle">会员列表</p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column prop="orderId" label="订单号" />
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column prop="years" label="购买年限" />
      <el-table-column prop="productName" label="订购版本" />
      <el-table-column label="使用人数">
        <template slot-scope="scope">
          {{ scope.row.minNum }}-{{ scope.row.maxNum }}人
        </template>
      </el-table-column>

      <el-table-column prop="payTime" label="支付时间" :formatter="dateFormat" />
      <el-table-column prop="price" label="支付金额" />

      <el-table-column prop="payType" label="支付方式">
        <template slot-scope="scope">
          {{ +scope.row.payType===0?'支付宝':+scope.row.payType===1?'微信':+scope.row.payType===2?'银行卡':+scope.row.payType===3?'试用':'未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="到期时间" :formatter="dateFormat" />
      <el-table-column prop="payStatus" label="状态">
        <template slot-scope="scope">
          {{ +scope.row.payStatus===0?'未支付':+scope.row.payStatus===1?'已支付':+scope.row.payStatus===2&&+scope.row.payType===2?'待收款':+scope.row.payStatus===3?'试用':'未知' }}
        </template>
      </el-table-column>
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <span v-if="+scope.row.payStatus===2&&+scope.row.payType===2" style="color:red;cursor: pointer;" @click="goDetail(scope.row.id)">去收款</span>
          <span v-else style="color:#00c48f;cursor: pointer;" @click="goDetail(scope.row.id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block fenye">
      <el-pagination
        :current-page="Current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="Size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { selectOrder } from '@/api/chengxu'
import moment from 'moment'
export default {
  data() {
    return {
      companyName: '',
      orderId: '',
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
    this.getlist()
  },
  methods: {
    goDetail(e) {
      this.$router.push({ path: '/detailOrder', query: { orderId: e }})
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          companyName: this.companyName,
          orderId: this.orderId,
          pageNum: _this.Current,
          pageSize: _this.Size,
          startTime: _this.time ? new Date(_this.time[0]).getTime() : '',
          endTime: _this.time ? new Date(_this.time[1]).getTime() + 86399999 : ''
        }
      }
      selectOrder(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data.records
          _this.total = res.data.total
        }
      })
    },
    // 搜索
    sousuo() {
      this.Current = 1
      this.getlist()
    },

    dateFormat(row, column) {
      var date = row.payTime
      if (!date) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
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
      this.Size = val
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
