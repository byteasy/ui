import request from '../../request'

export function getUsers(params) {
  return request({
    url: '/platformSvr/sapi/users',
    method: 'get',
    params: params,
  })
}

export function editPassword(passwordForm) {
  return request({
    url: '/platformSvr/sapi/users/password',
    method: 'put',
    data: passwordForm,
  })
}

export function editPersonalInfo(info) {
  return request({
    url: '/platformSvr/sapi/users/personalInfo',
    method: 'put',
    data: info,
  })
}

export function getLoginPersonalInfo() {
  return request({
    url: '/platformSvr/sapi/users/personalInfo',
    method: 'get',
  })
}
