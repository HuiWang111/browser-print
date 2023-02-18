import Vue from 'vue'
import Antd from 'ant-design-vue';
// @ts-ignore
import App from './App.vue'
import Printer from '../es'
import './index.less'
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
Vue.use(Printer)

new Vue({
	el: '#app',
	render: (h) => h(App)
})