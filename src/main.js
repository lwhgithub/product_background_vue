// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


import './assets/css/icon.css';

//qs
import QS from 'qs'
// 将qs放到原型链中
Vue.prototype.$qs = QS
//ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
//axios
import axios from 'axios';
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios)
Vue.prototype.$axios = axios

// 前台vue cookies无法传到后台
axios.defaults.withCredentials=true

Vue.config.productionTip = false


// 配置路由守卫 通过判断是否登录来跳转
      router.beforeEach((to, from, next) => {
        //  to  去  from  来自   next 允许通过
        if(to.fullPath!="/login"){
          var token = window.sessionStorage.getItem('login_user');
            if(token ==null){
              next({path:"/login"});
             }else{
              next();
            }
          }else{
            next();
        }
      });
// 添加请求拦截器
      axios.interceptors.request.use(function (config) {
        // 判断是否存在token,如果存在将每个页面header添加token
        let token=window.sessionStorage.getItem('login_user');
        if(token!=null){
          let stringtoken = JSON.parse(token);
              config.params = {"token":stringtoken.token}
        }
        // 在发送请求之前做些什么
        return config
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      });

// 添加响应拦截器
    axios.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      if(response.data.code!=2000 && response.data.code!=2001){
        return response
      }else{
        router.push('/login')
      }
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error)
    });


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
