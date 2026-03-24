import request from '../../request'
import qs from 'qs'

function getUrl(url, params) {
  return (
    url +
    (params !== null && params !== undefined
      ? '?' + qs.stringify(params, { arrayFormat: 'repeat' })
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

export function doHttpPost(url, params, data) {
  return request({
    url: getUrl(url, params),
    method: 'post',
    data: data,
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

export function putEntitySchema(className) {
  return request({
    url: '/platformSvr/sapi/schemaDefines/entity/' + className,
    method: 'put',
  })
}

export function getDictionaryValues(code) {
  return request({
    url: '/platformSvr/sapi/dictionarys/codes/' + code,
    method: 'get'
  })
}
