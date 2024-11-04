### i18n AST Processor

这是一个用于扫描 JavaScript/TypeScript 文件并将字符串文本转换为国际化（i18n）调用的工具。它支持将中文字符串替换为 `i18next.t` 调用，并生成一个包含翻译键和中文的输出文件。

扫描前:

```typescript
import React from 'react'
import { Card, message } from 'antd'
import { BasicPageWrapper } from '@/components'

const App: React.FC = () => {
  const year = '2024'
  const month = '11'
  const day = '12'

  const str = `今天是${year}年${month}月${day}日`
  const text = '你好'

  const handleClick = () => {
    message.info('早上好')
  }

  return (
    <BasicPageWrapper title={'标题'} desc='描述'>
      <Card onClick={handleClick}>{str}</Card>
      <Card>仪表盘</Card>
    </BasicPageWrapper>
  )
}
export default App
```

扫描后：

```typescript
import i18next from '@/i18n'
import React from 'react'
import { Card, message } from 'antd'
import { BasicPageWrapper } from '@/components'

const App: React.FC = () => {
  const year = '2024'
  const month = '11'
  const day = '12'

  const str = i18next.t('prefix.594cec45' /* 今天是{{year}}年{{month}}月{{day}}日 */, { year, month, day })
  const text = i18next.t('prefix.7a4e7e47' /* 你好 */)

  const handleClick = () => {
    message.info(i18next.t('prefix.770d4127' /* 早上好 */))
  }

  return (
    <BasicPageWrapper title={i18next.t('prefix.825dcb9e' /* 标题 */)} desc={i18next.t('prefix.c1ecbf16' /* 描述 */)}>
      <Card onClick={handleClick}>{str}</Card>
      <Card>{i18next.t('prefix.c253eadc' /* 仪表盘 */)}</Card>
    </BasicPageWrapper>
  )
}
export default App
```

#### 功能

1. **扫描和处理文件**：自动识别 JavaScript/TypeScript 文件中的字符串，转换为 i18n 调用。
2. **生成 Excel 文件**：将翻译结果输出为 Excel 格式，便于管理和查看。
3. **机器翻译**：使用腾讯翻译 API 进行字符串翻译，并将翻译结果合并到原数据中。

#### 安装

```bash
npm i react-i18next-ast-processor
```

#### 使用

添加脚本运行

- **扫描文件**：`i18n-processor-cli -s`
- **生成 Excel 文件**：`i18n-processor-cli -p`
- **翻译**：`i18n-processor-cli -t`

```json
"scripts": {
  "scan": "i18n-processor-cli -s",
  "pack": "i18n-processor-cli -p",
  "translate": "i18n-processor-cli -t"
},
```

#### 配置文件

根目录下创建一个名为 `i18n-ast.config.js` 的配置文件，示例内容如下

```javascript
const { resolve } = require("path");

module.exports = {
  entry: [resolve("src/pages/overview/dashboard")], // 必填，入口文件或目录，可以是一个数组
  output: "./output", // 必填，生成文件的输出目录
  locales: "zh", // 必填，源语言，支持 'zh' (中文), 'en' (英语), 'fr' (法语), 'es' (西班牙语)
  i18nConfigFilePath: "@/i18n", // 必填，i18n 配置的导入路径
  targetLngs: ["zh-TW", "en"], // 可选，指定要翻译成的目标语言数组
  prettierrc: require("./.prettierrc"), // 可选，Prettier 配置文件的路径
  exclude: [], // 可选，指定要排除的文件或目录，例如 ['types', 'utils']
  ignoreFunctions: ["console.log"], // 可选，指定要忽略的函数调用，例如 ['console.log']
  translator: {
    SECRET_ID: "", // 替换成腾讯云API
    SECRET_KEY: "",
    PROJECT_ID: "",
  },
};
```
