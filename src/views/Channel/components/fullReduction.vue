<template>
  <!--  2020-8-10 LRS -->
  <div class="fenlei_admin_box shaowAll" :style="{height:bodyHeight}">
    <div class="fenlei_admin">
      <div class="top_form">
        <el-form :inline="true" size="mini">
          <el-form-item label="优惠券名称：">
            <el-input v-model="searchData.voucherName" placeholder="请输入优惠券名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFenleipop">添加优惠券</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="list_box">
        <el-table
          v-loading="loading"
          :data="tableData"
          highlight-current-row
          style="height:600px;overflow: auto;"
          size="mini"
        >
          <el-table-column prop="voucherName" label="名称" />
          <el-table-column prop="title" label="小标题" />
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              {{ scope.row.type==='man_jian'?'满减':scope.row.type==='ze_kou'?'折扣':'未知' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="+scope.row.validityStatus===0" class="useSign">已启用</span>
              <span v-else-if="+scope.row.validityStatus===1 " class="noUseSign" type="danger">已禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="详情" />
          <el-table-column prop="conditionAmount" label="条件价格" />
          <el-table-column prop="amount" label="数值" />

          <el-table-column prop="startTime" label="生效时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <!-- <el-table-column prop="createTime" label="编辑时间" align="center" /> -->
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="+scope.row.validityStatus===1" type="text" size="mini" @click="downupYh(scope.row)">启用</el-button>
              <el-button v-else-if="+scope.row.validityStatus===0" type="text" size="mini" @click="downupYh(scope.row)">禁用</el-button>
              <el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="page-footer"
            :current-page="current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="size"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChange"
            @current-change="currentPageChange"
          />
        </el-row>
      </div>
      <div class="add_fenlei">
        <el-dialog
          :title="title"
          :visible.sync="addFenleivisible"
          :close-on-click-modal="false"
          style="width:85%;margin:0 auto"
        >
          <el-form v-if="addFenleivisible" ref="addEditData" :rules="addEditrules" :inline="true" :model="addEditData" label-width="110px">
            <el-form-item label="名称：" prop="voucherName">
              <el-input v-model="addEditData.voucherName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="小标题：" prop="title">
              <el-input v-model="addEditData.title" placeholder="请输入小标题" />
            </el-form-item>

            <el-form-item label="满：" prop="conditionAmount">
              <el-input v-model="addEditData.conditionAmount" class="no-number" type="number" placeholder="达标金额（满多少）" />
            </el-form-item>
            <el-form-item label="减" prop="amount" style="margin-left:-80px">
              <el-input v-model="addEditData.amount" class="no-number" type="number" placeholder="折扣数值" />
            </el-form-item>

            <el-form-item label="生效时间：" prop="startUseTime">
              <el-date-picker
                v-model="addEditData.startTime"
                style="width:100%"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                placeholder="开始使用时间"
              />
              <!-- <el-input v-model="addEditData.startUseTime" placeholder="开始使用时间" style="width:100%;" /> -->
            </el-form-item>

            <el-form-item label="有效期至：" prop="validityTime">
              <el-date-picker
                v-model="addEditData.endTime"
                style="width:100%"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                placeholder="有效期至"
              />
              <!-- <el-input v-model="addEditData.validityTime" placeholder="有效期至" style="width:100%;" /> -->
            </el-form-item>
            <el-form-item label="详情：" prop="content">
              <textarea v-model="addEditData.content" class="textHov" placeholder="请输入详情（折扣使用介绍）" cols="60" rows="5" />
            </el-form-item>
          </el-form>
          <div class="el-center" style="margin-left:37%;margin-top:30px;">
            <el-button type="primary" @click="onSubmit('addEditData')">提交</el-button>
            <el-button plain @click="addFenleivisible=false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { pageManjianByStore, useManjianVoucherByStore, changeManjianVoucherByStore, addManjianVoucherByStore, delManjianVoucherByStore } from '@/api/user'
export default {
  props: {
    coupon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      datalist: [],
      checkGoods: [], // 选中商品数组
      checkClassFy: '', // 选中分类
      // 上传中转
      uploadData: '',
      bodyHeight: '', // 获取浏览器的高度，背景色
      searchData: {// 搜索数据
        voucherName: '', // 名称
        type: '' // 类型
      },
      tableData: [], // 表格数据
      loading: false, // 表格loding加载
      current: 0, // 页码
      size: 10, // 一页10条数据
      total: 0, // 数据总条数
      addFenleivisible: false, // 新增分类、编辑弹出框
      title: '', // 新增分类、编辑名字
      addEditData: {// 新增、编辑字段
        voucherName: '', // 名称
        title: '', // 标题
        type: '', // 购物券类型
        content: '',	// 详情
        amount: 0,	// 数值
        conditionAmount: 0,	// 条件价格
        // unit: '',	// 单位
        startTime: '',	// 开始使用时间
        endTime: ''	// 有效期至

      },
      addEditrules: {
        voucherName: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写详情', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请填写开始生效时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请填写结束时间', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '数值不能为空', trigger: 'blur' }

        ],
        conditionAmount: [
          { required: true, message: '条件价格不能为空', trigger: 'blur' }

        ]
      }
    }
  },
  mounted() {
    /*
    *功能描述：获取屏幕高度添加背景色
    *开发人员：LRS
    */
    this.bodyHeight = window.innerHeight - 85 + 'px'
    /*
    *功能描述：获取列表
    *开发人员：LRS
    */
    this.getlist()
  },
  methods: {
    downupYh(row) {
      useManjianVoucherByStore({
        id: row.id,
        validityStatus: +row.validityStatus ? 0 : 1
      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getlist()
        }
      })
    },
    /*
    *功能描述：获取列表
    *开发人员：CX
    */
    getlist() {
      const _this = this
      _this.loading = true
      pageManjianByStore({
        current: _this.current,
        size: _this.size,
        voucherName: _this.searchData.voucherName
      }).then(res => {
        if (res.status) {
          _this.tableData = res.data.records
          _this.total = res.data.total
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    /*
    *功能描述：搜索
    *开发人员：LRS
    */
    search() {
      this.getlist()
    },
    /*
    *功能描述：一级添加分类弹出框
    *开发人员：LRS
    */
    addFenleipop() {
      this.title = '添加优惠卷'
      this.addEditData = {// 新增、编辑字段
        voucherName: '', // 名称
        title: '', // 标题
        type: '', // 购物券类型
        content: '',	// 详情
        amount: '',	// 数值
        conditionAmount: '',	// 条件价格
        // unit: '',	// 单位
        startTime: '',	// 开始使用时间
        endTime: ''	// 有效期至

      }
      this.addFenleivisible = true
    },

    /*
    *功能描述：编辑弹出框
    *开发人员：LRS
    */
    edit(e) {
      this.addFenleivisible = true
      this.title = '编辑优惠卷'
      this.addEditData = {// 新增、编辑字段
        id: e.id,
        voucherName: e.voucherName, // 名称
        title: e.title, // 标题
        type: e.type, // 购物券类型
        content: e.content,	// 详情
        amount: e.amount,	// 数值
        conditionAmount: e.conditionAmount,	// 条件价格
        // unit: '',	// 单位

        startTime: e.startTime,	// 开始使用时间
        endTime: e.endTime	// 有效期至
      }
    },

    /*
    *功能描述：新增、编辑满减提交
    *开发人员：cX
    */
    onSubmit(formName) {
      console.log(this.addEditData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addEditData.type = this.coupon
          this.addEditData.amount = Math.abs(this.addEditData.amount)	// 数值
          this.addEditData.conditionAmount = Math.abs(this.addEditData.conditionAmount)	// 条件价格
          if (!this.addEditData.id) { // 添加分类
            addManjianVoucherByStore(this.addEditData).then(res => {
              console.log(res)
              if (res.status) {
                this.$message({ message: '添加成功', type: 'success' })
                this.addFenleivisible = false
                this.getlist()
              }
            })
          } else { // 编辑分类
            changeManjianVoucherByStore(this.addEditData).then(res => {
              if (res.status) {
                this.$message({ message: '添加成功', type: 'success' })
                this.addFenleivisible = false
                this.getlist()
              }
            })
          }
        }
      })
    },

    /*
    *功能描述：删除分类
    *开发人员：LRS
    */
    remove(e) {
      var data = {
        id: e.id
      }
      this.$confirm('此操作将删除该优惠卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delManjianVoucherByStore(data).then(res => {
          console.log(res)
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getlist()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /*
    *功能描述：分页点击页码
    *开发人员：LRS
    */
    currentPageChange(val) {
      console.log(val)
      this.current = val
      this.getlist()
    },
    /*
    *功能描述：分页选择条数
    *开发人员：LRS
    */
    pageSizeChange(val) {
      console.log(val)
      this.size = val
      this.getlist()
    }

  }
}
</script>
<style  scoped>
.textHov{
  border: 1px solid #DCDFE6;
  padding: 6px;
}
</style>

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

.fenlei_admin_box{
  /* background: #F5F5FA; */
  overflow: hidden;
   margin:20px;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
.el-button--text{
color: #00c48f !important;
}
.fenlei_admin_box .fenlei_admin{
  background: #fff;
  margin:15px;
  padding: 15px;
}
.page-footer{
  margin-top:20px;
  float: right;
}
.border{
  display: inline-block;
  width:100%;
  height: 28px;
  line-height: 28px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding:0 15px;
  font-size:12px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  display: block !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px dashed #d9d9d9;
  text-align: center;
}
.avatar {
  max-width: 100%;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
