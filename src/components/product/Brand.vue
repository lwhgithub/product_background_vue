<template>
    <div>
      <!--  条件查询-->
      <el-form  :inline="true" v-model="paging" ref="queryform" >
        <!--  查询推荐-->
        <el-form-item label="名称">
          <el-input placeholder="品牌名称" v-model="paging.brandname" style="width: 100%;"></el-input>
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
      <el-table :data="brand" border style="width: 100%;" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="展示序号" width="80" >
          <template slot-scope="scope">
            {{ scope.$index+1}}
          </template>
        </el-table-column>
        <!--    fixed    固定为第一列-->
        <el-table-column prop="brandname" label="品牌" > </el-table-column>
        <el-table-column prop="brandE" label="首字母" > </el-table-column>
        <el-table-column prop="brandDesc" label="品牌介绍" height="100"> </el-table-column>
        <el-table-column prop="brandord" label="排序字段" > </el-table-column>
        <el-table-column prop="brandcreateDate" label="创建时间"></el-table-column>
        <el-table-column prop="brandupdateDate" label="修改时间"></el-table-column>
        <el-table-column prop="brandauthor" label="操作人"></el-table-column>
        <el-table-column label="图片log">
          <template slot-scope="scope">
            <img :src="scope.row.brandimgpath" height="50px">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" @click="hx(scope.row)" circle></el-button>
<!--              <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" circle></el-button>-->
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--  添加-->
      <el-dialog title="添加" :visible.sync="addbutton">
        <!--      表单部分-->
        <el-form :model="addBrandForm"  ref="addBrandForm" >
          <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="addBrandForm.brandname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="addBrandForm.brandE" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌介绍" :label-width="formLabelWidth" prop="bookName">
            <el-input type="textarea" v-model="addBrandForm.brandDesc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序字段" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="addBrandForm.brandord" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth" prop="carimgPath">
            <div align="left">
              <el-upload class="upload-demo" drag action="api/api/brand/uploadFile"
                         :on-success="adduploadSuccess" :on-remove="addfiledelete" :file-list="filelist" ref="upload" multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <!--      按钮部分-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="addoff('addBrandForm')">取 消</el-button>
          <el-button type="primary" @click="addBrand('addBrandForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!--  修改-->
      <el-dialog title="修改" :visible.sync="updatebutton">
        <!--      表单部分-->
         <el-form :model="updateBrandForm"  ref="updateBrandForm" >
          <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="updateBrandForm.brandname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="updateBrandForm.brandE" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌介绍" :label-width="formLabelWidth" prop="bookName">
            <el-input type="textarea" v-model="updateBrandForm.brandDesc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序字段" :label-width="formLabelWidth" prop="bookName">
            <el-input v-model="updateBrandForm.brandord" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌删除" :label-width="formLabelWidth" prop="bookType">
            <div align="left">
              <el-radio v-model="updateBrandForm.brandisdel" :label="1" >保留</el-radio>
              <el-radio v-model="updateBrandForm.brandisdel" :label="2" >删除</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="原图片" :label-width="formLabelWidth">
            <div align="left">
              <img :src="updateBrandForm.brandimgpath" width="100px"/>
            </div>
          </el-form-item>
           <el-form-item label="图片" :label-width="formLabelWidth" prop="updatecarimgPath">
             <div align="left">
               <el-upload class="upload-demo" drag action="api/api/brand/uploadFile"
                          :on-success="updateuploadSuccess" :on-remove="updatefiledelete" :file-list="filelist" ref="upload" multiple>
                 <i class="el-icon-upload"></i>
                 <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                 <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
               </el-upload>
             </div>
           </el-form-item>
        </el-form>
        <!--      按钮部分-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateoff('updateBrandForm')">取 消</el-button>
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
                // 控制修改的表单
                updatebutton:false,
                // 修改表单数据
                updateBrandForm:{
                  brandid:'',
                  brandname:'',
                  brandE:'',
                  brandimgpath:'',
                  brandDesc:'',
                  brandord:'',
                  brandisdel:'',
                  newbrandimgpath:'',
                },
                // 控制添加的表单
                addbutton:false,
                // 添加表单数据
                addBrandForm:{
                    brandname:'',
                    brandE:'',
                    brandimgpath:'',
                    brandDesc:'',
                    brandord:'',
                },

                // 查询结果
                brand:[],
                //分页条件查询
                currentPage4: 0,
                total:0,
                xsts:[3,4,5,6,7,9,10,20,50],
                paging:{
                    pagingStart:0,
                    pagingSize:3,
                    brandname:'',
                },
                //宽度
                formLabelWidth: '120px',
                // 头部复选框
                multipleSelection:[],
                // 文件上传集合
                filelist:[],
            }
        },
        methods:{
            getData(){
              var self=this;
              console.log(this.paging.pagingSize)
              this.$axios.get("api/api/brand/getData?"+this.$qs.stringify(this.paging)).then(function (res) {
                  if(res.data.code==110){
                      self.brand=res.data.data.brandlist;
                      self.total=res.data.data.count;

                  }else if(res.data.code==120){
                      self.$message({showClose: true,message: '查询失败！',type: 'error'});
                  }
              }).catch(function () {
                  self.$message({showClose: true,message: '系统错误！',type: 'error'});
              })
            },
            // 条件查询重置
            tjcxcz(){
                var pagingsize= this.paging.pagingSize;
                this.paging.brandname='';
                this.paging.pagingStart=0;
                this.paging.pagingSize=pagingsize;
                this.getData();
            },
            // 条件查询
            tjcx(){
                this.paging.pagingStart=0;
                this.getData();
            },
            // 添加取消
            addoff(addBrandForm){
                this.$refs[addBrandForm].resetFields();
                this.addbutton=false;
            },
            // 添加
            addBrand (formName) {
                var self = this;
                this.$axios.post("api/api/brand/add", this.$qs.stringify(this.addBrandForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '添加成功！',type: 'success'});
                        self.$refs[formName].resetFields();
                        self.addbutton=false;
                        self.getData();
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                }).catch(function () {
                    self.$message.error('数据错误');
                })
            },
            // 修改回显
            hx(row){
                this.updateBrandForm = JSON.parse(JSON.stringify(row));
                this.updateBrandForm.brandid=row.brandid;
                this.updateBrandForm.brandname=row.brandname;
                this.updateBrandForm.brandE=row.brandE;
                this.updateBrandForm.brandimgpath=row.brandimgpath;
                this.updateBrandForm.brandDesc=row.brandDesc;
                this.updateBrandForm.brandord=row.brandord;
                this.updateBrandForm.brandisdel=row.brandisdel;
                this.updatebutton=true;
            },
            // 修改取消
            updateoff(aa){
                this.updatebutton=false;
            },
            // 修改
            updateBrand(){
                var self = this;
                this.$axios.put("api/api/brand/update", this.$qs.stringify(this.updateBrandForm)).then(function (res) {
                    if (res.data.code == 110) {
                        self.$message({showClose: true,message: '修改成功！',type: 'success'});
                        self.updateBrandForm={};
                        self.$refs.upload.clearFiles();
                        self.updatebutton=false;
                        self.getData();
                    }else if(res.data.code == 120){
                        self.$message.error(res.data.message);
                    }
                })
            },

            //添加文件上传成功的钩子
            adduploadSuccess(response, file, fileList) {
                this.addBrandForm.brandimgpath = response.data;
                this.$message.success("图片上传成功");
            },
            //添加文件列表移除文件时的钩子
            addfiledelete(file, fileList){
                this.addBrandForm.brandimgpath="";
                this.$message.success("图片已清除");
            },
            //修改文件上传成功的钩子
            updateuploadSuccess(response, file, fileList) {
                this.updateBrandForm.newbrandimgpath = response.data;
                this.$message.success("图片上传成功");
            },
            //修改文件列表移除文件时的钩子
            updatefiledelete(file, fileList){
                this.updateBrandForm.newbrandimgpath="";
                this.$message.success("图片已清除");
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
        }
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
