import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/product/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/producthomepage'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '系统首页' },
      children: [
        {
          path: '/producthomepage',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ProductHomePage.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/showproduct',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/ShowProduct.vue'),
          meta: { title: '商品展示' }
        },
        {
          path: '/productadd',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/ProductAdd.vue'),
          meta: { title: '添加商品' }
        },
        {
          path: '/category',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Category.vue'),
          meta: { title: '商品分类' }
        },
        {
          path: '/brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Brand.vue'),
          meta: { title: '商品品牌' }
        },
        {
          path: '/property',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Property.vue'),
          meta: { title: '商品属性' }
        },
        {
          path: '/test',
          component: ()=>import(/* webpackChunkName: "dashboard" */'../components/Test.vue'),
          meta: {title:'测试页面'}
        },
        {
          path: '/icon',
          component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
          meta:{ title:'自定义图标'}
        },
        {
          path: '/user',
          component: () => import(/* webpackChunkName: "icon" */ '../components/user/User.vue'),
          meta:{ title:'用户信息'}
        },
      ]
    },
  ]
})
