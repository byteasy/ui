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
