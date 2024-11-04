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


function getTranslationApiParams(source, target, sourceTextList, translator) {
    const { SECRET_ID, SECRET_KEY, PROJECT_ID } = translator
    const host = 'tmt.tencentcloudapi.com'
    const service = 'tmt'
    const region = 'ap-shanghai'
    const action = 'TextTranslateBatch'
    const version = '2018-03-21'
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = getDate(timestamp)
    const payload = JSON.stringify({
        Source: source,
        Target: target,
        ProjectId: PROJECT_ID,
        SourceTextList: sourceTextList,
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

module.exports = {
    getTranslationApiParams
}