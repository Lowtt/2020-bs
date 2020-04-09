// 引用模板
import Vue from 'vue';
import Router from 'vue-router';

import {
  login,
  reg,
  update
} from '../pages/login';
import index from '../pages/index';
// import reg from '../pages/login/reg';
Vue.use(Router)

export default new Router({
  model: history,
  routes: [{
      path: '/',
      name: 'App',
      component: () =>
        import('../App'),
      redirect: '/login',
    }, {
      path: '/login',
      name: '登录',
      component: login
    }, {
      path: '/reg',
      name: '注册',
      component: reg
    }, {
      path: '/update',
      name: '修改密码',
      component: update
    },
    {
      path: '/index',
      name: '',
      component: index,
      children: [{
        name: '首页',
        path: '/index/index',
        component: () =>
          import('../pages/index/index')
      }]
    },
    {
      path: '/点餐管理',
      component: index,
      path: '/order',
      children: [{
        path: '/order/orderManage',
        component: () =>
          import('../pages/order/orderManage') //点餐页面
      }]
    },
    {
      name: '报表管理',
      path: '/report',
      component: index,
      children: [{
          name: '营业额度',
          path: '/report/sale',
          component: () =>
            import('../pages/report/makeMoney')
        },
        {
          name: '菜品销量',
          path: '/report/foodSale',
          component: () =>
            import('../pages/report/foodSale')
        }
      ]
    },
    {

      name: '系统设置',
      path: '/system',
      component: index,
      children: [{
        name: '新增菜品',
        path: '/system/addFood',
        component: () =>
          import('../pages/system/addFood')
      }, 
      {
        name: '配送人员',
        path: '/system/sendPreson',
        component: () =>
          import('../pages/system/sendPreson')
      }, 
      {
        name: '用户信息',
        path: '/system/userinfo',
        component: () =>
          import('../pages/system/userinfo')
      }]
    }
  ]
})
