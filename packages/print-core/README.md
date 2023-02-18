# `@browser-print/core`

> 原生js打印工具

## Usage

1. local print
```js
var handleBeforePrint = function() {
  console.log('before print')
}
var handleAfterPrint = function() {
  console.log('after print')
}

new Printer({
  id: 'print-content',
  iframeTitle: 'print',
  extraHead: [
    '<meta http-equiv="Access-Control-Allow-Origin" content="*">'
  ],
  onBeforePrint: handleBeforePrint,
  onAfterPrint: handleAfterPrint,
})
```

2. url print
```js
new Printer({
  url: 'http://localhost:8897/vite-react.html',
  onBeforePrint: handleBeforePrint,
  onAfterPrint: handleAfterPrint,
})
```

3. async url print
```js
new Printer({
  getUrlAsync: function(resolve) {
    setTimeout(function() {
      resolve('http://localhost:8897/vite-react.html')
    }, 2000)
  },
  onBeforePrint: handleBeforePrint,
  onAfterPrint: handleAfterPrint,
})
```

## Options

```ts
enum HTMLStandards {
  Strict = 'strict',
  Loose = 'loose',
  HTML5 = 'html5',
}

interface PrinterOptions {
  id?: string;
  standard?: HTMLStandards;
  extraHead?: string[];
  extraCss?: string[];
  iframeTitle?: string;
  url?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  getUrlAsync?: (resolve: (url: string) => void) => void;
}
```

| Option | Description |
| --- | --- |
| id | 需要被打印的元素id |
| standard | 设置 iframe html 标准 |
| extraHead | 添加额外的元素到 iframe head 标签下 |
| extraCss | 添加额外的 css url 地址 |
| iframeTitle | 设置 iframe title |
| url | 用于 url 打印 |
| onBeforePrint | 执行打印之前的回调 |
| onAfterPrint | 执行打印之后的回调 |
| getUrlAsync | 用于 async url 打印 |
