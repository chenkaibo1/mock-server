import { pathToRegexp } from 'path-to-regexp'
/**
   * 安全的 decodeURIComponent
   * @param String str
   */

function safeDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
}
/**
   * 解析出 params 对象
   *
   * /user/nick (/user/:name) => { name: 'nick' }
   *
   * @param String restURL /user/:name
   * @param String fullURL /user/nick
   */

export function params(restURL, fullURL) {
  const params = {}
  const paramNames = []
  const api = pathToRegexp(restURL, paramNames)
  const captures = fullURL.match(api)

  if (!captures) return {}

  captures.slice(1).forEach((value, i) => {
    /* istanbul ignore else */
    if (paramNames[i]) {
      params[paramNames[i].name] = this.safeDecodeURIComponent(value)
    }
  })

  return params
}
