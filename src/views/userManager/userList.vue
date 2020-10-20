<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <p class="Ptitle">会员列表</p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="phone" placeholder="请输入手机号" />
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
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="customerName" label="公司名称" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="gid" label="会员注册日期" />
      <el-table-column prop="username" label="手机号" />
      <el-table-column prop="capacity" label="服务器预计容量" />
      <el-table-column prop="gid" label="已使用容量" />
      <el-table-column prop="companyStatus" label="状态">
        <template slot-scope="scope">
          {{ +scope.row.companyStatus===0?'未认证':+scope.row.companyStatus===1?'待审核':+scope.row.companyStatus===2?'已认证':'已驳回' }}
        </template>
      </el-table-column>
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.companyStatus!==1" style="color:#00c48f;cursor: pointer;" @click="goDetail(scope.row.companyStatus,scope.row.customerId)">查看</span>
          <span v-else style="color:red;cursor: pointer;" @click="goDetail(scope.row.companyStatus,scope.row.customerId)">去审核</span>
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
import { getUsersPage } from '@/api/chengxu'
export default {
  data() {
    return {
      companyName: '',
      phone: '',
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
    goDetail(e, v) {
      this.$router.push({ path: '/detial', query: { companyStatus: e, customerId: v }})
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          companyName: this.companyName,
          phone: this.phone,
          pageNum: _this.Current,
          pageSize: _this.Size,
          startTime: _this.time ? new Date(_this.time[0]).getTime() : '',
          endTime: _this.time ? new Date(_this.time[1]).getTime() + 86399999 : ''
        }
      }
      getUsersPage(data).then(res => {
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
