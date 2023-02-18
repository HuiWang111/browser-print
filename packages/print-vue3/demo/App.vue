<template>
  <div>
    <a-button type="primary" v-print="'print-content'">id string print</a-button>
    <a-button type="primary" v-print="defaultPrintObj">default object print</a-button>
    <a-button type="primary" v-print="withShouldPrintObj">shouldPrint false print</a-button>
    <a-button type="primary" v-print="withShouldPrintAsyncObj" :loading="loading">with shouldPrintAsync print</a-button>
    <a-checkbox v-model:checked="checked">是否打印</a-checkbox>
    <div id="print-content">
      <div id="main" style="width: 600px;height:400px;margin: 10px 0;"></div>
      <a-form
        :model="formState"
        name="validate_other"
        v-bind="formItemLayout"
        @finishFailed="onFinishFailed"
        @finish="onFinish"
      >
        <a-form-item label="Plain Text">
          <span class="ant-form-text">China</span>
        </a-form-item>
        <a-form-item
          name="select"
          label="Select"
          has-feedback
          :rules="[{ required: true, message: 'Please select your country!' }]"
        >
          <a-select v-model:value="formState.select" placeholder="Please select a country">
            <a-select-option value="china">China</a-select-option>
            <a-select-option value="usa">U.S.A</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          name="select-multiple"
          label="Select[multiple]"
          :rules="[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]"
        >
          <a-select
            v-model:value="formState['select-multiple']"
            mode="multiple"
            placeholder="Please select favourite colors"
          >
            <a-select-option value="red">Red</a-select-option>
            <a-select-option value="green">Green</a-select-option>
            <a-select-option value="blue">Blue</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="InputNumber">
          <a-form-item name="input-number" no-style>
            <a-input-number v-model:value="formState['input-number']" :min="1" :max="10" />
          </a-form-item>
          <span class="ant-form-text">machines</span>
        </a-form-item>

        <a-form-item name="switch" label="Switch">
          <a-switch v-model:checked="formState.switch" />
        </a-form-item>

        <a-form-item name="slider" label="Slider">
          <a-slider
            v-model:value="formState.slider"
            :marks="{
              0: 'A',
              20: 'B',
              40: 'C',
              60: 'D',
              80: 'E',
              100: 'F',
            }"
          />
        </a-form-item>

        <a-form-item name="radio-group" label="Radio.Group">
          <a-radio-group v-model:value="formState['radio-group']">
            <a-radio value="a">item 1</a-radio>
            <a-radio value="b">item 2</a-radio>
            <a-radio value="c">item 3</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          name="radio-button"
          label="Radio.Button"
          :rules="[{ required: true, message: 'Please pick an item!' }]"
        >
          <a-radio-group v-model:value="formState['radio-button']">
            <a-radio-button value="a">item 1</a-radio-button>
            <a-radio-button value="b">item 2</a-radio-button>
            <a-radio-button value="c">item 3</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item name="checkbox-group" label="Checkbox.Group">
          <a-checkbox-group v-model:value="formState['checkbox-group']">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="A" style="line-height: 32px">A</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="B" style="line-height: 32px" disabled>B</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="C" style="line-height: 32px">C</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="D" style="line-height: 32px">D</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="E" style="line-height: 32px">E</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="F" style="line-height: 32px">F</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item name="rate" label="Rate">
          <a-rate v-model:value="formState.rate" allow-half />
        </a-form-item>

        <a-form-item name="upload" label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
          <a-upload
            v-model:fileList="formState.upload"
            name="logo"
            action="/upload.do"
            list-type="picture"
          >
            <a-button>
              <template #icon><UploadOutlined /></template>
              Click to upload
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="Dragger">
          <a-form-item name="dragger" no-style>
            <a-upload-dragger v-model:fileList="formState.dragger" name="files" action="/upload.do">
              <p class="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p class="ant-upload-text">Click or drag file to this area to upload</p>
              <p class="ant-upload-hint">Support for a single or bulk upload.</p>
            </a-upload-dragger>
          </a-form-item>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons-vue';
import type { PrinterConfig } from '../es'

export default defineComponent({
  components: {
    UploadOutlined,
    InboxOutlined,
  },
  setup() {
    const loading = ref(false)
    const checked = ref(false)
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const defaultPrintObj = {
      id: 'print-content'
    }
    const shouldToPrint = () => {
      if (!checked.value) {
        message.error('你拒绝了打印')
      }
      return checked.value
    }
    const withShouldPrintObj = {
      ...defaultPrintObj,
      shouldToPrint,
    }
    const shouldToPrintAsync: PrinterConfig['shouldToPrintAsync'] = (resolve) => {
      loading.value = true
      setTimeout(() => {
        loading.value = false

        if (!checked.value) {
          message.error('你拒绝了打印')
        } 
        resolve(checked.value)
      }, 2000)
    }
    const withShouldPrintAsyncObj = {
      ...defaultPrintObj,
      shouldToPrintAsync,
    }
    
    onMounted(() => {
      const myChart = echarts.init(document.getElementById('main') as HTMLElement);
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
    })

    const formState = reactive<Record<string, any>>({
      'input-number': 3,
      'checkbox-group': ['A', 'B'],
      rate: 3.5,
    });
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      formItemLayout,
      withShouldPrintObj,
      withShouldPrintAsyncObj,
      defaultPrintObj,
      loading,
      checked,
    };
  },
});
</script>

<style>
.ant-btn {
  margin-right: 8px;
}
</style>
