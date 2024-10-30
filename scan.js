const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const prettier = require('prettier')
const t = require('@babel/types')

// 生成短随机字符串，取 UUID 的前 8 位
function generateShortKey() {
  return 'prefix.' + uuidv4().split('-').join('').substring(0, 8) // 取 UUID 的前 8 位
}

const outputFilePath = path.join(__dirname, 'output', 'zh.js')
const translations = {} // 用于存储中文和对应的 key

// 替换文件中的中文为 i18next.t 格式
function replaceChineseWithI18n(file) {
  const content = fs.readFileSync(file, 'utf8')

  // 解析代码为 AST
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let hasI18nImport = false
  // 需要提前判断
  traverse(ast, {
    ImportDeclaration(path) {
      // 检查是否已有 import i18next from "@/i18n"
      if (path.node.source.value === '@/i18n') {
        hasI18nImport = true
      }
    },
  })

  // 插入import i18next from "@/i18n"
  const importStatement = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier('i18next'))],
    t.stringLiteral('@/i18n'),
  )

  // 遍历 AST
  traverse(ast, {
    Program(path) {
      if (!hasI18nImport) {
        path.node.body.splice(1, 0, importStatement) // 在第二行插入
      }
    },
    StringLiteral(path) {
      const value = path.node.value

      // 检查是否包含中文
      if (/[\u4e00-\u9fa5]/.test(value)) {
        const randomKey = generateShortKey()

        const stringLiteral = t.stringLiteral(randomKey)
        t.addComment(stringLiteral, 'trailing', ` ${value} `, false)

        // 创建新的调用表达式
        const newExpression = t.callExpression(t.memberExpression(t.identifier('i18next'), t.identifier('t')), [
          stringLiteral,
        ])
        path.replaceWith(newExpression)
        translations[randomKey] = value
      }
    },
    TemplateLiteral(path) {
      const quasis = path.get('quasis') // 获取所有的静态部分
      const expressions = path.get('expressions') // 获取所有的动态部分

      // 组合模板字符串的静态和动态部分
      const rawValueParts = quasis.map(quasi => quasi.node.value.raw)
      const expressionNames = expressions.map(expr => expr.node.name) // 假设表达式是变量名

      // 构建 i18next.t 的 key 和变量对象
      const randomKey = generateShortKey()
      const variablesKeys = []

      // 替换静态部分中的变量
      const translatedString = rawValueParts
        .map((part, index) => {
          const exprName = expressionNames[index] // 因为静态部分比动态部分多一个
          return exprName ? `${part}{{${exprName}}}` : part
        })
        .join('')

      // 替换为 i18next.t 的调用
      expressions.forEach((expr, index) => {
        const varName = expr.node.name // 获取变量名
        variablesKeys.push(varName)
      })

      const stringLiteral = t.stringLiteral(randomKey)
      t.addComment(stringLiteral, 'trailing', ` ${translatedString} `, false) // 添加注释
      const objectExpression = t.objectExpression(
        variablesKeys.map(key => t.objectProperty(t.identifier(key), t.identifier(key), false, true)),
      )

      const callExpression = t.callExpression(t.memberExpression(t.identifier('i18next'), t.identifier('t')), [
        stringLiteral,
        objectExpression,
      ])

      path.replaceWith(callExpression)
      translations[randomKey] = translatedString
    },
    JSXText(path) {
      const value = path.node.value.trim()
      if (/[\u4e00-\u9fa5]/.test(value)) {
        const randomKey = generateShortKey()

        // 创建字符串字面量
        const stringLiteral = t.stringLiteral(randomKey)
        t.addComment(stringLiteral, 'trailing', ` ${value} `, false)

        // 创建新的 JSX 表达式节点
        const newExpression = t.jsxExpressionContainer(
          t.callExpression(t.memberExpression(t.identifier('i18next'), t.identifier('t')), [stringLiteral]),
        )
        path.replaceWith(newExpression)
        translations[randomKey] = value
      }
    },
  })

  // 生成修改后的代码
  const { code } = generator(ast, {
    retainLines: true,
    comments: true, // 保留注释
  })

  prettier
    .format(code, {
      parser: 'typescript', // 或者根据需要选择适合的解析器
      ...require('./.prettierrc'), // 加载配置
    })
    .then(res => {
      fs.writeFileSync(file, res, 'utf8')
    })
}

// 扫描并替换指定文件
replaceChineseWithI18n(path.resolve(__dirname, './src/pages/overview/dashboard/index.tsx'))

// 生成输出文件内容
const outputContent = `module.exports = ${JSON.stringify(translations, null, 2)};`
fs.mkdirSync(path.dirname(outputFilePath), { recursive: true })
fs.writeFileSync(outputFilePath, outputContent, 'utf-8')
