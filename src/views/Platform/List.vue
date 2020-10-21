<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="goAdd">新增商品</el-button>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="query.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="" style="">
          <el-select v-model="query.showType" placeholder="请选择" style="width:90%">
            <el-option label="所有商品" value="0" />
            <el-option label="已关联分类" value="1" />
            <el-option label="未关联分类" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-left:-15px">
          <el-select v-model="query.status" placeholder="请选择" style="width:90%">
            <el-option label="请选择" value="" />
            <el-option label="上架" value="USE" />
            <el-option label="下架" value="STOP" />
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-left:-15px">
          <el-cascader
            v-model="query.goodsTypeId"
            :options="classFyList"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
          <el-button type="danger" @click="clearSE">清空</el-button>
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
      <el-table-column prop="imgOne" width="180" label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.imgOne" alt="" srcset="" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" />
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
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        label="操作"
        width="300"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='USE'" size="small" @click="disableGoodsAdmin(scope.row)">下架</el-button>
          <el-button size="small" @click="goSkuEdit(scope.row)">SKU管理</el-button>
          <el-button size="small" type="danger" @click="goEdit(scope.row)">编辑</el-button>

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
    <el-dialog
      :title="skuTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="80%"
    >
      <div v-if="dialogVisible">
        <!-- <span style="font-weight: 600;">商品名称：{{ SkuList.goods.goodsName }}</span>
        <span style="font-weight: 600;padding-left:15px">封面价格：{{ SkuList.goods.showPrice }}</span> -->
        <el-table
          v-loading="loading"
          :data="SkuList.skuList"
          tooltip-effect="dark"
          height="600"
          style="width:95%;margin:10px auto 20px auto;"
          highlight-current-row
        >
          <el-table-column prop="keyName" label="属性名" />
          <el-table-column prop="valueName" label="属性值" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="discountPrice" label="优惠价" />
          <el-table-column prop="skuImg" label="缩略图">
            <template slot-scope="scope">
              <img :src="scope.row.skuImg" alt="" width="80px" height="80px" srcset="">
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==='USE'" class="useSign">上架中</span>
              <span v-else-if="scope.row.status==='STOP' " class="noUseSign" type="danger">已下架</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.status==='USE'" size="small" @click="downGoodsSKUAdmin(scope.row)">下架</el-button>
              <el-button v-if="scope.row.status==='STOP'" size="small" @click="goSkuUpDIGO(scope.row)">上架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--编辑sku值-->
    <el-dialog
      :title="showSkuTitle"
      :visible.sync="dialogSKUVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form v-if="dialogSKUVisible" ref="skuForm" label-width="100px" :model="skuForm" :rules="rulesSKU">
        <el-form-item label="缩略图">
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="skuForm.price" placeholder="请输入价格" style="width:65%" />
        </el-form-item>
        <el-form-item label="优惠价" prop="discountPrice">
          <el-input v-model="skuForm.discountPrice" style="width:65%" placeholder="请输入优惠价" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSKUVisible=false">取 消</el-button>
        <el-button type="primary" @click="goSkuUp('skuForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectGoodsByStore, getTypeList, selectSKUByStore, upGoodsSKUAdmin, downGoodsSKUAdmin, disableGoodsAdmin } from '@/api/user'
import { fileUpload } from '@/api/chengxu'
export default {

  data() {
    // validator
    const validatePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写价格'))
      } else {
        callback()
      }
    }
    const validateDiscount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写优惠价格'))
      } else {
        callback()
      }
    }
    return {
      classFyList: [],
      query: {
        showType: '', // 是否展示有行业类别的商品(0:全查1:有类别的,2:没有类别的)
        goodsName: '', // 商品名称
        status: '', // 商品状态("USE","上架","STOP","下架")
        goodsTypeId: ''// 商品类别id
      },
      showSkuTitle: '', // 显示名
      skuGoodsId: '',
      dialogSKUVisible: false,
      skuForm: {
        price: '',
        discountPrice: '',
        skuImg: ''
      },
      rulesSKU: {
        price: [
          { required: true, validator: validatePrice, trigger: 'blur' }
        ],
        discountPrice: [
          { required: true, validator: validateDiscount, trigger: 'blur' }
        ]
      },
      // --------
      dialogVisibleImg: false,
      dialogImageUrl: null,
      uploadImg: null,
      fileList: [],
      uploadData: null,
      SkuList: [],
      skuTitle: '',
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      datalist: [],
      addClassfy: {
        className: ''

      },
      dialogVisible: false,
      loading: false, // loading加载
      rules: {
        price: [
          { required: true, validator: validatePrice, trigger: 'blur' }
        ],
        discountPrice: [
          { required: true, validator: validateDiscount, trigger: 'blur' }
        ]
      }

    }
  },
  mounted() {
    this.getlist()
    this.getFlList()
  },
  methods: {
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
    // 列表
    async getFlList(value) {
      const _this = this
      await getTypeList().then(res => {
        console.log(res)
        if (res.status) {
          _this.classFyList = this.generateRoutes(res.data)
          console.log(_this.classFyList)
        }
      })
    },
    // 下架
    downGoodsSKUAdmin(row) {
      downGoodsSKUAdmin({
        id: row.id
        // tradeName: row.tradeName
      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getSKUList(row.goodsId)
        }
      })
    },
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
          this.skuForm.skuImg = res.data
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
    goSkuEdit(row) {
      this.dialogVisible = true
      this.getSKUList(row.id)
    },
    // 下架
    disableGoodsAdmin(row) {
      disableGoodsAdmin({
        id: row.id

      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getlist()
        }
      })
    },
    goEdit(row) {
      this.$router.push({ path: '/platform', query: { goodsId: row.id }})
    },
    goSkuUpDIGO(row) {
      this.dialogSKUVisible = true
      this.fileList = []
      this.skuGoodsId = row
      this.showSkuTitle = `上架—(${row.keyName}-${row.valueName})`
      this.skuForm = {
        price: row.price,
        discountPrice: row.discountPrice,
        skuImg: row.discountPrice
      }
      if (row.skuImg) {
        this.fileList.push({
          url: row.skuImg
        })
      }
    },
    goSkuUp(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          upGoodsSKUAdmin({
            discountPrice: +this.skuForm.discountPrice,
            id: this.skuGoodsId.id,
            price: +this.skuForm.price,
            skuImg: this.skuForm.skuImg
          }).then(res => {
            if (res.status) {
              _this.$message({ message: '操作成功', type: 'success' })
              _this.$refs.upload.clearFiles()
              _this.dialogSKUVisible = false

              _this.getSKUList(this.skuGoodsId.goodsId)
            }
          })
        }
      })
    },

    goAdd(row) {
      this.$router.push({ path: '/platform' })
    },
    clearSE() {
      this.query = {
        showType: '', // 是否展示有行业类别的商品(0:全查1:有类别的,2:没有类别的)
        goodsName: '', // 商品名称
        status: '', // 商品状态("USE","上架","STOP","下架")
        goodsTypeId: ''// 商品类别id
      }
      this.getlist()
    },
    getlist() {
      const _this = this
      _this.loading = true
      selectGoodsByStore({
        showType: +_this.query.showType, // 是否展示有行业类别的商品(0:全查1:有类别的,2:没有类别的)
        goodsName: _this.query.goodsName, // 商品名称
        status: _this.query.status, // 商品状态("USE","上架","STOP","下架")
        goodsTypeId: _this.query.goodsTypeId[_this.query.goodsTypeId.length - 1],
        current: _this.Current,
        size: _this.Size
      }).then(res => {
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
    getSKUList(id) {
      const _this = this
      _this.loading = true
      selectSKUByStore({
        id: id
      }).then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)

          _this.SkuList = res.data
          _this.skuTitle = `SKU操作—${res.data.goods.goodsName}`
          console.log(_this.SkuList)
          // _this.total = res.data.total
        }
      })
    },
    showFlie(fileU) {
      const ShowArr = []
      if (!fileU.skuImg) {
        return ShowArr
      }

      ShowArr.push({
        url: fileU.skuImg
      })
      return ShowArr
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
