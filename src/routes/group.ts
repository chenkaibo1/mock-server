/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-07 16:34:26
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:29:03
 * @ Description:团队路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/group'
const router = new Router()

router.get('/', controller.getCreateGroup)
router.get('/list', controller.getGroupList)
router.post('/create', controller.createGroup)
router.put('/edit/:id', controller.editGroup)
router.put('/join', controller.joinGroup)
router.delete('/del/:id', controller.deleteGroup)

export default router
