<template>
  <div style="height: 695px;overflow:auto;padding-top: 10px">
    <div style="float: right">
      <el-button type="success" @click="spuserloginff()" plain>登录</el-button>
      <el-button type="success" @click="userregisterff()" plain>注册</el-button>
      <el-button type="success" @click="forgetpassword()" plain>忘记密码</el-button>
    </div>
    <center>
      <!--      登录-->
      <div style="width: 400px" v-show="spuserlogin">
        <el-form :model="LoginUser"   ref="LoginUser" label-width="100px" >
          <h1><i>用户登录页面</i></h1>
          <el-form-item label="账号/手机号" prop="userName">
            <el-input placeholder="请输入账号或注册手机号"  v-model.trim="LoginUser.userName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input type="password" v-model.trim="LoginUser.userPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('LoginUser')">登录</el-button>
            <el-button @click="resetForm('LoginUser')">重置</el-button>
            <el-button @click="submitFormqx()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      注册-->
      <div style="width: 400px" v-show="userregister">
        <el-form :model="RegisterUser"   ref="RegisterUser" label-width="90px" >
          <h1><i>用户注册页面</i></h1>
          <el-form-item label="用户名/账号" prop="userName">
            <el-input v-model.trim="RegisterUser.userName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="userRealName">
            <el-input v-model.trim="RegisterUser.userRealName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model.trim="RegisterUser.userPassword" autocomplete="off" :type="passa" clearable @blur="onBlur">
              <i slot="suffix" :class="icon" @click="showPass"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkpass">
            <el-input v-model.trim="RegisterUser.checkpass" autocomplete="off" :type="passb" clearable @blur="onBlurb" placeholder="再次输入密码">
              <i slot="suffix" :class="icona" @click="showPassb"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model.trim="RegisterUser.userPhone" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model.trim="RegisterUser.code" autocomplete="off" placeholder="请先输入手机号" style="width: 166px"></el-input>
            <el-button @click="sendcode()">点击获取验证码</el-button>
          </el-form-item>
          <el-form-item label="用户性别"  prop="userSex">
            <div align="left">
              <el-radio v-model="RegisterUser.userSex" :label="1" >男</el-radio>
              <el-radio v-model="RegisterUser.userSex" :label="2" >女</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model.trim="RegisterUser.userEmail" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="用户身份证" prop="userIdCard">
          <el-input v-model.trim="RegisterUser.userIdCard" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="用户生日"  >
            <div align="left">
              <el-date-picker v-model="RegisterUser.userBirthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"  ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="头像" prop="userImgUrl">
            <div align="left">
              <el-upload class="upload-demo" drag action="api/UserController/uploadFile"
                         :on-success="adduploadSuccess" :on-remove="addfiledelete"
                         :file-list="filelist" ref="addupload"
                         :before-upload="beforeAvatarUpload"
                         multiple>
                <div v-if="RegisterUser.userImgUrl==''">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                </div>
                <div v-else>
                  <img :src="RegisterUser.userImgUrl" width="360px" height="180px">
                </div>
              </el-upload>
              <div style="margin-left: 80px" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1024kb</div>
            </div>
          </el-form-item>
          <el-form-item label="用户学历" prop="userEduId">
          <el-input v-model.trim="RegisterUser.userEduId" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="部门id" prop="userDeptId">
          <el-input v-model.trim="RegisterUser.userDeptId" autocomplete="off" ></el-input>
          </el-form-item>





          <el-form-item>
            <el-button type="primary" @click="submitFormb('RegisterUser')">注册</el-button>
            <el-button @click="resetFormb('RegisterUser')">重置</el-button>
            <el-button @click="submitFormbqx()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </center>
  </div>
</template>
<script>
    export default {
        name: '',
        data() {
            return {
                icon: "el-input__icon el-icon-view",
                passa: "password",
                icona: "el-input__icon el-icon-view",
                passb: "password",
                spuserlogin:false,
                userregister:false,
                LoginUser:{
                    userName: '',
                    userPassword: '',
                },
                RegisterUser:{
                    userName: '',
                    userRealName:'',
                    userPassword: '',
                    checkpass: '',
                    userPhone:'',
                    code:'',
                    userSex:'',
                    userEmail:'',
                    userIdCard:'',
                    userBirthday:'',
                    userImgUrl:'',
                    userEduId:'',
                    userDeptId:'',
                },

                // 文件上传集合
                filelist:[],
            };
        },
        methods: {
            // 忘记密码
            forgetpassword(){
                this.$message.error("恭喜你，你把你的密码忘了,我也找不回来,你号没了,这边建议您直接投诉哦！")
            },
            //密码的隐藏和显示111
            showPass() {
                //点击图标是密码隐藏或显示
                if (this.passa == "text") {
                    this.passa = "password";
                    //更换图标
                    this.icon = "el-input__icon el-icon-view";
                } else {
                    this.passa = "text";
                    this.icon = "el-input__icon el-icon-loading";
                    setTimeout(()=>{
                        this.icon = "";
                    },500)
                }
            },
            //密码失焦事件
            onBlur(){
                this.passa = "password";
                this.icon = "el-input__icon el-icon-view";
            },

            showPassb() {
                //点击图标是密码隐藏或显示
                if (this.passb == "text") {
                    this.passb = "password";
                    //更换图标
                    this.icona = "el-input__icon el-icon-view";
                } else {
                    this.passb = "text";
                    this.icona = "el-input__icon el-icon-loading";
                    setTimeout(()=>{
                        this.icona = "";
                    },500)
                }
            },
            //密码失焦事件
            onBlurb(){
                this.passb = "password";
                this.icona = "el-input__icon el-icon-view";
            },
            //点击用户登录
            spuserloginff(){
                this.userregister=false;
                this.RegisterUser={};
                this.$refs.addupload.clearFiles();
                this.spuserlogin=true;
            },
            //点击用户注册
            userregisterff(){
                this.spuserlogin=false;
                this.LoginUser={};
                this.userregister=true;
            },
            //点击登录取消
            submitFormqx(){
                this.LoginUser={};
                this.spuserlogin=false;
            },
            //点击注册取消
            submitFormbqx(){
                this.RegisterUser={};
                this.userregister=false;
            },
            //用户正式登录
            submitForm() {
                if(this.LoginUser.userName==""){
                    this.$message.error("用户名或账号不能为空！")
                    return;
                }
                if(this.LoginUser.userPassword==""){
                    this.$message.error("密码不能为空！")
                    return;
                }
                var self = this;
                this.$axios.post("/api/UserController/login",this.$qs.stringify(this.LoginUser)).then(function (res) {
                    console.log(res.data)
                    if (res.data.code==110) {
                        let userValue ={"userName":self.LoginUser.userName,"token":res.data.data};
                        window.sessionStorage.setItem("login_user",JSON.stringify(userValue));
                        self.$router.push("/")
                    }else if(res.data.code==120){
                        self.$message.error(res.data.message)
                    }else{
                        self.$message.error("登录错误,你输入的密码可能存在空格，请重新登录")
                    }
                })
            },
            //用户注册
            submitFormb() {
                if(this.RegisterUser.userName==""){
                    this.$message.error("用户名不能为空！")
                    return;
                }
                if(this.RegisterUser.userPassword==""){
                    this.$message.error("密码不能为空！")
                    return;
                }
                if(this.RegisterUser.checkpass!=this.RegisterUser.userPassword){
                    this.$message.error("两次输入的密码不一致！")
                    return;
                }
                if(this.RegisterUser.userPhone==""){
                    this.$message.error("手机号不能为空！")
                    return;
                }
                if(this.RegisterUser.code==""){
                    this.$message.error("验证码不能为空！")
                    return;
                }
                var self = this;
                this.$axios.post("/api/UserController/addregister",this.$qs.stringify(this.RegisterUser)).then(function (res) {
                    console.log(res.data)
                    if (res.data.code==110) {
                        self.spuserloginff();
                    }else if(res.data.code==120){
                        self.$message.error(res.data.message)
                    }else{
                        self.$message.error("注册失败")
                    }
                })
            },
            //获取验证码
            sendcode(){
                console.log(this.RegisterUser.userPhone)
                if(this.RegisterUser.userPhone == ''){
                    this.$message({showClose: true,message: '请输入手机号！',type: 'error'});
                    return;
                }
                var self = this;
                this.$axios.post("/api/UserController/sendcode",this.$qs.stringify(this.RegisterUser)).then(function (res) {
                    if (res.data.code==1111) {
                        self.$message.success("发送成功,请注意短信查收")
                    }else{
                        self.$message.error("短信发送失败,请重新尝试发送")
                    }
                })
            },
            //用户登录页面重置
            resetForm(LoginUser) {
                this.$refs[LoginUser].resetFields();
            },
            //用户注册页面重置
            resetFormb(RegisterUser) {
                this.$refs[RegisterUser].resetFields();
                this.$refs.addupload.clearFiles();
                this.filelist=[];
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
            //添加文件上传成功的钩子
            adduploadSuccess(response, file, fileList) {
                this.RegisterUser.userImgUrl = response.data;
                this.$message.success("图片上传成功");
            },
            //添加文件列表移除文件时的钩子
            addfiledelete(file, fileList){
                this.RegisterUser.userImgUrl='';
            },
        },
        created(){
            this.spuserloginff();
        }
    }
</script>
<style >

</style>
