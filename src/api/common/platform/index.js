import request from '../../request'
import qs from 'qs'

function getUrl(url, params) {
  return (
    url +
    (params !== null && params !== undefined
      ? '?' + qs.stringify(params, {arrayFormat: 'repeat'})
      : '')
  )
}

export function doHttpGet(url, params) {
  return request({
    url: getUrl(url, params),
    method: 'get',
  })
}

export function doHttpPut(url, params, data) {
  return request({
    url: getUrl(url, params),
    method: 'put',
    data: data,
  })
}

export function doHttpPost(url, params, data, config = {}) {
  return request({
    url: getUrl(url, params),
    method: 'post',
    data: data,
    ...config,
  })
}

export function doHttpDelete(url, params, data) {
  return request({
    url: getUrl(url, params),
    method: 'delete',
    data: data,
  })
}

export function getEnumValues(serviceContext, enumClassName) {
  return request({
    url: '/' + serviceContext + '/sapi/enums/' + enumClassName,
    method: 'get',
  })
}

export function getEntitySchema(serviceContext, enumClassName) {
  return request({
    url: '/' + serviceContext + '/sapi/schemas/' + enumClassName,
    method: 'get',
  })
}

export function getDictionaryValues(code) {
  return request({
    url: '/platformSvr/sapi/dictionarys/codes/' + code,
    method: 'get'
  })
}

export function runDefaultValueScript(input, script) {
  return request({
    url: '/platformSvr/sapi/jsExec/form/run',
    method: 'post',
    data: {
      input: input,
      script: script
    }
  })
}

export function executeOpenApi(apiCode, params, data) {
  return new Promise((resolve, reject) => {
    request({
      url: getUrl('/platformSvr/sapi/common/com.byteasy.platform.entity.Openapi', {code: apiCode}),
      method: 'get',
      data: data
    }).then(response => {
      if (response.success === true) {
        const openapi = response.data.records[0]
        // 脚本函数
        if (openapi.scriptId) {
        } else {
          request({
            url: getUrl(genUri(openapi.uri, params), params),
            method: openapi.httpMethod,
            data: data
          }).then(result => {
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }
      } else {
        reject(response.error)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 根据带有占位符的 url 和 params 对象生成最终的 uri
 * @param url 带有占位符的 URL，例如: /api/{code}/{id}
 * @param params 参数对象，例如: { code: 'A01', id: 123 }
 * @returns 替换后的 URL，例如: /api/A01/123
 */
export function genUri(url, params) {
  if (!url || Object.keys(params).length === 0) return url;

  // 匹配 {} 中的内容，例如 {code}，其中 match 是 "{code}", key 是 "code"
  return url.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = params[key];
    // 如果 params 中有对应的值（且不是 null 或 undefined），则进行替换
    if (value !== undefined && value !== null) {
      return encodeURIComponent(String(value)); // 必须使用 encodeURIComponent 保证 URL 安全
    }
    // 如果没有传这个参数，保留原样（或者你也可以 return '' 将其置空）
    return match;
  })
}
