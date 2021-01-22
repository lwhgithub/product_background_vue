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
          <img :src="scope.row.productImgPath" height="50px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="hx(scope.row)" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--  修改-->
    <el-dialog title="修改" :visible.sync="updatebutton">
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
          <div v-if="this.updateProductForm.newproductImgPath==''" align="left">
            <img :src="updateProductForm.productImgPath" width="360px" height="180px"/>
          </div>
          <div v-else align="left">
            <img :src="updateProductForm.productImgPath" width="360px" height="180px"/>
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
        <el-button @click="updateoff('updateProductForm')">取 消</el-button>
        <el-button type="primary" @click="updateBrand()">确 定</el-button>
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
                // 修改表单数据
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
            // 修改取消
            updateoff(aa){
                this.updatebutton=false;
            },
            // 修改
            updateBrand(){
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
                this.getData();
            },
            //切换第几页时触发
            handleCurrentChange(val) {
                this.paging.pagingStart=(val-1)*this.paging.pagingSize;
                this.getData();
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
