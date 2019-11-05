/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-10-30 16:21:59
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-05 17:46:24
 * @ Description: 加载中间件
 */

import auth from './auth'
import resp from './resp'
export default (app: any) => {
  app.use(resp) // 参数响应
  app.use(auth) // 权限验证
}
