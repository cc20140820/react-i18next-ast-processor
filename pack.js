const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');

async function generateExcel(outputDir, zhFilePath, locales) {
  try {
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });

    // 读取 translations 对象
    const translations = require(zhFilePath);

    // 创建一个新的工作簿
    const workbook = xlsx.utils.book_new();

    // 将 translations 对象转换为二维数组
    const data = [
      ['key', locales], // 表头
      ...Object.entries(translations), // 将 key 和 zh 的映射作为数组添加
    ];

    // 将数据转换为工作表
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    // 将工作表添加到工作簿中
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations');

    // 输出 Excel 文件
    const excelFilePath = path.join(outputDir, `${locales}.xlsx`);
    await xlsx.writeFile(workbook, excelFilePath); // 确保写入操作完成

    console.log(`Excel 文件已生成: ${excelFilePath}`);
  } catch (error) {
    console.error('生成 Excel 文件时出错:', error);
  }
}

module.exports = function () {
  const configFilePath = path.resolve(process.cwd(), 'i18n-ast.config.js');
  const config = require(configFilePath);
  const { output, locales } = config
  const outputDir = path.resolve(process.cwd(), output);
  const zhFilePath = path.join(outputDir, `${locales}.js`);
  generateExcel(outputDir, zhFilePath, locales)
};
