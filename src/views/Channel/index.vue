<template>
  <!--  优惠卷  -->
  <div class="fenlei_admin_box shaowAll" :style="{height:bodyHeight}">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in VoucherTypes" :key="index" :label="item.value" :name="item.name" />
    </el-tabs>
    <div v-if="activeName=='man_jian'">
      <fullReduction :coupon="activeName" />
    </div>
  </div>
</template>

<script>
import { selectVoucherTypes } from '@/api/user'
import fullReduction from './components/fullReduction'
export default {
  components: {
    fullReduction
  },
  data() {
    return {
      activeName: '', // 选中种类
      VoucherTypes: [] // 优惠卷种类

    }
  },
  mounted() {
    this.selectVoucherTypesList()
    /*
    *功能描述：获取屏幕高度添加背景色
    *开发人员：LRS
    */
    this.bodyHeight = window.innerHeight - 85 + 'px'
  },
  methods: {
    /*
    *功能描述：切换tab
    *开发人员：cx
    */
    handleClick(tab, event) {
      console.log(tab)
      this.activeName = tab.name
    },
    /*
    *功能描述：展示店铺优惠券的所有分类
    *开发人员：CX
    */
    selectVoucherTypesList() {
      selectVoucherTypes().then(res => {
        if (res.status) {
          this.VoucherTypes = res.data
          this.activeName = this.VoucherTypes[0].name
        }
      })
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
