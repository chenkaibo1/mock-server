import { networkInterfaces } from 'os'
// @ts-ignore
import { pathToRegexp } from 'path-to-regexp'
import * as fs from 'fs'
import * as path from 'path'
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

export function getLocalIP() {
  let locatIp = ''
  const ifaces = networkInterfaces()
  for (let dev in ifaces) {
    if (dev === '本地连接' || dev === '以太网') {
      for (let j = 0; j < ifaces[dev].length; j++) {
        if (ifaces[dev][j].family === 'IPv4') {
          locatIp = ifaces[dev][j].address
          break
        }
      }
    }
  }
  return locatIp
}
// create folders
export function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
