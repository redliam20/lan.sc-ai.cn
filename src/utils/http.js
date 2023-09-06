import http from './httpRequest'

// post
export function postAction (url, parameter) {
  return http({
    url: url,
    method: 'post',
    data: parameter
  })
}

// post method= {post | put}
export function httpAction (url, parameter, method) {
  return http({
    url: url,
    method: method,
    data: parameter
  })
}

// put
export function putAction (url, parameter) {
  return http({
    url: url,
    method: 'put',
    data: parameter
  })
}

// get
export function getAction (url, parameter) {
  return http({
    url: url,
    method: 'get',
    params: parameter
  })
}

// deleteAction
export function deleteAction (url, parameter) {
  return http({
    url: url,
    method: 'delete',
    params: parameter
  })
}
