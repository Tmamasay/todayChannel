<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="importGood">分配商品</el-button>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="userName" placeholder="请输入管理员" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable1"
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />

      <el-table-column prop="storeName" label="渠道商名称" />
      <el-table-column prop="tradeType" label="行业" />
      <el-table-column prop="storeLevel" label="等级" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='USE'" class="useSign">使用中</span>
          <span v-else-if="scope.row.status==='STOP' " class="noUseSign" type="danger">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="手续费率">
        <template slot-scope="scope">
          {{ (scope.row.rate/100).toFixed(2) }}%
        </template>
      </el-table-column>
      <el-table-column prop="storeRealName" label="实体店名字" />
      <el-table-column prop="storeAddress" label="实体店地址" />
      <el-table-column prop="userName" label="联系人" />
      <el-table-column prop="mobile" label="联系电话" />
      <el-table-column prop="createTime" width="150" label="创建时间" />
      <!-- <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <span style="color:#00c48f;cursor: pointer;" @click="goEdit(scope.row)">编辑</span>
        </template>
      </el-table-column> -->
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
    <!-- 渠道商操作 -->
    <el-dialog
      title="渠道商操作"
      :visible.sync="dialogVisible_yh"
      :close-on-click-modal="false"
      width="70%"
    >
      <div class="toolS">
        <p v-if="checkChannel.length" style="margin-top:-20px">已选渠道商：<span class="activeCha">{{ checkChannel[0].storeName }}</span></p>
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="商品名">
            <el-input v-model="query.goodsName" placeholder="请输入管理员" />
          </el-form-item>
          <el-form-item label="所属行业">
            <el-select v-model="query.industry" placeholder="请选择" style="width:90%" @change="tradeNaChange">
              <el-option v-for="item in classList" :key="item.id" :label="item.tradeName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="行业类目">
            <el-cascader
              v-model="query.goodsTypeId"
              :options="classFyList"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchGoods">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <p v-if="checkGoods.length">已选商品：<span v-for="item in checkGoods" :key="item.id" class="activeCha1">{{ item.goodsName }}</span></p>
      <el-button type="primary" style="margin-bottom:20px" @click="importGoodSrue">确定分配</el-button>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="commList"
        tooltip-effect="dark"
        height="400"
        style="width:95%;margin:10px auto 20px auto;"
        highlight-current-row
        @selection-change="handleSelectionGoodsChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="goodsName" width="150" label="商品名称" />
        <el-table-column prop="imgOne" width="180" label="封面图">
          <template slot-scope="scope">
            <img :src="scope.row.imgOne" alt="" srcset="" width="100" height="100">
          </template>
        </el-table-column>

        <el-table-column prop="tradeName" label="所属行业" />
        <el-table-column prop="goodsTypeName" label="行业类目" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='USE'" class="useSign">上架中</span>
            <span v-else-if="scope.row.status==='STOP' " class="noUseSign" type="danger">已下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="showPrice" label="封面价格" />
        <el-table-column prop="remakes" label="备注" />
        <el-table-column prop="createTime" width="150" label="创建时间" />
        <el-table-column
          label="操作"
        >
          <!-- <template slot-scope="scope">
            <el-button size="small" @click="goSkuEdit(scope.row)">SKU管理</el-button>
          </template> -->
        </el-table-column>
      </el-table>
      <div class="block fenye">
        <el-pagination
          :current-page="Current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="Size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { issueGoodsToStore, selectGoodsByAdmin, getGoodsTypeByAdmin, getTradeList, selectStoreList } from '@/api/user'
// import { ttyMD5 } from '@/utils'
export default {
  data() {
    return {
      query: {
        goodsName: '',
        industry: '',
        goodsTypeId: ''
      },
      classFyList: [], // 行业容器
      classList: [],
      checkChannel: [], // 选中渠道商
      checkGoods: [], // 选中商品
      userName: '',
      options: [],
      dialogVisible_yh: false,
      yhData: {
        name: '', // 渠道商名称
        account: '', // 账号
        industry: '', // 行业
        grade: '', // 等级
        entityName: '', // 实体店名字
        entityAdress: '', // 实体店地址
        contacts: '', // 联系人
        phone: '', // 联系电话
        fee: '', // 手续费率
        password: '' // 登陆密码
        // businessLicense: '', // 营业执照
        // licence: '', // 许可证
      },
      rulesyh: {
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ]

      },
      datalist: [],
      yueNum: 0,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      commList: [], // 商品列表
      commTotal: [], // 总数
      time: null,
      type: null,
      loading: false // loading加载
    }
  },
  mounted() {
    this.getlist()
    this.getGoodsList()
    this.getClassList()
  },
  methods: {
    async importGoodSrue() {
      if (!this.checkGoods.length) {
        this.$message({ message: '请勾选需要导入的商品', type: 'warning' })
        return
      }
      const listId = []
      this.checkGoods.forEach(element => {
        listId.push(element.id)
      })
      await issueGoodsToStore({
        goodsIds: listId,
        storeId: this.checkChannel[0].id
      }).then(res => {
        if (res.status) {
          this.$message({ message: res.statusMessage, type: 'success' })
          this.$refs.multipleTable1.clearSelection()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$refs.multipleTable1.clearSelection()
          this.$refs.multipleTable.clearSelection()
          this.$message({ message: res.statusMessage, type: 'warning' })
        }
      })
    },
    generateRoutes(routes) {
      const res = []
      routes.forEach(route => {
        const data = {
          value: route.id,
          label: route.name
        }
        if (route.children && route.children.length) {
          data.children = this.generateRoutes(route.children)
        }
        res.push(data)
      })
      return res
    },
    tradeNaChange(value) {
      this.getFlList(value)
    },
    async getClassList() {
      const _this = this

      _this.loading = true
      await getTradeList().then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.classList = res.data
        }
      })
    },
    // 列表
    async getFlList(value) {
      const _this = this
      var data = {
        // tradeId: this.$route.query.tradeId
        tradeId: value
      }
      await getGoodsTypeByAdmin(data).then(res => {
        console.log(res)
        if (res.status) {
          _this.classFyList = this.generateRoutes(res.data.children)
          console.log(_this.classFyList)
        }
      })
    },
    importGood() {
      if (!this.checkChannel.length) {
        this.$message({ message: '请勾选需要导入的渠道商', type: 'warning' })
        return
      }
      // this.$refs.multipleTable.clearSelection()
      this.dialogVisible_yh = true
    },
    getGoodsList() {
      const _this = this
      _this.loading = true
      selectGoodsByAdmin({
        goodsName: _this.query.goodsName,
        goodsTypeId: _this.query.goodsTypeId[_this.query.goodsTypeId.length - 1],
        tradeId: _this.query.industry,
        current: _this.Current,
        size: _this.Size
      }).then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.commList = res.data.records
          _this.commTotal = res.data.total
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$message({ message: '仅支持单个渠道商导入', type: 'warning' })
        return
      }
      this.checkChannel = val
      // console.log(val)
    },
    handleSelectionGoodsChange(val) {
      this.checkGoods = val
      console.log(val)
    },
    async getTradeList() {
      await getTradeList().then(res => {
        if (res.status) {
          this.options = res.data
          console.log(this.options)
        }
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          // userName: _this.userName,
          current: _this.Current,
          size: _this.Size

        }
      }
      selectStoreList(data).then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data.records
          _this.total = res.data.total
        }
      })
    },
    sousuo() {
      this.Current = 1
      this.getlist()
    },
    // 搜索
    searchGoods() {
      this.Current = 1
      this.getGoodsList()
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
.activeCha{
    padding: 5px 8px;
    /* border:1px solid #00c48f; */
  background-color:#00c48f !important;
 color:#fff ;
 border-radius: 4px;
}
.activeCha1{
  display: inline-block;
    padding: 5px 8px;
    border:1px solid #00c48f;
    margin-left: 5px;
  /* background-color:#00c48f !important; */
 color:#00c48f ;

 border-radius: 4px;
}
.useSign{

  padding: 5px 8px;
  background-color:#00c48f !important;
 color:#fff ;
 border-radius: 4px;
}
.noUseSign{
   padding: 5px 8px;
  background-color:rgb(167, 167, 167);
 color:#fff ;
 border-radius: 4px;
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
