const { resolve } = require('path')

module.exports = {
  entry: [resolve('src/pages/overview/dashboard')], // 必填，入口,支持目录或文件
  output: './output', // 必填 输出目录 
  i18nConfigFilePath: '@/i18n', // 必填 导入i18n配置
  prettierrc: require('./.prettierrc'),
  exclude: ['resources', 'types', 'utils'], // 排除的文件
  ignoreFunctions: ['sensorsUtil', 'sensorsFundClick'], // 需要忽略的函数调用
  locales: 'zh', // 要转换的语言，支持 'zh' (中文), 'en' (英语), 'fr' (法语), 'es' (西班牙语)

  // LEFT
  isModule: false, // 命名空间（APP项目必须开启）
  translate: {
    translator: 'google', // 可选机翻类型（google需终端挂代理，默认为tmt）
    toCols: ['E', 'F'], // 目标列，E为中文繁体，F为英文
    toLngs: ['zh-TW', 'en'], // 目标语言，需要与targetColumns对应
  }
}
