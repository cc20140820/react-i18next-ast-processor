const path = require('path')
const xlsx = require('xlsx')

// 读取 zh.js 文件
const zhFilePath = path.join(__dirname, 'output', 'zh.js')
const translations = require(zhFilePath)

// 创建一个新的工作簿
const workbook = xlsx.utils.book_new()

// 将 translations 对象转换为二维数组
const data = [
  ['key', 'zh'], // 表头
  ...Object.entries(translations), // 将 key 和 zh 的映射作为数组添加
]

// 将数据转换为工作表
const worksheet = xlsx.utils.aoa_to_sheet(data)

// 将工作表添加到工作簿中
xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations')

// 输出 Excel 文件
const excelFilePath = path.join(__dirname, 'output', 'template.xlsx')
xlsx.writeFile(workbook, excelFilePath)

console.log(`Excel 文件已生成: ${excelFilePath}`)
