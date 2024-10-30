const path = require('path')
const xlsx = require('xlsx')
const axios = require('axios')
const crypto = require('crypto')

// 哈希和签名相关函数
function sha256(message, secret = '', encoding) {
  const hmac = crypto.createHmac('sha256', secret)
  return hmac.update(message).digest(encoding)
}

function getHash(message, encoding = 'hex') {
  const hash = crypto.createHash('sha256')
  return hash.update(message).digest(encoding)
}

function getDate(timestamp) {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)
  return `${year}-${month}-${day}`
}

const getTranslationApiParams = textArr => {
  // 腾讯云 API 配置
  const SECRET_ID = 'SECRET_ID' // 替换为你的 
  const SECRET_KEY = 'SECRET_KEY' // 替换为你的 SecretKey 

  const host = 'tmt.tencentcloudapi.com'
  const service = 'tmt'
  const region = 'ap-shanghai'
  const action = 'TextTranslateBatch'
  const version = '2018-03-21'
  const timestamp = parseInt(String(new Date().getTime() / 1000))
  const date = getDate(timestamp)
  const payload = JSON.stringify({
    Source: 'zh',
    Target: 'en',
    ProjectId: 1324875,
    SourceTextList: textArr,
  })

  // ************* 步骤 1：拼接规范请求串 *************
  const signedHeaders = 'content-type;host'
  const hashedRequestPayload = getHash(payload)
  const httpRequestMethod = 'POST'
  const canonicalUri = '/'
  const canonicalQueryString = ''
  const canonicalHeaders = 'content-type:application/json; charset=utf-8\n' + 'host:' + host + '\n'

  const canonicalRequest =
    httpRequestMethod +
    '\n' +
    canonicalUri +
    '\n' +
    canonicalQueryString +
    '\n' +
    canonicalHeaders +
    '\n' +
    signedHeaders +
    '\n' +
    hashedRequestPayload

  // ************* 步骤 2：拼接待签名字符串 *************
  const algorithm = 'TC3-HMAC-SHA256'
  const hashedCanonicalRequest = getHash(canonicalRequest)
  const credentialScope = date + '/' + service + '/' + 'tc3_request'
  const stringToSign = algorithm + '\n' + timestamp + '\n' + credentialScope + '\n' + hashedCanonicalRequest

  // ************* 步骤 3：计算签名 *************
  const kDate = sha256(date, 'TC3' + SECRET_KEY)
  const kService = sha256(service, kDate)
  const kSigning = sha256('tc3_request', kService)
  const signature = sha256(stringToSign, kSigning, 'hex')

  // ************* 步骤 4：拼接 Authorization *************
  const authorization = `${algorithm} Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  // ************* 步骤 5：构造并发起请求 *************
  const headers = {
    Authorization: authorization,
    'Content-Type': 'application/json; charset=utf-8',
    Host: host,
    'X-TC-Action': action,
    'X-TC-Timestamp': timestamp,
    'X-TC-Version': version,
    'X-TC-Region': region,
  }

  return { host, payload, headers }
}

// 读取 translations.xlsx 文件
const excelFilePath = path.join(__dirname, 'output', 'template.xlsx')
const workbook = xlsx.readFile(excelFilePath)
const worksheet = workbook.Sheets[workbook.SheetNames[0]]

// 将工作表转换为 JSON 数据
const jsonData = xlsx.utils.sheet_to_json(worksheet)

// 创建翻译后的数据数组
const translateAll = async () => {
  const textArr = jsonData.map(v => v.zh || '')

  const { host, payload, headers } = getTranslationApiParams(textArr)
  const res = await axios.post(`https://${host}`, payload, { headers })
  const translatedRawData = res.data?.Response?.TargetTextList

  console.log('translatedRawData', translatedRawData)
  const translatedData = jsonData.map((v, index) => ({ ...v, en: translatedRawData[index] }))

  // 创建新的工作表
  const newWorksheet = xlsx.utils.json_to_sheet(translatedData)

  // 将新的工作表添加到工作簿
  const newWorkbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Translations')

  // 输出新的 Excel 文件
  const newExcelFilePath = path.join(__dirname, 'output', 'template.xlsx')
  xlsx.writeFile(newWorkbook, newExcelFilePath)

  console.log(`翻译后的 Excel 文件已生成: ${newExcelFilePath}`)
}

// 执行翻译
translateAll()
