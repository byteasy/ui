import request from '../../request'
import qs from 'qs'

export function doHttpGet(url, params) {
  return request({
    url:
      url +
      '?' +
      qs.stringify(params, {
        arrayFormat: 'repeat',
      }),
    method: 'get',
  })
}

export function getEnumValues(serviceContext, enumClassName) {
  return request({
    url: '/' + serviceContext + '/papi/enums/' + enumClassName,
    method: 'get',
  })
}
