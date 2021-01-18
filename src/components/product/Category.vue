<template>
  <div  >
<!--分类-->
    <el-menu   class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
                style="border-right: none;width: 200px;" >
<!--第一层-->
      <div v-for="ztrra in ztrradata">
            <div v-if="ztrra.children">
                <el-submenu :index="String(ztrra.id)" v-if="ztrra.children">
                  <span slot="title"><span @click="aa">{{ztrra.name}}</span></span>
<!--第二层-->
                  <div v-for="son in ztrra.children">
                    <div v-if="son.children">
                      <el-submenu :index="String(son.id)" v-if="son.children">
                        <span slot="title"><span @click="aa">{{son.name}}</span></span>
<!--第三层-->
                        <div v-for="grandson in son.children">
                          <div v-if="grandson.children">
                            <el-submenu :index="String(grandson.id)" v-if="grandson.children">
                              <span slot="title"><span @click="aa">{{grandson.name}}</span></span>
                            </el-submenu>
                          </div>
                          <div v-else >
                            <el-menu-item :index="String(grandson.id)"><span @click="aa">{{grandson.name}}</span></el-menu-item>
                          </div>
                        </div>
<!--                        -->
                      </el-submenu>
                    </div>
                    <div v-else >
                      <el-menu-item :index="String(son.id)"><span @click="aa">{{son.name}}</span></el-menu-item>
                    </div>
                  </div>
<!--                  -->
                </el-submenu>
            </div>
        <div v-else >
          <el-menu-item :index="String(ztrra.id)"><span @click="aa">{{ztrra.name}}</span></el-menu-item>
        </div>
      </div>

    </el-menu>
<!--分类树形结构-->
    <div align="left" v-show="isshow">
      <el-button type="success" @click="toadd()" plain>添加</el-button>
      <el-button type="primary" @click="toupdate()" plain>修改</el-button>
    </div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"

      ref="category"
      @node-click="clickNode"
      :check-on-click-node="true"

      accordion
      :props="defaultProps"
      :default-expand-all="true"

    >
    </el-tree>
<!--  添加-->
    <el-dialog title="添加" :visible.sync="dialogFormVisible" width="35%">
      <!--      表单部分-->
      <el-form :model="addCategorydata"  ref="addCategorydata" prop="addCategorydata" >
        <el-form-item label="pid" :label-width="formLabelWidth"  >
          <el-input v-model="checkedNode.pid" style="width:300px" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="pname" :label-width="formLabelWidth"  >
          <el-input v-model="checkedNode.name" style="width:300px" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新的节点" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addCategorydata.name" style="width:300px" autocomplete="off"  ></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addqx()">取 消</el-button>
        <el-button type="primary" @click="addCategory()">确 定</el-button>
      </div>
    </el-dialog>
<!--  修改-->
    <el-dialog title="修改" :visible.sync="dialogFormVisibleup" width="35%">
      <!--      表单部分-->
      <el-form :model="updateCategorydata"  ref="updateCategorydata" >
        <el-form-item label="pid" :label-width="formLabelWidth"  >
          <el-input v-model="updateCategorydata.pid" style="width:300px" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth" >
          <el-input v-model="updateCategorydata.name" style="width:300px" autocomplete="off"  ></el-input>
        </el-form-item>
        <el-form-item label="上下架" :label-width="formLabelWidth" prop="isDel">
          <div align="left">
            <el-radio v-model="updateCategorydata.newisDel" :label="1" >上架</el-radio>
            <el-radio v-model="updateCategorydata.newisDel" :label="2" >下架</el-radio>
          </div>
        </el-form-item>


      </el-form>
      <!--      按钮部分-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleup = false">取 消</el-button>
        <el-button type="primary" @click="updateCategory()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: '',
    data(){
      return {
          ztrradata: [],
          isCollapse: true,
          data:[],
          defaultProps: {
              children: 'children',
              label: 'name'
          },
          props: {
              label:'name',
              children:'children',
              isLeaf:'leaf'
          },
          dialogFormVisible:false,
          dialogFormVisibleup:false,
          formLabelWidth:"120px",
          // ztree
          data: [],
          isshow:false,
          checkedNode:{
              id:'',
              name:'',
              pid:'',
              isDel:'',
          },
          addCategorydata:{
              id:'',
              name:'',
              pid:'',
          },
          updateCategorydata:{
              id:'',
              name:'',
              pid:'',
              isDel:'',
              newisDel:'',
          },
  }
  },
  methods:{
      aa(){
          console.log(222)
      },


      queryProductCategory () {
        var self = this;
        this.$axios.get("api/api/type/getData").then(function (res) {
          if (res.data.code == 110) {
            self.ztrradata = res.data.data;
            self.data = res.data.data;
          }else if(res.data.code=120){
              self.$message({showClose: true,message: '查询失败！',type: 'error'});
          }
        }).catch(function () {
            self.$message({showClose: true,message: '系统错误，请联系管理员！',type: 'error'});
        })
      },
      //点击选中后
      clickNode(data){
          this.checkedNode.id=data.id;
          this.checkedNode.name=data.name;
          this.checkedNode.pid=data.pid;
          this.checkedNode.isDel=data.isDel;
          this.isshow=true;
      },
      toadd(){
          this.addCategorydata.pid=this.checkedNode.id
          this.dialogFormVisible = true;
      },
      addqx(){
          this.dialogFormVisible = false
          this.addCategorydata.name='';
      },
      addCategory(){
          var self = this;
          this.$axios.post("api/api/type/add",this.$qs.stringify(this.addCategorydata)).then(function (res) {
              if (res.data.code==110){
                  self.queryProductCategory();
                  self.$refs.addCategorydata.resetFields();
                  self.$message({showClose: true,message: '添加成功！',type: 'success'});
                  self.dialogFormVisible = false;
              }else {
                  self.$message({showClose: true,message: '添加失败 ！',type: 'error'});
              }
          }).catch(function () {
              self.$message({showClose: true,message: '系统错误 ！',type: 'error'});
          })
      },
      toupdate(){
          this.dialogFormVisibleup = true;
          this.updateCategorydata.id=this.checkedNode.id;
          this.updateCategorydata.name=this.checkedNode.name;
          this.updateCategorydata.pid=this.checkedNode.pid;
          this.updateCategorydata.isDel=this.checkedNode.isDel;
          this.updateCategorydata.newisDel=this.checkedNode.isDel;
      },
      updateCategory(){
          var self = this;
          this.$axios.put("api/api/type/update",this.$qs.stringify(this.updateCategorydata)).then(function (res) {
              if (res.data.code==110){
                  self.queryProductCategory();
                  self.$message({showClose: true,message: '修改成功！',type: 'success'});
                  self.dialogFormVisibleup = false;
              }else {
                  self.$message({showClose: true,message: '修改失败！',type: 'error'});
              }
          })
      },
      handleOpen(key, keyPath) {
          console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
          console.log(key, keyPath);
      },
    },
    created(){
      this.queryProductCategory();
    },watch:{
          dialogFormVisible:function(){
              if(this.dialogFormVisible==false){
                  this.addCategorydata.name='';
              }
          }
      },
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
