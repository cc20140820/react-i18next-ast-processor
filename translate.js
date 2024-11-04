const path = require('path')
const xlsx = require('xlsx')
const axios = require('axios')
const { getTranslationApiParams } = require('./utils');

// 获取机器翻译
const translateSource2Target = async (source, target, sourceTextList, translator) => {
  const { host, payload, headers } = getTranslationApiParams(source, target, sourceTextList, translator);
  const response = await axios.post(`https://${host}`, payload, { headers });
  return response.data?.Response?.TargetTextList || [];
};

// 创建翻译后的数据数组
const translateAll = async (jsonData, locales, targetLngs, translator) => {
  const sourceList = jsonData.map(item => item[locales] || '');
  const translatedMap = {};

  // 使用 Promise.all 收集所有翻译请求的结果
  const translatePromises = targetLngs.map(targetLng =>
    translateSource2Target(locales, targetLng, sourceList, translator).then(translations => {
      translatedMap[targetLng] = translations;
    })
  );

  await Promise.all(translatePromises);

  // 将翻译结果合并到原数据中
  const translatedData = jsonData.map((item, index) => {
    const newItem = { ...item };
    targetLngs.forEach(lang => {
      newItem[lang] = translatedMap[lang]?.[index] || ''; // 使用可选链处理可能的未定义
    });
    return newItem;
  });

  return translatedData;
};

const saveToExcel = (data, excelFilePath) => {
  const newWorksheet = xlsx.utils.json_to_sheet(data);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Translations');
  xlsx.writeFile(newWorkbook, excelFilePath);
};

module.exports = async function () {
  try {
    const configFilePath = path.resolve(process.cwd(), 'i18n-ast.config.js');
    const { output, locales, translator, targetLngs } = require(configFilePath);
    const outputDir = path.resolve(process.cwd(), output);
    const excelFilePath = path.join(outputDir, `${locales}.xlsx`);

    const workbook = xlsx.readFile(excelFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const translatedData = await translateAll(jsonData, locales, targetLngs, translator);
    saveToExcel(translatedData, excelFilePath);

    console.log(`翻译已完成并保存到: ${excelFilePath}`);
  } catch (error) {
    console.error('翻译过程中出现错误:', error);
  }
};