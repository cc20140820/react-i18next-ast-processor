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

  // LEFT
  isModule: false, // 命名空间（APP项目必须开启）
  translate: {
    translator: 'google', // 可选机翻类型（google需终端挂代理，默认为tmt）
    toCols: ['E', 'F'], // 目标列，E为中文繁体，F为英文
    toLngs: ['zh-TW', 'en'], // 目标语言，需要与targetColumns对应
  }
}
