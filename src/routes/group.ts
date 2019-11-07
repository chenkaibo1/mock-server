import * as Router from 'koa-router'
import * as controller from '../controller/group'
const router = new Router()

router.get('/', controller.getCreateGroup)

export default router
