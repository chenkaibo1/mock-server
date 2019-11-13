/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:29:14
 * @ Description:用户路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/user'
const router = new Router()

router.post('/login', controller.login)
router.get('/keyword', controller.findUserByKeyword)

export default router
