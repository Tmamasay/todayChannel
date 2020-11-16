<template>
  <!--  2020-8-10 LRS -->
  <div class="fenlei_admin_box shaowAll" :style="{height:bodyHeight}">
    <div class="fenlei_admin">
      <div class="top_form">
        <el-form :inline="true" size="mini">
          <el-form-item label="轮播名称：">
            <el-input v-model="searchData.name_value" placeholder="请输入轮播名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFenleipop">添加轮播</el-button>
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
          <el-table-column prop="imgName" label="轮播名称" />
          <el-table-column prop="imgColour" label="轮播颜色" />
          <el-table-column prop="sort" label="排序" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderNum }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="updateName" label="编辑者" align="center" /> -->
          <el-table-column prop="createTime" label="编辑时间" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
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
          style="width:60%;margin:0 auto"
        >
          <el-form v-if="addFenleivisible" ref="addEditData" :rules="addEditrules" :model="addEditData" label-width="100px" size="mini">
            <el-form-item label="名称：" style="line-height:60px" prop="voucherName">
              <el-input v-model="addEditData.voucherName" placeholder="请输入名称" style="width:100%;" />
            </el-form-item>
            
            <el-form-item label="购物券类型" style="line-height:60px" prop="type">
             <el-select v-model="addEditData.type" placeholder="请选择">
                <el-option  label="满减" value="man_jian" />
                <el-option  label="折扣" value="ze_kou" />
          
              </el-select>
            </el-form-item>
            <el-form-item label="小标题：" style="line-height:60px" prop="title">
              <el-input v-model="addEditData.title" placeholder="请输入小标题" style="width:100%;" />
            </el-form-item>
             <el-form-item label="详情：" style="line-height:60px" prop="content">
              <el-input v-model="addEditData.content" placeholder="请输入详情（折扣使用介绍）" style="width:100%;" />
            </el-form-item>
             <el-form-item label="条件：" style="line-height:60px" prop="condition">
              <el-input v-model="addEditData.conditionTxt" placeholder="满多少使用" style="width:100%;" />
            </el-form-item>
              <el-form-item label="条件价格：" style="line-height:60px" prop="conditionAmount">
              <el-input v-model="addEditData.conditionAmount" placeholder="达标金额（满多少）" style="width:100%;" />
            </el-form-item>
             <el-form-item label="数值：" style="line-height:60px" prop="amount">
              <el-input v-model="addEditData.amount" placeholder="折扣数值" style="width:100%;" />
            </el-form-item>
              <el-form-item label="是否长期：" style="line-height:60px" prop="validityStatus">
               <el-select v-model="addEditData.validityStatus" placeholder="请选择">
                <el-option  label="有效期" value="0" />
                <el-option  label="永久" value="1" />
                <el-option  label="过期" value="2" />
              </el-select>
            </el-form-item>
              <el-form-item v-if="+addEditData.validityStatus===0" label="开始使用时间：" style="line-height:60px" prop="startUseTime">    
            <el-date-picker
              v-model="addEditData.startUseTime"
             type="datetime"
             format="yyyy-MM-dd HH:mm:ss"
             value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              placeholder="开始使用时间"
            />
              <!-- <el-input v-model="addEditData.startUseTime" placeholder="开始使用时间" style="width:100%;" /> -->
            </el-form-item>
              <el-form-item v-if="+addEditData.validityStatus===0" label="有效期至：" style="line-height:60px" prop="validityTime">
                <el-date-picker
              v-model="addEditData.validityTime"
             type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              placeholder="有效期至"
            />
              <!-- <el-input v-model="addEditData.validityTime" placeholder="有效期至" style="width:100%;" /> -->
            </el-form-item>
          </el-form>
          <div class="el-center">
            <el-button type="primary" size="mini" @click="onSubmit('addEditData')">提交</el-button>
            <el-button size="mini" plain @click="addFenleivisible=false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { selectVoucherByStore, addVoucherByStore, updateVoucherByStore, delVoucherByStore } from '@/api/user'
import { fileUpload } from '@/api/chengxu'
export default {
  data() {
    return {
      datalist: [],
      checkGoods: [], // 选中商品数组
      checkClassFy: '', // 选中分类
      // 上传中转
      uploadData: '',
      bodyHeight: '', // 获取浏览器的高度，背景色
      searchData: {// 搜索数据
        name_value: '', // 分类名称
        date_value: '' // 编辑时间
      },
      tableData: [], // 表格数据
      loading: false, // 表格loding加载
      fenleiShow: 1, // 一级二级分类隐藏显示:1：一级 2:二级
      Current: 0, // 页码
      Size: 10, // 一页10条数据
      current: 0, // 页码
      size: 10, // 一页10条数据
      total: 0, // 数据总条数
      addFenleivisible: false, // 新增分类、编辑弹出框
      title: '', // 新增分类、编辑名字
      addEditData: {// 新增、编辑字段
        voucherName:"",//名称
        title: '', // 标题
        type: '', // 购物券类型
        content: '',	// 详情
        conditionTxt: '',	// 条件
        amount: '',	// 数值
        conditionAmount: '',	// 条件价格
        // unit: '',	// 单位
        validityStatus: '0',	// 是否长期(0:有效期,1:永久2:过期)
        startUseTime: '',	// 开始使用时间
        validityTime: ''	// 有效期至
       
      },
      addEditrules: {
        img: [
          { required: true, message: '请先上传图片', trigger: 'change' }
        ],
        imgName: [
          { required: true, message: '请填写轮播名称', trigger: 'blur' }
        ],
        imgColour: [
          { required: true, message: '请填写轮播颜色', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请填写轮播跳转url', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字值' }
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

    /*
    *功能描述：获取列表
    *开发人员：CX
    */
    getlist() {
      const _this = this
      _this.loading = true
      selectVoucherByStore({
        current: _this.current,
        size: _this.size
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
        voucherName:"",//名称
        title: '', // 标题
        type: '', // 购物券类型
        content: '',	// 详情
        conditionTxt: '',	// 条件
        amount: '',	// 数值
        conditionAmount: '',	// 条件价格
        // unit: '',	// 单位
        validityStatus: '0',	// 是否长期(0:有效期,1:永久2:过期)
        startUseTime: '',	// 开始使用时间
        validityTime: ''	// 有效期至
       
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
         voucherName:e.voucherName,//名称
        title: e.title, // 标题
        type: e.type, // 购物券类型
        content: e.content,	// 详情
        conditionTxt: e.conditionTxt,	// 条件
        amount: e.amount,	// 数值
        conditionAmount: e.conditionAmount,	// 条件价格
        // unit: '',	// 单位
        validityStatus: e.validityStatus,	// 是否长期(0:有效期,1:永久2:过期)
        startUseTime: e.startUseTime,	// 开始使用时间
        validityTime: e.validityTime	// 有效期至
      }
    },

    /*
    *功能描述：新增、编辑分类提交
    *开发人员：LRS
    */
    onSubmit(formName) {
      console.log(this.addEditData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addEditData.id) { // 添加分类
            addVoucherByStore(this.addEditData).then(res => {
              console.log(res)
              if (res.status) {
                this.$message({ message: '添加成功', type: 'success' })
                this.addFenleivisible = false
                this.getlist()
              }
            })
          } else { // 编辑分类
            updateVoucherByStore(this.addEditData).then(res => {
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
      this.$confirm('此操作将删除该轮播, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delVoucherByStore(data).then(res => {
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

<style scoped>

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
