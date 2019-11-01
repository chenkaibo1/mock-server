import * as Router from 'koa-router'
import * as controller from '../controller/user'
const router = new Router()

router.post('/login', controller.login)

export default router
