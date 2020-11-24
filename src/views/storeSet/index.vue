<template>
  <!--  优惠卷  -->
  <div class="fenlei_admin_box shaowAll"  style="height:500px">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="营业时间" name="first"   >
         <el-form style="padding:20px"  ref="addEditData" :rules="addEditrules" :inline="true" :model="addEditData" label-width="110px">
            <el-form-item label="营业时间：" prop="time">
              <el-time-picker
                is-range
                 arrow-control
                v-model="addEditData.time"
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开店时间"
                end-placeholder="关店时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <el-button type="primary" style="margin-left:15px" @click="onSubmit('addEditData')">提交</el-button>
            </el-form-item>
            <p style="font-size:25px;font-weight:500">开店时间：{{config.startTime}}</p>
            <p style="font-size:25px;font-weight:500">关店时间：{{config.endTime}}</p>
          </el-form>
      </el-tab-pane>
      <el-tab-pane label="是否打单" name="second"  >
      <div style="padding:20px">
          <el-radio v-model="isPrint" label="0" border>不打单</el-radio>
          <el-radio v-model="isPrint" label="1" border>打单</el-radio>
          <el-button type="primary" @click="onSubmit2">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="起送价" name="third"  >
        <div style="padding:20px">
    <el-input v-model="StartPrice" class="no-number" style="width:140px"  placeholder="起送价" />
        <el-button type="primary" @click="onSubmit3" style="margin-left:30px">提交</el-button>
        </div>
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { setStoreBusinessTime,setStorePrint ,setStoreStartPrice,getMySwitch} from '@/api/user'

export default {
  components: {

  },
  data() {
    return {
      activeName: 'first', // 选中种类
      VoucherTypes: [], // 优惠卷种类
      addEditData:{
          time:''
      },
      isPrint:'1',
      StartPrice:0,
      config:{},
      addEditrules: {
        time: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ]
        }

    }
  },
  mounted() {
    this.gitConfig()
    /*
    *功能描述：获取屏幕高度添加背景色
    *开发人员：LRS
    */
    // this.bodyHeight = window.innerHeight - 85 + 'px'
  },
  methods: {
    gitConfig(){
      getMySwitch({
             startPrice:+this.StartPrice
            }).then(res => {
              console.log(res)
              if (res.status) {
                this.config=res.data.switch
                this.isPrint=res.data.switch.isPrint+''
                this.StartPrice=res.data.switch.startPrice
        
              }
            })

    },
     onSubmit3(){
       if (!this.StartPrice) {
         this.$message({ message: '请设置起送价', type: 'warning' })
          return
       }
       setStoreStartPrice({
             startPrice:+this.StartPrice
            }).then(res => {
              console.log(res)
              if (res.status) {
                this.$message({ message: '操作成功', type: 'success' })
                this.gitConfig()
              }
            })

    },
    onSubmit2(){
       setStorePrint({
             isPrint:+this.isPrint
            }).then(res => {
              console.log(res)
              if (res.status) {
                this.$message({ message: '操作成功', type: 'success' })
                this.gitConfig()
              }
            })

    },
     onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.addEditData)
            setStoreBusinessTime({
              endTime:this.addEditData.time[1],
	            startTime: this.addEditData.time[0]
            }).then(res => {
              console.log(res)
              if (res.status) {
                this.$message({ message: '操作成功', type: 'success' })
                  this.gitConfig()
              }
            })
        }
      })
    },
    /*
    *功能描述：切换tab
    *开发人员：cx
    */
    handleClick(tab, event) {
      console.log(tab)
      this.activeName = tab.name
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
