/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-10-30 16:21:59
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-01 11:48:01
 * @ Description: 加载中间件
 */

import auth from './auth'
import resp from './resp'
export default (app: any) => {
  app.use(auth) // 权限验证
  app.use(resp) // 参数响应
}
