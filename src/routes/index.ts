/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:28:52
 * @ Description: 路由总入口
 */

import * as Router from 'koa-router'
import user from './user'
import util from './util'
import project from './project'
import group from './group'
import mock from './mock'
const router = new Router({
  prefix: '/api'
})
export default (app: any) => {
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/util', util.routes(), util.allowedMethods())
  router.use('/project', project.routes(), project.allowedMethods())
  router.use('/group', group.routes(), group.allowedMethods())
  router.use('/mock', mock.routes(), mock.allowedMethods())
  app.use(router.routes(), router.allowedMethods())
}
