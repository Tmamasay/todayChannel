<template>
  <div class="dashboard-container">
    <!-- <div class="title_box">
      <p>近七天公司数据</p>
      <span class="line" />
    </div> -->
    <div class="lineYue">
      <div class="chart_box shaowAll" style="width: 100%">
        <p class="Ptitle">今日点击数概览</p>
        <div id="myChart" style="width: 100%;height:140px">
          <div class="itemDi">
            <p class="D1">产品介绍页</p>
            <p class="D2">{{ A1 }}</p>
          </div>
          <div class="itemDi">
            <p class="D1">价格页</p>
            <p class="D2">{{ A2 }}</p>
          </div>
          <div class="itemDi">
            <p class="D1">行业资讯页</p>
            <p class="D2">{{ A3 }}</p>
          </div>
          <div class="itemDi">
            <p class="D1">独立IP</p>
            <p class="D2">{{ A4 }}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="chart_box shaowAll" style="width: 100%;margin-top:30px">
      <p class="Ptitle">访问列表</p>
      <div id="myChart1" style="width: 100%; cursor: pointer;">
        <el-table
          ref="zx-list-data-&quot;"
          v-loading="loading"
          :data="yxhdlist"
          tooltip-effect="dark"
          style="width:95%;margin:10px auto 20px auto;"
          highlight-current-row
        >
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="createTime" label="访问时间" :formatter="formatDate" />
          <el-table-column prop="realIp" label="独立IP" />
          <el-table-column prop="amount" label="访问次数" />
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

    </div>

  </div>
</template>

<script>

import { getTable, getRealIP, getRealIpPage } from '@/api/chengxu'
export default {
  data() {
    return {

      yxhdlist: [], // 十条有效话单
      days: [], // 日期
      loading: false,
      lyUrl: '',
      dialogVisible: false,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      A1: '',
      A2: '',
      A3: '',
      A4: ''

    }
  },
  mounted() {
    this.getTabNum(1)
    this.getTabNum(2)
    this.getTabNum(3)
    this.getRealIP()
    this.getRealIpPage()
  },
  methods: {
    // 近十条有效话单
    getRealIpPage() {
      getRealIpPage({
        param: {
          pageNum: this.Current,
          pageSize: this.Size
        }
      }).then(res => {
        console.log(res)
        //
        if (res.statusCode === '00000') {
          this.yxhdlist = res.data.records
          this.total = res.data.total
        }
      })
    },
    // 独立IP
    async getRealIP(e) {
      await getRealIP().then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.A4 = res.data
        }
      })
    },
    // 获取TAb点击
    async getTabNum(e) {
      await getTable({
        data: {
          tableId: e
        }
      }).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          if (+e === 1) {
            this.A1 = res.data
          } else if (+e === 2) {
            this.A2 = res.data
          } else if (+e === 3) {
            this.A3 = res.data
          }
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.Size = val
      this.gethd()
    },
    handleCurrentChange(val) {
      this.Current = val
      this.gethd()
    },

    // 时间戳转换
    formatDate(row) {
      const date = new Date(row.createTime)
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
    }

  }
}
</script>

<style scoped>

.jiesi{
  float:right;
      font-size: 20px;
    color: #999;
    margin-right: 15px;
    margin-top: 15px;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

}
.lineYue{
  display: flex;
  justify-content: space-between;
  /* margin-left: 20px; */
}
.lineRight{
/* width: 150px; */
  text-align: center;
  margin: 35px auto 0 auto;
  display: flex;
flex-direction: column;
/* justify-content: center; */
align-items: center;
cursor: pointer;

}
.lineRight2{
  text-align: left;
  margin: 15px auto auto 5px;

}
.rightLi{
  width: 65px;
  height: 65px;
}
.rightLi img{
  width: 100%;
  height: 100%;
}
.rightL2{
  font-size: 23px;
    color: #f7603e;
    line-height: 32px;
    /* margin-bottom: 20px; */
    font-weight: 500;

}
.rightL2 span{
font-weight: 500;
}
.rightL3{
  font-size: 16px;
    color: #333;
    margin-top: -12px;
    /* line-height: 36px; */
}
.rightL4{
font-size: 15px;
    color: rgb(99, 99, 99);
    margin-top: -10px;
}
.changeYe{
  color: #00c48f;
}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;
    padding: 12px;
}
.itemDi{
  width: 150px;
  text-align: center;
  margin: 0 auto;
  display: flex;
flex-direction: column;
align-items: center;
cursor: pointer;

}
.itemDi:hover{
  color: #22AB82;
}
.D1{
      font-size: 14px;
    color: #999;
    line-height: 15px;
    margin-bottom: 14px;
}

.DM1{
  width: 50px;
  height: 50px;
}
.DM1 img{
  width: 100%;
  height: 100%;

}
.DM2{
  font-size: 16px;
    font-family: PingFangSC-Regular,sans-serif;
    padding-top: 10px;
}
.D2{
font-size: 34px;
    color: #333;
    line-height: 36px;
    margin-bottom: 20px;
}
.lineDet{
  width: 90%;
  margin: 0 auto;
padding: 15px;
    border-bottom: 1px solid #f5f5f5;
}
.C1{
    color: #666;
    font-size: 14px;
    line-height: 24px;
}
.C1 span{
  font-weight: 700;
}
#myChart{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#myChart2{
  float:left;
  background: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.chart_box{
  overflow: hidden;
}
.dashboard-container{
  background: #fff;
  padding:20px;
  overflow: auto;
}
.dashboard-container::-webkit-scrollbar{

   display:none;

}
.drqk_box{
  margin-top:50px;
  clear: both;
  /* box-shadow: 0px 0px 5px #d2d2d2; */
  overflow: hidden;
  padding-bottom:10px;
}
.title_box p{
    font-size: 24px;
    color: #363636;
    margin:0;
  }
  .title_box .line{
    display: block;
    width: 34px;
    height: 4px;
    background: #1c6feb;
    margin: 8px 0 30px 0;
  }
  .title{
    font-weight: 600;
    font-size: 18px;
    margin-top:50px;
  }
.drqk_box .content_box{
  /* width:320px; */
  width:16.5%;
  height:100px;
  background: #fff;
  float:left;
  margin-left:122px;
  box-shadow: 0px 0px 5px #d2d2d2;
  border-radius: 5px;
  margin-top:20px;
}
.drqk_box .content_box .img{
  width:90px;
  height:90px;
  background: #fc9208;
  border-radius: 5px;
  position: relative;
  top: -40px;
  left: 20px;
  box-shadow: 0px 10px 15px #eee;
  display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    float:left;
}
.drqk_box .content_box:nth-of-type(3) .img{
  background: #09b2c7;
}
.drqk_box .content_box:nth-of-type(4) .img{
  background: #e8413d;
}
.drqk_box .content_box:nth-of-type(5) .img{
  background: #4da851;
}
.drqk_box .content_box div{
  float:right;
  margin-right:20px;
  text-align: right;
}
.drqk_box .content_box div p{
  color:#9f9f9f;
  font-size:14px;
}
.table_box .title_box{
  margin-top:50px;
}
.icon{
  cursor: pointer;
}
.icon_box .svg-icon:hover{
  color:#1c6feb;
}
audio{
  outline: none;
}
.drqk_box .content_box .img .svg-icon{
  width:30px;
  height:30px;
}
audio{
  outline: none;
}
.ls{
  color:#2acc69
}
.hs{
  color:#fb5e5e
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
    margin-bottom: 30px;
}
</style>
