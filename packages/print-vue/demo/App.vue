<template>
  <div>
    <a-button type="primary" v-print="'print-content'">id string print</a-button>
    <a-button type="primary" v-print="defaultPrintObj">default object print</a-button>
    <a-button type="primary" v-print="withShouldPrintObj">shouldPrint false print</a-button>
    <a-button type="primary" v-print="withShouldPrintAsyncObj" :loading="loading">with shouldPrintAsync print</a-button>
    <a-checkbox v-model="checked">是否打印</a-checkbox>
    <div id="print-content">
      <div id="main" style="width: 600px;height:400px;margin: 10px 0;"></div>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="E-mail">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Password" has-feedback>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Confirm Password" has-feedback>
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout">
          <span slot="label">
            Nickname&nbsp;
            <a-tooltip title="What do you want others to call you?">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            v-decorator="[
              'nickname',
              {
                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Habitual Residence">
          <a-cascader
            v-decorator="[
              'residence',
              {
                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                rules: [
                  { type: 'array', required: true, message: 'Please select your habitual residence!' },
                ],
              },
            ]"
            :options="residences"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Phone Number">
          <a-input
            v-decorator="[
              'phone',
              {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              },
            ]"
            style="width: 100%"
          >
            <a-select
              slot="addonBefore"
              v-decorator="['prefix', { initialValue: '86' }]"
              style="width: 70px"
            >
              <a-select-option value="86">
                +86
              </a-select-option>
              <a-select-option value="87">
                +87
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Website">
          <a-auto-complete
            v-decorator="['website', { rules: [{ required: true, message: 'Please input website!' }] }]"
            placeholder="website"
            @change="handleWebsiteChange"
          >
            <template slot="dataSource">
              <a-select-option v-for="website in autoCompleteResult" :key="website">
                {{ website }}
              </a-select-option>
            </template>
            <a-input />
          </a-auto-complete>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="Captcha"
          extra="We must make sure that your are a human."
        >
          <a-row :gutter="8">
            <a-col :span="12">
              <a-input
                v-decorator="[
                  'captcha',
                  { rules: [{ required: true, message: 'Please input the captcha you got!' }] },
                ]"
              />
            </a-col>
            <a-col :span="12">
              <a-button>Get captcha</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
            I have read the
            <a href="">
              agreement
            </a>
          </a-checkbox>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-button type="primary" html-type="submit">
            Register
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default {
  data() {
    return {
      confirmDirty: false,
      residences,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
      defaultPrintObj: {
        id: 'print-content'
      },
      withShouldPrintObj: {
        id: 'print-content',
        shouldToPrint: this.shouldToPrint
      },
      withShouldPrintAsyncObj: {
        id: 'print-content',
        shouldToPrintAsync: this.shouldToPrintAsync
      },
      loading: false,
      checked: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },
  mounted() {
    const myChart = echarts.init(document.getElementById('main'));
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    myChart.setOption(option);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
    handleWebsiteChange(value) {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.autoCompleteResult = autoCompleteResult;
    },
    shouldToPrint() {
      if (!this.checked) {
        this.$message.error('你拒绝了打印')
      }
      return this.checked
    },
    shouldToPrintAsync(resolve) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        if (!this.checked) {
          this.$message.error('你拒绝了打印')
        }
        resolve(this.checked)
      }, 2000)
    }
  },
};
</script>

<style>
.ant-btn {
  margin-right: 8px;
}
</style>
