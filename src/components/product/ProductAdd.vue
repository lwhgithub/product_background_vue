<template>
  <div>


       <div style="margin-left:230px;width: 800px">
           <el-steps :active="active" finish-status="success" align-center>
             <el-step title="步骤 1"></el-step>
             <el-step title="步骤 2"></el-step>
          </el-steps>
       </div>
        <div style="margin-left:200px;margin-top: 50px; width: 700px" v-show="productaddform">
              <el-form :model="addProductForm"  ref="addProductForm" >
                <el-form-item label="名称" :label-width="formLabelWidth" prop="productName">
                  <el-input v-model="addProductForm.productName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label=" 标题" :label-width="formLabelWidth" prop="productTitle">
                  <el-input v-model="addProductForm.productTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="productBrandId">
                  <div align="left">
                    <el-select v-model="addProductForm.productBrandId" placeholder="属性分类" style="width: 300px">
                      <el-option :label="brand.brandname"  :value="brand.brandid" v-for="(brand,index) in productBrand" :key="index"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="商品介绍" :label-width="formLabelWidth" prop="productDesc">
                  <el-input type="textarea" v-model="addProductForm.productDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" :label-width="formLabelWidth" prop="productPrice">
                  <el-input v-model="addProductForm.productPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth" prop="productStock">
                  <el-input v-model="addProductForm.productStock" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="productSortNum">
                  <el-input v-model="addProductForm.productSortNum" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
        </div>
    <div style="margin-left:200px;margin-top: 50px; width: 700px" v-show="!productaddform">
      <el-form :model="addProductForm"  ref="addProductForm" >
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId">
          <div align="left">
            <el-select v-model="productPropertyCategory" placeholder="属性分类" style="width: 300px">
              <el-option :label="category.name"  :value="category.id" v-for="(category,index) in categoryTypes" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>

      </el-form>
    </div>

      <div style="margin-left: 530px" v-if="active==0">
        <div>
            <el-button type="primary" size="medium" @click="next">下一步，填写商品属性</el-button>
        </div>
      </div>
      <div style="margin-left: 420px;width: 480px" v-if="active==1">
        <div style="float: left">
          <el-button type="primary" size="medium" @click="nexts">上一步，填写商品信息</el-button>
        </div>
        <div style="float: right">
          <el-button type="primary" size="medium" @click="addProduct()">点击提交</el-button>
        </div>
      </div>
  </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
                //步骤条
                active: 0,
                productaddform:true,
                //添加商品的对象
                addProductForm:{
                    productName:'',
                    productTitle:'',
                    productBrandId:'',
                    productDesc:'',
                    productPrice:'',
                    productStock:'',
                    productSortNum:'',

                    addproductPropertyCategory:'',
                },
                productPropertyCategory:'',
                //商品品牌的数组
                productBrand:[],
                //宽度
                formLabelWidth: '220px',

                //分类name拼接
                categoryData:[],
                categoryTypeName:'',
                categoryTypes:[],
            };
        },

        methods: {
            //获取商品品牌
            getProductBrandData(){
                var self=this;
                this.$axios.get("api/api/product/getProductBrandData").then(function (res) {
                    if(res.data.code==110){
                        self.productBrand=res.data.data;
                    }else if(res.data.code==120){
                        self.$message({showClose: true,message: '品牌查询失败！',type: 'error'});
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '系统错误！',type: 'error'});
                })
            },

            addProduct(){
                this.addProductForm.addproductPropertyCategory=this.productPropertyCategory;
                var aa= this.addProductForm.addproductPropertyCategory;
                this.$message({showClose: true,message: aa,type: 'error'});
            },
            //步骤条
            next() {
                if (this.active++ > 2) this.active = 0;
                  if(this.active==1){
                      this.productaddform=false;
                  }
            },
            nexts() {
                var a=this.active;
                if (this.active-- < 0 ) this.active = a;
                  if(this.active==0){
                    this.productaddform=true;
                  }
            },
            //分类name拼接
            formaterTypeData:function(){
                this.$axios.get("api/api/type/getDataList").then(res=>{
                    this.categoryData=res.data.data;
                    this.getChildrenType();
                    for (let i = 0; i <this.categoryTypes.length ; i++) {
                        this.categoryTypeName="";
                        this.chandleName(this.categoryTypes[i]);
                        this.categoryTypes[i].name=this.categoryTypeName.split("/").reverse().join("/").substr(0,this.categoryTypeName.length-1);
                    }
                })
            },
            chandleName:function(node){
                if(node.pid!=0){
                    this.categoryTypeName+="/"+node.name;
                    for (let i = 0; i <this.categoryData.length ; i++) {
                        if(node.pid==this.categoryData[i].id){
                            this.chandleName(this.categoryData[i]);
                            break;
                        }}
                }else{
                    this.categoryTypeName+="/"+node.name;
                }},
            getChildrenType:function(){
                for (let i = 0; i <this.categoryData.length ; i++) {
                    let  node=this.categoryData[i];
                    this.isChildrenNode(node);
                }},
            isChildrenNode:function(node){
                let rs=true;
                for (let i = 0; i <this.categoryData.length ; i++) {
                    if(node.id==this.categoryData[i].pid){
                        rs=false;
                        break;}}
                if(rs==true){this.categoryTypes.push(node);
                }},
        },
        created(){
            this.getProductBrandData();
            this.formaterTypeData();
        },watch:{
            productPropertyCategory:function(){

            }
        },

    }
</script>

<style scoped>


</style>
