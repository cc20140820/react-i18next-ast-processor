# i18n AST Processor

这是一个用于扫描 JavaScript/TypeScript 文件并将字符串文本转换为国际化（i18n）调用的工具。它支持将中文字符串替换为 `i18next.t` 调用，并生成一个包含翻译键和中文的输出文件。

## 特性

- 扫描指定目录下的 JavaScript/TypeScript 文件
- 支持 JSX 和模板字符串
- 可以配置忽略某些函数调用
- 自动生成翻译键
- 支持自定义输出格式和目录

## 安装

```bash
npm install
```

## 使用

1. 创建 i18n-ast.config.js 配置文件：

```
const { resolve } = require('path')

module.exports = {
  entry: [resolve('src/pages/overview/dashboard')], // 必填
  output: './output', // 必填 输出目录
  i18nConfigFilePath: '@/i18n', // 必填 导入i18n配置(结合tsconfig中的paths定义)
  prettierrc: require('./.prettierrc'),
  exclude: ['resources', 'types', 'utils'], // 排除的文件
  ignoreFunctions: ['sensorsUtil', 'sensorsFundClick'], // 需要忽略的函数调用

  // WIP
  locales: 'zh', // 默认语言(无须调整)
  excelName: 'output.xlsx', // 输出excel名
}
```

2. 在项目根目录运行：

```
node path/to/this/script.js
```
