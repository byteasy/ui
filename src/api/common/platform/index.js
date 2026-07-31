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

export function getEntitySchema(enumClassName) {
  return request({
    url: '/platformSvr/sapi/schemas/' + enumClassName,
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

export async function executeOpenApi(apiCode, params, data) {
  try {
    // 第一步：发起请求
    const response = await request({
      url: getUrl('/platformSvr/sapi/common/com.byteasy.platform.entity.Openapi', { code: apiCode }),
      method: 'get',
      data: data
    });

    // 第二步：校验 success
    if (response.success !== true) {
      throw response.error || new Error('获取 OpenAPI 配置失败');
    }

    // 第三步：提取数据
    const openapi = response.data?.records?.[0];
    if (!openapi) {
      throw new Error(`未找到 apiCode: ${apiCode} 对应的配置信息`);
    }

    // 第四步：根据条件发起二次请求
    if (openapi.scriptId) {
      const contextPath = openapi?.serviceInstance?.contextPath || '';

      return request({
        url: getUrl(`${contextPath}/sapi/script/api/${apiCode}`, params),
        method: 'post',
        data: data
      });
    }

    console.log(`[调试] 7. 走无 scriptId 分支，准备发起最终请求...`);
    return request({
      url: getUrl(genUri(openapi.uri, params), params),
      method: openapi.httpMethod,
      data: data
    });

  } catch (error) {
    // 捕获这个函数内部发生的任何阻断
    console.error(`[调试] 💥 发生异常，函数执行被提前中断！错误信息:`, error);
    // 必须继续向上抛出，否则外层会以为执行成功了
    throw error;
  }
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
