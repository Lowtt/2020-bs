 import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import store from './store/index';
import echarts from 'echarts'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.prototype.$echarts = echarts



Vue.config.productionTip = false

Vue.use(antd);

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
