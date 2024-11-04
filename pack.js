const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');

async function generateExcel(outputDir, locales) {
  try {
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });
    const languageJsFilePath = path.join(outputDir, `${locales}.js`);
    // 读取 translations 对象
    const translations = require(languageJsFilePath);
    const data = [
      ['key', locales], // 表头
      ...Object.entries(translations), // 将 key 和 zh 的映射作为数组添加
    ];

    // 创建一个新的工作簿并添加工作表
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations');

    // 输出 Excel 文件
    const excelFilePath = path.join(outputDir, `${locales}.xlsx`);
    await xlsx.writeFile(workbook, excelFilePath); // 确保写入操作完成

    console.log(`Excel 文件已生成: ${excelFilePath}`);
  } catch (error) {
    console.error('生成 Excel 文件时出错:', error);
  }
}

module.exports = {
  generateExcel,
  default: async function () {
    try {
      const configFilePath = path.resolve(process.cwd(), 'i18n-ast.config.js');
      const { output, locales } = require(configFilePath);
      const outputDir = path.resolve(process.cwd(), output);
      await generateExcel(outputDir, locales);
    } catch (error) {
      console.error('加载配置或生成 Excel 时出错:', error);
    }
  }
};
