<template>
  <div>
    <!--  条件查询-->
    <el-form  :inline="true" v-model="paging" ref="queryform" >
        <el-form-item label="商品名称">
          <el-input placeholder="商品名称" v-model="paging.productName" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth" prop="productTypeId">
          <div align="left">
            <el-select v-model="paging.productTypeId" placeholder="商品分类" style="width: 300px">
              <el-option :label="category.name"  :value="category.id" v-for="(category,index) in categoryTypes" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
      <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="productBrandId">
        <div align="left">
          <el-select v-model="paging.productBrandId" placeholder="属性分类" style="width: 300px">
            <el-option :label="brand.brandname"  :value="brand.brandid" v-for="(brand,index) in productBrand" :key="index"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="tjcxcz()">重置</el-button>
        <el-button type="primary" @click="tjcx()">查询</el-button>
      </el-form-item>
    </el-form>
    <!--  添加按钮-->
    <div style="float: right">
      <el-button type="success" plain> <router-link :to="{path:'/ProductAdd'}">添加</router-link></el-button>
    </div>
    <!--  分页-->
    <div class="block" align="center">
      <!--      style="float:right"-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="xsts"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!--  查询展示-->
    <el-table :data="productddata" border style="width: 100%;" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="展示序号" width="80" >
        <template slot-scope="scope">
          {{ scope.$index+1}}
        </template>
      </el-table-column>
      <!--    fixed    固定为第一列-->
      <el-table-column prop="productName" label="名称" > </el-table-column>
      <el-table-column prop="productTitle" label="标题" > </el-table-column>
      <el-table-column prop="brandname" label="品牌" height="100"> </el-table-column>
      <el-table-column prop="name" label="分类" > </el-table-column>
      <el-table-column prop="productDesc" label="商品介绍"></el-table-column>
      <el-table-column prop="productPrice" label="价格"></el-table-column>
      <el-table-column prop="productStocks" label="库存"></el-table-column>
      <el-table-column prop="productSortNum" label="排许"></el-table-column>
      <el-table-column label="图片log">
        <template slot-scope="scope">
          <div @click="abc(scope.row)">
          <el-image :preview-src-list="srcList" :src="scope.row.productImgPath"></el-image>
<!--          <img :src="scope.row.productImgPath" height="50px">-->
        </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="hx(scope.row)" circle></el-button>
            <el-button type="primary" @click="sxwh(scope.row)">属性维护</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--  基本信息修改-->
    <el-dialog title="基本信息修改" :visible.sync="updatebutton">
      <!--      表单部分-->
      <el-form :model="updateProductForm"  ref="updateProductForm" >
        <el-form-item label="名称" :label-width="formLabelWidth" prop="productName">
          <el-input v-model="updateProductForm.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="productTitle">
          <el-input v-model="updateProductForm.productTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="productBrandId">
          <div align="left">
            <el-select v-model="updateProductForm.productBrandId" placeholder="属性分类" style="width: 300px">
              <el-option :label="brand.brandname"  :value="brand.brandid" v-for="(brand,index) in productBrand" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId" >
          <div align="left">
            <el-select v-model="productPropertyCategory" placeholder="属性分类" style="width:300px">
              <el-option :label="category.name" :value="category.id" v-for="(category,index) in categoryTypes" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="商品介绍" :label-width="formLabelWidth" prop="productDesc">
          <el-input type="textarea" v-model="updateProductForm.productDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="productPrice">
          <el-input-number v-model="updateProductForm.productPrice" :precision="2" :step="1" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth" prop="productStocks">
          <el-input-number v-model="updateProductForm.productStocks" :step="10" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="productSortNum">
          <el-input-number v-model="updateProductForm.productSortNum" :step="1" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="品牌删除" :label-width="formLabelWidth" prop="productIsDel">
          <div align="left">
            <el-radio v-model="updateProductForm.productIsDel" :label="1" >保留</el-radio>
            <el-radio v-model="updateProductForm.productIsDel" :label="2" >删除</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="原图片" :label-width="formLabelWidth">
          <div v-if="this.updateProductForm.productImgPath!=''">
            <div v-if="this.updateProductForm.newproductImgPath==''" align="left">
              <img :src="updateProductForm.productImgPath" width="360px" height="180px"/>
            </div>
            <div v-else align="left">
              <img :src="updateProductForm.productImgPath" width="360px" height="180px"/>
            </div>
          </div>
          <div v-else>
            <h4>无图片</h4>
          </div>
        </el-form-item>
        <el-form-item label="新图片" :label-width="formLabelWidth" prop="brandimgpath">
          <div align="left">
            <el-upload class="upload-demo" drag action="api/api/brand/uploadFile"
                       :on-success="updateuploadSuccess" :on-remove="updatefiledelete"
                       :file-list="filelist" ref="updateupload"
                       :before-upload="beforeAvatarUpload"
                       multiple>
              <div v-if="updateProductForm.newproductImgPath ==''">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </div>
              <div v-else>
                <img :src="updateProductForm.newproductImgPath" width="360px" height="180px">
              </div>
            </el-upload>
            <div style="margin-left: 80px" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1024kb</div>
          </div>
        </el-form-item>
      </el-form>
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatebutton=false">取 消</el-button>
        <el-button type="primary" @click="updateProduct()">确 定</el-button>
      </div>
    </el-dialog>
    <!--  商品属性修改  -->
    <el-dialog title="属性信息修改" :visible.sync="updatepropertybutton">
      <!--      表单部分-->
      <el-form :model="updateProductForm"  ref="updateProductForm" >
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId" >
          <div align="left">
            <el-select v-model="productPropertyCategorySX" placeholder="属性分类" @change="getPropertyData(productPropertyCategorySX)" style="width:300px">
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
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatepropertybutton=false">取 消</el-button>
        <el-button type="primary" @click="updateproperty()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return{
                //商品品牌的数组
                productBrand:[],
                // 控制修改的表单
                updatebutton:false,
                //控制修改属性的弹框
                updatepropertybutton:false,
                //修改商品基本信息表单数据
                updateProductForm:{
                    productId:'',
                    productName:'',
                    productTitle:'',
                    productBrandId:'',
                    productTypeId:'',
                    productDesc:'',
                    productPrice:'',
                    productStocks:'',
                    productSortNum:'',
                    productImgPath:'',
                    productIsDel:'',
                    newproductImgPath:'',
                },
//修改商品属性信息
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
                //修改商品属性信息的商品分类
                productPropertyCategorySX:'',
//查询
                srcList:[],
                // 查询结果
                productddata:[],
                //分页条件查询
                currentPage4: 0,
                total:0,
                xsts:[3,4,5,6,7,9,10,20,50],
                paging:{
                    pagingStart:0,
                    pagingSize:3,
                    productName:'',
                    productBrandId:'',
                    productTypeId:'',
                },
//公共
                //宽度
                formLabelWidth: '120px',
                // 头部复选框
                multipleSelection:[],
                // 文件上传集合
                filelist:[],
                //商品分类
                productPropertyCategory:'',
                //分类name拼接
                categoryData:[],
                categoryTypeName:'',
                categoryTypes:[],
            }
        },
        methods:{
            abc(row){
                this.srcList=[];
                this.srcList.push(row.productImgPath);
            },
            //获取商品基本信息
            getProductData(){
                var self=this;
                this.$axios.get("api/api/product/getProductData?"+this.$qs.stringify(this.paging)).then(function (res) {
                    if(res.data.code==110){
                        self.productddata=res.data.data.Products;
                        self.total=res.data.data.count;
                    }else if(res.data.code==120){
                        self.$message({showClose: true,message: '查询失败！',type: 'error'});
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '系统错误！',type: 'error'});
                })
            },
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
            // 条件查询重置
            tjcxcz(){
                var pagingsize= this.paging.pagingSize;
                this.paging= {};
                this.paging.pagingStart=0;
                this.paging.pagingSize=pagingsize;
                this.getProductData();
            },
            // 条件查询
            tjcx(){
                this.paging.pagingStart=0;
                console.log(this.paging)
                this.getProductData();
            },
            // 修改回显
            hx(row){
                this.updateProductForm = JSON.parse(JSON.stringify(row));
                this.updateProductForm.productId=row.productId;
                this.updateProductForm.productName=row.productName;
                this.updateProductForm.productTitle=row.productTitle;
                this.updateProductForm.productBrandId=row.productBrandId;
                this.productPropertyCategory=row.productTypeId;
                this.updateProductForm.productDesc=row.productDesc;
                this.updateProductForm.productPrice=row.productPrice;
                this.updateProductForm.productStocks=row.productStocks;
                this.updateProductForm.productSortNum=row.productSortNum;
                this.updateProductForm.productPrice=row.productPrice;
                this.updateProductForm.productImgPath=row.productImgPath;
                this.updateProductForm.newproductImgPath='';
                this.updatebutton=true;
            },
            // 修改商品基本信息
            updateProduct(){
                this.updateProductForm.productTypeId=this.productPropertyCategory
                var self = this;
                this.$axios.put("api/api/product/updateProduct", this.$qs.stringify(this.updateProductForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '修改成功！',type: 'success'});
                        self.updateProductForm={};
                        self.$refs.updateupload.clearFiles();
                        self.updatebutton=false;
                        self.getProductData();
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                })
            },
            //修改商品属性信息
            sxwh(row){
                this.productPropertyCategorySX=row.productTypeId;
                this.getPropertyData(this.productPropertyCategorySX)
                this.updatepropertybutton=true;
            },
            //属性sku spu
            getPropertyData(productPropertyCategorySX){
                //选择分类修改的时候，清空之前的SKU数据，并关闭表格
                this.addProductTableCols=[];
                this.DKRJData=[];
                this.productDKRJTable=false;
                //清空属性数据
                this.isNotSKU=[];
                this.isSKU=[];
                var self=this;
                this.$axios.get("api/api/property/getPropertyDataByCategoryId?propertytypeId="+productPropertyCategorySX).then(function (res) {
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

            //图片上传验证
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 1;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //修改文件上传成功的钩子
            updateuploadSuccess(response, file, fileList) {
                this.updateProductForm.newproductImgPath = response.data;
                this.$message.success("图片上传成功");
            },
            //修改文件列表移除文件时的钩子
            updatefiledelete(file, fileList){
                this.updateProductForm.newproductImgPath='';
                // this.$message.success("图片已清除2222");
            },
            //切换每一页的条数时触发
            handleSizeChange(val) {
                this.paging.pagingSize=(val);
                this.paging.pagingStart=0;
                this.getProductData();
            },
            //切换第几页时触发
            handleCurrentChange(val) {
                this.paging.pagingStart=(val-1)*this.paging.pagingSize;
                this.getProductData();
            },
            //当选中复选框时触发该事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
            this.getProductData();
            this.getProductBrandData();
            this.formaterTypeData();
        },watch:{
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
