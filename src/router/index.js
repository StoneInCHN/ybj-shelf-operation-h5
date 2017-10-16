import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
import Full from '@/containers/Full'

// Views - Pages
import Page404 from '@/views/errorPages/Page404'
import Page500 from '@/views/errorPages/Page500'


/* login */
const Login = _import('login/index');
Vue.use(Router);

export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  {
    path: '/pages',
    redirect: '/pages/p404',
    name: 'Pages',
    component: {
      render(c) { return c('router-view') }
    },
    children: [{ path: '404', name: 'Page404', component: _import('errorPages/Page404') },
      { path: '500', name: 'Page500', component: _import('errorPages/Page404') },
    ]
  }
]
export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/dashboard',
    name: '首页',
    component: Full,
    hidden: false,
    children: [],
    // children: [
    //   { path: '/dashboard', name: '首页', icon: 'speedometer', component: _import('Dashboard') },
    //   { path: '/orderList', name: '订单管理', icon: 'clipboard', component: _import('order/OrderList') },
    //   { path: '/orderDetail/:id', name: '订单详情', hidden: true, component: _import('order/OrderDetail') },
    //   { path: '/companyList', name: '公司管理', icon: "ios-photos-outline", component: _import('company/CompanyList') },
    //   { path: '/goodsList', name: '商品管理', icon: "android-playstore", component: _import('order/OrderList') },
    //   { path: '/userList', name: '用户管理', icon: "android-contacts", component: _import('order/OrderList') },
    // ]
  },
  { path: '*', redirect: '/pages/404', hidden: true }
];

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }), 
  //routes: constantRouterMap.concat(asyncRouterMap)
  routes: constantRouterMap
});

