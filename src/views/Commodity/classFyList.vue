<template>
  <!-- 课程改造-分类管理 2020-8-10 LRS -->
  <div class="fenlei_admin_box" :style="{height:bodyHeight}">
    <div class="fenlei_admin">
      <div class="top_form">
        <el-form :inline="true" size="mini">
          <el-form-item label="分类名称：">
            <el-input v-model="searchData.name_value" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="编辑时间：">
            <el-date-picker
              v-model="searchData.date_value"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFenleipop">添加一级分类</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="list_box">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="height:600px;overflow: auto;"
          size="mini"
          row-key="id"
        >
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="img" label="LOGO">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <img
                  :src="scope.row.img"
                  alt="无图片"
                  style="height: 50px; width: 50px;display: block;cursor: pointer;"
                >

              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="courseCount" label="课程数" align="center" /> -->
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
              <el-button v-if="scope.row.children" type="text" size="mini" @click="twofenlei(scope.row)">添加二级分类</el-button>
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
          @closed="closeDialog"
        >
          <el-form ref="addEditData" :rules="addEditrules" :model="addEditData" label-width="100px" size="mini">
            <el-row :gutter="10">

              <el-form-item label="LOGO：">
                <el-upload
                  ref="upload"
                  list-type="picture-card"
                  action
                  :file-list="fileList"
                  :show-file-list="true"
                  :http-request="uploadFile"
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  :limit="1"
                  :on-remove="handleRemove"
                  :on-change="handlePreview"
                  :on-exceed="handleExceed"
                >
                  <i class="el-icon-plus" />
                </el-upload>
              </el-form-item>
            </el-row>
            <el-form-item v-if="+fenleiShow === 1" label="一级分类：" style="line-height:60px" prop="name">
              <el-input v-model="addEditData.name" placeholder="请填写分类名称" style="width:100%;" />
            </el-form-item>
            <!-- <el-form-item v-if="+fenleiShow === 2" label="一级分类：" prop="region">
              <span class="border">{{addEditData.twofenleiName}}</span>
            </el-form-item> -->
            <el-form-item v-if="+fenleiShow === 2" label="二级分类：" style="line-height:60px" prop="name1">
              <el-input v-model="addEditData.name1" placeholder="请填写分类名称" style="width:100%;" />
            </el-form-item>
            <el-form-item label="分类排序：" prop="sort">
              <el-input v-model.number="addEditData.sort" placeholder="请填写分类排序" style="width:100%;" />
            </el-form-item>
            <!-- <el-form-item prop="isShow" label="是否显示：">
              <el-radio-group v-model="addEditData.isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item prop="isRecommend" label="是否热门：">
              <el-radio-group v-model="addEditData.isRecommend">
                <el-radio label="1">热门</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
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
import { addStoreTypeByStore, updateStoreTypeByStore, selectStoreTypeByStore, delStoreTypeByStore } from '@/api/user'
import { fileUpload } from '@/api/chengxu'
export default {
  data() {
    return {
      // 上传中转
      uploadData: '',
      fileList: [],

      bodyHeight: '', // 获取浏览器的高度，背景色
      searchData: {// 搜索数据
        name_value: '', // 分类名称
        date_value: '' // 编辑时间
      },
      tableData: [], // 表格数据
      loading: false, // 表格loding加载
      fenleiShow: 1, // 一级二级分类隐藏显示:1：一级 2:二级
      current: 0, // 页码
      size: 10, // 一页10条数据
      total: 0, // 数据总条数
      addFenleivisible: false, // 新增分类、编辑弹出框
      title: '', // 新增分类、编辑名字
      addEditData: {// 新增、编辑字段
        cYImg: '',
        name: '', // 一级名称
        name1: '', // 二级名称
        twofenleiName: '', // 创建二级时获取一级的名称
        sort: '', // 排序
        isShow: '1', // 是否显示
        isRecommend: '1', // 是否推荐
        pid: '', // 父级id
        id: ''// 修改id
      },
      addEditrules: {
        name: [
          { required: true, message: '请填写一级分类', trigger: 'blur' }
        ],
        name1: [
          { required: true, message: '请填写二级分类', trigger: 'blur' }
        ],
        sort: [
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
    // 上传------
    handleExceed(file) {
      this.$message({
        message: '封面文件只允许上传一张，如需重新上传请删除已存在封面',
        type: 'warning'
      })
    },
    handleRemove(file) {
      console.log(file)
    },
    uploadFile(e) {
      fileUpload(this.uploadData).then(res => {
        if (res) {
          this.addEditData.cYImg = res.data
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.status)
        }
      })
    },

    // 获取上传文件信息
    handlePreview(file) {
      const _this = this
      var formData = new FormData()
      formData.append('file', file.raw)
      _this.uploadData = formData
    },
    // =======
    /*
    *功能描述：获取列表
    *开发人员：LRS
    */
    getlist() {
      const _this = this
      _this.loading = true

      selectStoreTypeByStore({
        current: _this.current,
        size: _this.size,
        parentId: ''
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
      this.title = '添加分类'
      this.addFenleivisible = true
      this.fenleiShow = 1
    },
    /*
    *功能描述：二级添加分类弹出框
    *开发人员：LRS
    */
    twofenlei(e) {
      this.addFenleivisible = true
      this.fenleiShow = 2
      this.title = '添加分类'
      console.log(e)
      // this.addEditData.twofenleiName = e.name
      this.addEditData.pid = e.id
    },

    /*
    *功能描述：编辑弹出框
    *开发人员：LRS
    */
    edit(e) {
      this.addFenleivisible = true
      this.fileList = []
      this.title = '编辑分类'
      this.addEditData.name = e.name
      this.addEditData.name1 = e.name
      this.addEditData.sort = e.orderNum
      this.addEditData.isRecommend = '' + e.hot
      this.addEditData.id = e.id
      this.addEditData.cYImg = e.img
      this.fileList.push({
        url: e.img
      })

      if (!e.children) { // 2级
        this.fenleiShow = 2
      } else { // 1级
        this.fenleiShow = 1
      }
    },

    /*
    *功能描述：新增、编辑分类提交
    *开发人员：LRS
    */
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '添加分类') { // 添加分类
            if (+this.fenleiShow === 1) { // 一级分类
              const data = {
                hot: +this.addEditData.isRecommend,
                img: this.addEditData.cYImg,
                level: 0,
                name: this.addEditData.name,
                orderNum: this.addEditData.sort,
                parentId: ''
              }
              addStoreTypeByStore(data).then(res => {
                console.log(res)
                if (res.status) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            } else { // 二级
              const data = {
                hot: +this.addEditData.isRecommend,
                img: this.addEditData.cYImg,
                level: 1,
                name: this.addEditData.name1,
                orderNum: this.addEditData.sort,
                parentId: this.addEditData.pid

              }
              addStoreTypeByStore(data).then(res => {
                console.log(res)
                if (res.status) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            }
          } else { // 编辑分类
            if (+this.fenleiShow === 1) { // 一级分类
              const data = {
                hot: +this.addEditData.isRecommend,
                img: this.addEditData.cYImg,
                level: 0,
                name: this.addEditData.name,
                id: this.addEditData.id,
                orderNum: this.addEditData.sort,
                parentId: ''
              }
              updateStoreTypeByStore(data).then(res => {
                if (res.status) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            } else { // 二级
              const data = {
                hot: +this.addEditData.isRecommend,
                img: this.addEditData.cYImg,
                level: 1,
                name: this.addEditData.name1,
                id: this.addEditData.id,
                orderNum: this.addEditData.sort,
                parentId: this.addEditData.pid
              }
              updateStoreTypeByStore(data).then(res => {
                if (res.status) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
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
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStoreTypeByStore(data).then(res => {
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
    },
    closeDialog() {
      this.addFenleivisible = false
      this.$refs.addEditData.resetFields()
      this.addEditData.name = ''
      this.addEditData.name1 = ''
      this.addEditData.sort = ''
      this.addEditData.isShow = '1'
      this.addEditData.isRecommend = '1'
    }

  }
}
</script>

<style scoped>
.fenlei_admin_box{
  background: #F5F5FA;
  overflow: hidden;
}
.fenlei_admin_box .fenlei_admin{
  background: #fff;
  margin:15px;
  padding: 15px;
}
.page-footer{
  margin-top:20px;
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
