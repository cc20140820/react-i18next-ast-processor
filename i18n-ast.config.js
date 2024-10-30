const { resolve } = require('path')

module.exports = {
  entry: [resolve('src/pages/FXAccount/components/Form/WithdrawalAccount')], // 必填
  isModule: false, // 命名空间（APP项目必须开启）
  output: './output', // 输出目录 必填
  exclude: ['**/resources/**', '**/types/**', '**/utils/**', '**/policy/**', '**/platformProtocols/**', '**/sensor.ts'], // 排除的文件（类型是数组）
  locales: 'zh', // 默认语言(无须调整)
  excelName: 'output1.xlsx', // 输出excel名
  i18nConfigFilePath: '@/i18n', // 导入i18n配置(结合tsconfig中的paths定义)
  prefix: 'order',
  translate: {
    translator: 'google', // 可选机翻类型（google需终端挂代理，默认为tmt）
    toCols: ['E', 'F'], // 目标列，E为中文繁体，F为英文
    toLngs: ['zh-TW', 'en'], // 目标语言，需要与targetColumns对应
  },
  prettierrc: require('./.prettierrc'),
  ignoreFunctions: ['sensorsUtil', 'genTranslationKey', 'tOrElse', 'sensorsFundClick', 'sensorsFundPageView'], // 需要忽略的函数调用
  download: {
    projectId: 101321,
    path: resolve('./locales'),
    clean: true,
  },
}
