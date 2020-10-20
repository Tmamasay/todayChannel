<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="addZx">新增渠道商</el-button>
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
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <!-- <el-table-column prop="createTime" width="180" label="添加时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column> -->
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
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <span style="color:#00c48f;cursor: pointer;" @click="goEdit(scope.row)">编辑</span>
          <!-- <span style="color:#00c48f;cursor: pointer;" @click="goEdit(scope.row)">充值</span> -->
          <span v-if="scope.row.status==='USE'" style="color:red;cursor: pointer;padding-left:10px" @click="removeZX(scope.row)">冻结</span>
          <span v-if="scope.row.status==='STOP'" style="color:#00c48f;cursor: pointer;padding-left:10px" @click="removeZX(scope.row)">解冻</span>
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
    <!-- 渠道商操作 -->
    <el-dialog
      title="渠道商操作"
      :visible.sync="dialogVisible_yh"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form v-if="dialogVisible_yh" ref="yhData" label-position="right" :inline="true" label-width="120px" :model="yhData" :rules="rulesyh">
        <el-form-item label="渠道商名称" prop="name">
          <el-input v-model="yhData.name" placeholder="请输入渠道商名称" />
        </el-form-item>
        <el-form-item label="渠道商账号" prop="account">
          <el-input v-model="yhData.account" placeholder="请输入渠道商账号" />
        </el-form-item>
        <el-form-item label="行业类别" prop="industry">
          <el-select v-model="yhData.industry" placeholder="请选择" style="width:90%">
            <el-option v-for="item in options" :key="item.id" :label="item.tradeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商等级" prop="grade" style="margin-left:-15px">
          <el-select v-model="yhData.grade" placeholder="请选择" style="width:90%">
            <el-option label="V1" value="1" />
            <el-option label="V2" value="2" />
            <el-option label="V3" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="实体店名称" prop="entityName">
          <el-input v-model="yhData.entityName" placeholder="请输入实体店名" />
        </el-form-item>
        <el-form-item label="实体店地址" prop="entityAdress">
          <!-- <textarea v-model="yhData.entityAdress" style="border:1px solid #DCDFE6" placeholder="请输入实体店地址" cols="30" rows="4" /> -->
          <el-input v-model="yhData.entityAdress" placeholder="请输入实体店地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="yhData.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="yhData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="手续费率" prop="fee">
          <el-input v-model="yhData.fee" placeholder="请输入手续费率（最低千分之六）" />
        </el-form-item>
        <el-form-item v-if="!yhData.id" label="登录密码" prop="password">
          <el-input v-model="yhData.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_yh=false">取 消</el-button>
        <el-button type="primary" @click="addUser('yhData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStore, getTradeList, checkAddStore, selectStoreList, disableStoreOne, getStoreOne, updateStoreOne } from '@/api/user'
// import { ttyMD5 } from '@/utils'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      const ss = reg.test(value)
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!ss) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    const validateLoginName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ loginName: value })
        if (!value) {
          callback(new Error('请输入渠道商账号'))
        } else if (!data) {
          callback(new Error('渠道商账号已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入渠道商账号'))
        } else {
          callback()
        }
      }
    }
    const validateStoreName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ storeName: value })
        if (!value) {
          callback(new Error('请输入渠道商名称'))
        } else if (!data) {
          callback(new Error('渠道商名称已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入渠道商名称'))
        } else {
          callback()
        }
      }
    }
    const validateStoreRealName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ storeRealName: value })
        if (!value) {
          callback(new Error('请输入实体店铺名称'))
        } else if (!data) {
          callback(new Error('实体店铺名称已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入实体店铺名称'))
        } else {
          callback()
        }
      }
    }
    return {
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
        name: [
          { required: true, trigger: 'blur', validator: validateStoreName }
        ],
        account: [
          { required: true, trigger: 'blur', validator: validateLoginName }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择渠道商等级', trigger: 'change' }
        ],
        entityName: [
          { required: true, trigger: 'blur', validator: validateStoreRealName }
        ],
        entityAdress: [
          { required: true, message: '请输入实体店地址', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        fee: [
          { required: true, message: '请输入手续费率', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' }
        ]

      },
      datalist: [
        {
          name: '测试渠道商',
          account: 'chengXu',
          industry: '奶茶',
          grade: 'V2',
          entityName: '一只酸奶牛',
          entityAdress: '重庆市南岸区万达广场',
          contacts: '程旭',
          phone: '18883630318'
        }
      ],
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
    removeZX(row) {
      disableStoreOne({
        storeId: row.id,
        status: row.status === 'USE' ? 1 : 0

      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getlist()
        }
      })
    },
    async addUser(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.yhData.id) {
            // this.yhData.password = ttyMD5(this.yhData.password)
            const _param = {
              loginName: this.yhData.account,
              mobile: this.yhData.phone,
              password: this.yhData.password,
              rate: this.yhData.fee,
              storeAddress: this.yhData.entityAdress,
              storeLevel: this.yhData.grade,
              storeName: this.yhData.name,
              storeRealName: this.yhData.entityName,
              tradeTypeId: this.yhData.industry,
              userName: this.yhData.contacts
            }
            addStore(_param).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                _this.getlist()
              }
            })
          } else {
            const _param2 = {
              storeId: this.yhData.id,
              loginName: this.yhData.account,
              mobile: this.yhData.phone,
              password: this.yhData.password,
              rate: this.yhData.fee,
              storeAddress: this.yhData.entityAdress,
              storeLevel: this.yhData.grade,
              storeName: this.yhData.name,
              storeRealName: this.yhData.entityName,
              tradeTypeId: this.yhData.industry,
              userName: this.yhData.contacts
            }
            updateStoreOne(_param2).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                _this.getlist()
              }
            })
          }
        }
      })
    },
    goEdit(row) {
      this.getTradeList()
      getStoreOne({
        storeId: row.id
      }).then(res => {
        if (res.status) {
          this.dialogVisible_yh = true
          console.log(res.data.store)
          console.log('-----------')
          this.yhData = {
            id: row.id,
            account: res.data.user.userName,
            phone: res.data.store.mobile,
            password: res.data.user.password,
            fee: res.data.store.rate,
            entityAdress: res.data.store.storeAddress,
            grade: res.data.store.storeLevel,
            name: res.data.store.storeName,
            entityName: res.data.store.storeRealName,
            industry: res.data.store.tradeTypeId,
            contacts: res.data.store.userName
          }
        }
      })

      // this.yhData = {
      //   id: row.id,
      //   roleId: row.roleId,
      //   username: row.username
      // }
    },
    addZx() {
      this.dialogVisible_yh = true
      this.yhData = {
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
      }
      this.getTradeList()
    },
    goDetail(e, v) {
      this.$router.push({ path: '/detial', query: { companyStatus: e, customerId: v }})
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
