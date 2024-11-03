const path = require('path')
const xlsx = require('xlsx')
const axios = require('axios')
const { getTranslationApiParams } = require('./utils');

// 创建翻译后的数据数组
const translateAll = async (jsonData, excelFilePath, config) => {
  const textArr = jsonData.map(v => v.zh || '')
  const { host, payload, headers } = getTranslationApiParams(textArr, config)
  const res = await axios.post(`https://${host}`, payload, { headers })
  const translatedRawData = res.data?.Response?.TargetTextList
  const translatedData = jsonData.map((v, index) => ({ ...v, en: translatedRawData[index] }))

  // 创建新的工作表 & 将新的工作表添加到工作簿
  const newWorksheet = xlsx.utils.json_to_sheet(translatedData)
  const newWorkbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Translations')

  // 更新 Excel 文件
  xlsx.writeFile(newWorkbook, excelFilePath)
}

module.exports = function () {
  const configFilePath = path.resolve(process.cwd(), 'i18n-ast.config.js');
  const config = require(configFilePath);
  const { output, locales, translate } = config
  const outputDir = path.resolve(process.cwd(), output);
  const excelFilePath = path.join(outputDir, `${locales}.xlsx`)

  const workbook = xlsx.readFile(excelFilePath)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  // 将工作表转换为 JSON 数据
  const jsonData = xlsx.utils.sheet_to_json(worksheet)
  translateAll(jsonData, excelFilePath, translate)
};