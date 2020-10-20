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
          <el-table-column prop="imgUrl" label="LOGO">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <viewer>
                  <img
                    :src="scope.row.imgUrl"
                    alt="无图片"
                    style="height: 50px; width: 50px;display: block;cursor: pointer;"
                  >
                </viewer>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="courseCount" label="课程数" align="center" />
          <el-table-column prop="sort" label="排序" align="center">
            <template slot-scope="scope">
              {{ scope.row.sort }}
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" label="是否显示" align="center">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.isOpen===1?true:false"
                active-color="#13ce66"
                inactive-color="#dee3e6"
                @change="isUp(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="updateName" label="编辑者" align="center" />
          <el-table-column prop="updateTime" label="编辑时间" :formatter="dateFormat" align="center" />
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
              <el-col :span="10">
                <el-form-item label="LOGO：" required>
                  <el-upload
                    ref="upload"
                    accept="image/jpeg, image/jpg, image/png"
                    :action="oss.action"
                    :data="oss.data"
                    :on-success="handSuccess"
                    :on-change="handChange"
                    :auto-upload="false"
                    :show-file-list="false"
                    class="avatar-uploader"
                  >
                    <img v-if="oss.imgUrl" :src="oss.imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-button size="mini" type="primary" @click="submitUpload">上传服务器</el-button>
                <div class="el-upload__tip">banner图片上传jpg/png文件格式<br>且不超过1M，图片高宽60像素</div>
              </el-col>
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
            <el-form-item prop="isShow" label="是否显示：">
              <el-radio-group v-model="addEditData.isShow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item prop="isRecommend" label="是否推荐：">
              <el-radio-group v-model="addEditData.isRecommend">
                <el-radio label="1">推荐</el-radio>
                <el-radio label="0">不推荐</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
          <div class="el-center">
            <ElButton type="primary" size="mini" @click="onSubmit('addEditData')">提交</ElButton>
            <ElButton size="mini" plain @click="addFenleivisible=false">取消</ElButton>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getfenleilist, saveCourseCategory, deleteCourseCategory, updateCourseCategory, openOrCloseCategory } from '@/api/kaoshi_lrs'
import moment from 'moment'
import common_problem_listVue from '../information-manage/common_problem_list.vue'
import { tracherOssImg } from '@/utils/ossimg'
import { newGeneratePostPolicy } from '@/api/common'
export default {
  data() {
    return {
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
        name: '', // 一级名称
        name1: '', // 二级名称
        twofenleiName: '', // 创建二级时获取一级的名称
        sort: '', // 排序
        isShow: '1', // 是否显示
        isRecommend: '1', // 是否推荐
        pid: '', // 父级id
        id: ''// 修改id
      },
      oss: {// banner图
        img_oss: {},
        action: '',
        imgUrl: '',
        data: {},
        imgId: '',
        imageInfoFlag: false,
        imageTemporaryFlag: false
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
    /*
    *功能描述：获取列表
    *开发人员：LRS
    */
    getlist() {
      const _this = this
      _this.loading = true
      var cansu = {
        name: _this.searchData.name_value,
        current: _this.current,
        size: _this.size,
        startTime: _this.searchData.date_value ? _this.searchData.date_value[0] : '',
        endTime: _this.searchData.date_value ? _this.searchData.date_value[1] : ''
      }
      getfenleilist(cansu).then(res => {
        if (+res.code === 1) {
          _this.tableData = res.data.records
          var json = JSON.stringify(_this.tableData).replace(/childrenList/g, 'children')
          _this.tableData = JSON.parse(json)
          console.log(_this.tableData)
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
      this.oss.imgUrl = ''
      this.title = '添加分类'
      this.addFenleivisible = true
      this.fenleiShow = 1
      this.getPostPolicy()
    },
    /*
    *功能描述：二级添加分类弹出框
    *开发人员：LRS
    */
    twofenlei(e) {
      this.oss.imgUrl = ''
      this.addFenleivisible = true
      this.fenleiShow = 2
      this.title = '添加分类'
      console.log(e)
      // this.addEditData.twofenleiName = e.name
      this.addEditData.pid = e.id
      // this.addEditData.name = e.name
      this.getPostPolicy()
    },

    /*
    *功能描述：编辑弹出框
    *开发人员：LRS
    */
    edit(e) {
      this.addFenleivisible = true
      this.title = '编辑分类'
      console.log(e)
      this.getPostPolicy()
      this.oss.imageInfoFlag = true
      this.addEditData.name = e.name
      this.addEditData.name1 = e.name
      this.addEditData.sort = e.sort
      this.addEditData.isShow = '' + e.isOpen
      this.addEditData.isRecommend = '' + e.isRecommend
      this.addEditData.id = e.id
      this.img_url = e.imgUrl
      this.oss.imgUrl = e.imgUrl

      if (!e.children) { // 2级
        this.fenleiShow = 2
      } else { // 1级
        this.fenleiShow = 1
      }

      console.log(this.oss.imgUrl)
      // 图片回显
      // const obj = new Object()
      // obj.url = e.imgUrl
      // this.fileList.push(obj)
    },

    /*
    *功能描述：新增、编辑分类提交
    *开发人员：LRS
    */
    onSubmit(formName) {
      // if (this.img_url === '') {
      //   this.$message({ message: '请上传图片！', type: 'warning' })
      // } else {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.oss.imgUrl) {
            return this.$message.warning('请上传LOGO！')
          }
          if (!this.oss.imageInfoFlag) {
            return this.$message.warning('请上传LOGO到服务器！')
          }
          if (this.title === '添加分类') { // 添加分类
            if (+this.fenleiShow === 1) { // 一级分类
              const data = {
                name: this.addEditData.name,
                pid: 0,
                sort: +this.addEditData.sort,
                imgUrl: this.oss.imgUrl,
                isOpen: +this.addEditData.isShow,
                resourceId: this.oss.imgId
              }
              saveCourseCategory(data).then(res => {
                console.log(res)
                if (+res.code === 1) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            } else { // 二级
              const data = {
                name: this.addEditData.name1,
                pid: this.addEditData.pid,
                sort: +this.addEditData.sort,
                imgUrl: this.oss.imgUrl,
                isOpen: +this.addEditData.isShow,
                isRecommend: +this.addEditData.isRecommend,
                resourceId: this.oss.imgId
              }
              saveCourseCategory(data).then(res => {
                console.log(res)
                if (+res.code === 1) {
                  this.$message({ message: '添加成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            }
          } else { // 编辑分类
            if (+this.fenleiShow === 1) { // 一级分类
              const data = {
                name: this.addEditData.name,
                pid: 0,
                sort: +this.addEditData.sort,
                imgUrl: this.oss.imgUrl,
                isOpen: +this.addEditData.isShow,
                isRecommend: +this.addEditData.isRecommend,
                id: this.addEditData.id,
                resourceId: this.oss.imgId
              }
              updateCourseCategory(data).then(res => {
                console.log(res)
                if (+res.code === 1) {
                  this.$message({ message: '修改成功', type: 'success' })
                  this.addFenleivisible = false
                  this.getlist()
                }
              })
            } else { // 二级
              const data = {
                name: this.addEditData.name1,
                pid: this.addEditData.pid,
                sort: +this.addEditData.sort,
                imgUrl: this.oss.imgUrl,
                isOpen: +this.addEditData.isShow,
                isRecommend: +this.addEditData.isRecommend,
                id: this.addEditData.id,
                resourceId: this.oss.imgId
              }
              updateCourseCategory(data).then(res => {
                console.log(res)
                if (+res.code === 1) {
                  this.$message({ message: '修改成功', type: 'success' })
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
      // }
    },

    /*
    *功能描述：删除分类
    *开发人员：LRS
    */
    remove(e) {
      console.log(e)
      var data = {
        categoryId: +e.id
      }
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourseCategory(data).then(res => {
          console.log(res)
          if (+res.code === 1) {
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
    *功能描述：是否显示状态
    *开发人员：LRS
    */
    isUp(row) {
      console.log(row)
      const _this = this
      if (!row.children) { // children不存在证明是子级
        /*
        *思路：循环整个数组匹配id === 当前点击列表的父级id 得到 当前点击列表父级的整条数据
        *目的：判断父级是否是开启状态
        */
        const json = _this.tableData.filter(item => item.id === row.parentId)
        if (json[0].isOpen === 0) { // 证明父级没有开启
          this.$message({
            message: '必须先开启父级，才能开启子级',
            type: 'warning'
          })
        } else {
          if (+row.isOpen === 1) { // 1开启状态 0关闭状态
            const data = {
              isOpen: 0,
              id: row.id
            }
            openOrCloseCategory(data).then(res => {
              if (+res.code === 1) {
                _this.getlist()
              }
            })
          } else {
            const data = {
              isOpen: 1,
              id: row.id
            }
            openOrCloseCategory(data).then(res => {
              if (+res.code === 1) {
                _this.getlist()
              }
            })
          }
        }
      } else { // 父级
        if (+row.isOpen === 1) { // 1开启状态 0关闭状态
          if (row.children.length === 0) { // 证明是一级分类
            const data = {
              isOpen: 0,
              id: row.id
            }
            openOrCloseCategory(data).then(res => {
              if (+res.code === 1) {
                _this.getlist()
              }
            })
          } else {
            /*
            *思路：循环当前子级 匹配parentId === 当前点击列表的id 得到 所有的子级数组
            *目的：判断子级是否全部关闭
            */
            var json = row.children.filter(item => item.parentId === row.id)
            console.log('111')
            json.forEach(item => {
              if (+item.isOpen === 1) {
                this.$message({
                  message: '子级必须全部关闭，才能关闭父级',
                  type: 'warning'
                })
                return false
              } else {
                const data = {
                  isOpen: 0,
                  id: row.id
                }
                openOrCloseCategory(data).then(res => {
                  if (+res.code === 1) {
                    _this.getlist()
                  }
                })
              }
            })
          }
        } else {
          console.log('222')
          const data = {
            isOpen: 1,
            id: row.id
          }
          openOrCloseCategory(data).then(res => {
            if (+res.code === 1) {
              _this.getlist()
            }
          })
        }
      }
    },

    /*
    *功能描述：获取图片上传凭证
    *开发人员：LRS
    */
    async getPostPolicy() {
      const req = await newGeneratePostPolicy(tracherOssImg)
      console.log(req)
      if (req.statusCode === '00000') {
        this.oss.img_oss = req.data
      }
    },

    /*
    *功能描述：banner上传图片
    *开发人员：LRS
    */
    handChange(file) {
      const _this = this
      if (this.oss.imageTemporaryFlag) {
        this.oss.imageTemporaryFlag = false
        return
      }
      this.oss.imageInfoFlag = false
      const timers = new Date().getTime()
      const index1 = file.name.lastIndexOf('.')
      const index2 = file.name.length
      const fileExname = file.name.substring(index1 + 1, index2)
      const key_data = `${this.oss.img_oss.dir}${timers}.${fileExname}`
      _this.oss.action = this.oss.img_oss.host
      _this.oss.data = {
        key: key_data,
        OSSAccessKeyId: _this.oss.img_oss.accessId,
        callback: _this.oss.img_oss.callback,
        date: _this.oss.img_oss.date,
        policy: _this.oss.img_oss.policy,
        Signature: _this.oss.img_oss.signature
      }
      const blob = new Blob([file.raw], { type: file.raw.type })
      this.oss.imgUrl = window.URL.createObjectURL(blob)
    },

    /*
    *功能描述：banner上传图片成功回调
    *开发人员：LRS
    */
    handSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      if (response.statusCode === '00000') {
        this.oss.imageInfoFlag = true
        this.oss.imageTemporaryFlag = true
        this.oss.imgUrl = file.response.data.permanentUrl
        this.oss.imgId = file.response.data.id
        console.log(this.oss.imgUrl, this.oss.imgId)
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败，请联系管理员!')
      }
    },
    /*
    *功能描述：上传服务器验证
    *开发人员：LRS
    */
    async submitUpload() {
      const _this = this
      if (!this.oss.imgUrl) {
        return this.$message.info('请上传banner图！')
      }

      this.$refs.upload.submit()
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
    },
    /*
    *功能描述：时间格式化
    *开发人员：LRS
    */
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
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
