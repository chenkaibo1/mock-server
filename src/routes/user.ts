/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-12-18 16:15:21
 * @ Description:用户路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/user'
const router = new Router()

router.post('/login', controller.login)
router.put('/edit', controller.editUser)
router.get('/keyword', controller.findUserByKeyword)

export default router
