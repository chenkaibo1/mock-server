import * as Router from 'koa-router'
import user from './user'
import util from './util'
import project from './project'
import group from './group'
const router = new Router({
  prefix: '/api'
})
export default (app: any) => {
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/util', util.routes(), util.allowedMethods())
  router.use('/project', project.routes(), project.allowedMethods())
  router.use('/group', group.routes(), group.allowedMethods())
  app.use(router.routes(), router.allowedMethods())
}
