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
  isModule: false, // 可选，是否启用模块化命名空间
}
