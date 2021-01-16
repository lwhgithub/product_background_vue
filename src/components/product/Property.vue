<template>
    <diV>
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
        <el-table-column prop="name" label="属性分类" ></el-table-column>
        <el-table-column prop="propertytype" label="属性类型" >
          <template slot-scope="scope">
            {{ scope.row.propertytype==1?'下拉框':scope.row.propertytype==2?'单选框':scope.row.propertytype==3?'复选框':scope.row.propertytype==4?'输入框':'未知'}}
          </template>
        </el-table-column>
        <el-table-column prop="propertyisSKU" label="是否为sku属性" >
          <template slot-scope="scope">
            {{ scope.row.propertyisSKU==1?'是':scope.row.bookType==2?'否':'待定'}}
          </template>
        </el-table-column>
        <el-table-column prop="propertycreateDate" label="创建时间"></el-table-column>
        <el-table-column prop="propertyupdateDate" label="修改时间"></el-table-column>
        <el-table-column prop="propertyauthor" label="操作人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" @click="hx(scope.row)" circle></el-button>
              <!--              <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" circle></el-button>-->
            </el-row>
          </template>
        </el-table-column>
      </el-table>

    </diV>
</template>

<script>
    export default {
        name: "",
        data(){
            return {
                //商品分类查询结果
                propertycategory:[],
                // 查询结果
                property:[],
        //       propertyid
        //       propertyname;//  属性名   color
        //       propertynameCH;//  属性中文名   颜色
        //       propertytypeId;//   分类的主键
        //       propertytype;//     属性的类型    0 下拉框     1 单选框      2  复选框   3  输入框
        //       propertyisSKU;//  是否为sku属性
        //       propertyisDel;//   逻辑删
        //       propertycreateDate;//
        //       propertyupdateDate;//
        //       propertyauthor;// 操作人
                //分页条件查询
                currentPage4: 0,
                total:0,
                xsts:[3,4,5,6,7,9,10,20,50],
                paging:{
                    pagingStart:0,
                    pagingSize:3,

                },
                //宽度
                formLabelWidth: '120px',
                // 头部复选框
                multipleSelection:[],
            }
        },
        methods:{
            getData(){
                var self=this;
              this.$axios.get("api/api/property/getData?"+this.$qs.stringify(this.paging)).then(function (res) {
                  if(res.data.code=110){
                      self.property=res.data.data.propertylist;
                      self.total=res.data.data.count;
                  }
              }).catch(function () {

              })
            },
            getPropertyCategory(){
                var self=this;
              this.$axios.get("api/api/type/getPropertyCategory").then(function (res) {
                  if(res.data.code=110){
                      self.propertycategory=res.data.data;
                  }
              }).catch(function () {

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
