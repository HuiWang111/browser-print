/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import Printer from '../es'
// @ts-ignore
import App from './App.vue'
import './index.less'
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

app.use(Antd);
app.use(Printer)
app.mount('#app');