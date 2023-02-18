# `@browser-print/vue`

> Vue2 打印工具

## Usage

```html
<template>
  <button v-print="'print-content'">打印</button>
  <button v-print="printObj">打印</button>
  <div id="print-content">
    <!-- print content -->
  </div>
</template>

<script setup>
const printObj = {
  id: 'print-content'
}
</script>
```

## Options

```ts
interface PrinterConfig extends PrinterOptions {
  shouldToPrint?: () => boolean;
  shouldToPrintAsync?: (resolve: (shouldPrint: boolean) => void) => void;
}
```

| Option | Description |
| --- | --- |
| shouldToPrint | 是否需要打印的回调 |
| shouldToPrintAsync | 是否需要打印的异步回调 |

更多属性请参考 [@browser-print/core](https://github.com/HuiWang111/browser-print/tree/main/packages/print-core)
