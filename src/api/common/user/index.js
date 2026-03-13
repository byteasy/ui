import request from '../../request'

export function getUsers(params) {
  return request({
    url: '/platform/sapi/users',
    method: 'get',
    params: params,
  })
}

export function editPassword(passwordForm) {
  return request({
    url: '/platform/sapi/users/password',
    method: 'put',
    data: passwordForm,
  })
}

export function editPersonalInfo(info) {
  return request({
    url: '/platform/sapi/users/personalInfo',
    method: 'put',
    data: info,
  })
}

export function getLoginPersonalInfo() {
  return request({
    url: '/platform/sapi/users/personalInfo',
    method: 'get',
  })
}
