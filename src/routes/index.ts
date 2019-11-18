/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-18 17:58:18
 * @ Description: 路由总入口
 */

import * as Router from 'koa-router'
import user from './user'
import util from './util'
import project from './project'
import group from './group'
import mock from './mock'
import * as ratelimit from 'koa-ratelimit'
import redisClient from '../tools/redis'
import config from '../config'
import * as restc from 'restc'
import { mockApi } from '../controller/mock'
const apiRouter = new Router({
  prefix: '/api'
})
const mockRouter = new Router({
  prefix: '/mock'
})
const rate = ratelimit({
  db: redisClient,
  id: (ctx) => ctx.url,
  max: config.rateLimit.max,
  duration: config.rateLimit.duration,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  }
})
export default (app: any) => {
  mockRouter.all('*', rate, restc.koa2(), mockApi)
  apiRouter.use('/user', user.routes(), user.allowedMethods())
  apiRouter.use('/util', util.routes(), util.allowedMethods())
  apiRouter.use('/project', project.routes(), project.allowedMethods())
  apiRouter.use('/group', group.routes(), group.allowedMethods())
  apiRouter.use('/mock', mock.routes(), mock.allowedMethods())
  app.use(mockRouter.routes(), mockRouter.allowedMethods())
  app.use(apiRouter.routes(), apiRouter.allowedMethods())
}
