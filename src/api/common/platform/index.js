import request from '../../request';
import qs from 'qs';
import { useSessionStore } from '@/stores/session.js';
const openapiConfigCache = new Map()

export function getUrl(url, params) {
  return (
    url +
    (params !== null && params !== undefined
      ? '?' + qs.stringify(params, { arrayFormat: 'repeat' })
      : '')
  );
}

export function doHttpGet(url, params) {
  return request({
    url: getUrl(genUri(url, params), params),
    method: 'get',
  });
}

export function doHttpPut(url, params, data) {
  return request({
    url: getUrl(genUri(url, params), params),
    method: 'put',
    data: data,
  });
}

export function doHttpPost(url, params, data, config = {}) {
  return request({
    url: getUrl(genUri(url, params), params),
    method: 'post',
    data: data,
    ...config,
  });
}

export function doHttpDelete(url, params, data) {
  return request({
    url: getUrl(genUri(url, params), params),
    method: 'delete',
    data: data,
  });
}

/**
 * 获取枚举值（对外导出的函数）
 * @param enumClassName 枚举类名
 */
export function getEnumValues(enumClassName) {
  const sessionStore = useSessionStore();
  return sessionStore.fetchEnumValues(enumClassName);
}

export function getEntitySchema(className) {
  return request({
    url: '/platformSvr/sapi/fieldDefines/entity/' + className,
    method: 'get',
  });
}

export function getDictionaryValues(code) {
  return request({
    url: '/platformSvr/sapi/dictionarys/codes/' + code,
    method: 'get',
  });
}

export function runDefaultValueScript(input, script) {
  return request({
    url: '/platformSvr/sapi/jsExec/form/run',
    method: 'post',
    data: {
      input: input,
      script: script,
    },
  });
}

/**
 * 根据带有占位符的 url 和 params 对象生成最终的 uri
 * @param url 带有占位符的 URL，例如: /api/{code}/{id}
 * @param params 参数对象，例如: { code: 'A01', id: 123 }
 * @returns 替换后的 URL，例如: /api/A01/123
 */
export function genUri(url, params) {
  if (!url || !params || Object.keys(params).length === 0) return url;

  // 匹配 {} 中的内容，例如 {code}，其中 match 是 "{code}", key 是 "code"
  return url.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = params[key];
    // 如果 params 中有对应的值（且不是 null 或 undefined），则进行替换
    if (value !== undefined && value !== null) {
      return encodeURIComponent(String(value)); // 必须使用 encodeURIComponent 保证 URL 安全
    }
    // 如果没有传这个参数，保留原样（或者你也可以 return '' 将其置空）
    return match;
  });
}

export function getEntityDefine(className) {
  return new Promise((resolve, reject) => {
    executeOpenApi('4GSabRyjA', { code: className, codeQueryType: 'eq' }, {})
      .then((response) => {
        resolve(response.data[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 辅助函数：优先从内存缓存获取 OpenAPI 配置，无缓存则请求远程后台
 * @param {string} apiCode
 * @returns {Promise<object>}
 */
async function getOpenapiConfig(apiCode) {
  // 1. 命中缓存：直接返回缓存中的配置（或正在 pending 的 Promise）
  if (openapiConfigCache.has(apiCode)) {
    return openapiConfigCache.get(apiCode);
  }

  // 2. 未命中缓存：创建请求 Promise 并立刻写入缓存（防止同一时刻并发重复请求）
  const fetchPromise = (async () => {
    try {
      const response = await request({
        url: getUrl('/platformSvr/sapi/openapis/codes/' + apiCode, {}),
        method: 'get',
      });

      if (response.success !== true) {
        throw response.error || new Error('获取OpenAPI配置失败');
      }

      const openapi = response.data
      if (!openapi) {
        throw new Error(`未找到 apiCode: ${apiCode} 对应的配置信息`);
      }

      // 请求成功后，将缓存值从 Promise 更新为纯配置对象
      openapiConfigCache.set(apiCode, openapi);
      return openapi;
    } catch (err) {
      // 若请求失败，必须清除缓存，避免后续调用一直报错
      openapiConfigCache.delete(apiCode);
      throw err;
    }
  })();

  // 立即将进行中的 Promise 缓存
  openapiConfigCache.set(apiCode, fetchPromise);
  return fetchPromise;
}

/**
 * 执行 OpenAPI 请求
 */
export async function executeOpenApi(apiCode, params, data) {
  try {
    if (!apiCode) {
      throw new Error('apiCode argument missing');
    }

    // 🔥 核心优化：走内存缓存获取 openapi 配置信息
    const openapi = await getOpenapiConfig(apiCode);

    if (openapi.scriptId && openapi.type === 'script') {
      return request({
        url: getUrl(genUri(openapi.uri, params), params),
        method: 'post',
        data: data,
      });
    }

    return request({
      url: getUrl(genUri(openapi.uri, params), params),
      method: openapi.httpMethod,
      data: data,
    });
  } catch (error) {
    console.error(`[调试] 💥 发生异常，函数执行被提前中断！错误信息:`, error);
    throw error;
  }
}
