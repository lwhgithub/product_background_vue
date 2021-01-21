<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
    </el-steps>

    <br/>
    <br/>
    <br/>
    <div v-if="active==0">
      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="productForm.title"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="bandId">
          <el-select v-model="productForm.bandId" placeholder="请选择">
            <el-option v-for="b in brandDatas" :key="b.id" :label="b.name" :value="b.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="简介" prop="productdecs">
          <el-input type="textarea" v-model="productForm.productdecs"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number v-model="productForm.price" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="库存" prop="stocks">
          <template>
            <el-input-number v-model="productForm.stocks" :step="10"></el-input-number>
          </template>
        </el-form-item>

        <el-form-item label="排序" prop="sortNum">
          <template>
            <el-input-number v-model="productForm.sortNum" :step="1"></el-input-number>
          </template>
        </el-form-item>

        <!-- 图片插件  -->
        <el-form-item label="主图" prop="imgPath">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/band/uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button>重置</el-button>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>



    </div>
    <div v-if="active==1">


      <el-form :model="productForm2" label-width="100px" class="demo-ruleForm">

        <el-form-item label="分类" prop="typeId">
          <!--  改变 获取属性数据  -->
          <el-select v-model="productForm2.typeId" placeholder="请选择" @change="getAttrData">
            <el-option v-for="b in types" :key="b.id" :label="b.name" :value="b.id"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">
          <!--  颜色 color   大小  szie  -->
          <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">
            <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
            <!--  skuCK0color    skuCK1szie   -->
            <el-checkbox-group  v-model="a.ckValues"  v-if="a.type==2" @change="skuChange">
              <el-checkbox v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-checkbox>
            </el-checkbox-group>


          </el-form-item>



        </el-form-item>


        <el-table
          v-if="tableShow"
          :data="tableSkuData"
          style="width: 100%">
          <!--   动态展示列头  sku属性中文名 -->
          <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
          </el-table-column>

          <el-table-column
            label="库存"
            width="180">

            <template slot-scope="scope">
              <el-input v-model="scope.row.storcks"/>
            </template>

          </el-table-column>
          <el-table-column
            label="价格"
            width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pricess"/>
            </template>
          </el-table-column>
        </el-table>

        <el-form-item v-if="attData.length>0" label="商品参数" prop="name">

          <el-form-item v-for="a in  attData" :key="a.id" :label="a.nameCH">
            <template slot-scope="scope">
              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>

              <el-select v-if="a.type==0" v-model="a.ckValues"  placeholder="请选择">
                <el-option v-for="b in a.values" :key="b.id"  :label="b.valueCH" value="b.id"></el-option>
              </el-select>

              <el-radio-group  v-if="a.type==1"  v-model="a.ckValues"  >
                <el-radio v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-radio>
              </el-radio-group>


              <el-checkbox-group   v-if="a.type==2" v-model="a.ckValues" >
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.valueCH" name="type"></el-checkbox>
              </el-checkbox-group>


            </template>
          </el-form-item>

        </el-form-item>

        <el-button type="primary" @click="active--">上一步</el-button>
        <el-button type="primary" @click="addProduct">添加</el-button>
      </el-form>



    </div>
    <div v-if="active==2">
      第三步信息
    </div>
  </div>
</template>

<script>
    export default {
        name: "AddProduct",
        data() {
            return {
                active: 0,//步骤条的
                /* 第一步相关的数据 */
                productForm:{ // 商品的基本
                    name:"",
                    title:"",
                    bandId:"",
                    productdecs:"",
                    price:0,
                    stocks:0,
                    sortNum:0,
                    imgPath:""
                },
                rules:{},// 商品表单的验证规则
                imageUrl:"",//图片显示用的

                brandDatas:[], // 品牌数据   从接口拿数据
                /* 第二步相关的数据  */
                productForm2:{},
                ajaxTypeData:[], //接口返回的数据
                typeName:"", //递归拼接子节点的名称
                types:[  //分类的数据
                    /* {"id":7,name:"分类/电子产品/手机"},
                     {"id":9,name:"分类/电子产品/笔记本"},
                     {"id":8,name:"分类/服装/上衣"},
                     {"id":10,name:"分类/服装/裤子"},
                     {"id":11,name:"分类/家电/空调"},
                     {"id":12,name:"分类/家电/洗衣机"},
                     {"id":13,name:"分类/家电/冰箱"}*/],

                /* 商品属性模块  */

                attData:[],   //非sku的属性数据
                SKUData:[], //sku属性数据


                tableShow:false, //sku的table是否显示
                cols:[],//skutable的动态表头
                tableSkuData:[],//skutable的动态表头对应的表格数据
                /*   看效果用的  */
                storcks:"", // 库存
                pricess:"", //  价格
                aaa:"",
                bbb:"",
                ccc:"",
            };
        },
        methods:{
            //添加商品
            addProduct:function(){
                //商品的类型id 添加到productform
                this.productForm.typeId=this.productForm2.typeId;
                console.log(this.productForm);
                //非sku的数据
                console.log(this.attData); //[{id: c,namech:系统,name:system,ckvaluwse:ios},{},{}]
                //sku数据
                console.log(this.tableSkuData);
                debugger;
                //声明后台接参的atrr
                let  atrrs=[];
                for (let i = 0; i <this.attData.length ; i++) {
                    let  attData={};
                    attData[this.attData[i].name]=this.attData[i].ckValues;
                    atrrs.push(attData);
                }

                this.productForm.attr=JSON.stringify(atrrs);
                this.productForm.sku=JSON.stringify(this.tableSkuData); //传参是string   怎么将js json 转为字符串
                console.log(this.$qs.stringify(this.productForm));
                //发起请求  保存数据
                this.$ajax.post("http://localhost:8080/api/product/add",this.$qs.stringify(this.productForm)).then(res=>{
                    this.$message.success("添加成功");
                })
            },
            /* 笛卡尔积    */
            calcDescartes:function(array) {
                if (array.length < 2) return array[0] || [];
                return [].reduce.call(array, function (col, set) {
                    var res = [];
                    col.forEach(function (c) {
                        set.forEach(function (s) {
                            var t = [].concat(Array.isArray(c) ? c : [c]);
                            t.push(s);
                            res.push(t);
                        })
                    });
                    return res;
                });
            },
            //监听sku属性 改变事件
            skuChange:function(){
                //笛卡尔积的参数
                let  kdej=[];
                //清空表格数据
                this.tableSkuData=[];
                //清空动态表头数据
                this.cols=[];
                // console.log(this.SKUData);
                //判断是否要生成笛卡尔积
                let flag=true;
                //遍历sku所有数据
                for (let i = 0; i <this.SKUData.length ; i++) {
                    //将sku属性 放入动态表头中
                    this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH,"name":this.SKUData[i].name});

                    //将此属性选中的选项值放入笛卡尔积参数中
                    //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
                    kdej.push(this.SKUData[i].ckValues);
                    //判断此sku的复选框是否为选中
                    if(this.SKUData[i].ckValues.length==0){
                        flag=false; // 不能生成笛卡尔积
                        break;
                    }
                }
                if(flag==true){
                    //debugger;
                    // alert("生成笛卡尔积");
                    //生成table的数据  [[],[],[]]   [{},{},{}]
                    let  datas=this.calcDescartes(kdej);
                    //遍历数据  [[红色,16g],[绿色,16g],[黑色，16g]]
                    for (let i = 0; i <datas.length ; i++) {
                        //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]

                        let  jsonData={}; //笛卡尔积 转为json的对象
                        for (let j = 0; j <datas[i].length ; j++) {
                            //获取数据的key
                            let  key=this.cols[j].name;
                            jsonData[key]=datas[i][j]

                        }
                        this.tableSkuData.push(jsonData);
                    }
                    console.log(this.tableSkuData);
                    console.log(datas);


                }
                this.tableShow=flag;
            },
            /*   根据typeid 查询属性数据和sku数据  */
            getAttrData:function(typeId){
                this.SKUData=[];
                this.attData=[];
                //发起请求 拿到属性数据
                this.$ajax.get("http://localhost:8080/api/attr/queeryDataByTypeId?typeId="+typeId).then(res=>{
                    // 所有的属性数据
                    let attrDatas=res.data.data;  // 所有的属性数据    id  name  type   如果为 下拉框 单选框  复选框  values
                    //判断分类是否有数据   更新 参数和规格
                    if(attrDatas.length>0){
                        //初始化  attData      SKUData
                        for (let i = 0; i <attrDatas.length ; i++) {
                            //判断是否为sku属性
                            if(attrDatas[i].isSKU==0){

                                if(attrDatas[i].type!=3){
                                    //发起请求 查询此属性对应的选项值
                                    this.$ajax.get("http://localhost:8080/api/attrvalue/queryDataByAid?aid="+attrDatas[i].id).then(res=>{
                                        attrDatas[i].values=res.data.data;

                                        this.attData.push(attrDatas[i]);
                                    })
                                }else{
                                    this.attData.push(attrDatas[i]);
                                }

                            }else{
                                if(attrDatas[i].type!=3){
                                    //发起请求 查询此属性对应的选项值
                                    this.$ajax.get("http://localhost:8080/api/attrvalue/queryDataByAid?aid="+attrDatas[i].id).then(res=>{
                                        attrDatas[i].values=res.data.data;
                                        attrDatas[i].ckValues=[];

                                        this.SKUData.push(attrDatas[i]);
                                    })
                                }else{
                                    attrDatas[i].ckValues=[];
                                    this.SKUData.push(attrDatas[i]);
                                }

                            }
                        }
                    }else{
                        this.SKUData=[];
                        this.attData=[];
                    }


                })
                //console.log(this.attData);
            },
            //初始化品牌数据
            initBandData:function(){
                let param={page:1,size:100000000};
                this.$ajax.post("http://localhost:8080/api/band/queryPageData",this.$qs.stringify(param)).then(res=>{
                    this.brandDatas=res.data.data.data;
                });
            },
            //处理分类的下拉框   [{id:1,"name":"",pid:2},{}]
            // {"id":7,name:"分类/电子产品/手机"},
            formaterTypeData:function(){

                this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{

                    // [{id:1,"name":"",pid:2},{}]
                    this.ajaxTypeData=res.data.data;
                    //{"id":7,name:"分类/电子产品/手机"},
                    //先找到子节点的数据   this.types;
                    this.getChildrenType();
                    debugger;
                    //遍历所有的子节点
                    for (let i = 0; i <this.types.length ; i++) {
                        this.typeName=""; // 全局变量   临时存 层级名称
                        //处理子节点的name属性
                        this.chandleName(this.types[i]);
                        //   a/b/c/f/d/e
                        //给name重新赋值
                        this.types[i].name=this.typeName.split("/").reverse().join("/");
                    }

                })
            }, //给我一个节点  得到层级name
            chandleName:function(node){
                if(node.pid!=0){ //临界值
                    this.typeName+="/"+node.name;
                    //上级节点
                    for (let i = 0; i <this.ajaxTypeData.length ; i++) {
                        if(node.pid==this.ajaxTypeData[i].id){
                            this.chandleName(this.ajaxTypeData[i]);
                            break;
                        }
                    }

                }else{
                    this.typeName+="/"+node.name;
                }
            },
            //得到types的数据      遍历所有ajaxtypedata
            getChildrenType:function(){
                //遍历所有的节点数据
                for (let i = 0; i <this.ajaxTypeData.length ; i++) {
                    let  node=this.ajaxTypeData[i];
                    this.isChildrenNode(node);
                }
            },
            isChildrenNode:function(node){
                let rs=true; //标示
                for (let i = 0; i <this.ajaxTypeData.length ; i++) {
                    if(node.id==this.ajaxTypeData[i].pid){
                        rs=false;
                        break;
                    }
                }
                if(rs==true){
                    this.types.push(node);
                }
            },


            /*  步骤条  下一页  */
            next() {
                this.formaterTypeData();
                if (this.active++ > 1) this.active = 0;
            },
            handleAvatarSuccess(res, file) {
                debugger;
                //打断点 看怎么取返回值
                this.productForm.imgPath=res.data;
                //显示赋值
                this.imageUrl=res.data;
            },
            beforeAvatarUpload(file) {
                //限制类型    name  来限制
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
        },
        created:function () {
            //初始化 品牌数据
            this.initBandData();
        }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
