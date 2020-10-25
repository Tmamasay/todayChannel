<template>
  <div class="hw_admin_box shaowAll">
    <div v-if="+step===1">
      <div class="toolS">
        <p class="Ptitle">商品基本信息 <span class="ptFS">请您遵守国家相关规定，切勿上传低俗色情、暴力恐怖、谣言诈骗、侵权盗版等相关内容</span></p>
      </div>
      <div class="baseSt">
        <el-form ref="addCommodForm" label-position="left" label-width="80px" :model="addCommodForm" :rules="ruleCommod">

          <el-form-item label="封面图：" prop="imgOne">
            <el-upload
              list-type="picture-card"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              action
              :file-list="fileList"
              :show-file-list="true"
              :http-request="uploadFileFM"
              :limit="1"
              :on-change="handlePreview"
              :on-preview="handlePictureCardPreview"
              :on-success="handleSuccess"
            >
              <i class="el-icon-plus" />
              <div slot="tip" class="el-upload__tip">
                提示：支持格式JPG，JPEG,PNG,PDF
              </div>
              <el-dialog :visible.sync="dialogVisibleImg">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-upload>
          </el-form-item>
          <el-form-item label="轮播图：" prop="imgList">
            <div>
              <el-upload
                list-type="picture-card"
                action
                :file-list="fileList2"
                :show-file-list="true"
                :http-request="uploadFile"
                accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                :limit="6"
                :multiple="true"
                :on-change="handlePreview"
                :on-remove="handleRemove"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
              >
                <i class="el-icon-plus" />
                <div slot="tip" class="el-upload__tip">
                  提示：支持格式JPG，JPEG,PNG,PDF
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisibleImg">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="商品名" prop="goodsName">
            <el-input v-model="addCommodForm.goodsName" placeholder="请输入摘要" />
          </el-form-item>
          <!-- <el-form-item label="所属行业" prop="industry">
            <el-select v-model="addCommodForm.industry" placeholder="请选择" style="width:90%" @change="tradeNaChange">
              <el-option v-for="item in classList" :key="item.id" :label="item.tradeName" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="行业类目" prop="goodsTypeId">
            <el-cascader
              v-model="addCommodForm.goodsTypeId"
              :options="classFyList"
            />
          </el-form-item>
          <el-form-item label="展示价格" prop="showPrice">
            <el-input v-model="addCommodForm.showPrice" placeholder="请输入展示价格" />
          </el-form-item>
          <el-form-item label="商品备注" prop="remakes">
            <el-input v-model="addCommodForm.remakes" placeholder="请输入商品备注" />
          </el-form-item>
          <el-form-item label="商品标签" prop="labelNames">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              type="info"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>
          <el-form-item label="商品规格" prop="attributes">
            <div class="guiGe">
              <div class="guiOne">
                <span>规格组：</span>
                <el-tag
                  v-for="tag in GuienamicTags"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  type="success"
                  @close="handleGuieClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="GuieinputVisible"
                  ref="saveGuieTagInput"
                  v-model="GuieinputValue"
                  class="input-new-tag"
                  size="small"
                  @keyup.enter.native="handleGuieInputConfirm"
                  @blur="handleGuieInputConfirm"
                />
                <el-button v-else class="button-new-tag" size="small" @click="showGuieInput">+ 添加规格名</el-button>
              </div>
              <div v-for="(item,index) in GuienamicTags" :key="item" class="guiValue">
                <p>规格名：<span class="guGe">{{ item }}</span></p>

                <span v-if="SpecnamicTags.length&&SpecnamicTags[index]">
                  <span>规格值：</span>
                  <el-tag
                    v-for="tag in SpecnamicTags[index].attributeValue"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    type="warning"
                    @close="handleSpecClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </span>
                <el-input
                  v-if="SpecinputVisible&&SpecinputIndex===index"
                  ref="saveSpecInput"
                  v-model="SpecinputValue"
                  class="input-new-tag"
                  size="small"
                  @keyup.enter.native="handleSpecInputConfirm(item,index)"
                  @blur="handleSpecInputConfirm(item,index)"
                />
                <el-button v-else class="button-new-tag" size="small" @click="showSpecInput(index)">+ 添加规格值</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="介绍：" prop="goodsDetails">
            <EditorImage :value="addCommodForm.goodsDetails" @editlisten="geteditS" />
          </el-form-item>
          <!-- <el-form-item label="规格明细" /> -->
          <el-form-item>
            <el-button type="primary" @click="commodSubmit('addCommodForm')">下一步</el-button>
          </el-form-item>
        </el-form>

      <!-- <div slot="footer" class="dialog-footer">

        </div> -->
      </div>
    </div>

  </div>
</template>

<script>
import { fileUpload } from '@/api/chengxu'
import { getTradeList, updateGoodsToStore, getTypeList, getStoreGoodsToStore, addStoreGoodsToStore } from '@/api/user'
import EditorImage from '@/components/Tinymce/index' // 富文本编辑
export default {
  components: { EditorImage },
  data() {
    return {
      // 轮播图
      dialogImageUrl: null,
      imgList: [],
      fileUidList: [],
      classFyList: [], // 行业容器
      delIndex: null,
      classList: [],
      // ======
      dialogVisibleImg: false,
      step: 1,
      tableData: [],

      // 标签
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      // 规格
      GuienamicTags: [],
      GuieinputVisible: false,
      GuieinputValue: '',
      // 规格值
      SpecnamicTags: [],
      SpecinputVisible: false,
      SpecinputIndex: 0,
      SpecinputValue: '',

      fileList: [],
      fileList2: [],
      uploadData: null,
      dialogVisible: false,
      time: null,
      loading: false, // loading加载
      dataList: [], // 数据列表
      hwSize: 10, // 一页多少条
      hwCurrent: 1, // 页码
      total: 0, // 总数
      title: '', // 新增修改名称
      labelPosition: 'center', // 对齐方式
      addCommodForm: {
        goodsName: '', // 商品名称
        imgOne: '', // 商品缩略图
        imgList: [], // 轮播list
        labelNames: '', // 商品标签数组
        attributes: [], // 规格集合
        showPrice: '', // 展示价格
        industry: '', // 行业id
        goodsTypeId: '', // 商品类别id
        goodsDetails: '', // 商品详情
        remakes: '', // 商品备注
        status: 'STOP'// 商品状态("USE","上架","STOP","下架")
      },
      ruleCommod: {
        imgOne: [
          { required: true, message: '请上传缩略图', trigger: 'blur' }
        ],
        imgList: [
          { required: true, message: '请上传轮播图', trigger: 'blur' }
        ],
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        // labelNames: [
        //   { required: true, message: '请添加商品标签数组', trigger: 'blur' }
        // ],
        attributes: [
          { required: true, message: '请添加商品规格', trigger: 'blur' }
        ],
        showPrice: [
          { required: true, message: '请输入展示价格', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'chagne' }
        ],
        goodsTypeId: [
          { required: true, message: '请选择行业类目', trigger: 'chagne' }
        ],
        goodsDetails: [
          { required: true, message: '请添加商品详情', trigger: 'blur' }
        ],
        remakes: [
          { required: true, message: '请添加商品备注', trigger: 'blur' }
        ]
        //  status: [
        //   { required: true, message: '请添加商品商品规格', trigger: 'blur' }
        // ],
        // releaseTime: [
        //   { required: true, message: '请选择发布时间', trigger: 'change' }
        // ]
      }

    }
  },
  created() {

    // this.choiceBm()
  },
  mounted() {
    if (this.$route.query.goodsId) {
      this.getlist(this.$route.query.goodsId)
    }

    // this.getClassList()
    this.getFlList()
  },
  methods: {
    arrp(arr) {
    // 编辑原数组格式
      if (arr[0].attributeValue) {
        arr = arr.map((item) => {
          item = item.attributeValue
          return item
        })
      }
      if (arr.length === 1) {
        // 最终合并成一个
        return arr[0]
      } else {	// 有两个子数组就合并
        const arrySon = []
        // 将组合放到新数组中
        arr[0].forEach((_, index) => {
          arr[1].forEach((_, index1) => {
            arrySon.push([].concat(arr[0][index], arr[1][index1]))
          })
        })
        // 新数组并入原数组,去除合并的前两个数组
        arr[0] = arrySon
        arr.splice(1, 1)
        // 递归
        return this.arrp(arr)
      }
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
    // tradeNaChange(value) {
    //   this.getFlList(value)
    // },
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
    async getFlList() {
      const _this = this

      await getTypeList().then(res => {
        console.log(res)
        if (res.status) {
          _this.classFyList = this.generateRoutes(res.data)
          console.log(_this.classFyList)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },

    formatDAta(data) {
      const ObjData = []
      data.forEach(el => {
        if (el.value.length) {
          el.value.forEach(ment => {
            ObjData.push({
              name: el.name,
              value: ment
            })
          })
        }
      })
      console.log(ObjData)
      console.log('--------------')
      return ObjData
    },
    // 里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    },
    // 标签-----------》
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // END----------->
    // 规格名列表
    handleGuieClose(tag) {
      this.GuienamicTags.splice(this.GuienamicTags.indexOf(tag), 1)
    },

    showGuieInput() {
      this.GuieinputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveGuieTagInput.$refs.input.focus()
      })
    },

    handleGuieInputConfirm() {
      const inputValue = this.GuieinputValue
      if (inputValue) {
        this.GuienamicTags.push(inputValue)
      }
      this.GuieinputVisible = false
      this.GuieinputValue = ''
    },
    // end===========
    // 规格值列表
    handleSpecClose(tag) {
      this.SpecnamicTags.splice(this.SpecnamicTags.indexOf(tag), 1)
    },

    showSpecInput(index) {
      this.SpecinputVisible = true
      this.SpecinputIndex = index
      this.$nextTick(_ => {
        // console.log(this.$refs.saveSpecInput)
        // console.log(this.$refs.saveSpecInput[index])
        // console.log('[[[======')
        // console.log(index)
        this.$refs.saveSpecInput[index].$refs.input.focus()
      })
    },

    handleSpecInputConfirm(key, index) {
      // alert(key)
      const inputValue = this.SpecinputValue
      if (inputValue) {
        const foundIndex = this.SpecnamicTags.findIndex(el => el.attributeKey === key)
        if (foundIndex !== -1) {
          // alert(2)
          this.SpecnamicTags[foundIndex].attributeValue.push(inputValue)
        } else {
          // alert(1)
          this.SpecnamicTags.push({
            attributeKey: '',
            attributeValue: []
          })
          this.SpecnamicTags[index].attributeKey = key
          this.SpecnamicTags[index].attributeValue.push(inputValue)
          console.log(this.SpecnamicTags)
        }
        this.addCommodForm.attributes = this.SpecnamicTags
        console.log(this.addCommodForm.attributes)
        console.log('-0-----------')
      }

      this.SpecinputVisible = false
      this.SpecinputValue = ''
    },
    // end=------------>

    goPre(row) {
      this.step = 1
      // this.$router.push({ path: '/preDetaill', query: { newsId: row.id }})
      // this.$router.push({ path: '/Platform', query: { newsId: row.id }})
    },
    goEdit(row) {
      this.dialogVisible = true
      this.addCommodForm = {
        id: row.id,
        noticeImg: row.noticeImg,
        releaseTime: row.releaseTime,
        remark: row.remark,
        source: row.source,
        textBody: row.textBody,
        title: row.title
      }
      this.fileList.push({
        url: row.noticeImg
      })
    },

    handleSuccess(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    uploadFileFM(e) {
      fileUpload(this.uploadData).then(res => {
        if (res) {
          this.addCommodForm.imgOne = res.data
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.status)
        }
      })
    },
    uploadFile(e) {
      fileUpload(this.uploadData).then(res => {
        if (res) {
          this.addCommodForm.imgList.push(res.data)
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.status)
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file)
      if (this.fileUidList.length) {
        this.delIndex = this.fileUidList.findIndex(el => el === file.uid)
        this.addCommodForm.imgList.splice(this.delIndex, 1)
        this.fileUidList.splice(this.delIndex, 1)
        // console.log(this.imgList)
      } else {
        // console.log(this.imgList)
        const _AU = this.addCommodForm.imgList.findIndex(el => el === file.url)
        this.addCommodForm.imgList.splice(_AU, 1)
      }
    },
    // 获取上传文件信息
    handlePreview(file) {
      const _this = this
      _this.fileUidList.push(file.uid)
      var formData = new FormData()
      formData.append('file', file.raw)
      _this.uploadData = formData
    },
    geteditS(data) {
      this.addCommodForm.goodsDetails = data
    },

    // 列表
    async getlist(id) {
      var data = {
        id: id
      }
      await getStoreGoodsToStore(data).then(res => {
        console.log(res)
        if (res.status) {
          this.dynamicTags = []
          this.GuienamicTags = []
          this.SpecnamicTags = []
          this.getFlList(res.data.goods.tradeId)
          // this.addCommodForm.attributes = res.data.keyValus
          this.addCommodForm.id = res.data.goods.id
          this.addCommodForm.goodsDetails = res.data.goods.goodsDetails
          this.addCommodForm.goodsName = res.data.goods.goodsName
          this.addCommodForm.imgOne = res.data.goods.imgOne

          // this.imgList = res.data.goods.imgList.split(',')
          this.addCommodForm.imgList = res.data.goods.imgList.split(',')
          res.data.lables.forEach(element => {
            this.dynamicTags.push(element.labelName)
          })
          const listIMG = res.data.goods.imgList.split(',')
          listIMG.forEach(element => {
            this.fileList2.push({
              url: element
            })
          })
          this.fileList.push({
            url: res.data.goods.imgOne
          })
          res.data.skus.forEach(element => {
            this.GuienamicTags.push(element.keyName)
            const _Floy = {
              attributeKey: '',
              attributeValue: []
            }
            element.values.forEach(el => {
              _Floy.attributeKey = element.keyName
              _Floy.attributeValue.push(el)
            })
            this.SpecnamicTags.push(_Floy)
            this.addCommodForm.attributes = this.SpecnamicTags
          })
          this.addCommodForm.industry = `${res.data.goods.tradeId}`
          this.addCommodForm.goodsTypeId = `${res.data.goods.goodsTypeId}`
          this.addCommodForm.remakes = res.data.goods.remakes
          this.addCommodForm.showPrice = res.data.goods.showPrice
          this.addCommodForm.status = res.data.goods.status
        }
      })
    },
    // 新增
    async commodSubmit(formName) {
      // this.step = 2
      // console.log(this.SpecnamicTags)
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            id: this.addCommodForm.id || null,
            attributes: this.arrp(this.addCommodForm.attributes),
            attributeName: this.GuienamicTags,
            goodsDetails: this.addCommodForm.goodsDetails,
            goodsName: this.addCommodForm.goodsName,
            goodsTypeId: typeof (this.addCommodForm.goodsTypeId) === 'string' ? this.addCommodForm.goodsTypeId : this.addCommodForm.goodsTypeId[this.addCommodForm.goodsTypeId.length - 1],
            imgOne: this.addCommodForm.imgOne,
            imgList: this.addCommodForm.imgList.join(','),
            labelNames: this.dynamicTags,
            remakes: this.addCommodForm.remakes,
            showPrice: +this.addCommodForm.showPrice,
            status: this.addCommodForm.status
          }
          if (this.addCommodForm.id) {
            // const data2 = {
            //   id: this.addCommodForm.id,
            //   attributes: this.addCommodForm.attributes,
            //   goodsDetails: this.addCommodForm.goodsDetails,
            //   goodsName: this.addCommodForm.goodsName,
            //   goodsTypeId: this.addCommodForm.goodsTypeId[this.addCommodForm.goodsTypeId.length - 1],
            //   imgOne: this.addCommodForm.imgOne,
            //   imgList: this.addCommodForm.imgList.join(','),
            //   labelNames: this.dynamicTags,
            //   remakes: this.addCommodForm.remakes,
            //   showPrice: +this.addCommodForm.showPrice,
            //   status: this.addCommodForm.status
            // }
            updateGoodsToStore(data).then(res => {
              if (res.status) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.go(-1)
              }
            })
          } else {
            addStoreGoodsToStore(data).then(res => {
              if (res.status) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.go(-1)
                // setTimeout(() => {
                //   this.getlist()
                // }, 1500)
              }
            })
          }
        }
      })
    }

  }
}
</script>
<style  scoped>
.el-tag + .el-tag {
    margin-left: 10px;
    /* color:#00c48f */
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    /* line-height: 30px;
    padding-top: 0;
    padding-bottom: 0; */
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
   table
        {
          width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
            text-align: center;
        }
        table td, table th
        {
            border: 1px solid #ebebeb;
            color: #666;
            width: 60px !important;
            height: 30px !important;
        }

</style>

<style scoped>
.toolS{
  display: flex;
  justify-content: space-between;
   /* padding-bottom: 10px; */
    align-items:center;
    margin-bottom: 14px;
    /* padding: 15px 0; */
    font-size: 0;
    border-bottom: 1px solid #f5f5f5;
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
.ptFS{
  display: inline-block;
    font-size: 12px;
    color: #999;
    font-weight: 400;

    margin-left: 16px;
}
.baseSt{
  width: 50%;
}
.guiGe{
  border: 1px dashed #d1d1d1;
  /* height: 400px; */
  padding: 5px 10px;
}
.guiOne{
  color: #606266;
  /* background-color: #f5f5f5; */
}
.guGe{

  font-weight: 600;
}
.hw_admin_box{
    margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.el-button{
    padding: 8px 12px !important;
    position: relative;
}
.el-message-box {
    width: 1500px !important;
  }
</style>
