<template>
  <div>
<!--    步骤条-->
       <div style="margin-left:230px;width: 800px">
           <el-steps :active="active" finish-status="success" align-center>
             <el-step title="商品基本信息"></el-step>
             <el-step title="商品属性信息"></el-step>
             <el-step title="商品图片"></el-step>
          </el-steps>
       </div>
<!--    第一页商品基本信息-->
        <div style="margin-left:200px;margin-top: 50px; width: 700px" v-show="active==0">
              <el-form :model="addProductForm"  ref="addProductForm" >
                <el-form-item label="名称" :label-width="formLabelWidth" prop="productName">
                  <el-input v-model="addProductForm.productName" placeholder="商品名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label=" 标题" :label-width="formLabelWidth" prop="productTitle">
                  <el-input v-model="addProductForm.productTitle" placeholder="展示标题" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="productBrandId">
                  <div align="left">
                    <el-select v-model="addProductForm.productBrandId" placeholder="属性分类" style="width: 300px">
                      <el-option :label="brand.brandname"  :value="brand.brandid" v-for="(brand,index) in productBrand" :key="index"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="商品介绍" :label-width="formLabelWidth" prop="productDesc">
                  <el-input type="textarea" v-model="addProductForm.productDesc"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" :label-width="formLabelWidth" prop="productPrice">
                  <el-input-number v-model="addProductForm.productPrice" :precision="2" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth" prop="productStocks">
                  <el-input-number v-model="addProductForm.productStocks" :step="10"></el-input-number>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="productSortNum">
                  <el-input-number v-model="addProductForm.productSortNum" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth" prop="brandimgpath">
                  <div align="left">
                    <el-upload class="upload-demo" drag action="api/api/brand/uploadFile"
                               :on-success="adduploadSuccess" :on-remove="addfiledelete"
                               :file-list="filelist" ref="addupload"
                               :before-upload="beforeAvatarUpload"
                               multiple>
                      <div v-if="addProductForm.productImgPath==''">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                      </div>
                      <div v-else>
                        <img :src="addProductForm.productImgPath" width="360px" height="180px">
                      </div>
                    </el-upload>
                    <div style="margin-left: 80px" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1024kb</div>
                  </div>
                </el-form-item>
              </el-form>
        </div>
<!--    第二页商品属性-->
    <div style="margin-left:200px;margin-top: 50px; width: 700px" v-show="active==1">
      <el-form :model="addProductForm"  ref="addProductForm" >
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId" >
          <div align="left">
            <el-select v-model="productPropertyCategory" placeholder="属性分类" @change="getPropertyData(productPropertyCategory)" style="width:300px">
              <el-option :label="category.name" :value="category.id" v-for="(category,index) in categoryTypes" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
<!--    商品参数-->
        <el-form-item v-if="isSKU.length>0" label="商品参数" :label-width="formLabelWidth">
          <el-form-item v-for="issk in  isSKU" :key="issk.propertyid" :label="issk.propertynameCH" label-width="100px">
<!--                       复选框-->
            <el-checkbox-group v-if="issk.propertytype==3" v-model="issk.checkboxValues" @change="checkboxValuesChange">
              <el-checkbox v-for="valu in issk.values" :key="valu.propertyPriceId" :label="valu.propertyPriceNameCH"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>
<!--    表格-->
        <el-form-item v-show="productDKRJTable" label="商品参数" :label-width="formLabelWidth">
          <el-table :data="DKRJData" border style="width: 100%;" >
            <el-table-column label="序号" width="40px" >
              <template slot-scope="scope">
                {{ scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column v-for="(c,index) in addProductTableCols" :key="index"
                             :label="c.propertynameCH" :prop="c.propertyname">

            </el-table-column>

            <el-table-column prop="productPrice" label="价格">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productPrice"/>
              </template>
            </el-table-column>
            <el-table-column prop="productStocks" label="库存">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productStocks"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
<!--      商品规格-->
        <el-form-item v-if="isNotSKU.length>0" label="商品规格" :label-width="formLabelWidth">
          <el-form-item v-for="isNotsk in  isNotSKU" :key="isNotsk.propertyid" :label="isNotsk.propertynameCH" label-width="100px">
          <template slot-scope="scope">
<!--           输入框-->
            <el-input v-if="isNotsk.propertytype==4"  v-model="isNotsk.checkboxValues" ></el-input>
<!--           下拉框-->
            <el-select v-if="isNotsk.propertytype==1" placeholder="请选择"  v-model="isNotsk.checkboxValues">
              <el-option v-for="(valu,index) in isNotsk.values" :key="index" :label="valu.propertyPriceNameCH" :value="valu.propertyPriceId" ></el-option>
            </el-select>
<!--           单选框-->
            <el-radio-group v-if="isNotsk.propertytype==2" v-model="isNotsk.checkboxValues">
              <el-radio v-for="valu in isNotsk.values" :key="valu.propertyPriceId" :label="valu.propertyPriceNameCH"></el-radio>
            </el-radio-group>
<!--           复选框-->
            <el-checkbox-group v-if="isNotsk.propertytype==3" v-model="isNotsk.checkboxValues">
              <el-checkbox v-for="valu in isNotsk.values" :key="valu.propertyPriceId" :label="valu.propertyPriceNameCH" naem="type"></el-checkbox>
            </el-checkbox-group>
          </template>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
<!--    第三页商品图片-->
    <div style="margin-left:200px;margin-top: 50px; width: 700px" v-show="active==2">

    </div>
<!-- 操控步骤条   -->
      <div v-show="active==0" style="margin-left: 530px">
        <div>
            <el-button type="primary" size="medium" @click="active++">下一步，填写商品属性</el-button>
        </div>
      </div>
      <div v-show="active==1" style="margin-left: 420px;width: 480px">
        <div style="float: left">
          <el-button type="primary" size="medium" @click="active--">上一步，填写商品信息</el-button>
        </div>
        <div style="float: right">
          <el-button type="primary" size="medium" @click="active++">下一步，上传商品图片</el-button>
        </div>
      </div>
      <div v-show="active==2" style="margin-left: 420px;width: 480px">
        <div style="float: left">
          <el-button type="primary" size="medium" @click="active--">上一步，填写商品属性</el-button>
        </div>
        <div style="float: right">
          <el-button type="primary" size="medium" @click="addProduct()">提交</el-button>
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
                //sku属性数据
                isNotSKU:[],
                //非sku属性
                isSKU:[],
                //笛卡尔积数据展示表格
                productDKRJTable:false,
                //添加商品动态表格头
                addProductTableCols:[],
                //笛卡尔积之后的SKU数据
                DKRJData:[],

                //添加商品的对象
                addProductForm:{
                    productName:'',
                    productTitle:'',
                    productBrandId:'',
                    productDesc:'',
                    productPrice:'',
                    productStocks:'',
                    productSortNum:'',
                    productImgPath:'',
                    productTypeId:'',
                },

                productPropertyCategory:'',
                //商品品牌的数组
                productBrand:[],
                //宽度
                formLabelWidth: '220px',
                //文件上传，
                filelist:[],
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
            //添加
            addProduct(){
                var self=this;
                this.addProductForm.productTypeId=this.productPropertyCategory;
                let  propertys=[];
                for (let i = 0; i <this.isNotSKU.length ; i++) {
                    let  isNotSKUs={};


                    isNotSKUs.propertyPrice=this.isNotSKU[i].checkboxValues;
                    isNotSKUs.propertyid=this.isNotSKU[i].propertyid;

                    propertys.push(isNotSKUs);

                }
                    // console.log(propertys)
                this.addProductForm.property=JSON.stringify(propertys);
                this.addProductForm.sku=JSON.stringify(this.DKRJData);
                this.$axios.post("api/api/product/addProduct",this.$qs.stringify(this.addProductForm)).then(function (res) {
                      if(res.data.code==110){
                          self.$message({showClose:'true',message:'添加成功',type:'success'})
                      }
                  }).catch(function () {
                    self.$message({showClose:'true',message:'添加失败',type:'error'})
                  })
            },
            //属性sku spu
            getPropertyData(productPropertyCategory){
                //选择分类修改的时候，清空之前的SKU数据，并关闭表格
                this.addProductTableCols=[];
                this.DKRJData=[];
                this.productDKRJTable=false;
                //清空属性数据
                this.isNotSKU=[];
                this.isSKU=[];
                var self=this;
              this.$axios.get("api/api/property/getPropertyDataByCategoryId?propertytypeId="+productPropertyCategory).then(function (res) {
                  if(res.data.code==110){
                      let propertydata =res.data.data;
                      if(propertydata.length>0){
                          for (let i = 0; i < propertydata.length; i++) {
                              if(propertydata[i].propertyisSKU==1){
                                  if (propertydata.propertytype!=4){
                                      self.$axios.get("api/api/property/getPropertyPrice?propertyId="+propertydata[i].propertyid).then(function (res) {
                                          propertydata[i].values=res.data.data;
                                          propertydata[i].checkboxValues=[];
                                          self.isSKU.push(propertydata[i])
                                      })
                                  }else{
                                      propertydata[i].checkboxValues=[];
                                      self.isSKU.push(propertydata[i])
                                  }
                              }else if(propertydata[i].propertyisSKU==2){
                                  if (propertydata.propertytype!=4){
                                      if(propertydata[i].propertytype==3){
                                      propertydata[i].checkboxValues=[];
                                      }
                                      self.$axios.get("api/api/property/getPropertyPrice?propertyId="+propertydata[i].propertyid).then(function (res) {
                                          propertydata[i].values=res.data.data;
                                          self.isNotSKU.push(propertydata[i])
                                      })
                                  }else{
                                  self.isNotSKU.push(propertydata[i])
                                  }
                              }
                          }
                      }else{
                          self.isNotSKU=[];
                          self.isSKU=[];
                      }
                  }else if(res.data.code==120){
                      self.$message({showClose:true,message:res.data.message,type:'error'})
                  }
              })
            },
            //触发笛卡尔积  复选框内容改变事件
            checkboxValuesChange(){
                //清空动态列头
                this.addProductTableCols=[];
                this.DKRJData=[];
                this.productDKRJTable=true;
                for (let i = 0; i <this.isSKU.length ; i++) {
                    //循环选中的复选框数组，决定是否进行笛卡尔积
                    if(this.isSKU[i].checkboxValues.length==0){
                        this.productDKRJTable=false;
                        break;
                    }
                    //添加动态列头名称
                    this.addProductTableCols.push({"propertyid":this.isSKU[i].propertyid,"propertynameCH":this.isSKU[i].propertynameCH,"propertyname":this.isSKU[i].propertyname});
                }
                if(this.productDKRJTable==true){
                    var DKRJ =[];
                    for (let i = 0; i <this.isSKU.length; i++) {
                        DKRJ.push(this.isSKU[i].checkboxValues)
                    }
                    //调用笛卡尔积方法 获取数据
                    var DKRJData=this.calcDescartes(DKRJ);
                    //////
                    for (let i = 0; i <DKRJData.length ; i++) {
                        //只有一个sku复选框属性时
                        if (this.isSKU.length==1){
                            var valuesAttr=[];
                            valuesAttr.push(DKRJData[i]);
                        }else{
                            var valuesAttr=DKRJData[i];
                        }
                        //得到数据
                        var tableValue={};
                        for (let j = 0; j < valuesAttr.length; j++) {
                            //+":"+this.addProductTableCols[j].propertyid
                            let key=this.addProductTableCols[j].propertyname;
                            tableValue[key]=valuesAttr[j];
                        }
                        this.DKRJData.push(tableValue);
                    }
                }
            },
            //笛卡尔积
            calcDescartes (array) {
                  if (array.length < 2) return array[0] || [];
                  return [].reduce.call(array, function (col, set) {
                      var res = [];
                      col.forEach(function (c) {
                          set.forEach(function (s) {
                              var t = [].concat(Array.isArray(c) ? c : [c]);
                              t.push(s); res.push(t);
                          })});
                      return res;
                  });},
            //文件上传判断
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isJPG) {this.$message.error('上传图片只能是 JPG 格式!');}
                if (!isLt2M) {this.$message.error('上传图片大小不能超过 2MB!');}
                return isJPG && isLt2M;},
            //添加文件上传成功的钩子
            adduploadSuccess(response, file, fileList) {
                this.addProductForm.productImgPath = response.data;
                this.$message.success("图片上传成功");
            },
            //添加文件列表移除文件时的钩子
            addfiledelete(file, fileList){
                this.addProductForm.productImgPath='';
                // this.$message.success("图片已清除111");
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
        },
        watch:{
        },

    }
</script>

<style scoped>
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }

</style>
