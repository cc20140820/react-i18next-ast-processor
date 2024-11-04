# i18n AST Processor

这是一个用于扫描 JavaScript/TypeScript 文件并将字符串文本转换为国际化（i18n）调用的工具。它支持将中文字符串替换为 `i18next.t` 调用，并生成一个包含翻译键和中文的输出文件。

## 特性

- 扫描指定目录下的 JavaScript/TypeScript 文件
- 支持 JSX 和模板字符串
- 可以配置忽略某些函数调用
- 自动生成唯一翻译键
- 支持自定义输出格式和目录
- 支持转换为Excel

## 安装

```bash
npm install
```

## 使用

1. 创建 i18n-ast.config.js 配置文件：

```
const { resolve } = require('path')

module.exports = {
  entry: [resolve('src/pages/overview/dashboard')], // 必填，入口文件或目录，可以是一个数组
  output: './output', // 必填，生成文件的输出目录
  locales: 'zh', // 必填，源语言，支持 'zh' (中文), 'en' (英语), 'fr' (法语), 'es' (西班牙语)
  i18nConfigFilePath: '@/i18n', // 必填，i18n 配置的导入路径
  targetLngs: ['zh-TW', 'en'], // 可选，指定要翻译成的目标语言数组
  prettierrc: require('./.prettierrc'), // 可选，Prettier 配置文件的路径
  exclude: [], // 可选，指定要排除的文件或目录，例如 ['types', 'utils']
  ignoreFunctions: ['console.log'], // 可选，指定要忽略的函数调用，例如 ['console.log']
  translator: {
    SECRET_ID: 'YOUR_SECRET_ID', // 必填，翻译服务的 Secret ID
    SECRET_KEY: 'YOUR_SECRET_KEY', // 必填，翻译服务的 Secret Key
    PROJECT_ID: 'YOUR_PROJECT_ID', // 必填，翻译服务的项目 ID
  },

  isModule: false, // 可选，是否启用模块化命名空间
}

```

### 配置说明

以下是 `i18n-ast.config.js` 文件中的各个字段说明：

- `entry`: (必填) 入口文件或目录，可以是一个字符串或字符串数组，指定需要处理的文件。
- `output`: (必填) 生成文件的输出目录。
- `locales`: (必填) 源语言，支持的值包括 'zh' (中文), 'en' (英语), 'fr' (法语), 'es' (西班牙语)。
- `i18nConfigFilePath`: (必填) i18n 配置的导入路径。
- `targetLngs`: (可选) 指定要翻译成的目标语言数组。
- `prettierrc`: (可选) Prettier 配置文件的路径。
- `exclude`: (可选) 指定要排除的文件或目录，例如 `['types', 'utils']`。
- `ignoreFunctions`: (可选) 指定要忽略的函数调用，例如 `['console.log']`。
- `translator`: (必填) 包含翻译服务的认证信息：
  - `SECRET_ID`: 翻译服务的 Secret ID。
  - `SECRET_KEY`: 翻译服务的 Secret Key。
  - `PROJECT_ID`: 翻译服务的项目 ID。
- `isModule`: (可选) 是否启用模块化命名空间。

2. 在项目根目录运行：

```
node path/to/this/script.js
```
