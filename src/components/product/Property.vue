<template>
  <div>
    <!--  条件查询-->
    <el-form  :inline="true" v-model="paging" ref="queryform" >
      <el-form-item label="属性中文名">
        <el-input placeholder="属性中文名" v-model="paging.propertynameCH" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="属性分类">
        <el-select v-model="paging.propertytypeId" placeholder="属性分类" style="width: 230px">
          <el-option :label="category.property_category_name"  :value="category.id" v-for="(category,index) in propertycategory" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性类型" :label-width="formLabelWidth" prop="propertytype">
        <el-radio v-model="paging.propertytype" :label="1">下拉框</el-radio>
        <el-radio v-model="paging.propertytype" :label="2">单选框</el-radio>
        <el-radio v-model="paging.propertytype" :label="3">复选框</el-radio>
        <el-radio v-model="paging.propertytype" :label="4">输入框</el-radio>
      </el-form-item>
      <el-form-item label="属性是否sku属性" :label-width="formLabelWidth" prop="propertyisSKU">
        <el-radio v-model="paging.propertyisSKU" :label="1">是</el-radio>
        <el-radio v-model="paging.propertyisSKU" :label="2">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button @click="tjcxcz()">重置</el-button>
        <el-button type="primary" @click="tjcx()">查询</el-button>
      </el-form-item>
    </el-form>
    <!--  添加按钮-->
    <div style="float: right">
      <el-button type="success" @click="addbutton = true" plain>添加</el-button>
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
    <el-table :data="property" border style="width: 100%;" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="展示序号" width="80" >
        <template slot-scope="scope">
          {{ scope.$index+1}}
        </template>
      </el-table-column>
      <!--    fixed    固定为第一列-->
      <el-table-column prop="propertyname" label="属性名" > </el-table-column>
      <el-table-column prop="propertynameCH" label="属性中文名" > </el-table-column>
      <el-table-column prop="property_category_name" label="属性分类" ></el-table-column>
      <el-table-column prop="propertytype" label="属性类型" >
        <template slot-scope="scope">
          {{ scope.row.propertytype==1?'下拉框':scope.row.propertytype==2?'单选框':scope.row.propertytype==3?'复选框':scope.row.propertytype==4?'输入框':'未知'}}
        </template>
      </el-table-column>
      <el-table-column prop="propertyisSKU" label="是否为sku属性" >
        <template slot-scope="scope">
          {{ scope.row.propertyisSKU==1?'是':scope.row.propertyisSKU==2?'否':'待定'}}
        </template>
      </el-table-column>
      <el-table-column prop="propertycreateDate" label="创建时间"></el-table-column>
      <el-table-column prop="propertyupdateDate" label="修改时间"></el-table-column>
      <el-table-column prop="propertyauthor" label="操作人"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="hx(scope.row)" circle></el-button>
            <el-button v-if="scope.row.propertytype!=4" type="success" @click="togetPropertyPrice(scope.row)" plain>属性值</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加-->
    <el-dialog title="添加" :visible.sync="addbutton">
      <!--      表单部分-->
      <el-form :model="addPropertyForm"  ref="addPropertyForm" >
        <el-form-item label="属性名称" :label-width="formLabelWidth" prop="propertyname">
          <el-input v-model="addPropertyForm.propertyname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性中文名" :label-width="formLabelWidth" prop="propertynameCH">
          <el-input v-model="addPropertyForm.propertynameCH" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId">
          <div align="left">
            <el-select v-model="addPropertyForm.propertytypeId" placeholder="属性分类" style="width: 300px">
              <el-option :label="category.property_category_name"  :value="category.id" v-for="(category,index) in propertycategory" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="属性类型" :label-width="formLabelWidth" prop="propertytype">
          <el-radio v-model="addPropertyForm.propertytype" :label="1">下拉框</el-radio>
          <el-radio v-model="addPropertyForm.propertytype" :label="2">单选框</el-radio>
          <el-radio v-model="addPropertyForm.propertytype" :label="3">复选框</el-radio>
          <el-radio v-model="addPropertyForm.propertytype" :label="4">输入框</el-radio>
        </el-form-item>
        <el-form-item label="属性是否sku属性" :label-width="formLabelWidth" prop="propertyisSKU">
          <el-radio v-model="addPropertyForm.propertyisSKU" :label="1">是</el-radio>
          <el-radio v-model="addPropertyForm.propertyisSKU" :label="2">否</el-radio>
        </el-form-item>
      </el-form>
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addoff('addPropertyForm')">取 消</el-button>
        <el-button type="primary" @click="addProperty('addPropertyForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  修改-->
    <el-dialog title="修改" :visible.sync="updatebutton">
      <!--      表单部分-->
      <el-form :model="updatePropertyForm"  ref="updatePropertyForm" >
        <el-form-item label="属性名称" :label-width="formLabelWidth" prop="propertyname">
          <el-input v-model="updatePropertyForm.propertyname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性中文名" :label-width="formLabelWidth" prop="propertynameCH">
          <el-input v-model="updatePropertyForm.propertynameCH" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性分类" :label-width="formLabelWidth" prop="propertytypeId">
          <div align="left">
            <el-select v-model="updatePropertyForm.propertytypeId" placeholder="属性分类" style="width: 300px">
              <el-option :label="category.property_category_name"  :value="category.id" v-for="(category,index) in propertycategory" :key="index"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="属性类型" :label-width="formLabelWidth" prop="propertytype">
          <el-radio v-model="updatePropertyForm.propertytype" :label="1">下拉框</el-radio>
          <el-radio v-model="updatePropertyForm.propertytype" :label="2">单选框</el-radio>
          <el-radio v-model="updatePropertyForm.propertytype" :label="3">复选框</el-radio>
          <el-radio v-model="updatePropertyForm.propertytype" :label="4">输入框</el-radio>
        </el-form-item>
        <el-form-item label="属性是否sku属性" :label-width="formLabelWidth" prop="propertyisSKU">
          <el-radio v-model="updatePropertyForm.propertyisSKU" :label="1">是</el-radio>
          <el-radio v-model="updatePropertyForm.propertyisSKU" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="属性是否删除" :label-width="formLabelWidth" prop="propertyisSKU">
          <el-radio v-model="updatePropertyForm.propertyisDel" :label="1">是</el-radio>
          <el-radio v-model="updatePropertyForm.propertyisDel" :label="2">否</el-radio>
        </el-form-item>
      </el-form>
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateoff()">取 消</el-button>
        <el-button type="primary" @click="updateBrand()">确 定</el-button>
      </div>
    </el-dialog>
    <!--  属性值展示-->
    <el-dialog :title="propertyPriceShowTitle" :visible.sync="propertyPricebutton">
      <div v-if="propertyPriceShow">
        <div style="float: right" >
          <el-button type="success" @click="toPropertyPriceAdd()" plain>添加属性值</el-button>
          <el-button type="success" @click="propertyPricebutton = false" plain>关闭</el-button>
        </div>
          <el-table :data="PropertypriceForm" border style="width: 100%;" >
            <el-table-column prop="propertynameCH" label="属性名" > </el-table-column>
            <el-table-column prop="propertyPriceNameCH" label="属性值名" > </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-row>
                  <el-button type="success" @click="toupdatePrice(scope.row)" plain>修改</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
      </div>
<!--      属性值添加-->
      <div v-if="propertyPriceAdd" style="height: 220px;">
          <!--      表单部分-->
          <el-form :model="addPriceForm"  ref="addPriceForm" >
            <el-form-item label="属性值名称" :label-width="formLabelWidth" prop="propertyPriceName">
              <el-input v-model="addPriceForm.propertyPriceName" placeholder="属性值名称" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="属性值中文名" :label-width="formLabelWidth" prop="propertyPriceNameCH">
              <el-input v-model="addPriceForm.propertyPriceNameCH" placeholder="属性值中文名" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <!--      按钮部分-->
          <div style="float: right" slot="footer" class="dialog-footer">
            <el-button @click="addPriceoff('addPriceForm')">取 消</el-button>
            <el-button type="primary" @click="addPrice('addPriceForm')">确 定</el-button>
          </div>
      </div>
<!--   属性值修改-->
      <div v-if="propertyPriceUpdate">
        <!--      表单部分-->
        <el-form :model="updatePriceForm"  ref="updatePriceForm" >
          <el-form-item label="属性值名称" :label-width="formLabelWidth" prop="propertyPriceName">
            <el-input v-model="updatePriceForm.propertyPriceName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="属性值中文名" :label-width="formLabelWidth" prop="propertyPriceNameCH">
            <el-input v-model="updatePriceForm.propertyPriceNameCH" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="属性值是否删除" :label-width="formLabelWidth" prop="propertyPriceisDel">
            <el-radio v-model="updatePriceForm.propertyPriceisDel" :label="1">是</el-radio>
            <el-radio v-model="updatePriceForm.propertyPriceisDel" :label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <!--      按钮部分-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePriceoff()">取 消</el-button>
          <el-button type="primary" @click="updatePrice()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return {
//属性
                // 添加按钮
                addbutton:false,
                // 添加数据
                addPropertyForm:{
                    propertyname:'',
                    propertynameCH:'',
                    propertytypeId:'',
                    propertytype:'',
                    propertyisSKU:'',
                },
                // 修改按钮
                updatebutton:false,
                // 修改数据
                updatePropertyForm:{
                    propertyid:'',
                    propertyname:'',
                    propertynameCH:'',
                    propertytypeId:'',
                    propertytype:'',
                    propertyisSKU:'',
                    propertyisDel:'',
                },
                //商品分类查询结果
                propertycategory:[],
                // 商品属性查询结果
                property:[],
                //分页条件查询
                currentPage4: 0,
                total:0,
                xsts:[3,4,5,6,7,9,10,20,50],
                paging:{
                    pagingStart:0,
                    pagingSize:3,
                    propertytypeId:'',
                    propertynameCH:'',
                    propertyisSKU:'',
                    propertytype:'',
                },

//属性值
                //查询属性值按钮
                propertyPricebutton:false,
                //查询属性值数据
                PropertypriceForm:[],
                //属性值展示弹框标题
                propertyPriceShowTitle:'',
                //属性值查询展示按钮
                propertyPriceShow:true,
                //属性值添加按钮
                propertyPriceAdd:false,
                //属性值添加数据
                addPriceForm:{
                    propertyPriceName:'',
                    propertyPriceNameCH:'',
                    propertyId:'',
                },
                //属性值修改按钮
                propertyPriceUpdate:false,
                //属性值修改数据
                updatePriceForm:{
                    propertyPriceId:'',
                    propertyPriceName:'',
                    propertyPriceNameCH:'',
                    propertyId:'',
                    propertyPriceisDel:'',
                },
//通用
                //宽度
                formLabelWidth: '120px',
                // 头部复选框
                multipleSelection:[],
            }
        },
        methods:{
            // 查询
            getData(){
                var self=this;
                this.$axios.get("api/api/property/getData?"+this.$qs.stringify(this.paging)).then(function (res) {
                    if(res.data.code==110){
                        self.property=res.data.data.propertylist;
                        self.total=res.data.data.count;
                    }else if(res.data.code==120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '查询失败！',type: 'error'});
                })
            },
            // 条件查询重置
            tjcxcz(){
                var pagingsize= this.paging.pagingSize;
                this.paging= {};
                this.paging.pagingStart=0;
                this.paging.pagingSize=pagingsize;
                this.getData();
            },
            // 条件查询
            tjcx(){
                this.paging.pagingStart=0;
                this.getData();
            },
            //查询分类
            getPropertyCategory(){
                var self=this;
                this.$axios.get("api/api/property/getPropertyCategory").then(function (res) {
                    if(res.data.code==110){
                        self.propertycategory=res.data.data;
                    }else if(res.data.code==120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '查询失败！',type: 'error'});
                })
            },
            // 添加取消
            addoff(addPropertyForm){
                this.$refs[addPropertyForm].resetFields();
                this.addbutton=false;
            },
            // 添加
            addProperty (addPropertyForm) {
                var self = this;
                this.$axios.post("api/api/property/add", this.$qs.stringify(this.addPropertyForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '添加成功！',type: 'success'});
                        self.$refs[addPropertyForm].resetFields();
                        self.addbutton=false;
                        self.getData();
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '添加失败！',type: 'success'});
                })
            },
            // 修改回显
            hx(row){
                this.updatePropertyForm = JSON.parse(JSON.stringify(row));
                this.updatebutton=true;
            },
            // 修改取消
            updateoff(){
                this.updatebutton=false;
            },
            // 修改
            updateBrand(){
                var self = this;
                this.$axios.put("api/api/property/update", this.$qs.stringify(this.updatePropertyForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '修改成功！',type: 'success'});
                        self.updatePropertyForm={};
                        self.updatebutton=false;
                        self.getData();
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                })
            },
            //调用查询属性值的方法
            togetPropertyPrice(row){
                this.propertyPriceShowTitle=row.propertynameCH+'的属性值';
                this.addPriceForm.propertyId=row.propertyid;
                this.getPropertyPrice(row.propertyid);
            },
            //查询属性值
            getPropertyPrice(propertyid){
                var self = this;
                this.$axios.get("api/api/property/getPropertyPrice?"+this.$qs.stringify({"propertyid":propertyid})).then(function (res) {
                    if(res.data.code==110){
                        self.PropertypriceForm=res.data.data;
                    }else if(res.data.code==120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function (res) {
                    self.$message({showClose: true,message: '系统错误！',type: 'error'});
                })
                this.propertyPricebutton=true;
            },
            // 属性值添加取消
            addPriceoff(addPriceForm){
                this.$refs[addPriceForm].resetFields();
                this.propertyPriceAdd=false;
                this.propertyPriceShow=true;
                this.propertyPriceUpdate=false;
            },
            //属性值添加前
            toPropertyPriceAdd(){
                this.propertyPriceShow=false;
                this.propertyPriceAdd=true;
                this.propertyPriceUpdate=false;
            },
            // 属性值添加
            addPrice (addPriceForm) {
                var self = this;
                this.$axios.post("api/api/property/addPrice", this.$qs.stringify(this.addPriceForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '添加成功！',type: 'success'});
                        self.$refs[addPriceForm].resetFields();
                        self.propertyPriceAdd=false;
                        self.propertyPriceUpdate=false;
                        self.propertyPriceShow=true;
                        self.getPropertyPrice(self.addPriceForm.propertyId);
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '系统错误！',type: 'error'});
                })
            },
            //属性值回显
            toupdatePrice(row){
                this.updatePriceForm = JSON.parse(JSON.stringify(row));
                this.propertyPriceUpdate=true;
                this.propertyPriceAdd=false;
                this.propertyPriceShow=false;
            },
            //属性值修改取消
            updatePriceoff(){
                this.propertyPriceUpdate=false;
                this.propertyPriceAdd=false;
                this.propertyPriceShow=true;
            },
            //属性值属性值
            updatePrice(){
                var self = this;
                this.$axios.put("api/api/property/updatePrice", this.$qs.stringify(this.updatePriceForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '修改成功！',type: 'success'});
                        self.propertyPriceUpdate=false;
                        self.propertyPriceAdd=false;
                        self.propertyPriceShow=true;
                        self.getPropertyPrice(self.updatePriceForm.propertyId);
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message({showClose: true,message: '系统错误！',type: 'error'});
                })
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
        },
        created(){
            this.getData();
            this.getPropertyCategory();
        },
        watch:{
            addbutton:function(){
                if(this.addbutton==false){
                    this.addPropertyForm={};
                }
            },
            propertyPricebutton:function () {
              if(this.propertyPricebutton==false){
                  this.addPriceForm={};
                  this.propertyPriceAdd=false;
                  this.propertyPriceUpdate=false;
              }
            }
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
