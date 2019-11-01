import * as Router from 'koa-router'
import user from './user'
import util from './util'
const router = new Router({
  prefix: '/api'
})
export default (app: any) => {
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/util', util.routes(), util.allowedMethods())
  app.use(router.routes(), router.allowedMethods())
}
